from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from users.models import ProviderProfile
from services.models import City, ServiceArea, Service, ServicePricing


class Command(BaseCommand):
    help = "Seed repeatable demo data for local HealthFromHome testing."

    def handle(self, *args, **options):
        self.seed_locations()
        self.seed_services_and_pricing()
        self.seed_provider()
        self.stdout.write(self.style.SUCCESS("Demo data is ready."))

    def seed_locations(self):
        for name in ["Kathmandu", "Lalitpur", "Bhaktapur"]:
            City.objects.get_or_create(name=name, defaults={"is_active": True})

        ServiceArea.objects.get_or_create(
            name="Inside Ring Road",
            defaults={
                "description": "Core Kathmandu Valley service area.",
                "is_active": True,
            },
        )
        ServiceArea.objects.get_or_create(
            name="Outside Ring Road within 30 km",
            defaults={
                "description": "Extended service area within 30 km of ring road.",
                "is_active": True,
            },
        )

    def seed_services_and_pricing(self):
        service_data = [
            ("Nurse Visit", "On-demand nurse visit at patient home.", Decimal("1500"), Decimal("0"), Decimal("500"), Decimal("300")),
            ("Doctor Appointment", "Appointment coordination with doctor or hospital.", Decimal("1000"), Decimal("0"), Decimal("0"), Decimal("0")),
            ("Lab Sample Collection", "Home lab sample collection and report coordination.", Decimal("800"), Decimal("0"), Decimal("300"), Decimal("200")),
            ("Medical Transport", "Non-emergency medical pickup and hospital transportation.", Decimal("2000"), Decimal("100"), Decimal("700"), Decimal("500")),
            ("Physiotherapy Visit", "Home physiotherapy session coordination.", Decimal("1800"), Decimal("0"), Decimal("500"), Decimal("300")),
        ]

        kathmandu = City.objects.get(name="Kathmandu")
        inside_ring_road = ServiceArea.objects.get(name="Inside Ring Road")

        for name, description, base_price, per_km, night, weekend in service_data:
            service, _ = Service.objects.get_or_create(
                name=name,
                defaults={"description": description, "is_active": True},
            )
            ServicePricing.objects.get_or_create(
                service=service,
                city=kathmandu,
                service_area=inside_ring_road,
                defaults={
                    "base_price": base_price,
                    "price_per_km": per_km,
                    "night_charge": night,
                    "weekend_charge": weekend,
                    "is_active": True,
                },
            )

    def seed_provider(self):
        User = get_user_model()
        provider_user, created = User.objects.get_or_create(
            username="demo_nurse",
            defaults={
                "first_name": "Maya",
                "last_name": "Tamang",
                "email": "demo_nurse@example.com",
                "is_provider": True,
            },
        )
        if created:
            provider_user.set_password("DemoProvider123!")
            provider_user.save()

        ProviderProfile.objects.get_or_create(
            user=provider_user,
            defaults={
                "specialization": "Nursing",
                "bio": "Demo provider for local testing and booking assignment.",
                "phone_number": "9800000001",
                "is_active": True,
            },
        )
