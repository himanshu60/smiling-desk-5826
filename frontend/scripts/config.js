// Single source of truth for the API base URL.
// Auto-detects local development vs. production so the same code works in both.
// At deploy time (Phase 15), set PROD_API_URL to the live backend URL.
(function () {
  var host = window.location.hostname;
  var isLocal =
    host === "localhost" || host === "127.0.0.1" || host === "" /* file:// */;

  // Single-service deploy: the API is served from the SAME origin as the page,
  // so in production we just use the current origin. This means renaming the
  // service or moving to any new domain needs NO code change.
  window.API_BASE_URL = isLocal
    ? "http://localhost:5001"
    : window.location.origin;

  // Backwards-compatible aliases used by the existing page scripts.
  window.deploy_url = window.API_BASE_URL;

  // Inject the global enhancement layer (styles + animations) on every page
  // that loads config.js — no need to edit each page's <head>.
  function inject() {
    if (!document.querySelector('link[data-cc="enhance"]')) {
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "./styles/enhance.css";
      link.setAttribute("data-cc", "enhance");
      (document.head || document.documentElement).appendChild(link);
    }
    if (!document.querySelector('script[data-cc="enhance"]')) {
      var s = document.createElement("script");
      s.src = "./scripts/enhance.js";
      s.defer = true;
      s.setAttribute("data-cc", "enhance");
      (document.head || document.documentElement).appendChild(s);
    }
  }
  inject();
})();
