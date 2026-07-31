from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("_nested_admin/", include("nested_admin.urls")),
    path("admin/", admin.site.urls),
    path("api/", include("core.urls")),
]

# Serve uploaded photos in development. In production put this behind
# nginx / a CDN / S3 instead of Django.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

admin.site.site_header = "Studio Admin"
admin.site.site_title = "Studio Admin"
admin.site.index_title = "Manage your portfolio site"
