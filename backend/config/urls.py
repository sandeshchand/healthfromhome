from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
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
            'records': '/api/records/',
        },
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/services/', include('services.urls')),
    path('api/patients/', include('patients.urls')),
    path('api/bookings/', include('bookings.urls')),
    path('api/records/', include('records.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
