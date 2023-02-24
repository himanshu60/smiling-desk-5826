const payBtn = document.getElementById("pay-btn");
payBtn.addEventListener("click", ()=>{
    swal("Order Placed");
    setTimeout(()=>{
        fun();
    }, 2000)
    
})

function fun(){
    window.location.href = "index.html";
}