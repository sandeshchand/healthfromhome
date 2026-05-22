from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.db import connection
from django.http import JsonResponse
from django.urls import path, include


def api_root(request):
    return JsonResponse({
        'message': 'HealthFromHome backend is running.',
        'admin': '/admin/',
        'api': {
            'users': '/api/users/',
            'services': '/api/services/',
            'patients': '/api/patients/',
            'bookings': '/api/bookings/',
            'payments': '/api/payments/',
            'records': '/api/records/',
            'reminders': '/api/reminders/',
        },
    })


def health_check(request):
    try:
        connection.ensure_connection()
    except Exception:
        return JsonResponse({
            'status': 'error',
            'database': 'unavailable',
        }, status=503)

    return JsonResponse({
        'status': 'ok',
        'database': 'available',
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('api/health/', health_check, name='health-check'),
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/services/', include('services.urls')),
    path('api/patients/', include('patients.urls')),
    path('api/bookings/', include('bookings.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/records/', include('records.urls')),
    path('api/reminders/', include('notifications.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
