from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def health(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("", health),
    path("admin/", admin.site.urls),
    path("api/", include("accounts.urls")),
    path("api/", include("rooms.urls")),
    path("api/", include("guests.urls")),
    path("api/", include("reservations.urls")),
    path("api/", include("payments.urls")),
    path("api/", include("cancellations.urls")),
]

# Uploaded receipts. Fine for a demo; use object storage (S3/Cloudinary) for real production use.
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
