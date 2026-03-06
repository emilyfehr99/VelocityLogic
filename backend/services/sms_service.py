"""
SMS Service
Handles outbound quote delivery and inbound webhook processing using Twilio.
"""

import os
import logging
from typing import Optional
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException

class SMSService:
    def __init__(self):
        self.account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.from_number = os.getenv("TWILIO_FROM_NUMBER")
        
        self.client = None
        if self.account_sid and self.auth_token:
            try:
                self.client = Client(self.account_sid, self.auth_token)
            except Exception as e:
                logging.error(f"Failed to initialize Twilio client: {e}")

    def send_quote_link(self, to_number: str, customer_name: str, quote_url: str) -> bool:
        """Send an outbound SMS with a quote link."""
        if not self.client:
            logging.warning("Twilio not configured. Skipping SMS.")
            return False
            
        message_body = (
            f"Hi {customer_name}, your quote from Velocity Logic is ready! "
            f"View it here: {quote_url}\n\n"
            "Reply YES to approve instantly."
        )
        
        try:
            self.client.messages.create(
                body=message_body,
                from_=self.from_number,
                to=to_number
            )
            return True
        except TwilioRestException as e:
            logging.error(f"Twilio error: {e}")
            return False

    def _send_sms(self, to_number: str, message: str) -> bool:
        """Helper to send a raw SMS."""
        if not self.client:
            logging.warning("Twilio not configured. Mocking SMS.")
            print(f"MOCK SMS to {to_number}: {message}")
            return True
            
        try:
            self.client.messages.create(
                body=message,
                from_=self.from_number,
                to=to_number
            )
            return True
        except TwilioRestException as e:
            logging.error(f"Twilio error: {e}")
            return False

    def send_invoice_notification(self, to_number: str, amount: float, payment_link: Optional[str] = None) -> bool:
        """Send notification after SMS approval."""
        message_body = (
            f"Thank you! Your quote for ${amount:,.2f} has been approved. "
            "We have generated your invoice and scheduled the work."
        )
        if payment_link:
            message_body += f"\n\nPay online here: {payment_link}"
        
        return self._send_sms(to_number, message_body)
