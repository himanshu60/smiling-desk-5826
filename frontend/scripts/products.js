const api_base_url = "http://localhost:8080";
const div = document.querySelector("#products");
const filterByCategory = document.getElementById("filter-by-category");
const sortByPrice = document.getElementById("sort-by-price");
const sortByRatings = document.getElementById("sort-by-ratings");
const token = localStorage.getItem("token");
const deploy_url = "https://tough-hen-underclothes.cyclic.app";

getProducts();

async function getProducts() {
  try {
    const res = await fetch(`${deploy_url}/products`);
    const data = await res.json();
    displayProducts(data);
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

function displayProducts(data) {
  div.innerHTML = null;

  data.forEach((el) => {
    const div1 = document.createElement("div");

    const div2 = document.createElement("div");

    div2.addEventListener("click", () => {
      localStorage.setItem("abc", JSON.stringify(el));
      window.location.href = "individual-product-page.html";
    });

    const image = document.createElement("img");
    image.setAttribute("src", el.image);

    const name = document.createElement("h2");
    name.innerText = el.name;

    const details = document.createElement("p");
    details.innerText = el.description;

    const div3 = document.createElement("div");

    div3.addEventListener("click", () => {
      localStorage.setItem("abc", JSON.stringify(el));
      window.location.href = "individual-product-page.html";
    });

    const price = document.createElement("h3");
    price.innerText = "₹" + el.price;

    const span = document.createElement("span");
    span.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="15" viewBox="0 0 24 24" width="15"><path d="M0 0h24v24H0z" fill="none"/><path d="M0 0h24v24H0z" fill="none"/><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
    ${el.rating}`;

    const div4 = document.createElement("div");

    const cartBtn = document.createElement("button");
    cartBtn.innerText = "Add to Cart";
    cartBtn.addEventListener("click", () => {
      if (token) {
        let obj = {
          image: el.image,
          name: el.name,
          description: el.description,
          price: el.price,
          category: el.category,
          userid: localStorage.getItem("id"),
          quantity: 1,
        };
        console.log(obj);
        addToCartfun(obj);
      } else {
        swal("Please Login in first");
      }
    });

    div2.append(image);
    div3.append(name, span, details);
    div4.append(price, cartBtn);
    div1.append(div2, div3, div4);
    div.append(div1);
  });
}

// Add to Cart

async function addToCartfun(prod) {
  try {
    let res = await fetch(`${deploy_url}/cartproducts`, {
      method: "POST",
      body: JSON.stringify(prod),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    if (res.ok) {
      swal({
        title: "Product has been Added.",
        text: "",
        icon: "success",
        button: "OK",
      });
    } else {
      console.log(res);
      swal(res.json());
    }
  } catch (error) {
    console.log(error);
    swal("Login First");
  }
}

filterByCategory.addEventListener("change", async () => {
  if (sortByPrice.value == "" && filterByCategory.value == "") {
    const res = await fetch(`${deploy_url}/products`);
    const data = await res.json();
    displayProducts(data);
  } else if (sortByPrice.value == "htl" && filterByCategory.value != "") {
    const res = await fetch(
      `${deploy_url}/products/?sort=dsc&category=${filterByCategory.value}`
    );
    const data = await res.json();
    displayProducts(data);
  } else if (sortByPrice.value == "lth" && filterByCategory.value != "") {
    const res = await fetch(
      `${deploy_url}/products/?sort=asc&category=${filterByCategory.value}`
    );
    const data = await res.json();
    displayProducts(data);
  } else if (filterByCategory != "") {
    const res = await fetch(
      `${deploy_url}/products/?category=${filterByCategory.value}`
    );
    const data = await res.json();
    displayProducts(data);
  }
});

sortByPrice.addEventListener("change", async () => {
  if (sortByPrice.value == "" && filterByCategory.value == "") {
    const res = await fetch(`${deploy_url}/products`);
    const data = await res.json();
    displayProducts(data);
  } else if (sortByPrice.value == "htl" && filterByCategory.value != "") {
    const res = await fetch(
      `${deploy_url}/products/?sort=dsc&category=${filterByCategory.value}`
    );
    const data = await res.json();
    displayProducts(data);
  } else if (sortByPrice.value == "lth" && filterByCategory.value != "") {
    const res = await fetch(
      `${deploy_url}/products/?sort=asc&category=${filterByCategory.value}`
    );
    const data = await res.json();
    displayProducts(data);
  } else if (sortByPrice.value == "") {
    const res = await fetch(`${deploy_url}/products`);
    const data = await res.json();
    displayProducts(data);
  } else if (sortByPrice.value == "htl") {
    const res = await fetch(`${deploy_url}/products/?sort=dsc`);
    const data = await res.json();
    displayProducts(data);
  } else if (sortByPrice.value == "lth") {
    const res = await fetch(`${deploy_url}/products/?sort=asc`);
    const data = await res.json();
    displayProducts(data);
  }
});

sortByRatings.addEventListener("change", async () => {
  const rati = sortByRatings.value;
  if (rati != "") {
    try {
      const res = await fetch(`${deploy_url}/products`);
      const data = await res.json();
      if (rati == "4a") {
        const data1 = data.filter((el) => {
          return el.rating >= 4;
        });
        console.log(data1);
        displayProducts(data1);
      } else if (rati == "5") {
        const data1 = data.filter((el) => {
          return el.rating == 5;
        });
        console.log(data1);
        displayProducts(data1);
      } else {
        const data1 = data.filter((el) => {
          return el.rating >= 3;
        });
        console.log(data1);
        displayProducts(data1);
      }
    } catch (error) {
      console.log(error);
    }
  }
});
