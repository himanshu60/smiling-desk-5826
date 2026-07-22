# Click & Collect

**Click & Collect** is a full-stack e-commerce web application where users can browse
products, search and filter them, register/login, and manage a shopping cart. It's a
learning project built with a Node.js/Express/MongoDB backend and a Bootstrap 5 frontend.

🔗 **Live demo:** https://clickcollect-shop.onrender.com

> Single-service deployment: the Express server also serves the static frontend, so
> the API and the site share one URL (no CORS needed).

---

## Tech Stack

**Frontend**
- HTML5, CSS3, JavaScript (ES6)
- Bootstrap 5 + Bootstrap Icons
- Custom design system (`styles/theme.css`) + shared components (`scripts/components.js`)

**Backend**
- Node.js, Express.js
- MongoDB + Mongoose
- JWT authentication, bcrypt password hashing
- helmet, express-rate-limit, express-mongo-sanitize, compression, cors, dotenv

---

## Features

- **Auth** — register, login (JWT, 7-day expiry), logout; passwords hashed with bcrypt.
- **Products** — listing, search by title (debounced live search), category filter,
  sort by price, filter by rating / price range / stock, product detail page.
- **Cart** — add/remove items, update quantity, live cart badge; each cart is scoped to
  the logged-in user (no cross-user access).
- **UI/UX** — sticky navbar, carousel hero, modern product cards (discount badge, rating,
  wishlist, stock status), sticky filter sidebar (desktop) / filter drawer (mobile),
  skeleton loading, toasts, empty states, scroll-to-top, fully responsive.
- **Extra pages** — Become a Seller, and a shared info page for More-menu items
  (Notifications, Customer Care, Orders, Wishlist, Gift Cards, Help Center).

---

## API Endpoints

All responses are JSON.

```
POST   /users/register          Register a new user
POST   /users/login             Login, returns { token, name, userid }

GET    /products                All products
GET    /products?category=X     Filter by category
GET    /products?title=X        Search by title (case-insensitive)
GET    /products?sort=asc|dsc   Sort by price (composes with category)
POST   /products/add            Add a product

POST   /cartproducts            Add to cart            (auth required)
GET    /cartproducts/:id        Get the logged-in user's cart (auth; :id ignored, uses token)
POST   /cartproducts/qtn/:id    Update item quantity   (auth required)
DELETE /cartproducts/:id        Remove a cart item     (auth required)
```

Protected routes expect the JWT in the `Authorization` header (raw token or `Bearer <token>`).

---

## Local Setup

### 1. Backend
```bash
cd backend
cp .env.example .env      # then fill in real values
npm install
npm run dev               # nodemon, or `npm start`
```

`.env` variables:
```
PORT=8080
mongoUrl=<your MongoDB Atlas connection string>
key=<your JWT secret>
# optional: CLIENT_ORIGINS=https://your-frontend-url (defaults to * / same-origin)
```

The server serves the frontend from `../frontend`, so once it's running, open
`http://localhost:8080` (or the port you set) to view the full site.

### 2. Frontend only (optional)
Any static server works for the frontend on its own:
```bash
cd frontend
python3 -m http.server 5500
```
`scripts/config.js` auto-detects localhost and points the API at `http://localhost:5001`
(adjust if your backend runs on a different port).

---

## Project Structure

```
backend/
  index.js                 app bootstrap, middleware, static frontend, routes
  config/db.js             Mongoose connection
  middlewares/auth.js      JWT verification
  models/                  user, product, cart.product schemas
  routes/                  user, products, cart routes
frontend/
  index.html               home page
  products.html            product filter page
  become-seller.html       seller landing page
  info.html                shared placeholder page (More menu / footer links)
  cart.html, individual-product-page.html, address.html, payment.html, thankU.html
  styles/theme.css         design system
  scripts/
    config.js              API base URL
    components.js          navbar, footer, auth modal, toasts, product card
    index.js               home page logic
    products.js            filter page logic
```

---

## Deployment (Render — single service)

1. Create a **Web Service** from this repo.
2. **Root Directory:** *(blank)* — **Build:** `cd backend && npm install` — **Start:** `cd backend && npm start`
3. Env vars: `mongoUrl`, `key` (Render injects `PORT`).
4. In MongoDB Atlas → Network Access, allow `0.0.0.0/0`.
5. The single service serves both the API and the frontend at one URL.

---

## Security

- Passwords hashed with bcrypt; JWTs signed with a secret and expiring after 7 days.
- `helmet` security headers, `express-rate-limit` (stricter on auth routes),
  `express-mongo-sanitize` (NoSQL-injection protection), input validation.
- Cart access is scoped to the authenticated user; errors never leak stack traces.

---

_Built as a learning project. Product data is for demonstration only._
