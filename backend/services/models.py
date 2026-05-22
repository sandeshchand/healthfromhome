from django.db import models

class City(models.Model):
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class ServiceArea(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Service(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class ServicePricing(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='pricing')
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='pricing')
    service_area = models.ForeignKey(ServiceArea, on_delete=models.CASCADE, related_name='pricing')
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    price_per_km = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    night_charge = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    weekend_charge = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.service.name} - {self.city.name} ({self.service_area.name})"
