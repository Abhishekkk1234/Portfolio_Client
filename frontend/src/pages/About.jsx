// from django.core.exceptions import ValidationError
// from django.db import models
// from django.utils.text import slugify


// # ---------------------------------------------------------------------------
// # Designer / Home / About content
// # ---------------------------------------------------------------------------
// class Designer(models.Model):
//     """
//     Singleton-style model: the site expects exactly one Designer row.
//     Everything on the Home and About pages reads from this record.
//     """
//     name = models.CharField(max_length=150)
//     tagline = models.CharField(
//         max_length=200, blank=True,
//         help_text="Short line shown under the name on the home page, e.g. 'Couturier of quiet excess'."
//     )
//     home_intro = models.TextField(
//         help_text="A short paragraph shown on the Home page."
//     )
//     about_bio = models.TextField(
//         help_text="Full biography shown on the About page."
//     )
//     philosophy = models.TextField(
//         blank=True, help_text="Design philosophy / statement, shown on the About page."
//     )
//     portrait = models.ImageField(upload_to="designer/", blank=True, null=True)
//     about_image = models.ImageField(
//         upload_to="designer/", blank=True, null=True,
//         help_text="Secondary image for the About page (studio, atelier, etc.)."
//     )
//     founded_year = models.PositiveIntegerField(blank=True, null=True)
//     location = models.CharField(max_length=150, blank=True)
//     email = models.EmailField(blank=True)
//     phone = models.CharField(max_length=30, blank=True)
//     instagram_url = models.URLField(blank=True)
//     pinterest_url = models.URLField(blank=True)
//     linkedin_url = models.URLField(blank=True)

//     class Meta:
//         verbose_name = "Designer Profile"
//         verbose_name_plural = "Designer Profile"

//     def __str__(self):
//         return self.name

//     def save(self, *args, **kwargs):
//         if not self.pk and Designer.objects.exists():
//             raise ValidationError(
//                 "Only one Designer Profile is allowed. Edit the existing one instead of adding a new one."
//             )
//         super().save(*args, **kwargs)


// class CraftHighlight(models.Model):
//     """
//     'Details of the craft' blocks shown on the Home page — e.g. hand embroidery,
//     draping, hand-block printing — each with an image and short text.
//     """
//     title = models.CharField(max_length=120)
//     description = models.TextField()
//     image = models.ImageField(upload_to="craft/")
//     order = models.PositiveIntegerField(default=0)

//     class Meta:
//         ordering = ["order", "id"]
//         verbose_name = "Craft Highlight (Home page)"
//         verbose_name_plural = "Craft Highlights (Home page)"

//     def __str__(self):
//         return self.title


// # ---------------------------------------------------------------------------
// # Collections
// # ---------------------------------------------------------------------------
// class Collection(models.Model):
//     title = models.CharField(max_length=150)
//     slug = models.SlugField(max_length=170, unique=True, blank=True)
//     genre = models.CharField(
//         max_length=120,
//         help_text="e.g. Bridal Couture, Resort Wear, Avant-Garde"
//     )
//     season_year = models.CharField(
//         max_length=60, blank=True, help_text="e.g. Spring/Summer 2026"
//     )
//     short_description = models.CharField(
//         max_length=300, help_text="One-line summary shown on the collection grid."
//     )
//     story = models.TextField(
//         help_text="Longer narrative shown on the collection detail page."
//     )
//     fabric_and_technique = models.CharField(max_length=250, blank=True)
//     cover_image = models.ImageField(upload_to="collections/covers/")
//     order = models.PositiveIntegerField(
//         default=0, help_text="Controls the 01, 02, 03... numbering on the site."
//     )
//     is_published = models.BooleanField(default=True)
//     created_at = models.DateTimeField(auto_now_add=True)

//     class Meta:
//         ordering = ["order", "id"]

//     def __str__(self):
//         return self.title

//     def save(self, *args, **kwargs):
//         if not self.slug:
//             self.slug = slugify(self.title)
//         super().save(*args, **kwargs)


// class CollectionImage(models.Model):
//     """
//     Gallery photos for a collection: both look photos and photoshoot/BTS shots.
//     Upload at least 10 per collection from the admin panel.
//     """
//     collection = models.ForeignKey(Collection, related_name="images", on_delete=models.CASCADE)
//     image = models.ImageField(upload_to="collections/gallery/")
//     caption = models.CharField(max_length=200, blank=True)
//     is_photoshoot = models.BooleanField(
//         default=False, help_text="Tick if this is a photoshoot / behind-the-scenes image rather than a plain look shot."
//     )
//     order = models.PositiveIntegerField(default=0)

//     class Meta:
//         ordering = ["order", "id"]

//     def __str__(self):
//         return f"{self.collection.title} — image {self.id}"


// class ArtisticElement(models.Model):
//     """
//     Each Collection has multiple Artistic Elements (garments / looks / pieces).
//     """
//     collection = models.ForeignKey(Collection, related_name="artistic_elements", on_delete=models.CASCADE)
//     title = models.CharField(max_length=150)
//     description = models.TextField(blank=True)
//     material = models.CharField(max_length=200, blank=True)
//     cover_image = models.ImageField(upload_to="elements/covers/", blank=True, null=True)
//     order = models.PositiveIntegerField(default=0)

//     class Meta:
//         ordering = ["order", "id"]

//     def __str__(self):
//         return f"{self.collection.title} · {self.title}"


// class ArtisticElementImage(models.Model):
//     """
//     Photos for one artistic element — again, at least 10 recommended,
//     mixing final shots and photoshoot images.
//     """
//     artistic_element = models.ForeignKey(ArtisticElement, related_name="images", on_delete=models.CASCADE)
//     image = models.ImageField(upload_to="elements/gallery/")
//     caption = models.CharField(max_length=200, blank=True)
//     is_photoshoot = models.BooleanField(default=False)
//     order = models.PositiveIntegerField(default=0)

//     class Meta:
//         ordering = ["order", "id"]

//     def __str__(self):
//         return f"{self.artistic_element.title} — image {self.id}"


// # ---------------------------------------------------------------------------
// # Enquiry
// # ---------------------------------------------------------------------------
// class Enquiry(models.Model):
//     name = models.CharField(max_length=150)
//     email = models.EmailField()
//     phone = models.CharField(max_length=30, blank=True)
//     subject = models.CharField(max_length=200, blank=True)
//     message = models.TextField()
//     collection_of_interest = models.ForeignKey(
//         Collection, blank=True, null=True, on_delete=models.SET_NULL, related_name="enquiries"
//     )
//     created_at = models.DateTimeField(auto_now_add=True)
//     is_read = models.BooleanField(default=False)

//     class Meta:
//         ordering = ["-created_at"]
//         verbose_name_plural = "Enquiries"

//     def __str__(self):
//         return f"{self.name} — {self.subject or self.message[:30]}"


// import React from 'react';

// function About() {
//   return (
//     <div className="about-page">
//       <h1>About</h1>
//       <p>This is the About page.</p>
//     </div>
//   );
// }

// export default About;

// import React, { useEffect, useState } from 'react';

// function About() {
//   const [designer, setDesigner] = useState(null);

//   useEffect(() => {
//     // Adjust this URL to match your actual Django API endpoint
//     // fetch('/api/designer/')
//       fetch('http://127.0.0.1:8000/api/designer/')
//       .then((res) => res.json())
//       .then((data) => setDesigner(data));
//   }, []);

//   if (!designer) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="about-page">
//       <h1>{designer.name}</h1>
//       <p className="tagline">{designer.tagline}</p>

//       {designer.about_image && (
//         <img src={designer.about_image} alt={designer.name} />
//       )}

//       <section>
//         <h2>Biography</h2>
//         <p>{designer.about_bio}</p>
//       </section>

//       {designer.philosophy && (
//         <section>
//           <h2>Philosophy</h2>
//           <p>{designer.philosophy}</p>
//         </section>
//       )}

//       <footer>
//         {designer.location && <p>{designer.location}</p>}
//         {designer.email && <p>{designer.email}</p>}
//       </footer>
//     </div>
//   );
// }

// export default About;



import React, { useEffect, useState } from 'react';

function About() {
  const [designer, setDesigner] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/designer/')
      .then((res) => res.json())
      .then((data) => setDesigner(data))
      .catch((err) => console.error('Error fetching designer:', err));
  }, []);

  if (!designer) {
    return (
      <div style={{ padding: '80px', fontFamily: 'serif', fontSize: '20px' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#efe9e2', minHeight: '100vh' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '60px 40px',
          gap: '60px',
        }}
      >
        {/* Image on the left */}
        <div style={{ flex: '1 1 400px' }}>
          {designer.about_image && (
            <img
              src={designer.about_image}
              alt={designer.name}
              style={{
                width: '100%',
                height: '520px',
                objectFit: 'cover',
              }}
            />
          )}
        </div>

        {/* Text on the right */}
        <div style={{ flex: '1 1 400px' }}>
          <p
            style={{
              color: '#a4462f',
              letterSpacing: '2px',
              fontSize: '13px',
              marginBottom: '10px',
            }}
          >
            {designer.location?.toUpperCase()}
          </p>

          <h1
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '48px',
              margin: '0 0 20px 0',
            }}
          >
            {designer.name}
          </h1>

          <h3 style={{ fontFamily: 'Georgia, serif', marginBottom: '10px' }}>
            Biography
          </h3>
          <p style={{ lineHeight: '1.6', color: '#333', marginBottom: '30px' }}>
            {designer.about_bio}
          </p>

          {designer.philosophy && (
            <>
              <h3 style={{ fontFamily: 'Georgia, serif', marginBottom: '10px' }}>
                Philosophy
              </h3>
              <p style={{ lineHeight: '1.6', color: '#333', marginBottom: '30px' }}>
                {designer.philosophy}
              </p>
            </>
          )}

          <p style={{ color: '#555', marginBottom: '5px' }}>{designer.email}</p>
        </div>
      </div>
    </div>
  );
}

export default About;