// Home page visuals are generated locally as inline SVG data-URIs — no
// third-party/brand images, so nothing is hotlinked or impersonated.

const PALETTE = [
  ["#2874f0", "#1a4fd0"],
  ["#fb641b", "#e2540f"],
  ["#388e3c", "#2e7d32"],
  ["#8e24aa", "#6a1b9a"],
  ["#00838f", "#006064"],
  ["#f9a825", "#f57f17"],
];

// Build a gradient SVG placeholder with a centered label, returned as a data URI.
function placeholder(w, h, label, colors) {
  const [c1, c2] = colors;
  const fontSize = Math.max(16, Math.round(Math.min(w, h) / 9));
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>` +
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
    `<stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/>` +
    `</linearGradient></defs>` +
    `<rect width='100%' height='100%' fill='url(#g)'/>` +
    `<text x='50%' y='50%' fill='#ffffff' font-family='Verdana,Arial,sans-serif' ` +
    `font-size='${fontSize}' font-weight='700' text-anchor='middle' dominant-baseline='middle'>` +
    `${label}</text></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

// ---- Rotating hero banner ----
const bannerLabels = [
  "Click & Collect — Big Savings Days",
  "Top Deals on Mobiles & Laptops",
  "Fresh Grocery, Delivered",
  "New Season, New Styles",
  "Members Save More",
];
const banner_imgs = bannerLabels.map((label, i) =>
  placeholder(1688, 280, label, PALETTE[i % PALETTE.length])
);

// ---- Fill promo/offer placeholders ----
document.querySelectorAll("img.cc-ph").forEach((img, i) => {
  const label = img.getAttribute("data-label") || "Offer";
  const w = 800;
  const h = 800;
  img.src = placeholder(w, h, label, PALETTE[i % PALETTE.length]);
});

// ---- Category tiles navigate to the products page (with a filter when known) ----
const categories = document.querySelectorAll("#category p");
categories.forEach((el) => {
  el.addEventListener("click", () => {
    const cat = el.getAttribute("data-cat");
    window.location.href = cat
      ? `products.html?category=${encodeURIComponent(cat)}`
      : "products.html";
  });
});

// ---- Animate the hero banner ----
let i = 0;
const bannerEl = document.querySelector("#banner-img");
if (bannerEl) {
  bannerEl.src = banner_imgs[0];
  setInterval(() => {
    i = i === banner_imgs.length - 1 ? 0 : i + 1;
    bannerEl.src = banner_imgs[i];
  }, 3000);
}
