"""Users route — Supabase profile management."""
import structlog
from fastapi import APIRouter, HTTPException
from app.services.supabase_service import SupabaseService
from app.models.schemas import UserProfile

router = APIRouter()
logger = structlog.get_logger()
supabase_svc = SupabaseService()


@router.get("/{user_id}", response_model=UserProfile)
async def get_user_profile(user_id: str) -> UserProfile:
    try:
        profile = await supabase_svc.get_user_profile(user_id)
        if not profile:
            raise HTTPException(status_code=404, detail="User not found")
        return UserProfile(**profile)
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
