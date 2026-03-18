import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


async def send_notification(contact_data: dict):
    gmail_user = os.getenv("GMAIL_USER")
    gmail_password = os.getenv("GMAIL_APP_PASSWORD")
    notify_email = os.getenv("NOTIFY_EMAIL", gmail_user)

    if not gmail_user or not gmail_password:
        return False

    msg = MIMEMultipart()
    msg["From"] = gmail_user
    msg["To"] = notify_email
    msg["Subject"] = f"Portfolio Contact: {contact_data['subject']} from {contact_data['name']}"

    body = f"""
New message from your portfolio website!

Name: {contact_data['name']}
Email: {contact_data['email']}
Subject: {contact_data['subject']}

Message:
{contact_data['message']}
"""

    msg.attach(MIMEText(body, "plain"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(gmail_user, gmail_password)
        server.send_message(msg)

    return True
