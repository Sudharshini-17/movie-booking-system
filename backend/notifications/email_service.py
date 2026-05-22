from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings


def send_booking_email(user_email, context):
    try:
        subject = "🎟️ Booking Confirmation"

        html_content = render_to_string(
            "emails/booking_confirmation.html", context
        )

        email = EmailMultiAlternatives(
            subject,
            "",
            settings.EMAIL_HOST_USER,
            [user_email],
        )

        email.attach_alternative(html_content, "text/html")
        email.send()

        print("✅ EMAIL SENT")

    except Exception as e:
        print("❌ EMAIL ERROR:", str(e))