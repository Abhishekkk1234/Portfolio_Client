from rest_framework.routers import DefaultRouter

from .views import (
    ArtisticElementViewSet,
    CollectionViewSet,
    CraftHighlightViewSet,
    DesignerView,
    EnquiryViewSet,
)

router = DefaultRouter()
router.register("designer", DesignerView, basename="designer")
router.register("craft-highlights", CraftHighlightViewSet, basename="craft-highlight")
router.register("collections", CollectionViewSet, basename="collection")
router.register("elements", ArtisticElementViewSet, basename="element")
router.register("enquiries", EnquiryViewSet, basename="enquiry")

urlpatterns = router.urls
