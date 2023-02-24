import { navBar } from "./navbar.js";

const nav = document.getElementById("navbar");
nav.innerHTML = navBar;

const usersTable = document.querySelector("#users tbody")
const base_url = "http://localhost:8080"


getUsers();

async function getUsers(){
  try {
      const res = await fetch(`${base_url}/users`);
      const data = await res.json();
      displayUsers(data);
      console.log(data);
  } catch (error) {
      console.log(error)
  }
}

function displayUsers(data){
  
    usersTable.innerHTML = null;
  
    data.forEach((el)=>{
        
        const row = document.createElement("tr");
  
        const td1 = document.createElement("td");
        td1.innerText = el._id;

        const td2 = document.createElement("td");
        td2.innerText = el.name;
  
        const td3 = document.createElement("td");
        td3.innerText = el.email;
      
        const td4 = document.createElement("td");
        td4.innerText = el.phone;
  
        row.append(td1, td2, td3, td4);
        usersTable.append(row);
    });
  
}