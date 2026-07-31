# from rest_framework import serializers

# from .models import (
#     ArtisticElement,
#     ArtisticElementImage,
#     Collection,
#     CollectionImage,
#     CraftHighlight,
#     Designer,
#     Enquiry,
# )


# class DesignerSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Designer
#         fields = "__all__"


# class CraftHighlightSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CraftHighlight
#         fields = ["id", "title", "description", "image", "order"]


# class CollectionImageSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CollectionImage
#         fields = ["id", "image", "caption", "is_photoshoot", "order"]


# class ArtisticElementImageSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ArtisticElementImage
#         fields = ["id", "image", "caption", "is_photoshoot", "order"]


# class ArtisticElementListSerializer(serializers.ModelSerializer):
#     """Lightweight version used inside the Collection detail payload."""
#     cover_image = serializers.ImageField()
#     image_count = serializers.IntegerField(source="images.count", read_only=True)

#     class Meta:
#         model = ArtisticElement
#         fields = ["id", "title", "description", "material", "cover_image", "order", "image_count"]


# class ArtisticElementDetailSerializer(serializers.ModelSerializer):
#     # images = ArtisticElementImageSerializer(many=True, read_only=True)
#     images = serializers.SerializerMethodField()

# def get_images(self, obj):
#     qs = obj.images.order_by("order", "id")
#     return ArtisticElementImageSerializer(qs, many=True, context=self.context).data
#     collection_title = serializers.CharField(source="collection.title", read_only=True)
#     collection_slug = serializers.CharField(source="collection.slug", read_only=True)

#     class Meta:
#         model = ArtisticElement
#         fields = [
#             "id", "title", "description", "material", "cover_image",
#             "order", "images", "collection_title", "collection_slug",
#         ]


# class CollectionListSerializer(serializers.ModelSerializer):
#     """Used for the Collections grid page — no heavy nested galleries."""
#     class Meta:
#         model = Collection
#         fields = [
#             "id", "title", "slug", "genre", "season_year",
#             "short_description", "cover_image", "order",
#         ]


# class CollectionDetailSerializer(serializers.ModelSerializer):
#     # images = CollectionImageSerializer(many=True, read_only=True)
#     images = serializers.SerializerMethodField()

# def get_images(self, obj):
#     qs = obj.images.order_by("order", "id")
#     return CollectionImageSerializer(qs, many=True, context=self.context).data
#     artistic_elements = ArtisticElementListSerializer(many=True, read_only=True)

#     class Meta:
#         model = Collection
#         fields = [
#             "id", "title", "slug", "genre", "season_year", "short_description",
#             "story", "fabric_and_technique", "cover_image", "order",
#             "images", "artistic_elements",
#         ]


# class EnquirySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Enquiry
#         fields = [
#             "id", "name", "email", "phone", "subject",
#             "message", "collection_of_interest", "created_at",
#         ]
#         read_only_fields = ["id", "created_at"]


from rest_framework import serializers

from .models import (
    ArtisticElement,
    ArtisticElementImage,
    Collection,
    CollectionImage,
    CraftHighlight,
    Designer,
    Enquiry,
)


class DesignerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Designer
        fields = "__all__"


class CraftHighlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = CraftHighlight
        fields = ["id", "title", "description", "image", "order"]


class CollectionImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionImage
        fields = ["id", "image", "caption", "is_photoshoot", "order"]


class ArtisticElementImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtisticElementImage
        fields = ["id", "image", "caption", "is_photoshoot", "order"]


class ArtisticElementListSerializer(serializers.ModelSerializer):
    """Lightweight version used inside the Collection detail payload."""
    cover_image = serializers.ImageField()
    image_count = serializers.IntegerField(source="images.count", read_only=True)

    class Meta:
        model = ArtisticElement
        fields = ["id", "title", "description", "material", "cover_image", "order", "image_count"]


class ArtisticElementDetailSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    collection_title = serializers.CharField(source="collection.title", read_only=True)
    collection_slug = serializers.CharField(source="collection.slug", read_only=True)

    def get_images(self, obj):
        qs = obj.images.order_by("order", "id")
        return ArtisticElementImageSerializer(qs, many=True, context=self.context).data

    class Meta:
        model = ArtisticElement
        fields = [
            "id", "title", "description", "material", "cover_image",
            "order", "images", "collection_title", "collection_slug",
        ]


class CollectionListSerializer(serializers.ModelSerializer):
    """Used for the Collections grid page — no heavy nested galleries."""
    class Meta:
        model = Collection
        fields = [
            "id", "title", "slug", "genre", "season_year",
            "short_description", "cover_image", "order",
        ]


class CollectionDetailSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    artistic_elements = ArtisticElementListSerializer(many=True, read_only=True)

    def get_images(self, obj):
        qs = obj.images.order_by("order", "id")
        return CollectionImageSerializer(qs, many=True, context=self.context).data

    class Meta:
        model = Collection
        fields = [
            "id", "title", "slug", "genre", "season_year", "short_description",
            "story", "fabric_and_technique", "cover_image", "order",
            "images", "artistic_elements",
        ]


class EnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Enquiry
        fields = [
            "id", "name", "email", "phone", "subject",
            "message", "collection_of_interest", "created_at",
        ]
        read_only_fields = ["id", "created_at"]