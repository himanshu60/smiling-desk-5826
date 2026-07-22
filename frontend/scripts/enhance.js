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

  onReady(function () {
    mountScrollTop();
    fadeImages(document);
    attachRipple();
    revealOnScroll();
    watchDynamicImages();
  });
})();
