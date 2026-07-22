/* Home page — load products and render the "Trending" and "Top Picks" rows
   using the shared card component. No third-party/brand assets. */
(function () {
  var featured = document.getElementById("cc-featured");
  var picks = document.getElementById("cc-picks");

  // show skeletons while loading
  featured.appendChild(window.CC.skeletons(4));
  picks.appendChild(window.CC.skeletons(4));

  fetch(window.deploy_url + "/products")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (!Array.isArray(data)) data = [];
      // Trending = highest rated; Picks = a different slice
      var byRating = data.slice().sort(function (a, b) { return b.rating - a.rating; });
      render(featured, byRating.slice(0, 8));
      render(picks, data.slice(8, 16).length ? data.slice(8, 16) : data.slice(0, 8));
    })
    .catch(function () {
      featured.innerHTML = picks.innerHTML =
        '<div class="cc-empty"><i class="bi bi-wifi-off"></i><p class="mt-2">Could not load products. Please retry.</p></div>';
    });

  function render(container, list) {
    container.innerHTML = "";
    if (!list.length) {
      container.innerHTML = '<div class="cc-empty"><i class="bi bi-box"></i><p class="mt-2">No products yet.</p></div>';
      return;
    }
    list.forEach(function (p) { container.appendChild(window.CC.productCard(p)); });
  }
})();
