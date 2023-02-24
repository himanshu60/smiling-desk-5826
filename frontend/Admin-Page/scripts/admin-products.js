import { navBar } from "./navbar.js";
const nav = document.getElementById("navbar");
nav.innerHTML = navBar;
const form = document.querySelector("#main>form");
const productsTable = document.querySelector("#products tbody");
const base_url = "http://localhost:8080"

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const inputs = document.querySelectorAll("#main input");
  const userDetails = [];

  for (let i = 0; i < inputs.length - 1; i++) {
    userDetails.push(inputs[i].value);
  }

  const userObj = {
    name: userDetails[0],
    price: +userDetails[1],
    category: userDetails[2],
    image: userDetails[3],
    description: userDetails[4],
    rating: userDetails[5]
  };

 
    try {
      let res = await fetch(`${base_url}/products/add`, {
        method: "POST",
        body: JSON.stringify(userObj),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        swal({
          title: "Product has been Added.",
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
        swal("Some error occurred");
    }
 
});

getProducts();

async function getProducts(){
  try {
      const res = await fetch(`${base_url}/products`);
      const data = await res.json();
      displayTodos(data);
  } catch (error) {
      console.log(error)
  }
}

function displayTodos(data){

  productsTable.innerHTML = null;

  data.forEach((el)=>{
      
      const row = document.createElement("tr");

      const td1 = document.createElement("td");
      
      const img = document.createElement("img");
      img.setAttribute("src", el.image);
      img.setAttribute("id", "product-img");

      const name = el.name.substring(0, 100);
      const td2 = document.createElement("td");
      td2.innerText = name

      const td3 = document.createElement("td");
      td3.innerText = el.category;
    
      const desc = el.description.substring(0, 100);
      const td4 = document.createElement("td");
      td4.innerText = desc;
      
      const td5 = document.createElement("td");
      td5.innerText = "₹"+el.price;

      const td6 = document.createElement("td");
      td6.innerText = el.rating;


      const td7 = document.createElement("td");
      td7.innerText = "Delete";
      td7.addEventListener("click", ()=>{
         
      });

      td1.append(img);
      row.append(td1, td2, td3, td4, td5, td6, td7);
      productsTable.append(row);
  });
}