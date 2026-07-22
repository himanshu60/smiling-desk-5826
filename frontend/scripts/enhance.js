/* =====================================================================
   enhance.js — progressive UX enhancements for Click & Collect.
   Pure add-on: attaches after the page's own scripts, changes no data flow.
   ===================================================================== */
(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onReady(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  /* ---- Scroll-to-top button ---- */
  function mountScrollTop() {
    var btn = document.createElement("button");
    btn.id = "cc-scroll-top";
    btn.setAttribute("aria-label", "Scroll to top");
    btn.innerHTML = "&#8679;";
    document.body.appendChild(btn);

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });

    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 320) btn.classList.add("cc-show");
        else btn.classList.remove("cc-show");
      },
      { passive: true }
    );
  }

  /* ---- Image fade-in on load ---- */
  function fadeImages(root) {
    var imgs = (root || document).querySelectorAll("img:not([data-cc-fade])");
    imgs.forEach(function (img) {
      img.setAttribute("data-cc-fade", "");
      if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
      if (img.complete && img.naturalWidth) {
        img.classList.add("cc-loaded");
      } else {
        img.addEventListener("load", function () { img.classList.add("cc-loaded"); });
        img.addEventListener("error", function () { img.classList.add("cc-loaded"); });
      }
    });
  }

  /* ---- Button ripple ---- */
  function attachRipple() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn || reduceMotion) return;
      var rect = btn.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);
      var span = document.createElement("span");
      span.className = "cc-ripple";
      span.style.width = span.style.height = size + "px";
      span.style.left = e.clientX - rect.left - size / 2 + "px";
      span.style.top = e.clientY - rect.top - size / 2 + "px";
      var pos = getComputedStyle(btn).position;
      if (pos === "static") btn.style.position = "relative";
      btn.style.overflow = "hidden";
      btn.appendChild(span);
      setTimeout(function () { span.remove(); }, 600);
    });
  }

  /* ---- Reveal-on-scroll for tagged sections ---- */
  function revealOnScroll() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("cc-in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".cc-reveal").forEach(function (el) { io.observe(el); });
  }

  /* ---- Keep fading images that the page renders dynamically ---- */
  function watchDynamicImages() {
    if (!("MutationObserver" in window)) return;
    var mo = new MutationObserver(function (mutations) {
      var needs = false;
      mutations.forEach(function (m) { if (m.addedNodes.length) needs = true; });
      if (needs) fadeImages(document);
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  /* ---- Back button (every page except the home page) ---- */
  function mountBackButton() {
    var path = window.location.pathname;
    var isHome = path === "/" || /(^|\/)index\.html$/.test(path);
    if (isHome) return;
    var btn = document.createElement("button");
    btn.id = "cc-back";
    btn.setAttribute("aria-label", "Go back");
    btn.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg> Back';
    btn.addEventListener("click", function () {
      if (window.history.length > 1) window.history.back();
      else window.location.href = "index.html";
    });
    document.body.appendChild(btn);
  }

  /* ---- Modal backdrop + close on outside-click / Escape ---- */
  function mountModalBackdrop() {
    var popups = [
      document.getElementById("login-popup"),
      document.getElementById("register-popup"),
    ].filter(Boolean);
    if (!popups.length) return;

    var backdrop = document.createElement("div");
    backdrop.id = "cc-backdrop";
    document.body.appendChild(backdrop);

    function anyVisible() {
      return popups.some(function (p) {
        return getComputedStyle(p).visibility !== "hidden";
      });
    }
    function sync() {
      backdrop.classList.toggle("cc-show", anyVisible());
    }
    function hideAll() {
      popups.forEach(function (p) { p.style.visibility = "hidden"; });
      sync();
    }

    var mo = new MutationObserver(sync);
    popups.forEach(function (p) {
      mo.observe(p, { attributes: true, attributeFilter: ["style"] });
    });
    backdrop.addEventListener("click", hideAll);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") hideAll();
    });
    sync();
  }

  onReady(function () {
    mountScrollTop();
    fadeImages(document);
    attachRipple();
    revealOnScroll();
    watchDynamicImages();
    mountBackButton();
    mountModalBackdrop();
  });
})();
