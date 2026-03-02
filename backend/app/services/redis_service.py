"""
Redis async service — AQI hot-location caching.
"""
import structlog
import redis.asyncio as redis

logger = structlog.get_logger()


class RedisService:
    def __init__(self, url: str):
        self._url = url
        self._client: redis.Redis | None = None

    async def connect(self) -> None:
        try:
            self._client = await redis.from_url(
                self._url,
                encoding="utf-8",
                decode_responses=True,
                socket_timeout=5,
                socket_connect_timeout=5,
            )
            await self._client.ping()
        except Exception as e:
            logger.warning("redis_service.connect_failed", error=str(e))
            self._client = None

    async def disconnect(self) -> None:
        if self._client:
            await self._client.aclose()

    async def ping(self) -> bool:
        if not self._client:
            return False
        try:
            return await self._client.ping()
        except Exception:
            return False

    async def get(self, key: str) -> str | None:
        if not self._client:
            return None
        try:
            return await self._client.get(key)
        except Exception as e:
            logger.warning("redis_service.get_failed", key=key, error=str(e))
            return None

    async def set(self, key: str, value: str, ttl: int = 300) -> bool:
        if not self._client:
            return False
        try:
            await self._client.setex(key, ttl, value)
            return True
        except Exception as e:
            logger.warning("redis_service.set_failed", key=key, error=str(e))
            return False

    async def delete(self, key: str) -> None:
        if not self._client:
            return
        try:
            await self._client.delete(key)
        except Exception as e:
            logger.warning("redis_service.delete_failed", key=key, error=str(e))
