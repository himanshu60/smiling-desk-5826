/* Product filter page — fetch + filter + render using the shared card. */
(function () {
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var API = window.deploy_url;
    var grid = document.getElementById("cc-products");
    var title = document.getElementById("cc-results-title");
    var count = document.getElementById("cc-results-count");

    var elCategory = document.getElementById("f-category");
    var elSort = document.getElementById("f-sort");
    var elRating = document.getElementById("f-rating");
    var elPrice = document.getElementById("f-price");
    var elPriceVal = document.getElementById("f-price-val");
    var elInstock = document.getElementById("f-instock");
    var elReset = document.getElementById("f-reset");
    var searchInput = document.getElementById("cc-search-input");

    var params = new URLSearchParams(location.search);
    var searchTerm = params.get("search") || "";
    var initialCategory = params.get("category") || "";
    if (initialCategory) elCategory.value = initialCategory;

    var searchTimer;

    function buildUrl() {
      var qs = [];
      if (elCategory.value) qs.push("category=" + encodeURIComponent(elCategory.value));
      if (elSort.value) qs.push("sort=" + encodeURIComponent(elSort.value));
      if (searchTerm) qs.push("title=" + encodeURIComponent(searchTerm));
      return API + "/products" + (qs.length ? "?" + qs.join("&") : "");
    }

    function clientFilter(list) {
      var minRating = elRating.value ? Number(elRating.value) : 0;
      var exactFive = elRating.value === "5";
      var maxPrice = Number(elPrice.value);
      var inStockOnly = elInstock.checked;
      return list.filter(function (p) {
        if (exactFive) { if (p.rating !== 5) return false; }
        else if (p.rating < minRating) return false;
        if (p.price > maxPrice) return false;
        if (inStockOnly && p.stock === 0) return false;
        return true;
      });
    }

    function setHeader(n) {
      title.textContent = searchTerm
        ? 'Results for "' + searchTerm + '"'
        : elCategory.options[elCategory.selectedIndex].text.replace("All categories", "All Products");
      count.textContent = n + " product" + (n === 1 ? "" : "s") + " found";
    }

    async function load() {
      grid.innerHTML = "";
      grid.appendChild(window.CC.skeletons(8));
      try {
        var res = await fetch(buildUrl());
        var data = await res.json();
        if (!Array.isArray(data)) data = [];
        var filtered = clientFilter(data);
        render(filtered);
        setHeader(filtered.length);
      } catch (e) {
        grid.innerHTML =
          '<div class="col-12"><div class="cc-empty"><i class="bi bi-wifi-off"></i>' +
          '<p class="mt-2">Could not load products. Please retry.</p></div></div>';
        count.textContent = "";
      }
    }

    function render(list) {
      grid.innerHTML = "";
      if (!list.length) {
        grid.innerHTML =
          '<div class="col-12"><div class="cc-empty"><i class="bi bi-search"></i>' +
          '<p class="mt-2">No products match your filters.</p>' +
          '<button class="btn btn-outline-primary btn-sm" id="cc-clear">Clear filters</button></div></div>';
        var c = document.getElementById("cc-clear");
        if (c) c.addEventListener("click", resetAll);
        return;
      }
      list.forEach(function (p) { grid.appendChild(window.CC.productCard(p)); });
    }

    function resetAll() {
      elCategory.value = "";
      elSort.value = "";
      elRating.value = "";
      elPrice.value = elPrice.max;
      elPriceVal.textContent = "₹" + Number(elPrice.max).toLocaleString("en-IN");
      elInstock.checked = false;
      searchTerm = "";
      if (searchInput) searchInput.value = "";
      load();
    }

    // events
    [elCategory, elSort, elRating, elInstock].forEach(function (c) {
      c.addEventListener("change", load);
    });
    elPrice.addEventListener("input", function () {
      elPriceVal.textContent = "₹" + Number(elPrice.value).toLocaleString("en-IN");
    });
    elPrice.addEventListener("change", load);
    elReset.addEventListener("click", resetAll);

    // debounced live search on the shared navbar search box
    if (searchInput) {
      if (searchTerm) searchInput.value = searchTerm;
      searchInput.addEventListener("input", function () {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function () {
          searchTerm = searchInput.value.trim();
          load();
        }, 400);
      });
    }

    load();
  });
})();
