const logo = document.getElementById("logo");
const loginBtn = document.getElementById("login-btn");
const profile_popup = document.getElementById("profile-popup");
const login_popup_closebtn = document.getElementById("login-popup-closebtn");
const login_popup = document.getElementById("login-popup");
const log_link = document.querySelector("#register-form a");
const register_popup = document.getElementById("register-popup");
const reg_link = document.querySelector("#login-form a");
const register_popup_closebtn = document.getElementById(
  "register-popup-closebtn"
);
const si_link = document.querySelector("#profile-popup>p>a");
const register_form = document.getElementById("register-form");
const login_form = document.getElementById("login-form");
const searchInput = document.getElementById("search-inputs");
const searchBtn = document.getElementById("search-btn");
const div = document.querySelector("#products");
const cartBtn = document.getElementById("cart-btn");
const auth_token = localStorage.getItem("token");
const userloggedin = JSON.parse(localStorage.getItem("userloggedin?"));
// deploy_url is provided globally by config.js

console.log(userloggedin);

if (userloggedin) {
  logout();
} else {
  loginBtn.style.visibility = "visible";
}

function logout() {
  let name = localStorage.getItem("name");
  console.log(name);
  loginBtn.innerHTML = name;
  const logoutBtns = document.createElement("a");
  // logoutBtns.innerHTML = `<img src="./images/power-on.png" alt=""> Log Out`;
  logoutBtns.innerHTML = `<img src="./images/power-on.png" alt="">Log Out`;
  // logoutBtns.style.visibility = "visible";
  profile_popup.append(logoutBtns);
  logoutBtns.addEventListener("click", () => {
    loginBtn.innerHTML = "Login";

    localStorage.clear();
    swal("You are now Logged out");
    localStorage.setItem("token", null);
    localStorage.setItem("userloggedin?", false);
    profile_popup.lastElementChild.style.visibility = "hidden";
    loginBtn.style.visibility = "visible";
  });
}

cartBtn.addEventListener("click", () => {
  window.location.href = "cart.html";
});

logo.addEventListener("click", () => {
  window.location.href = "index.html";
});

//--------------
loginBtn.addEventListener("mouseover", () => {
  profile_popup.style.visibility = "visible";
});
loginBtn.addEventListener("mouseout", () => {
  profile_popup.style.visibility = "hidden";
});
profile_popup.addEventListener("mouseover", () => {
  profile_popup.style.visibility = "visible";
});
profile_popup.addEventListener("mouseout", () => {
  profile_popup.style.visibility = "hidden";
});

loginBtn.addEventListener("click", () => {
  login_popup.style.visibility = "visible";
});

login_popup_closebtn.addEventListener("click", () => {
  login_popup.style.visibility = "hidden";
});

log_link.addEventListener("click", (e) => {
  e.preventDefault();
  register_popup.style.visibility = "hidden";
  login_popup.style.visibility = "visible";
});

//----------------------
reg_link.addEventListener("click", (e) => {
  e.preventDefault();
  register_popup.style.visibility = "visible";
  login_popup.style.visibility = "hidden";
});

register_popup_closebtn.addEventListener("click", () => {
  register_popup.style.visibility = "hidden";
});

si_link.addEventListener("click", (e) => {
  e.preventDefault();
  register_popup.style.visibility = "visible";
});

//***************** Register Functionality *******************

register_form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const inputs = document.querySelectorAll("#register-form input");
  const userDetails = [];

  for (let i = 0; i < inputs.length - 1; i++) {
    userDetails.push(inputs[i].value);
  }

  const userObj = {
    name: userDetails[0],
    email: userDetails[1],
    phone: userDetails[2],
    password: userDetails[3],
  };

  try {
    let res = await fetch(`${deploy_url}/users/register`, {
      method: "POST",
      body: JSON.stringify(userObj),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (res.ok) {
      // Auto-close register, switch to the login modal and prefill the email.
      register_form.reset();
      register_popup.style.visibility = "hidden";
      const loginInputs = document.querySelectorAll("#login-form input");
      if (loginInputs[0]) loginInputs[0].value = userObj.email;
      login_popup.style.visibility = "visible";
      swal({
        title: "Account created!",
        text: "Please log in to continue.",
        icon: "success",
        button: "OK",
      });
    } else {
      swal(data.msg || "Registration failed. Please try again.");
    }
  } catch (error) {
    console.log(error);
    swal("Something went wrong. Please try again.");
  }
});

//***************** Login Functionality *******************

login_form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const inputs = document.querySelectorAll("#login-form input");

  try {
    let res = await fetch(`${deploy_url}/users/login`, {
      method: "POST",
      body: JSON.stringify({
        email: inputs[0].value,
        password: inputs[1].value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    if (res.ok) {
      // Only persist the session after a confirmed successful login.
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name);
      localStorage.setItem("id", data.userid);
      localStorage.setItem("userloggedin?", true);
      // Auto-close the login modal.
      login_form.reset();
      login_popup.style.visibility = "hidden";
      swal({
        title: "Login Successful",
        text: "Welcome " + data.name,
        icon: "success",
        button: "OK",
      });
      logout();
    } else {
      swal(data.msg || "Wrong Credentials");
    }
  } catch (error) {
    console.log(error);
    swal("Some error occurred. Please try again.");
  }
});

//------------ Search Functionality -------------//
// Navigate to the products page carrying the search term as a query param.
// products.js reads ?search= and fetches matching products.
function doSearch() {
  const val = (searchInput && searchInput.value ? searchInput.value : "").trim();
  if (!val) return;
  window.location.href = `products.html?search=${encodeURIComponent(val)}`;
}

if (searchBtn) {
  const searchButtonEl = searchBtn.closest("button") || searchBtn;
  searchButtonEl.addEventListener("click", (e) => {
    e.preventDefault();
    doSearch();
  });
}
if (searchInput) {
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      doSearch();
    }
  });
}
