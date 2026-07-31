# Portfolio Backend (Django + DRF)

## 1. Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

## 2. Database + admin login

```bash
python manage.py migrate
python manage.py createsuperuser
```

## 3. (Optional) load demo content

Populates 1 designer profile, 4 craft highlights, and 8 collections x 8
artistic elements, each with 10 placeholder photos — so the site isn't empty
while you swap in real photography.

```bash
python manage.py seed_demo_data
```

## 4. Run

```bash
python manage.py runserver
```

- Admin panel: http://127.0.0.1:8000/admin/
- API root: http://127.0.0.1:8000/api/

## Managing content — no coding required

Everything on the website is editable from `/admin/`:

- **Designer Profile** → Home page intro + About page bio/philosophy/photos.
- **Craft Highlights** → the "details of the craft" blocks on the Home page.
- **Collections** → click a collection to edit its story, then scroll down to
  add gallery photos (mark photoshoot shots with the "is photoshoot"
  checkbox) and add each Artistic Element inline.
- **Artistic Elements** → open one from the Collections list (or the inline
  link) to upload its own 10+ photos.
- **Enquiries** → read-only list of messages submitted from the public
  Enquiry page.

Drag the "order" number on any list to control display order (collections
are numbered 01–08 on the site using this field).

## API endpoints (consumed by the React frontend)

| Method | Endpoint                          | Purpose                                   |
|--------|------------------------------------|--------------------------------------------|
| GET    | `/api/designer/`                  | Designer profile (Home + About)            |
| GET    | `/api/craft-highlights/`          | Craft blocks for the Home page              |
| GET    | `/api/collections/`               | Collection grid (list view)                 |
| GET    | `/api/collections/{slug}/`        | Single collection incl. images + elements   |
| GET    | `/api/elements/{id}/`             | Single artistic element incl. its gallery    |
| POST   | `/api/enquiries/`                 | Submit the Enquiry form                      |

## CORS

`CORS_ALLOWED_ORIGINS` in `.env` must include whatever URL the React app
runs on (defaults to `http://localhost:3000`). Update it before deploying.

## Deploying

- Swap `DATABASES` in `settings.py` for Postgres in production.
- Set `DJANGO_DEBUG=False`, a real `DJANGO_SECRET_KEY`, and your real domain
  in `DJANGO_ALLOWED_HOSTS` / `CORS_ALLOWED_ORIGINS` / `CSRF_TRUSTED_ORIGINS`.
- Serve `/media/` (uploaded photos) via nginx, S3, or another storage
  backend rather than Django directly — `DEBUG=True` static serving is
  dev-only.
- Run `python manage.py collectstatic`.
