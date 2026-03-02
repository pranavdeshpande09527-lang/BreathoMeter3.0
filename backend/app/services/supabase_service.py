"""
Supabase service — database operations and user management.
"""
import structlog
from supabase import create_client, Client
from app.core.config import settings

logger = structlog.get_logger()


def get_supabase_client() -> Client | None:
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        logger.warning("supabase_service.not_configured")
        return None
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)


class SupabaseService:
    def __init__(self):
        self._client = get_supabase_client()

    def _check_client(self):
        if not self._client:
            raise ValueError("Supabase not configured. Provide SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.")

    async def get_user_profile(self, user_id: str) -> dict | None:
        self._check_client()
        result = self._client.table("profiles").select("*").eq("id", user_id).single().execute()
        return result.data

    async def save_risk_prediction(self, user_id: str, prediction: dict) -> dict:
        self._check_client()
        result = self._client.table("risk_predictions").insert({
            "user_id": user_id,
            "city": prediction.get("city"),
            "aqi": prediction.get("aqi"),
            "pm25": prediction.get("pm25"),
            "pm10": prediction.get("pm10"),
            "risk_probability": prediction.get("ml_disease_risk_probability"),
            "risk_category": prediction.get("risk_category"),
            "confidence_score": prediction.get("confidence_score"),
            "top_risk_factor": prediction.get("top_risk_factor"),
        }).execute()
        return result.data

    async def update_subscription_status(self, user_id: str, status: str, tier: str) -> None:
        self._check_client()
        self._client.table("profiles").update({
            "subscription_status": status,
            "subscription_tier": tier,
        }).eq("id", user_id).execute()
