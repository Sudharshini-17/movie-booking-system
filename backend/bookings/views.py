print("🚨 BOOKINGS VIEW FILE LOADED")

from django.db import transaction
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action

from .models import Booking
from .serializers import BookingSerializer

from notifications.email_service import send_booking_email
from notifications.whatsapp_service import send_whatsapp_message


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        print("🔥 SAFE CREATE METHOD")

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        show = serializer.validated_data["show"]
        requested_seats = serializer.validated_data["seats"].split(",")

        try:
            with transaction.atomic():

                existing_bookings = Booking.objects.select_for_update().filter(show=show)

                booked_seats = []
                for booking in existing_bookings:
                    booked_seats.extend(booking.seats.split(","))

                # ✅ CHECK CONFLICT
                conflict_seats = [s for s in requested_seats if s in booked_seats]

                if conflict_seats:
                    return Response(
                        {
                            "error": f"Seats {', '.join(conflict_seats)} already booked"
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # ✅ SAVE BOOKING
                booking = serializer.save(user=request.user)

        except Exception as e:
            print("❌ ERROR:", str(e))
            return Response(
                {"error": "Server booking error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        context = {
            "user": request.user.username,
            "movie": booking.show.movie.title,
            "theater": booking.show.theater.name,
            "time": booking.show.starts_at,
            "seats": booking.seats,
            "payment_id": booking.payment_id,
        }

        try:
            send_booking_email(
                user_email=request.user.email,
                context=context
            )
            print("✅ EMAIL SENT")
        except Exception as e:
            print("❌ EMAIL ERROR:", str(e))

        try:
            send_whatsapp_message(
                to_number="whatsapp:+918015077308",
                message=f"🎟️ Booking Confirmed!\n\n"
                        f"🎬 {context['movie']}\n"
                        f"🎭 Seats: {context['seats']}\n"
                        f"⏰ {context['time']}"
            )
            print("✅ WHATSAPP SENT")
        except Exception as e:
            print("❌ WhatsApp ERROR:", str(e))

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["get"])
    def available_seats(self, request):
        show_id = request.query_params.get("show")

        if not show_id:
            return Response({"error": "Show ID is required"}, status=400)

        bookings = Booking.objects.filter(show_id=show_id)

        booked_seats = []
        for booking in bookings:
            booked_seats.extend(booking.seats.split(","))

        all_seats = [
            f"{row}{num}"
            for row in ["A", "B", "C", "D", "E", "F", "G", "H"]
            for num in range(1, 13)
        ]

        available = [s for s in all_seats if s not in booked_seats]

        return Response({"available_seats": available})

    @action(detail=False, methods=["get"])
    def my_bookings(self, request):
        bookings = Booking.objects.filter(user=request.user)

        data = []
        for booking in bookings:
            data.append({
                "movie": booking.show.movie.title,
                "theater": booking.show.theater.name,
                "time": str(booking.show.starts_at),
                "seats": booking.seats,
                "payment_id": booking.payment_id,
            })

        return Response({"bookings": data})