# Deployment Guide — Click & Collect

The app has two parts that deploy separately:

| Part | Host | Why |
|------|------|-----|
| Frontend (static HTML/CSS/JS) | **Netlify** | Static files only. |
| Backend (Node + Express) | **Render** | Netlify can't run a Node server. |

---

## 1. Deploy the backend to Render

1. Push this repo to GitHub (see git steps below).
2. Go to [render.com](https://render.com) → **New +** → **Web Service** → connect this repo.
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
   *(Or use **New + → Blueprint** — Render will read `backend/render.yaml`.)*
4. Add **Environment Variables** (Dashboard → Environment):
   - `mongoUrl` = your MongoDB Atlas connection string
   - `key` = your JWT secret
   - `CLIENT_ORIGINS` = `https://startling-starship-84b8ae.netlify.app`
   - *(Do NOT set `PORT` — Render injects it.)*
5. In **MongoDB Atlas → Network Access**, add `0.0.0.0/0` so Render can connect.
6. Deploy. Note the service URL, e.g. `https://smiling-desk-backend.onrender.com`.
7. Verify: open `https://<your-service>.onrender.com/products` — you should see JSON.

## 2. Point the frontend at the live backend

Edit [`frontend/scripts/config.js`](frontend/scripts/config.js) and set `PROD_API_URL`
to the Render URL from step 6. (If you named the service `smiling-desk-backend`,
the default `https://smiling-desk-backend.onrender.com` already matches.)
Commit and push.

## 3. Redeploy the frontend on Netlify

- Your Netlify site already exists (`startling-starship-84b8ae`).
- Ensure **Publish directory** = `frontend` (a `netlify.toml` at the repo root now
  sets this automatically).
- Trigger a redeploy (Netlify auto-deploys on push to `main`, or use **Deploys →
  Trigger deploy**).

## 4. Verify end-to-end

On the live Netlify site, confirm: products load, register, login, add to cart,
cart view/update/remove, search, filter, sort — with **no console or network errors**.

---

## Git (push to main)

```bash
git add -A
git commit -m "Upgrade: fixes, security, UI polish, deploy config"
git push origin main
```

`backend/.env` and `node_modules` are gitignored and will not be committed.
