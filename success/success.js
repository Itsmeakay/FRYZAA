/* =========================
   ORDER DATA
========================= */

const orderIdElement =
document.getElementById(
"orderId"
);

const paymentMethodElement =
document.getElementById(
"paymentMethod"
);

/* =========================
   LOAD ORDER
========================= */

loadOrderData();

function loadOrderData(){

  const savedOrder =

  localStorage.getItem(
  "fryzaaLastOrder"
  );

  if(!savedOrder){

    orderIdElement.innerText =
    "N/A";

    paymentMethodElement.innerText =
    "N/A";

    return;

  }

  const orderData =

  JSON.parse(savedOrder);

  orderIdElement.innerText =

  orderData.orderId ||
  "N/A";

  paymentMethodElement.innerText =

  orderData.paymentMethod ||
  "N/A";

}
/* =========================
   DELIVERY STATUS
========================= */

const deliveryBadge =
document.querySelector(
".delivery-badge"
);

if(deliveryBadge){

  deliveryBadge.innerText =

  "🚚 Preparing Your Order";

}

/* =========================
   PAGE ENTRY
========================= */

window.addEventListener(

  "load",

  ()=>{

    document.body.style.opacity =
    "1";

  }

);
/* =========================
   PAGE PROTECTION
========================= */

const orderData =

localStorage.getItem(
"fryzaaLastOrder"
);

if(!orderData){

  window.location.href =

  "../Home/index.html";

}