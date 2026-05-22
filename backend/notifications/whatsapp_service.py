from twilio.rest import Client

def send_whatsapp_message(to_number, message):
    try:
        account_sid = "ACaae9afe1abb2146ef0caa15f413f030f"
        auth_token = "623e1b0ea7af86c762a89678a788191e"

        client = Client(account_sid, auth_token)

        client.messages.create(
            body=message,
            from_="whatsapp:+14155238886",
            to=f"whatsapp:{to_number}"
        )

        print("✅ WhatsApp sent successfully")

    except Exception as e:
        print("❌ WhatsApp error:", str(e))