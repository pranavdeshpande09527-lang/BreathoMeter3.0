"""Subscriptions route — Stripe checkout and webhook."""
import structlog
from fastapi import APIRouter, HTTPException, Request, Header
from app.services.stripe_service import StripeService
from app.models.schemas import StripeCheckoutRequest, StripeCheckoutResponse

router = APIRouter()
logger = structlog.get_logger()
stripe_svc = StripeService()


@router.post("/checkout", response_model=StripeCheckoutResponse)
async def create_checkout(body: StripeCheckoutRequest) -> StripeCheckoutResponse:
    try:
        result = await stripe_svc.create_checkout_session(
            price_id=body.price_id,
            success_url=body.success_url,
            cancel_url=body.cancel_url,
        )
        return StripeCheckoutResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None),
):
    payload = await request.body()
    try:
        event = stripe_svc.construct_webhook_event(payload, stripe_signature)
        logger.info("stripe_webhook.received", event_type=event["type"])

        if event["type"] == "customer.subscription.created":
            logger.info("stripe_webhook.subscription_created")
        elif event["type"] == "customer.subscription.deleted":
            logger.info("stripe_webhook.subscription_deleted")

        return {"status": "ok"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
