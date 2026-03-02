"""
Stripe service — subscription checkout and webhook handling.
"""
import structlog
import stripe as stripe_client
from app.core.config import settings

logger = structlog.get_logger()


class StripeService:
    def __init__(self):
        stripe_client.api_key = settings.STRIPE_SECRET_KEY

    async def create_checkout_session(
        self,
        price_id: str,
        success_url: str,
        cancel_url: str,
        customer_email: str | None = None,
    ) -> dict:
        if not settings.STRIPE_SECRET_KEY:
            raise ValueError("Stripe secret key not configured. Provide STRIPE_SECRET_KEY.")

        session_params = {
            "payment_method_types": ["card"],
            "line_items": [{"price": price_id, "quantity": 1}],
            "mode": "subscription",
            "success_url": success_url,
            "cancel_url": cancel_url,
            "billing_address_collection": "auto",
            "automatic_tax": {"enabled": True},
        }
        if customer_email:
            session_params["customer_email"] = customer_email

        session = stripe_client.checkout.Session.create(**session_params)
        return {"checkout_url": session.url, "session_id": session.id}

    def construct_webhook_event(self, payload: bytes, sig_header: str):
        if not settings.STRIPE_WEBHOOK_SECRET:
            raise ValueError("Stripe webhook secret not configured.")
        return stripe_client.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
