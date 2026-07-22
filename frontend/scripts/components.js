/* =====================================================================
   components.js — shared navbar, footer, auth modal, toasts + wiring.
   Depends on: config.js (window.deploy_url) and Bootstrap 5 JS (bundle).
   Exposes a small API on window.CC used by page scripts.
   ===================================================================== */
(function () {
  "use strict";
  var API = window.deploy_url || "";

  // ---------- tiny helpers ----------
  function token() { return localStorage.getItem("token"); }
  function isLoggedIn() {
    return !!token() && token() !== "null" && localStorage.getItem("userloggedin?") === "true";
  }
  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  // ---------- toast ----------
  function toast(msg, type) {
    var wrap = document.getElementById("cc-toast-wrap");
    if (!wrap) {
      wrap = el('<div class="cc-toast-wrap" id="cc-toast-wrap"></div>');
      document.body.appendChild(wrap);
    }
    var ok = type !== "error";
    var t = el(
      '<div class="cc-toast ' + (ok ? "ok" : "err") + '">' +
      '<i class="bi ' + (ok ? "bi-check-circle-fill" : "bi-exclamation-circle-fill") + '"></i>' +
      '<span></span></div>'
    );
    t.querySelector("span").textContent = msg;
    wrap.appendChild(t);
    setTimeout(function () {
      t.style.transition = "opacity .3s, transform .3s";
      t.style.opacity = "0";
      t.style.transform = "translateX(20px)";
      setTimeout(function () { t.remove(); }, 300);
    }, 2600);
  }

  // ---------- navbar ----------
  var MORE_ITEMS = [
    ["notifications", "bi-bell", "Notifications"],
    ["customer-care", "bi-headset", "Customer Care"],
    ["orders", "bi-box-seam", "Orders"],
    ["wishlist", "bi-heart", "Wishlist"],
    ["gift-cards", "bi-gift", "Gift Cards"],
    ["help", "bi-question-circle", "Help Center"],
  ];

  function navbarHTML() {
    var more = MORE_ITEMS.map(function (m) {
      return '<li><a class="dropdown-item" href="info.html?type=' + m[0] + '"><i class="bi ' + m[1] + '"></i> ' + m[2] + "</a></li>";
    }).join("");
    return (
      '<nav class="navbar navbar-expand-lg cc-navbar sticky-top py-2">' +
      '<div class="container-fluid px-3 px-lg-4">' +
      '<a class="cc-brand" href="index.html"><i class="bi bi-bag-check-fill"></i>' +
      '<span>Click &amp; Collect<small>Explore Plus</small></span></a>' +
      '<button class="navbar-toggler text-white border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#ccNav" aria-label="Menu"><span class="navbar-toggler-icon"></span></button>' +
      '<div class="collapse navbar-collapse" id="ccNav">' +
      '<div class="cc-search mx-lg-3 my-2 my-lg-0">' +
      '<input id="cc-search-input" type="text" placeholder="Search for products, brands and more" aria-label="Search">' +
      '<button class="cc-search-btn" id="cc-search-btn" aria-label="Search"><i class="bi bi-search"></i></button>' +
      "</div>" +
      '<ul class="navbar-nav ms-auto align-items-lg-center gap-1">' +
      '<li class="nav-item dropdown">' +
      '<a class="cc-nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" role="button"><i class="bi bi-person-circle fs-5"></i> <span id="cc-user-name">Login</span></a>' +
      '<ul class="dropdown-menu dropdown-menu-end" id="cc-user-menu"></ul>' +
      "</li>" +
      '<li class="nav-item"><a class="cc-nav-link" href="become-seller.html"><i class="bi bi-shop"></i> Become a Seller</a></li>' +
      '<li class="nav-item dropdown">' +
      '<a class="cc-nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" role="button"><i class="bi bi-grid"></i> More</a>' +
      '<ul class="dropdown-menu dropdown-menu-end">' + more + "</ul>" +
      "</li>" +
      '<li class="nav-item"><a class="cc-nav-link position-relative" href="cart.html"><i class="bi bi-cart3 fs-5"></i> Cart' +
      '<span class="cc-cart-badge" id="cc-cart-badge" style="display:none">0</span></a></li>' +
      "</ul></div></div></nav>"
    );
  }

  function footerHTML() {
    return (
      '<footer class="cc-footer pt-5 pb-3">' +
      '<div class="container">' +
      '<div class="row g-4">' +
      '<div class="col-lg-4 col-md-6">' +
      '<div class="cc-brand mb-2" style="color:#fff"><i class="bi bi-bag-check-fill"></i> Click &amp; Collect</div>' +
      '<p class="small">Your one-stop shop for mobiles, electronics, fashion and more — great prices, fast delivery.</p>' +
      '<div class="cc-social mt-3">' +
      '<a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>' +
      '<a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>' +
      '<a href="#" aria-label="Twitter"><i class="bi bi-twitter-x"></i></a>' +
      '<a href="#" aria-label="YouTube"><i class="bi bi-youtube"></i></a>' +
      "</div></div>" +
      '<div class="col-lg-2 col-6"><h6>Company</h6><a href="info.html?type=about">About Us</a><a href="become-seller.html">Become a Seller</a><a href="info.html?type=careers">Careers</a><a href="info.html?type=press">Press</a></div>' +
      '<div class="col-lg-2 col-6"><h6>Help</h6><a href="info.html?type=help">Help Center</a><a href="info.html?type=customer-care">Customer Care</a><a href="info.html?type=shipping">Shipping</a><a href="info.html?type=returns">Returns</a></div>' +
      '<div class="col-lg-4 col-md-12"><h6>Stay in the loop</h6>' +
      '<p class="small">Subscribe for offers and new arrivals.</p>' +
      '<form class="cc-newsletter d-flex" id="cc-news">' +
      '<input type="email" class="form-control" placeholder="Enter your email" required>' +
      '<button class="btn" type="submit">Subscribe</button></form></div>' +
      "</div>" +
      '<div class="cc-footer-bottom mt-4 pt-3 text-center">© 2026 Click &amp; Collect. Built as a learning project. All product names are for demo purposes.</div>' +
      "</div></footer>"
    );
  }

  function authModalHTML() {
    return (
      '<div class="modal fade" id="cc-auth" tabindex="-1" aria-hidden="true"><div class="modal-dialog modal-lg modal-dialog-centered">' +
      '<div class="modal-content"><div class="row g-0">' +
      '<div class="col-md-5 cc-auth-side d-none d-md-flex flex-column justify-content-center">' +
      '<h4 id="cc-auth-side-title">Login</h4><p id="cc-auth-side-text" class="mb-0 opacity-75">Get access to your orders, wishlist and recommendations.</p></div>' +
      '<div class="col-md-7 p-4 position-relative">' +
      '<button type="button" class="btn-close position-absolute end-0 top-0 m-3" data-bs-dismiss="modal" aria-label="Close"></button>' +
      // login pane
      '<div id="cc-login-pane"><h5 class="fw-bold mb-3">Login</h5><form id="cc-login-form">' +
      '<div class="mb-3"><label class="form-label small fw-semibold">Email</label><input type="email" class="form-control" id="cc-login-email" required></div>' +
      '<div class="mb-3"><label class="form-label small fw-semibold">Password</label>' +
      '<div class="input-group"><input type="password" class="form-control" id="cc-login-pass" required>' +
      '<button class="btn btn-outline-secondary" type="button" data-toggle-pass="cc-login-pass"><i class="bi bi-eye"></i></button></div></div>' +
      '<button class="cc-btn-cart w-100" type="submit" id="cc-login-submit">Login</button>' +
      '<p class="small mt-3 mb-0 text-center">New here? <a href="#" id="cc-to-register" class="fw-semibold">Create an account</a></p>' +
      "</form></div>" +
      // register pane
      '<div id="cc-register-pane" style="display:none"><h5 class="fw-bold mb-3">Create account</h5><form id="cc-register-form">' +
      '<div class="mb-2"><label class="form-label small fw-semibold">Name</label><input type="text" class="form-control" id="cc-reg-name" required></div>' +
      '<div class="mb-2"><label class="form-label small fw-semibold">Email</label><input type="email" class="form-control" id="cc-reg-email" required></div>' +
      '<div class="mb-2"><label class="form-label small fw-semibold">Phone</label><input type="tel" class="form-control" id="cc-reg-phone" required></div>' +
      '<div class="mb-3"><label class="form-label small fw-semibold">Password</label>' +
      '<div class="input-group"><input type="password" class="form-control" id="cc-reg-pass" required>' +
      '<button class="btn btn-outline-secondary" type="button" data-toggle-pass="cc-reg-pass"><i class="bi bi-eye"></i></button></div></div>' +
      '<button class="cc-btn-cart w-100" type="submit" id="cc-reg-submit">Sign Up</button>' +
      '<p class="small mt-3 mb-0 text-center">Already have an account? <a href="#" id="cc-to-login" class="fw-semibold">Login</a></p>' +
      "</form></div>" +
      "</div></div></div></div></div>"
    );
  }

  // ---------- auth modal control ----------
  var authModal;
  function showPane(which) {
    var login = document.getElementById("cc-login-pane");
    var reg = document.getElementById("cc-register-pane");
    var title = document.getElementById("cc-auth-side-title");
    var text = document.getElementById("cc-auth-side-text");
    if (which === "register") {
      login.style.display = "none"; reg.style.display = "block";
      title.textContent = "Looks like you're new!";
      text.textContent = "Sign up with your details to get started.";
    } else {
      reg.style.display = "none"; login.style.display = "block";
      title.textContent = "Login";
      text.textContent = "Get access to your orders, wishlist and recommendations.";
    }
  }
  function openAuth(which) {
    showPane(which || "login");
    authModal.show();
  }

  // ---------- user dropdown ----------
  function renderUserMenu() {
    var nameEl = document.getElementById("cc-user-name");
    var menu = document.getElementById("cc-user-menu");
    if (!menu) return;
    if (isLoggedIn()) {
      var name = localStorage.getItem("name") || "Account";
      nameEl.textContent = name.split(" ")[0];
      menu.innerHTML =
        '<li class="dropdown-item-text fw-bold">Hi, ' + name + "</li><li><hr class='dropdown-divider'></li>" +
        '<li><a class="dropdown-item" href="info.html?type=orders"><i class="bi bi-box-seam"></i> Orders</a></li>' +
        '<li><a class="dropdown-item" href="info.html?type=wishlist"><i class="bi bi-heart"></i> Wishlist</a></li>' +
        '<li><a class="dropdown-item" href="cart.html"><i class="bi bi-cart3"></i> Cart</a></li>' +
        '<li><hr class="dropdown-divider"></li>' +
        '<li><a class="dropdown-item text-danger" href="#" id="cc-logout"><i class="bi bi-box-arrow-right text-danger"></i> Logout</a></li>';
      menu.querySelector("#cc-logout").addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.clear();
        localStorage.setItem("userloggedin?", "false");
        toast("You have been logged out");
        renderUserMenu();
        refreshCartBadge();
      });
    } else {
      nameEl.textContent = "Login";
      menu.innerHTML =
        '<li><a class="dropdown-item" href="#" id="cc-menu-login"><i class="bi bi-box-arrow-in-right"></i> Login</a></li>' +
        '<li><a class="dropdown-item" href="#" id="cc-menu-register"><i class="bi bi-person-plus"></i> Sign Up</a></li>';
      menu.querySelector("#cc-menu-login").addEventListener("click", function (e) { e.preventDefault(); openAuth("login"); });
      menu.querySelector("#cc-menu-register").addEventListener("click", function (e) { e.preventDefault(); openAuth("register"); });
    }
  }

  // ---------- cart badge ----------
  async function refreshCartBadge() {
    var badge = document.getElementById("cc-cart-badge");
    if (!badge) return;
    if (!isLoggedIn()) { badge.style.display = "none"; return; }
    try {
      var res = await fetch(API + "/cartproducts/me", { headers: { Authorization: token() } });
      if (!res.ok) { badge.style.display = "none"; return; }
      var data = await res.json();
      var count = Array.isArray(data) ? data.length : 0;
      if (count > 0) { badge.textContent = count; badge.style.display = "inline-flex"; }
      else badge.style.display = "none";
    } catch (e) { badge.style.display = "none"; }
  }

  // ---------- add to cart (shared) ----------
  async function addToCart(product) {
    if (!isLoggedIn()) { toast("Please login to add items", "error"); openAuth("login"); return false; }
    try {
      var res = await fetch(API + "/cartproducts", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token() },
        body: JSON.stringify({
          name: product.name, price: product.price, category: product.category,
          image: product.image, description: product.description, quantity: 1,
        }),
      });
      var data = await res.json();
      if (res.ok) { toast(product.name + " added to cart"); refreshCartBadge(); return true; }
      toast(data.msg || "Could not add to cart", "error");
      return false;
    } catch (e) { toast("Network error. Try again.", "error"); return false; }
  }

  // ---------- product card (shared by home + products pages) ----------
  function money(n) { return "₹" + Number(n).toLocaleString("en-IN"); }

  function productCard(p) {
    var discount = p.discount || 0;
    var oldPrice = discount ? Math.round(p.price / (1 - discount / 100)) : 0;
    var outOfStock = p.stock === 0;
    var col = el('<div class="col-6 col-md-4 col-xl-3 cc-fade-up"></div>');
    col.innerHTML =
      '<div class="cc-card">' +
      '<div class="cc-card-imgwrap">' +
      (discount ? '<span class="cc-badge-discount">' + discount + "% OFF</span>" : "") +
      '<button class="cc-wish" aria-label="Add to wishlist"><i class="bi bi-heart"></i></button>' +
      '<img loading="lazy" alt="" />' +
      "</div>" +
      '<div class="cc-card-body">' +
      '<h3 class="cc-card-title"></h3>' +
      '<span class="cc-rating"><i class="bi bi-star-fill" style="font-size:.7rem"></i> <span class="cc-rating-val"></span></span>' +
      '<p class="cc-card-desc"></p>' +
      '<div class="cc-price-row"><span class="cc-price"></span>' +
      (discount ? '<span class="cc-price-old">' + money(oldPrice) + "</span><span class='cc-price-off'>" + discount + "% off</span>" : "") +
      "</div>" +
      '<div class="cc-delivery"><i class="bi bi-truck"></i> Free delivery &nbsp;·&nbsp; <span class="' +
      (outOfStock ? "cc-stock-out" : "cc-stock-in") + '">' + (outOfStock ? "Out of stock" : "In stock") + "</span></div>" +
      '<button class="cc-btn-cart"' + (outOfStock ? " disabled" : "") + "><i class='bi bi-cart-plus'></i> Add to Cart</button>" +
      "</div></div>";

    col.querySelector("img").src = p.image;
    col.querySelector("img").alt = p.name;
    col.querySelector(".cc-card-title").textContent = p.name;
    col.querySelector(".cc-rating-val").textContent = p.rating;
    col.querySelector(".cc-card-desc").textContent = p.description;
    col.querySelector(".cc-price").textContent = money(p.price);

    // open product detail (reuse existing individual page contract)
    col.querySelector(".cc-card-imgwrap").addEventListener("click", function (e) {
      if (e.target.closest(".cc-wish")) return;
      localStorage.setItem("abc", JSON.stringify(p));
      window.location.href = "individual-product-page.html";
    });
    col.querySelector(".cc-card-title").style.cursor = "pointer";
    col.querySelector(".cc-card-title").addEventListener("click", function () {
      localStorage.setItem("abc", JSON.stringify(p));
      window.location.href = "individual-product-page.html";
    });
    var wish = col.querySelector(".cc-wish");
    wish.addEventListener("click", function () {
      wish.classList.toggle("active");
      wish.querySelector("i").className = wish.classList.contains("active") ? "bi bi-heart-fill" : "bi bi-heart";
      toast(wish.classList.contains("active") ? "Added to wishlist" : "Removed from wishlist");
    });
    var cartBtn = col.querySelector(".cc-btn-cart");
    if (!outOfStock) cartBtn.addEventListener("click", function () { addToCart(p); });
    return col;
  }

  function skeletons(n) {
    var frag = document.createDocumentFragment();
    for (var i = 0; i < n; i++) {
      var col = el('<div class="col-6 col-md-4 col-xl-3"></div>');
      col.innerHTML =
        '<div class="cc-card"><div class="cc-skel" style="height:210px"></div>' +
        '<div class="cc-card-body"><div class="cc-skel mb-2" style="height:16px;width:80%"></div>' +
        '<div class="cc-skel mb-2" style="height:14px;width:40%"></div>' +
        '<div class="cc-skel mb-2" style="height:28px;width:50%"></div>' +
        '<div class="cc-skel" style="height:40px"></div></div></div>';
      frag.appendChild(col);
    }
    return frag;
  }

  // ---------- wiring ----------
  function wireSearch() {
    var input = document.getElementById("cc-search-input");
    var btn = document.getElementById("cc-search-btn");
    function go() {
      var v = (input.value || "").trim();
      if (v) window.location.href = "products.html?search=" + encodeURIComponent(v);
    }
    if (btn) btn.addEventListener("click", go);
    if (input) input.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
    // reflect existing query on the products page
    var q = new URLSearchParams(location.search).get("search");
    if (q && input) input.value = q;
  }

  function wireAuthForms() {
    document.getElementById("cc-to-register").addEventListener("click", function (e) { e.preventDefault(); showPane("register"); });
    document.getElementById("cc-to-login").addEventListener("click", function (e) { e.preventDefault(); showPane("login"); });

    document.querySelectorAll("[data-toggle-pass]").forEach(function (b) {
      b.addEventListener("click", function () {
        var inp = document.getElementById(b.getAttribute("data-toggle-pass"));
        var icon = b.querySelector("i");
        if (inp.type === "password") { inp.type = "text"; icon.className = "bi bi-eye-slash"; }
        else { inp.type = "password"; icon.className = "bi bi-eye"; }
      });
    });

    document.getElementById("cc-login-form").addEventListener("submit", async function (e) {
      e.preventDefault();
      var btn = document.getElementById("cc-login-submit");
      btn.disabled = true; btn.textContent = "Logging in…";
      try {
        var res = await fetch(API + "/users/login", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: document.getElementById("cc-login-email").value,
            password: document.getElementById("cc-login-pass").value,
          }),
        });
        var data = await res.json();
        if (res.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("name", data.name);
          localStorage.setItem("id", data.userid);
          localStorage.setItem("userloggedin?", "true");
          authModal.hide();
          toast("Welcome back, " + data.name.split(" ")[0] + "!");
          renderUserMenu(); refreshCartBadge();
        } else { toast(data.msg || "Wrong credentials", "error"); }
      } catch (err) { toast("Something went wrong", "error"); }
      btn.disabled = false; btn.textContent = "Login";
    });

    document.getElementById("cc-register-form").addEventListener("submit", async function (e) {
      e.preventDefault();
      var btn = document.getElementById("cc-reg-submit");
      btn.disabled = true; btn.textContent = "Creating…";
      var email = document.getElementById("cc-reg-email").value;
      try {
        var res = await fetch(API + "/users/register", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: document.getElementById("cc-reg-name").value,
            email: email,
            phone: document.getElementById("cc-reg-phone").value,
            password: document.getElementById("cc-reg-pass").value,
          }),
        });
        var data = await res.json();
        if (res.ok) {
          document.getElementById("cc-register-form").reset();
          document.getElementById("cc-login-email").value = email;
          showPane("login");
          toast("Account created! Please log in.");
        } else { toast(data.msg || "Registration failed", "error"); }
      } catch (err) { toast("Something went wrong", "error"); }
      btn.disabled = false; btn.textContent = "Sign Up";
    });

    document.getElementById("cc-news").addEventListener("submit", function (e) {
      e.preventDefault(); e.target.reset(); toast("Subscribed! Watch your inbox.");
    });
  }

  function mountScrollTop() {
    var btn = el('<button id="cc-top" aria-label="Scroll to top"><i class="bi bi-arrow-up"></i></button>');
    document.body.appendChild(btn);
    btn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    window.addEventListener("scroll", function () {
      btn.classList.toggle("show", window.scrollY > 320);
    }, { passive: true });
  }

  // ---------- init ----------
  function init() {
    var navMount = document.getElementById("app-nav");
    if (navMount) navMount.innerHTML = navbarHTML();
    var footMount = document.getElementById("app-footer");
    if (footMount) footMount.innerHTML = footerHTML();
    document.body.insertAdjacentHTML("beforeend", authModalHTML());
    authModal = new bootstrap.Modal(document.getElementById("cc-auth"));

    renderUserMenu();
    wireSearch();
    wireAuthForms();
    mountScrollTop();
    refreshCartBadge();
  }

  // expose API for page scripts
  window.CC = {
    api: API, token: token, isLoggedIn: isLoggedIn,
    toast: toast, addToCart: addToCart, openAuth: openAuth,
    refreshCartBadge: refreshCartBadge,
    productCard: productCard, skeletons: skeletons, money: money,
  };

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
