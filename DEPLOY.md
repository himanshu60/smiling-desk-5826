# Deployment Guide — Click & Collect

## Why not Netlify?

The old Netlify site `startling-starship-84b8ae` is **Suspended**, was published via
**Netlify Drop** (not connected to GitHub, so pushes don't redeploy it), and the
Netlify team is currently on **operational credits with production deploys paused**.
So we deploy everything to **Render** instead — it's free, connects to GitHub
(auto-deploys on push), and hosts both the static frontend and the Node backend.

| Part | Host | Service name |
|------|------|--------------|
| Backend (Node + Express) | Render Web Service | `smiling-desk-backend` |
| Frontend (static site)   | Render Static Site | `smiling-desk-frontend` |

---

## Deploy both with the Blueprint (easiest)

1. Push this repo to GitHub (already done on `main`).
2. Go to [render.com](https://render.com) → **New +** → **Blueprint** → connect
   `himanshu60/smiling-desk-5826`. Render reads [`render.yaml`](render.yaml) and
   creates **both** services.
3. On the **backend** service, set the secret env vars (Dashboard → Environment):
   - `mongoUrl` = your MongoDB Atlas connection string
   - `key` = your JWT secret
   - `CLIENT_ORIGINS` is preset to `https://smiling-desk-frontend.onrender.com`
   - *(Do NOT set `PORT` — Render injects it.)*
4. In **MongoDB Atlas → Network Access**, add `0.0.0.0/0` so Render can connect.
5. Deploy. You get two URLs:
   - Backend: `https://smiling-desk-backend.onrender.com`
   - Frontend: `https://smiling-desk-frontend.onrender.com`

> **Keep the service names as-is.** The frontend's
> [`config.js`](frontend/scripts/config.js#L5) defaults `PROD_API_URL` to
> `https://smiling-desk-backend.onrender.com`, which matches the backend name.
> If you rename the backend service, update that line and push.

## Manual alternative (no Blueprint)

- **Backend:** New + → Web Service → Root Dir `backend`, Build `npm install`,
  Start `npm start`, add the env vars above.
- **Frontend:** New + → Static Site → Root Dir `frontend`, Build (leave blank/echo),
  Publish Directory `.`.

## Verify end-to-end

1. Open `https://smiling-desk-backend.onrender.com/products` → should return JSON.
2. Open the frontend URL → products load, register, login, add to cart,
   cart view/update/remove, search, filter, sort — with **no console/network errors**.

> Note: Render free web services **sleep after ~15 min idle**, so the first request
> after a nap takes ~30–50s to wake. That's normal on the free tier.

---

## If you later restore Netlify

Once your Netlify credits reset, you can also host the frontend there:
drag the `frontend/` folder onto [app.netlify.com/drop](https://app.netlify.com/drop),
or connect the GitHub repo with **Publish directory = `frontend`** (a root
[`netlify.toml`](netlify.toml) already sets this). Then set the frontend's
`CLIENT_ORIGINS` on the backend to include the Netlify URL.
