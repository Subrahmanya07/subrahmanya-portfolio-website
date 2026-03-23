import os
import logging
import smtplib
import asyncio
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

logger = logging.getLogger(__name__)


def _send_email_sync(contact_data: dict) -> bool:
    """Synchronous email send — runs in a thread executor."""
    gmail_user = os.getenv("GMAIL_USER")
    gmail_password = os.getenv("GMAIL_APP_PASSWORD")
    notify_email = os.getenv("NOTIFY_EMAIL", gmail_user)

    if not gmail_user or not gmail_password:
        logger.error("GMAIL_USER or GMAIL_APP_PASSWORD not set")
        return False

    if not notify_email:
        logger.error("NOTIFY_EMAIL not set and GMAIL_USER is empty")
        return False

    msg = MIMEMultipart()
    msg["From"] = gmail_user
    msg["To"] = notify_email
    msg["Subject"] = f"Portfolio Contact: {contact_data['subject']} from {contact_data['name']}"
    msg["Reply-To"] = contact_data["email"]

    body = f"""
New message from your portfolio website!

Name: {contact_data['name']}
Email: {contact_data['email']}
Subject: {contact_data['subject']}

Message:
{contact_data['message']}
"""

    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=15) as server:
            server.login(gmail_user, gmail_password)
            server.send_message(msg)
        logger.info(f"Email sent successfully to {notify_email}")
        return True
    except smtplib.SMTPAuthenticationError as e:
        logger.error(f"SMTP auth failed — check GMAIL_USER and GMAIL_APP_PASSWORD: {e}")
        raise
    except smtplib.SMTPRecipientsRefused as e:
        logger.error(f"Recipient refused — check NOTIFY_EMAIL ({notify_email}): {e}")
        raise
    except smtplib.SMTPException as e:
        logger.error(f"SMTP error: {e}")
        raise
    except Exception as e:
        logger.error(f"Unexpected email error: {e}")
        raise


async def send_notification(contact_data: dict) -> bool:
    """Send email notification in a thread executor to avoid blocking the event loop."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, _send_email_sync, contact_data)
