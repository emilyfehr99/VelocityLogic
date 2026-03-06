import os
import stripe
from typing import Optional, Dict, Any

class StripeService:
    """Handles Stripe payment link generation and payment status tracking."""
    
    def __init__(self):
        stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
        self.enabled = bool(stripe.api_key)
        if not self.enabled:
            print("⚠ STRIPE_SECRET_KEY not found. Stripe service running in MOCK mode.")

    def create_payment_link(self, amount: float, customer_name: str, quote_id: str) -> Optional[str]:
        """
        Creates a Stripe Checkout Session and returns the payment link.
        """
        if not self.enabled:
            # Mock link for testing
            return f"https://checkout.stripe.com/pay/mock_{quote_id}"

        try:
            # Create a simple product/price for the quote
            # In production, you'd likely reuse products or create one-time line items
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'cad',
                        'product_data': {
                            'name': f"Quote {quote_id} - {customer_name}",
                        },
                        'unit_amount': int(amount * 100), # Stripe uses cents
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url='https://velocitylogic.app/success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url='https://velocitylogic.app/cancel',
                metadata={
                    'quote_id': quote_id,
                    'customer_name': customer_name
                }
            )
            return session.url
        except Exception as e:
            print(f"✗ Stripe Error: {e}")
            return None

    def check_payment_status(self, session_id: str) -> str:
        """Checks if a payment session is completed."""
        if not self.enabled:
            return "PAID" if "mock" in session_id else "UNPAID"
            
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            return session.payment_status.upper() # 'paid', 'unpaid', 'no_payment_required'
        except Exception as e:
            print(f"✗ Stripe Retrieve Error: {e}")
            return "UNKNOWN"
