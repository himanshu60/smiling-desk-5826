const api_base_url = "http://localhost:8080";
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
const deploy_url = "https://tough-hen-underclothes.cyclic.app";

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
    if (res.ok) {
      swal({
        title: "Account has been created.",
        text: "You can login now.",
        icon: "success",
        button: "OK",
      });
    } else {
      console.log(res);
      swal("Internal server error");
    }
  } catch (error) {
    console.log(error);
    swal("User Login first");
  }
});

//***************** Login Functionality *******************

login_form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const inputs = document.querySelectorAll("#login-form input");

  if (inputs[0].value == "admin@click.com" && inputs[1].value == "admin") {
    // const path = window.location.origin;
    window.location.href = `Admin-Page/dashboard.html`;
  }

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
    localStorage.setItem("token", data.token);
    localStorage.setItem("name", data.name);
    localStorage.setItem("id", data.userid);
    localStorage.setItem("userloggedin?", true);
    console.log(data);
    if (res.ok) {
      swal({
        title: "Login Successful",
        text: "Welcome",
        icon: "success",
        button: "OK",
      });
      logout();
    } else {
      console.log(res);
      if (res.status == 404) {
        swal("User Login First");
      } else {
        swal("Wrong Credentials");
      }
    }
  } catch (error) {
    console.log(error);
    swal("Some error occurred");
  }
});

//------------ Search Functionality -------------//
searchBtn.addEventListener("click", async (e) => {
  const val = searchInput.value;
  if (val) {
    window.location.href = await "products.html";
  }

  // searchInput.value = val;

  try {
    const res = await fetch(`${deploy_url}/products/?title=${val}`);
    const data = await res.json();
    console.log(data);
    displayProducts(data);
  } catch (error) {}
});
