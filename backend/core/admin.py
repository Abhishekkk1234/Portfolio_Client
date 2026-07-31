from django.contrib import admin
from django.utils.html import format_html

import nested_admin

from .models import (
    ArtisticElement,
    ArtisticElementImage,
    Collection,
    CollectionImage,
    CraftHighlight,
    Designer,
    Enquiry,
)


def thumb(obj, field="image", size=60):
    file = getattr(obj, field, None)
    if not file:
        return "—"
    return format_html(
        '<img src="{}" style="height:{}px;width:{}px;object-fit:cover;border-radius:4px;" />',
        file.url, size, size,
    )


# ---------------------------------------------------------------------------
# Designer / Home / About
# ---------------------------------------------------------------------------
@admin.register(Designer)
class DesignerAdmin(admin.ModelAdmin):
    list_display = ("name", "tagline", "location", "email")

    fieldsets = (
        ("Basic Info", {
            "fields": ("name", "tagline", "portrait"),
            "description": "Shown across the whole site (nav, hero, footer).",
        }),
        ("Home Page Content", {
            "fields": ("home_intro",),
            "description": "The short introduction paragraph shown on the Home page.",
        }),
        ("About Page Content", {
            "fields": ("about_bio", "philosophy", "about_image"),
            "description": "The full story and studio photo shown on the About page.",
        }),
        ("Studio Details", {
            "fields": ("founded_year", "location"),
        }),
        ("Contact", {
            "fields": ("email", "phone"),
        }),
        ("Social Links (optional)", {
            "fields": ("instagram_url", "pinterest_url", "linkedin_url"),
            "classes": ("collapse",),
            "description": "Leave any of these blank if not applicable — they simply won't show on the site.",
        }),
    )

    def has_add_permission(self, request):
        # Enforce the singleton: hide "Add" once a profile exists.
        if Designer.objects.exists():
            return False
        return super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        # There should always be exactly one profile once created.
        return False


@admin.register(CraftHighlight)
class CraftHighlightAdmin(admin.ModelAdmin):
    list_display = ("preview", "title", "order")
    list_editable = ("order",)
    ordering = ("order",)

    def preview(self, obj):
        return thumb(obj, "image")


# ---------------------------------------------------------------------------
# Collections — everything for one collection (info, gallery, elements,
# and each element's own photos) is editable from a single page.
# ---------------------------------------------------------------------------
class CollectionImageInline(nested_admin.NestedTabularInline):
    model = CollectionImage
    extra = 2
    fields = ("preview", "image", "caption", "is_photoshoot", "order")
    readonly_fields = ("preview",)
    ordering = ("order",)
    classes = ("collapse",)
    verbose_name = "Collection gallery photo"
    verbose_name_plural = "① Collection Gallery Photos (look shots + photoshoot — add 10+)"

    def preview(self, obj):
        return thumb(obj, "image", 50)


class ArtisticElementImageInline(nested_admin.NestedTabularInline):
    model = ArtisticElementImage
    extra = 2
    fields = ("preview", "image", "caption", "is_photoshoot", "order")
    readonly_fields = ("preview",)
    ordering = ("order",)
    verbose_name = "Photo"
    verbose_name_plural = "Photos for this piece (add 10+)"

    def preview(self, obj):
        return thumb(obj, "image", 50)


class ArtisticElementInline(nested_admin.NestedStackedInline):
    """
    Each Artistic Element, with its own photo gallery nested directly
    underneath it — no need to leave the Collection page.
    """
    model = ArtisticElement
    extra = 1
    fields = ("title", "description", "material", "cover_image", "order")
    ordering = ("order",)
    classes = ("collapse",)
    verbose_name_plural = "② Artistic Elements (the pieces in this collection — add all 8, each with its own photos below)"
    inlines = [ArtisticElementImageInline]


@admin.register(Collection)
class CollectionAdmin(nested_admin.NestedModelAdmin):
    list_display = (
        "cover_preview", "order", "title", "genre", "season_year",
        "is_published", "image_count", "element_count",
    )
    list_editable = ("order", "is_published")
    list_filter = ("genre", "is_published")
    search_fields = ("title", "genre", "season_year")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [CollectionImageInline, ArtisticElementInline]
    fieldsets = (
        ("Collection Info", {
            "fields": ("title", "slug", "genre", "season_year", "order", "is_published"),
        }),
        ("Written Content", {
            "fields": ("short_description", "story", "fabric_and_technique"),
        }),
        ("Cover Photo", {
            "fields": ("cover_image",),
        }),
    )

    class Media:
        css = {"all": ("core/admin_extra.css",)}

    def cover_preview(self, obj):
        return thumb(obj, "cover_image")

    def image_count(self, obj):
        return obj.images.count()
    image_count.short_description = "Gallery photos"

    def element_count(self, obj):
        return obj.artistic_elements.count()
    element_count.short_description = "Artistic elements"


@admin.register(ArtisticElement)
class ArtisticElementAdmin(nested_admin.NestedModelAdmin):
    """
    Kept as a standalone page too — handy for quickly finding one piece by
    search, but day-to-day editing normally happens from the Collection page.
    """
    list_display = ("cover_preview", "title", "collection", "order", "image_count")
    list_filter = ("collection",)
    list_editable = ("order",)
    search_fields = ("title", "collection__title")
    inlines = [ArtisticElementImageInline]

    def cover_preview(self, obj):
        return thumb(obj, "cover_image")

    def image_count(self, obj):
        return obj.images.count()
    image_count.short_description = "Photos uploaded"


# ---------------------------------------------------------------------------
# Enquiries
# ---------------------------------------------------------------------------
@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "collection_of_interest", "created_at", "is_read")
    list_filter = ("is_read", "created_at", "collection_of_interest")
    list_editable = ("is_read",)
    search_fields = ("name", "email", "subject", "message")
    readonly_fields = ("name", "email", "phone", "subject", "message", "collection_of_interest", "created_at")

    def has_add_permission(self, request):
        # Enquiries only ever come in through the public website form.
        return False
