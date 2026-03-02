"""
AQI Service — parallel fetch from OpenWeather + WAQI with Redis caching.
Fusion: median-weighted average. Fallback if one provider fails.
"""
import json
import asyncio
import hashlib
import structlog
import httpx

from app.core.config import settings
from app.models.schemas import AQIRawData

logger = structlog.get_logger()

OPENWEATHER_GEO_URL = "http://api.openweathermap.org/geo/1.0/direct"
OPENWEATHER_AIR_URL = "http://api.openweathermap.org/data/2.5/air_pollution"
WAQI_URL = "https://api.waqi.info/feed/{city}/"


class AQIService:
    """Fetches and fuses AQI data from OpenWeather and WAQI."""

    def _cache_key(self, city: str) -> str:
        return f"aqi:{hashlib.md5(city.lower().encode()).hexdigest()}"

    async def fetch(self, city: str, redis_service) -> AQIRawData:
        cache_key = self._cache_key(city)

        # ─── Cache hit ────────────────────────────────────────
        if redis_service:
            cached = await redis_service.get(cache_key)
            if cached:
                data = json.loads(cached)
                logger.info("aqi_service.cache_hit", city=city)
                return AQIRawData(**data, cache_hit=True)

        # ─── Parallel API fetch ───────────────────────────────
        async with httpx.AsyncClient(timeout=settings.AQI_REQUEST_TIMEOUT) as client:
            ow_task = self._fetch_openweather(client, city)
            waqi_task = self._fetch_waqi(client, city)
            results = await asyncio.gather(ow_task, waqi_task, return_exceptions=True)

        valid = [r for r in results if isinstance(r, dict) and r is not None]

        if not valid:
            logger.warning("aqi_service.all_providers_failed", city=city)
            # Return safe defaults — frontend will show warning state
            return AQIRawData(aqi=0, pm25=0, pm10=0, city=city, source="unavailable")

        # ─── Fusion: median average across valid sources ──────
        fused = self._fuse(valid)
        fused["city"] = city
        fused["source"] = "+".join(r["source"] for r in valid)

        # ─── Cache result ─────────────────────────────────────
        if redis_service:
            await redis_service.set(
                cache_key,
                json.dumps(fused),
                ttl=settings.AQI_CACHE_TTL_SECONDS,
            )

        return AQIRawData(**fused)

    async def _fetch_openweather(self, client: httpx.AsyncClient, city: str) -> dict | None:
        if not settings.OPENWEATHER_API_KEY:
            return None
        try:
            # Step 1: Geocode city
            geo_resp = await client.get(
                OPENWEATHER_GEO_URL,
                params={"q": city, "limit": 1, "appid": settings.OPENWEATHER_API_KEY}
            )
            geo_resp.raise_for_status()
            geo = geo_resp.json()
            if not geo:
                return None
            lat, lon = geo[0]["lat"], geo[0]["lon"]

            # Step 2: Fetch air pollution
            air_resp = await client.get(
                OPENWEATHER_AIR_URL,
                params={"lat": lat, "lon": lon, "appid": settings.OPENWEATHER_API_KEY}
            )
            air_resp.raise_for_status()
            air = air_resp.json()
            components = air["list"][0]["components"]

            return {
                "aqi": float(air["list"][0]["main"]["aqi"]) * 50,  # OW AQI 1–5 → scale
                "pm25": components.get("pm2_5", 0),
                "pm10": components.get("pm10", 0),
                "source": "OpenWeather",
            }
        except Exception as e:
            logger.warning("aqi_service.openweather_failed", error=str(e), city=city)
            return None

    async def _fetch_waqi(self, client: httpx.AsyncClient, city: str) -> dict | None:
        if not settings.WAQI_API_KEY:
            return None
        try:
            resp = await client.get(
                WAQI_URL.format(city=city),
                params={"token": settings.WAQI_API_KEY}
            )
            resp.raise_for_status()
            data = resp.json()
            if data.get("status") != "ok":
                return None
            iaqi = data["data"].get("iaqi", {})
            return {
                "aqi": float(data["data"]["aqi"]),
                "pm25": iaqi.get("pm25", {}).get("v", 0),
                "pm10": iaqi.get("pm10", {}).get("v", 0),
                "source": "WAQI",
            }
        except Exception as e:
            logger.warning("aqi_service.waqi_failed", error=str(e), city=city)
            return None

    def _fuse(self, sources: list[dict]) -> dict:
        """Median-weighted fusion across valid sources."""
        import statistics
        aqi_vals = [s["aqi"] for s in sources]
        pm25_vals = [s["pm25"] for s in sources]
        pm10_vals = [s["pm10"] for s in sources]
        return {
            "aqi": round(statistics.median(aqi_vals), 2),
            "pm25": round(statistics.median(pm25_vals), 2),
            "pm10": round(statistics.median(pm10_vals), 2),
        }
