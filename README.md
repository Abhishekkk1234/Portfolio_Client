# Fashion Design Portfolio — Full Stack (Django + React)

A complete portfolio website: Home / About / Collections / Enquiry pages on
the frontend, a Django REST API backend, and a full no-code admin panel for
managing everything — designer bio, craft highlights, 8 collections × 8
artistic elements each (with photo galleries), and incoming enquiries.

```
portfolio-site/
├── backend/     Django + Django REST Framework + SQLite + admin panel
└── frontend/    React (Create React App style) + React Router + Axios
```

## Quick start (run both together)

**Terminal 1 — backend**
```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_demo_data     # optional: fills the site with demo content
python manage.py runserver
```

**Terminal 2 — frontend**
```bash
cd frontend
npm install
cp .env.example .env
npm start
```

Now:
- Website: http://localhost:3000
- Admin panel (no coding needed to manage content): http://127.0.0.1:8000/admin/
- Raw API: http://127.0.0.1:8000/api/

## How the pieces connect

- **Database → Admin → API → Frontend.** Every image/text field you fill in
  the Django admin is immediately available through the REST API, and the
  React pages fetch that API on load — there is no build step or manual
  sync required when you add content.
- **CORS** is configured in `backend/portfolio_backend/settings.py` via
  `django-cors-headers`, allowing `http://localhost:3000` (the React dev
  server) to call the API. Update `CORS_ALLOWED_ORIGINS` in `backend/.env`
  when you deploy the frontend elsewhere.
- **Media/images** are served from Django's `/media/` path in development;
  in production, point that at S3/Cloud storage or serve it via nginx.

## What the admin panel lets you do without touching code

- Edit the **Designer Profile** once (Home intro + About bio, philosophy,
  portrait, contact links) — enforced as a singleton so there's no ambiguity
  about which profile is live.
- Add/reorder **Craft Highlights** for the Home page.
- Add/edit **Collections** — title, genre, season, story, materials, cover
  photo, publish toggle, and inline photo gallery (mark each photo as a
  "look" or "photoshoot" shot).
- Inside each Collection, add its **Artistic Elements** (the 8 pieces), and
  open each one to upload its own 10+ photo gallery.
- View submitted **Enquiries** (read-only — they come from the public form).

## Extending this

- Swap SQLite for Postgres for production (see `backend/README.md`).
- Add authentication/checkout if this becomes an e-commerce site later —
  the models are already structured per-collection/per-piece to support it.
- Deploy backend (Railway/Render/Fly.io/EC2) and frontend (Netlify/Vercel),
  then update `CORS_ALLOWED_ORIGINS`/`CSRF_TRUSTED_ORIGINS` and
  `REACT_APP_API_URL` accordingly.

See `backend/README.md` and `frontend/README.md` for the full details of
each half.
