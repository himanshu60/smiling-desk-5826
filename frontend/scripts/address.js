const form = document.querySelector("#main>form");
form.addEventListener("submit", (e)=>{
    e.preventDefault();
    window.location.href = "payment.html"
})