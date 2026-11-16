# Serene Stays – Guest House Management

React (Vite + Tailwind) frontend + Django REST API (JWT auth, PostgreSQL).

```
backend/    Django API   (accounts, rooms, guests, reservations, payments, cancellations)
frontend/   React app    (landing page, login, dashboard)
render.yaml Render blueprint (API + static site + Postgres)
```

## Run locally

**Backend** (http://localhost:8000)
```bash
cd backend
python -m venv venv && source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # then edit; leave DATABASE_URL empty to use sqlite
python manage.py migrate
python manage.py createsuperuser      # this is your login
python manage.py runserver
```

**Frontend** (http://localhost:5173)
```bash
cd frontend
npm install
npm run dev                   # uses .env.development -> http://localhost:8000/api
```
Open http://localhost:5173, click **Staff login**, sign in with the superuser.
Add staff accounts from http://localhost:8000/admin/ (Users).

## Tests
```bash
cd backend && python manage.py test
```

## Deploy (Render)
0. Create a free Postgres (e.g. neon.tech) and copy its connection string.
1. Push the repo to GitHub, then Render → New → **Blueprint** → select the repo.
2. API service env vars: `DATABASE_URL` (your Postgres string), `DJANGO_SUPERUSER_USERNAME/EMAIL/PASSWORD`, and after the site URL exists, `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` = the frontend URL (no trailing slash).
3. Frontend on Netlify (`netlify.toml`), Vercel (`frontend/vercel.json`) or Cloudflare Pages (root dir `frontend`, build `npm run build`, output `dist`, env `NODE_VERSION=22`): set `VITE_API_URL` = `https://<your-api>.onrender.com/api`, then redeploy (Vite bakes it in at build time).

Other hosts work too: the API needs `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=False`, `DJANGO_ALLOWED_HOSTS`, `DATABASE_URL`, `CORS_ALLOWED_ORIGINS`; start with `gunicorn config.wsgi`. The frontend is a static build (`npm run build` → `dist/`) that needs an SPA rewrite to `index.html` (`public/_redirects` covers Netlify).

## Notes
- Brand name is one line in `frontend/src/config.js`.
- Optional dashboard video: put a file at `frontend/public/videos/guesthouse.mp4`.
- Uploaded payment receipts use local disk; use object storage (S3/Cloudinary) if you rely on them in production.
