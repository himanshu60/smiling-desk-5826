const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const path = require("path");

const { userRouter } = require("./routes/user.route");
const { connection } = require("./config/db");
const { productRouter } = require("./routes/products.route");
const { auth } = require("./middlewares/auth");
const { cartProductsRouter } = require("./routes/cart.products.route");

// ---------- Security & core middlewares ----------
// CSP is disabled because this server also serves the static frontend, which
// loads third-party CDNs (SweetAlert, Bootstrap, jQuery) and remote images.
// All other helmet protections stay on.
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression()); // gzip responses to cut payload size

// Restrict CORS to configured origins if provided, otherwise allow all
// (handy for local dev / static hosts). Set CLIENT_ORIGINS in .env for prod.
const allowedOrigins = (process.env.CLIENT_ORIGINS || "*")
  .split(",")
  .map((o) => o.trim());
app.use(
  cors({
    origin: allowedOrigins.includes("*") ? "*" : allowedOrigins,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(mongoSanitize()); // strip $ / . keys to block NoSQL injection

// Global rate limit
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { msg: "Too many requests, please try again later." },
});
app.use(generalLimiter);

// Stricter limit on auth endpoints to slow brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { msg: "Too many attempts. Please wait and try again." },
});

// ---------- Routes ----------
app.use("/users", authLimiter, userRouter);
app.use("/products", productRouter);
app.use("/cartproducts", auth, cartProductsRouter);

// ---------- Serve the static frontend from the same origin ----------
// API routes above are matched first; everything else falls through to the
// frontend files (index.html at "/", plus css/js/images).
const frontendDir = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendDir));

// JSON 404 for unknown API paths (won't affect real frontend files above)
app.use((req, res) => {
  res.status(404).json({ msg: "Invalid end point" });
});

// Centralized error handler — never leak stack traces to clients
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ msg: "Something went wrong" });
});

// ---------- Bootstrap ----------
const PORT = process.env.PORT || process.env.port || 8080;

app.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  try {
    await connection;
    console.log("Connected to Database Atlas");
  } catch (error) {
    console.log("Error while connecting to Database");
    console.log(error);
  }
});
