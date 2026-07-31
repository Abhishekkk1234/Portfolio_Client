from rest_framework import mixins, viewsets
from rest_framework.response import Response

from .models import ArtisticElement, Collection, CraftHighlight, Designer, Enquiry
from .serializers import (
    ArtisticElementDetailSerializer,
    CollectionDetailSerializer,
    CollectionListSerializer,
    CraftHighlightSerializer,
    DesignerSerializer,
    EnquirySerializer,
)


class DesignerView(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/designer/         -> list (will contain 0 or 1 item)
    GET /api/designer/latest/  -> convenience single-object endpoint
    """
    queryset = Designer.objects.all()
    serializer_class = DesignerSerializer

    def list(self, request, *args, **kwargs):
        instance = Designer.objects.first()
        if not instance:
            return Response({})
        return Response(self.get_serializer(instance).data)


class CraftHighlightViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CraftHighlight.objects.all().order_by("order")
    serializer_class = CraftHighlightSerializer
    pagination_class = None


class CollectionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/collections/            -> grid (list serializer)
    GET /api/collections/{slug}/     -> full detail with images + elements
    """
    queryset = Collection.objects.filter(is_published=True).order_by("order")
    lookup_field = "slug"
    pagination_class = None

    def get_serializer_class(self):
        if self.action == "retrieve":
            return CollectionDetailSerializer
        return CollectionListSerializer


class ArtisticElementViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/elements/{id}/  -> single artistic element with its full gallery
    Useful for a dedicated element page / lightbox deep link.
    """
    queryset = ArtisticElement.objects.select_related("collection").all()
    serializer_class = ArtisticElementDetailSerializer
    pagination_class = None


class EnquiryViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """
    POST /api/enquiries/  -> the only thing the public site is allowed to do here.
    """
    queryset = Enquiry.objects.all()
    serializer_class = EnquirySerializer
