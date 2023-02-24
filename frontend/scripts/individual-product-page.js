const main = document.getElementById("main");
const product = JSON.parse(localStorage.getItem("abc"));
const token = localStorage.getItem("token");

displayProducts(product);

function displayProducts(...data){

    main.innerHTML = null;

    data.forEach((el)=>{
        
    const div1 = document.createElement("div");
        

    const div2 = document.createElement("div");

    
    const image = document.createElement("img");
    image.setAttribute("src", el.image);
    div2.append(image);

    const addToCartBtn = document.createElement("button");
        addToCartBtn.innerText = "Add to Cart";
        addToCartBtn.addEventListener("click", ()=>{
            if(token){
             addToCartfun(el);
            } else {
             swal("Please Login in first");
            }
        })

    const name = document.createElement("h2");
    name.innerText = el.name;


    const div5 = document.createElement("div");
    div5.innerHTML = ` <p><b>Bank Offer</b> 5% Cashback on Axis Bank Card <a href="#">T&C</a></p>
    <p><b>Special Price</b> Get extra ₹3000 off (price inclusive of cashback/coupon)<a href="#">T&C</a></p>
    <p><b>Partner Offer</b> Purchase now & get a surprise cashback coupon for January / February 2023 <a href="#">Know more</a></p>
    <hr>`;

    const details = document.createElement("p");
    details.innerHTML = `<h4>Description : </h4>`+el.description;
   


    const price = document.createElement("h3");
    price.innerText = "₹"+el.price;

    const span = document.createElement("span");
    span.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="15" viewBox="0 0 24 24" width="15"><path d="M0 0h24v24H0z" fill="none"/><path d="M0 0h24v24H0z" fill="none"/><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
    ${el.rating} | 108 ratings & 51 reviews`;


    div1.append(image, addToCartBtn);
    div2.append(name, span, price, div5,  details);
    main.append(div1, div2);

    });
}


async function addToCartfun(prod){

    try {
        let res = await fetch(`${api_base_url}/cartproducts`, {
          method: "POST",
          body: JSON.stringify(prod),
          headers: {
            "Content-Type": "application/json",
            Authorization: token
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
          swal("Some error occurred");
      }

}
