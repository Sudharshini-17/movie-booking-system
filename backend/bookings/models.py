from django.db import models
from django.contrib.auth.models import User
from movies.models import Show


class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    show = models.ForeignKey(Show, on_delete=models.CASCADE)

    seats = models.CharField(max_length=100)
    payment_id = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.show} - {self.seats}"