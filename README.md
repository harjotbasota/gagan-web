# gagan-web

Static site for **CTY Transportation** (Mississauga / NYC metro limo and airport service).

Single **Docker image** (nginx + static files): good for **Cloud Run** as one service. The contact form posts **directly** to a hosted form API—no second container.

Deploy the same build to **Google Cloud Storage** static hosting by exporting the files nginx would serve (see below).

## Direct email / form APIs (no backend)

The app uses `fetch()` to POST `multipart/form-data` to `CONTACT_FORM_ACTION`, with `Accept: application/json` (works with **Formspree**).

- [Formspree](https://formspree.io): create a form, set `CONTACT_FORM_ACTION=https://formspree.io/f/<your-id>`, confirm your email in their dashboard.
- Alternatives with similar browser POST models: [Getform](https://getform.io), [FormSubmit](https://formsubmit.co) (configure to match field names if required).

Branding (company name, tagline, **owner name**, phone, etc.) and form endpoints are driven from environment variables (see `.env.example`).

## Local development

```bash
cp .env.example .env
# edit .env — set CONTACT_FORM_ACTION and your real email

npm install
npm run dev
```

`npm run dev` generates `public/config.js` from `.env` before Vite starts.

## Docker Compose

```bash
cp .env.example .env
docker compose up --build
```

Open `http://localhost` (port **80** by default). To use another host port, set `HOST_PORT` in `.env`.

## Cloud Run (one service)

1. Build and push the image.
2. Deploy with **the same variables** as in `.env` (Console → Cloud Run → Edit container → Environment variables).  
3. Cloud Run sets `PORT`; the entrypoint injects it into nginx.

Example:

```bash
gcloud run deploy gagandeep-web \
  --image REGION-docker.pkg.dev/PROJECT/REPO/gagandeep-web:latest \
  --platform managed \
  --region REGION \
  --allow-unauthenticated \
  --set-env-vars "SITE_NAME=CTY TRANSPORTATION,OWNER_NAME=Manvir Kaur,PRIMARY_PHONE=(929) 390-5862,SITE_TAGLINE=...,CONTACT_FORM_ACTION=https://formspree.io/f/xxx,..."
```

Use commas between vars; escape or use `--env-vars-file` for complex values.

## Google Cloud Storage (static bucket website)

The container generates `config.js` at **startup** from env. For a bucket:

1. Easiest: start the container with your `.env`, then copy the fully rendered site out:

   ```bash
   docker compose up -d
   docker cp "$(docker compose ps -q web)":/usr/share/nginx/html ./gcs-static
   docker compose down
   ```

2. Upload `gcs-static` to your bucket; set **website** main page to `index.html`.  
3. Ensure `config.js` is present in the upload (it is created when the container starts). For updates to copy, repeat after changing env.

**Note:** GCS cannot run the entrypoint for visitors—you upload the **already-generated** HTML/JS/assets including `config.js`.

## Photos

Add images under `public/photos/<folder>/` (any filename). The build picks the **first** image file per folder (sorted by name) and writes `public/photos/manifest.json`. Slots used in the layout: `frontpagephoto1` (hero), `frontpagephoto2` (about band).

The repo includes **sample photos** from [Unsplash](https://unsplash.com) (`hero.jpg`, `interior.jpg`); swap them for your own assets for production.

## Project structure

- `public/config.js.template` — substituted at container start (Docker) or by `scripts/inject-config.mjs` (local dev).
- `scripts/generate-photo-manifest.mjs` — runs before `vite build`.
