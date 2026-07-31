# Portfolio Frontend (React)

## Setup

```bash
cd frontend
npm install
cp .env.example .env   # confirm REACT_APP_API_URL points at your Django server
npm start
```

Opens on http://localhost:3000 and talks to the Django API at the URL set
in `.env` (defaults to `http://127.0.0.1:8000/api`).

## Pages

- `/` — Home: designer intro, craft highlights, featured collections
- `/about` — full bio, philosophy, contact
- `/collections` — grid of all 8 collections
- `/collections/:slug` — collection story, tabbed gallery (look/photoshoot), artistic elements
- `/enquiry` — contact form, posts to `/api/enquiries/`

## Notes

- All content (text + images) is fetched live from the Django API — there
  is nothing to hand-edit here when the designer updates the admin panel.
- Image URLs come back absolute from the backend (Django's `ImageField`
  serializes to a full URL), so no extra path-joining is needed.
- Build for production with `npm run build`; the `build/` folder can be
  served by any static host (Netlify, Vercel, nginx, etc.) — just make sure
  `REACT_APP_API_URL` points at your deployed Django backend before building.
