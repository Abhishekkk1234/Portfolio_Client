"""
Populates the database with a working demo: 1 designer profile, 4 craft
highlights, 8 collections x 8 artistic elements each, with placeholder
photos generated on the fly (no internet needed).

Run once after your first migration:
    python manage.py seed_demo_data

Re-running is safe — it wipes and recreates the demo content only.
"""
import io
import random

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from PIL import Image, ImageDraw, ImageFont

from core.models import (
    ArtisticElement,
    ArtisticElementImage,
    Collection,
    CollectionImage,
    CraftHighlight,
    Designer,
)

PALETTE = [
    "#8C2F23", "#161412", "#8A8378", "#C7B7A3",
    "#3B2A26", "#B5451B", "#4A4238", "#D8CFC0",
]

COLLECTION_NAMES = [
    ("Ash & Ember", "Avant-Garde Couture"),
    ("Marrow", "Bridal Couture"),
    ("Second Skin", "Resort Wear"),
    ("Terra Firma", "Ready-to-Wear"),
    ("Nocturne", "Evening Wear"),
    ("Sediment", "Textile Art"),
    ("Vantablack", "Menswear"),
    ("Reliquary", "Capsule Collection"),
]

ELEMENT_WORDS = [
    "Drape", "Silhouette", "Cutwork", "Bodice", "Train",
    "Overlay", "Corsetry", "Panel",
]


def make_placeholder_image(label, size=(1200, 1500)):
    color = random.choice(PALETTE)
    img = Image.new("RGB", size, color)
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.load_default()
    except Exception:
        font = None
    text = label
    draw.text((40, size[1] - 60), text, fill="white", font=font)
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG", quality=70)
    buffer.seek(0)
    return ContentFile(buffer.read(), name=f"{label.replace(' ', '_')}.jpg")


class Command(BaseCommand):
    help = "Seed the database with demo content so the site is not empty on first run."

    def handle(self, *args, **options):
        self.stdout.write("Clearing previous demo content...")
        Collection.objects.all().delete()
        CraftHighlight.objects.all().delete()

        self.stdout.write("Creating designer profile...")
        designer, _ = Designer.objects.get_or_create(
            name="Aanya Rao",
            defaults=dict(
                tagline="Couturier of quiet excess",
                home_intro=(
                    "Aanya Rao designs garments that sit between sculpture and "
                    "second skin — built by hand, in small batches, from natural "
                    "fibre and reclaimed textile."
                ),
                about_bio=(
                    "Aanya Rao trained in Mumbai and Antwerp before founding her "
                    "eponymous studio in 2016. Her work is defined by hand "
                    "embroidery, raw-edge tailoring, and a refusal to repeat a "
                    "silhouette twice. Each collection begins as a set of "
                    "drawings and ends, months later, on a runway or in a "
                    "single client's wardrobe."
                ),
                philosophy=(
                    "Clothing should carry the evidence of the hand that made "
                    "it. Nothing leaves the studio that could have been made "
                    "by a machine alone."
                ),
                founded_year=2016,
                location="Mumbai, India",
                email="studio@aanyarao.example",
            ),
        )
        if not designer.portrait:
            designer.portrait.save("portrait.jpg", make_placeholder_image("Aanya Rao"), save=False)
        if not designer.about_image:
            designer.about_image.save("atelier.jpg", make_placeholder_image("The Atelier"), save=False)
        designer.save()

        self.stdout.write("Creating craft highlights...")
        crafts = [
            ("Hand Embroidery", "Every motif is stitched by a single artisan over 40-plus hours."),
            ("Natural Dyeing", "Fabrics are dyed in small vats using root, bark and indigo."),
            ("Raw-Edge Tailoring", "Seams are left deliberately unfinished, exposed as texture."),
            ("Hand Draping", "Garments are draped directly on the form before any pattern is cut."),
        ]
        for i, (title, desc) in enumerate(crafts):
            ch = CraftHighlight(title=title, description=desc, order=i)
            ch.image.save(f"craft_{i}.jpg", make_placeholder_image(title), save=False)
            ch.save()

        self.stdout.write("Creating 8 collections with 8 artistic elements each...")
        for c_index, (name, genre) in enumerate(COLLECTION_NAMES, start=1):
            collection = Collection(
                title=name,
                genre=genre,
                season_year=f"Collection {c_index:02d} · 2025",
                short_description=f"A study in {genre.lower()}, built around texture and restraint.",
                story=(
                    f"'{name}' began as a set of studio sketches exploring weight, "
                    f"tension and the memory cloth holds after it has been worn. "
                    f"Across eight pieces, the collection moves from raw material "
                    f"to finished silhouette."
                ),
                fabric_and_technique="Hand-loomed cotton, raw silk, natural dye",
                order=c_index,
            )
            collection.cover_image.save(
                f"collection_{c_index}_cover.jpg", make_placeholder_image(f"{name} Cover"), save=False
            )
            collection.save()

            for i in range(10):
                is_shoot = i >= 6
                img = CollectionImage(
                    collection=collection,
                    caption=f"{name} — {'photoshoot' if is_shoot else 'look'} {i + 1}",
                    is_photoshoot=is_shoot,
                    order=i,
                )
                img.image.save(
                    f"collection_{c_index}_img_{i}.jpg",
                    make_placeholder_image(f"{name} {i + 1}"),
                    save=False,
                )
                img.save()

            for e_index in range(1, 9):
                word = random.choice(ELEMENT_WORDS)
                element = ArtisticElement(
                    collection=collection,
                    title=f"{word} No. {e_index}",
                    description=(
                        f"Piece {e_index} of {name}, exploring {word.lower()} as both "
                        f"structure and ornament."
                    ),
                    material="Hand-loomed cotton, raw silk",
                    order=e_index,
                )
                element.cover_image.save(
                    f"c{c_index}_e{e_index}_cover.jpg",
                    make_placeholder_image(f"{word} {e_index}"),
                    save=False,
                )
                element.save()

                for i in range(10):
                    is_shoot = i >= 6
                    eimg = ArtisticElementImage(
                        artistic_element=element,
                        caption=f"{element.title} — {'photoshoot' if is_shoot else 'detail'} {i + 1}",
                        is_photoshoot=is_shoot,
                        order=i,
                    )
                    eimg.image.save(
                        f"c{c_index}_e{e_index}_img_{i}.jpg",
                        make_placeholder_image(f"{word} {e_index}.{i + 1}"),
                        save=False,
                    )
                    eimg.save()

        self.stdout.write(self.style.SUCCESS(
            "Demo data created: 1 designer, 4 craft highlights, 8 collections x "
            "8 elements, each with 10 photos. Replace these via /admin/ with real photography."
        ))
