# Click & Collect — Code Audit Report

_Phase 2 deliverable. Documents the state of the project **before** fixes. Severity: 🔴 critical (breaks the app / security), 🟠 functional bug, 🟡 quality/hardening._

## 1. Architecture overview

**Backend** (`/backend`) — Express + Mongoose, flat structure:
- `index.js` — app bootstrap, CORS, routes, listen.
- `config/db.js` — Mongoose connection.
- `middlewares/auth.js` — JWT verification.
- `routes/` — `user.route.js`, `products.route.js`, `cart.products.route.js` (routes contain all controller logic — no service/controller layer).
- `models/` — `user`, `product`, `cart.product`.

**Frontend** (`/frontend`) — static multi-page site, vanilla JS + Bootstrap + SweetAlert:
- Pages: `index`, `products`, `individual-product-page`, `cart`, `address`, `payment`, `thankU`, plus `Admin-Page/`.
- `scripts/` — one JS file per page + shared `nav.js`.
- API calls hardcode a `deploy_url` constant in every script.

**Data flow**: browser → `fetch(deploy_url + endpoint)` → Express route → Mongoose → Atlas. Auth is a JWT stored in `localStorage` and sent as the raw `Authorization` header.

---

## 2. Findings

### 🔴 Critical

| # | Location | Issue |
|---|----------|-------|
| C1 | `scripts/products.js:7`, `nav.js:22`, others | Frontend points at **`https://tough-hen-underclothes.cyclic.app`** — Cyclic.sh shut down in early 2024. The URL is dead, so **every** API call on the deployed site fails. Root cause of "the deployed project has multiple issues." |
| C2 | `middlewares/auth.js:7` | `jwt.verify()` has **no try/catch**. An invalid/expired/missing token throws → unhandled 500 instead of a clean 401. Any protected route crashes for logged-out users. |
| C3 | `index.js:32` (fixed) | Used lowercase `process.env.port` with no default; cloud hosts inject `PORT`. Server wouldn't bind on deploy. **Fixed in Phase 1.** |
| C4 | `individual-product-page.js:64` | "Add to Cart" on the detail page posts the entire product object with **no `quantity`** (schema requires it → save fails) and reuses the product's `_id`. Feature is broken. |
| C5 | `cart.js:10` + `cart.products.route.js:5` | `GET /cartproducts/:id` takes the user id from the **URL/localStorage** and returns that cart with no ownership check → any user can read any other user's cart (IDOR). |

### 🟠 Functional bugs

| # | Location | Issue |
|---|----------|-------|
| F1 | `products.route.js:31-63` | Branch ordering: `if (category)` is checked **before** `else if (order && category)`, so **sorting within a category is unreachable**. Also `else if (order && category)` is dead code. |
| F2 | `products.route.js:24,32` | `user_id = req.body` (the whole object) then queried against products, which have no `user_id` field. The category query is fragile/incorrect. |
| F3 | `nav.js:172-176` | On login the code writes `data.token` to `localStorage` **before** checking `res.ok` — a failed login stores `undefined`, leaving the UI in a half-logged-in state. |
| F4 | `nav.js:156` | **Hardcoded admin backdoor** in client JS (`admin@click.com` / `admin`) — anyone reading the source becomes admin. |
| F5 | `products.js:117-141` | `filterByCategory` change handler: final branch tests `filterByCategory != ""` (the **element**, always truthy) instead of `.value`. Sort-by-price alone doesn't refresh when only category changes. |
| F6 | `products.js:181`, rating sort | Rating filter refetches **all** products and filters client-side, diverging from the server-side filter/sort paths (inconsistent + wasteful). |
| F7 | `user.route.js:59,54` | Login returns bare strings (`"Wrong Credentials"`, `"User Not found"`) instead of JSON `{msg}`, so the frontend's `res.json()` parsing is brittle. |
| F8 | `products.js:109`, `individual-product-page.js:84` | `swal(res.json())` passes a **Promise** to SweetAlert — error message never renders. |

### 🟡 Security & quality

| # | Location | Issue |
|---|----------|-------|
| Q1 | `index.js:14` | `cors({origin:"*"})` — wide open. |
| Q2 | backend | No `helmet`, no rate limiting, no input validation, no Mongo-injection / XSS sanitization. |
| Q3 | `user.model.js:4` | `email` has no `unique` index → duplicate accounts; no schema-level format validation. |
| Q4 | multiple routes | Raw error objects sent to clients (`res.send(error)`) — leaks internals. |
| Q5 | `auth.js` | Expects raw token in `Authorization`; no `Bearer ` scheme handling; no expiry (`expiresIn`) on issued tokens (`user.route.js:49`). |
| Q6 | frontend | `deploy_url` duplicated across 5+ files; unused `api_base_url`/`base_url` constants; commented-out dead code in `products.route.js`. |
| Q7 | models | No timestamps, no indexes on `category`/`price` (used for filter/sort), no stock/quantity/discount fields. |
| Q8 | frontend | No loading/empty/error states beyond cart; images have no `alt`; no lazy loading; XSS risk from `innerHTML` with product data. |

---

## 3. What works today (keep intact)
- Register (hashing with bcrypt) — works once pointed at a live backend.
- Login + JWT issuance — works.
- Product listing, plain title search, add-to-cart from the **listing** page, cart view, remove, quantity update — all work against a live backend.
- MongoDB Atlas has 22 seeded products.

## 4. Fix plan (Phase 3+)
1. Centralize the API base URL and point it at the live backend (C1).
2. Wrap `auth` in try/catch, return 401 cleanly, support `Bearer` (C2, Q5).
3. Fix detail-page add-to-cart payload (C4).
4. Enforce cart ownership from the token, not the URL (C5).
5. Reorder product query logic; fix category/sort (F1, F2, F5).
6. Fix login token-storage ordering + remove admin backdoor (F3, F4).
7. Normalize API responses to JSON (F7, F8).
8. Add helmet, rate-limit, validation, sanitization, unique email, indexes (Q1–Q7) — Phases 7–9.
