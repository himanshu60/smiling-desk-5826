const banner_imgs = [
    "https://rukminim1.flixcart.com/fk-p-flap/3376/560/image/483fc2547747864a.jpeg?q=50",
    "https://rukminim1.flixcart.com/fk-p-flap/1688/280/image/80d7d6f1c3d00945.jpeg?q=50",
    "https://rukminim1.flixcart.com/fk-p-flap/3376/560/image/448c152993ceefb3.jpeg?q=50",
    "https://rukminim1.flixcart.com/fk-p-flap/844/140/image/7e36ae7e8c5b8181.jpg?q=50",
    "https://rukminim1.flixcart.com/fk-p-flap/844/140/image/d42a1161502f3858.jpg?q=50"
];

const categories = document.querySelectorAll("#category p");
categories.forEach((el)=>{
  el.addEventListener("click", ()=>{
    window.location.href = "#";
  })
})


displayImg();


var i = 0;

function displayImg() {
    let int;
  clearInterval(int);
    i = 0;
    int = setInterval(() => {
      if (i == banner_imgs.length - 1) {
        i = 0;
      } else {
        i++;
      }
      document.querySelector("#banner-img").src = banner_imgs[i];
    }, 2000);
  }


