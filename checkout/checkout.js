import {
addDoc,
collection
}
from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
db
}
from
"../auth/firebase-config.js";



const STORE_LAT = 26.94992;
const STORE_LNG = 75.73735;

const MAX_DELIVERY_DISTANCE = 6;

const PLATFORM_FEE = 7;
const DELIVERY_FEE = 25;

const BUSINESS_WHATSAPP =
"91XXXXXXXXXX";

/* =========================
   APP STATE
========================= */
let couponDiscount = 0;

let appliedCoupon = null;

let customerLat = null;
let customerLng = null;

let customerDistance = 0;

let isOrderProcessing = false;

/* =========================
   CART DATA
========================= */

const cart =
JSON.parse(
localStorage.getItem(
"fryzaaCart"
)
) || [];

/* =========================
   EMPTY CART CHECK
========================= */

if(cart.length === 0){

  window.location.href =
  "../cart/cart.html";

}

/* =========================
   DOM ELEMENTS
========================= */

const checkoutItems =
document.getElementById(
"checkoutItems"
);

const itemTotalEl =
document.getElementById(
"itemTotal"
);

const grandTotalEl =
document.getElementById(
"grandTotal"
);

const placeOrderBtn =
document.getElementById(
"placeOrderBtn"
);

const getLocationBtn =
document.getElementById(
"getLocationBtn"
);

const locationStatus =
document.getElementById(
"locationStatus"
);
const couponInput =
document.getElementById(
"couponInput"
);

const applyCouponBtn =
document.getElementById(
"applyCouponBtn"
);

const couponMessage =
document.getElementById(
"couponMessage"
);

/* =========================
   INIT
========================= */

renderCheckout();

getLocationBtn.addEventListener(
  "click",
  getCustomerLocation
);

placeOrderBtn.addEventListener(
  "click",
  placeOrder
);
/* =========================
   CART SUMMARY
========================= */

function renderCheckout(){

  checkoutItems.innerHTML = "";

  let itemTotal = 0;

  cart.forEach(item => {

    const subtotal =
    item.price *
    item.quantity;

    itemTotal += subtotal;

    checkoutItems.innerHTML += `

      <div class="checkout-item">

        <div>

          <div class="checkout-item-name">

            ${item.name}

          </div>

          <div class="checkout-item-qty">

            ${item.size || ""}

            <br>

            Qty:
            ${item.quantity}

            ×

            ₹${item.price}

          </div>

        </div>

        <div class="checkout-item-price">

          ₹${subtotal}

        </div>

      </div>

    `;

  });

  updateTotals(
    itemTotal
  );

}

/* =========================
   TOTALS
========================= */

/* =========================
   TOTALS
========================= */

function updateTotals(
itemTotal
){

  itemTotalEl.innerText =

  `₹${itemTotal}`;

  let grandTotal =

  itemTotal +

  PLATFORM_FEE +

  DELIVERY_FEE;

  if(couponDiscount > 0){

    grandTotal -= couponDiscount;

  }

  if(grandTotal < 0){

    grandTotal = 0;

  }

  grandTotalEl.innerText =

  `₹${grandTotal}`;

}

applyCouponBtn.addEventListener(

"click",

applyCoupon

);

function applyCoupon(){

  const code =

  couponInput.value
  .trim()
  .toUpperCase();

  if(code === "FIRST50"){

    couponDiscount = 50;

    appliedCoupon =
    code;

    couponMessage.innerText =

    "✅ ₹50 Discount Applied";

    couponMessage.style.color =
  "#00e676";

  }

  else if(
  code === "WELCOME10"
  ){

    couponDiscount =

    Math.floor(
    getCartTotal() * .10
    );

    appliedCoupon =
    code;

    couponMessage.innerText =

    "✅ 10% Discount Applied";

  }

  else{

    couponDiscount = 0;

    appliedCoupon = null;

    couponMessage.innerText =

    "❌ Invalid Coupon";

    couponMessage.style.color =
"#ff5252";

  }

  updateTotals(
  getCartTotal()
  );

}
/* =========================
   CART TOTAL
========================= */

function getCartTotal(){

  let total = 0;

  cart.forEach(item => {

    total +=

    item.price *

    item.quantity;

  });

  return total;

}

/* =========================
   GRAND TOTAL
========================= */

function getGrandTotal(){

  return (

getCartTotal()

+

PLATFORM_FEE

+

DELIVERY_FEE

-

couponDiscount

);

}
/* =========================
   VALIDATION
========================= */

function showError(message){

  alert(message);

}

function validateName(name){

  return /^[A-Za-z ]{3,50}$/
  .test(name);

}

function validatePhone(phone){

  return /^[6-9][0-9]{9}$/
  .test(phone);

}

function validateEmail(email){

  if(email === "")
  return true;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  .test(email);

}

function validatePincode(pincode){

  return /^[0-9]{6}$/
  .test(pincode);

}

function validateAddress(

  houseNo,
  street,
  city

){

  if(houseNo.length < 2)
  return false;

  if(street.length < 5)
  return false;

  if(city.length < 2)
  return false;

  return true;

}

/* =========================
   ORDER ID
========================= */

function generateOrderId(){

  return "FRZ" +
   Date.now();

}
/* =========================
   LOCATION SYSTEM
========================= */

function getCustomerLocation(){

  if(!navigator.geolocation){

    showError(
      "Location not supported on this device."
    );

    return;

  }

  locationStatus.innerText =

  "📍 Capturing location...";

  navigator.geolocation.getCurrentPosition(

    (position)=>{

      customerLat =
      position.coords.latitude;

      customerLng =
      position.coords.longitude;

      customerDistance =
      calculateDistance(

        STORE_LAT,
        STORE_LNG,

        customerLat,
        customerLng

      );

      locationStatus.innerText =

      `✅ Location Captured

(${customerDistance.toFixed(1)} KM away)`;

    },

    ()=>{

      locationStatus.innerText =

      "❌ Location not captured";

      showError(
        "Please allow location access."
      );

    },

    {

      enableHighAccuracy:true,

      timeout:10000,

      maximumAge:0

    }

  );

}
/* =========================
   DISTANCE CALCULATION
========================= */

function calculateDistance(

  lat1,
  lon1,

  lat2,
  lon2

){

  const R = 6371;

  const dLat =

  (lat2 - lat1) *

  Math.PI / 180;

  const dLon =

  (lon2 - lon1) *

  Math.PI / 180;

  const a =

  Math.sin(dLat / 2) *

  Math.sin(dLat / 2)

  +

  Math.cos(

  lat1 * Math.PI / 180

  )

  *

  Math.cos(

  lat2 * Math.PI / 180

  )

  *

  Math.sin(dLon / 2)

  *

  Math.sin(dLon / 2);

  const c =

  2 *

  Math.atan2(

    Math.sqrt(a),

    Math.sqrt(1 - a)

  );

  return R * c;

}
/* =========================
   DELIVERY CHECK
========================= */

function validateDeliveryRange(){

  if(

    customerLat === null ||

    customerLng === null

  ){

    showError(

      "Please capture your location."

    );

    return false;

  }

  if(

    customerDistance >

    MAX_DELIVERY_DISTANCE

  ){

    showError(

`Sorry!

Delivery is available only within

${MAX_DELIVERY_DISTANCE} KM.

Your distance is

${customerDistance.toFixed(1)} KM`

    );

    return false;

  }

  return true;

}
/* =========================
   PLACE ORDER
========================= */

function placeOrder(){

  if(isOrderProcessing)
  return;

  const name =
  document.getElementById(
  "customerName"
  ).value.trim();

  const phone =
  document.getElementById(
  "customerPhone"
  ).value.trim();

  const email =
  document.getElementById(
  "customerEmail"
  ).value.trim();

  const houseNo =
  document.getElementById(
  "houseNo"
  ).value.trim();

  const street =
  document.getElementById(
  "street"
  ).value.trim();

  const city =
  document.getElementById(
  "city"
  ).value.trim();

  const pincode =
  document.getElementById(
  "pincode"
  ).value.trim();

  const landmark =
  document.getElementById(
  "landmark"
  ).value.trim();

  const instructions =
  document.getElementById(
  "instructions"
  ).value.trim();

  /* =========================
     REQUIRED CHECK
  ========================= */

  if(

    !name ||

    !phone ||

    !houseNo ||

    !street ||

    !city ||

    !pincode

  ){

    showError(

      "Please fill all required fields."

    );

    return;

  }

  /* =========================
     NAME VALIDATION
  ========================= */

  if(
  !validateName(name)
  ){

    showError(
    "Enter a valid name."
    );

    return;

  }

  /* =========================
     PHONE VALIDATION
  ========================= */

  if(
  !validatePhone(phone)
  ){

    showError(
    "Enter a valid mobile number."
    );

    return;

  }

  /* =========================
     EMAIL VALIDATION
  ========================= */

  if(
  !validateEmail(email)
  ){

    showError(
    "Enter a valid email address."
    );

    return;

  }

  /* =========================
     ADDRESS VALIDATION
  ========================= */

  if(

  !validateAddress(

  houseNo,
  street,
  city

  )

  ){

    showError(
    "Please enter a valid address."
    );

    return;

  }

  /* =========================
     PINCODE VALIDATION
  ========================= */

  if(
  !validatePincode(
  pincode
  )
  ){

    showError(
    "Enter a valid 6 digit pincode."
    );

    return;

  }

  /* =========================
     DELIVERY RANGE CHECK
  ========================= */

  if(
  !validateDeliveryRange()
  ){

    return;

  }

  /* =========================
     PROCESSING STATE
  ========================= */

  isOrderProcessing = true;

  placeOrderBtn.disabled =
  true;

  placeOrderBtn.innerText =
  "Processing...";

  generateOrder(

    name,
    phone,
    email,

    houseNo,
    street,
    city,
    pincode,

    landmark,
    instructions

  );

}
/* =========================
   GENERATE ORDER
========================= */

function generateOrder(

  name,
  phone,
  email,

  houseNo,
  street,
  city,
  pincode,

  landmark,
  instructions

){

  const orderId =

  generateOrderId();

  const itemTotal =

  getCartTotal();

  const grandTotal =

  getGrandTotal();

  let orderItems = "";

  cart.forEach(item => {

    const subtotal =

    item.price *

    item.quantity;

    orderItems +=

`🍔 ${item.name}

${item.size || ""}

Qty: ${item.quantity}

Price: ₹${subtotal}

━━━━━━━━━━━━━━

`;

  });

  const paymentMethod =

  document.querySelector(

  'input[name="paymentMethod"]:checked'

  ).value;
  localStorage.setItem(

"fryzaaLastOrder",

JSON.stringify({

  orderId,

  paymentMethod

})

);

  const message =

`🍔 *FRYZAA ORDER*

━━━━━━━━━━━━━━

🆔 Order ID

${orderId}

━━━━━━━━━━━━━━

👤 Customer

${name}

📞 Phone

+91 ${phone}

📧 Email

${email || "Not Provided"}

━━━━━━━━━━━━━━

📍 Delivery Address

${houseNo}

${street}

${city}

${pincode}

📌 Landmark

${landmark || "N/A"}

━━━━━━━━━━━━━━

📍 Distance

${customerDistance.toFixed(1)} KM

━━━━━━━━━━━━━━

🛒 ITEMS

${orderItems}

💰 Item Total

₹${itemTotal}

⚙ Platform Fee

₹${PLATFORM_FEE}

🚚 Delivery Fee

₹${DELIVERY_FEE}

━━━━━━━━━━━━━━

💵 Grand Total

₹${grandTotal}

━━━━━━━━━━━━━━

💳 Payment

${paymentMethod}

━━━━━━━━━━━━━━

📝 Instructions

${instructions || "None"}

`;

  if(

    paymentMethod ===

    "COD"

  ){

    sendWhatsAppOrder(

      message

    );

  }

  else{

    startRazorpay(

      grandTotal,

      message

    );

  }

}
/* =========================
   WHATSAPP ORDER
========================= */

async function sendWhatsAppOrder(
message
){
  const whatsappURL =

  `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(message)}`;

  const customerData =

JSON.parse(
localStorage.getItem(
"fryzaaCustomer"
)
);

const userData =

JSON.parse(
localStorage.getItem(
"fryzaaUser"
)
);

await addDoc(

collection(
db,
"orders"
),

{

  orderId:

  JSON.parse(
  localStorage.getItem(
  "fryzaaLastOrder"
  )
  )?.orderId ||

  generateOrderId(),

  userId:

  userData?.uid || "",

  customer:

  customerData,

  items:

  cart,

  total:

  getGrandTotal(),

  coupon:

appliedCoupon ||

"NONE",

discount:

couponDiscount,

  status:

  "pending",

  paymentMethod:

  JSON.parse(
  localStorage.getItem(
  "fryzaaLastOrder"
  )
  )?.paymentMethod ||

  "COD",

  createdAt:

  new Date()
  .toISOString()

}

);

  clearCart();

  clearCustomerData();

  alert(
    "🎉 Order Created Successfully!"
  );

  isOrderProcessing =
  false;

  placeOrderBtn.disabled =
  false;

  placeOrderBtn.innerText =
  "Place Order";

  window.open(
    whatsappURL,
    "_blank"
  );

  setTimeout(()=>{

    window.location.href =
    "../success/success.html";

  },1000);

}
/* =========================
   RAZORPAY PAYMENT
========================= */

function startRazorpay(

  amount,
  message

){

  const options = {

    key:

    "YOUR_RAZORPAY_KEY_ID",

    amount:

    amount * 100,

    currency:

    "INR",

    name:

    "FRYZAA",

    description:

    "Food Order Payment",

    image:

    "",

    theme:{

      color:"#ffb400"

    },

    handler:function(

      response

    ){

      sendWhatsAppOrder(

message +

`

━━━━━━━━━━━━━━

✅ PAYMENT STATUS

PAID ONLINE

🧾 PAYMENT ID

${response.razorpay_payment_id}

`

      );

    },

    modal:{

      ondismiss:function(){

        resetOrderState();

        alert(

        "Payment cancelled."

        );

      }

    }

  };

  const razorpay =

  new Razorpay(
    options
  );

  razorpay.on(

    "payment.failed",

    function(response){

      resetOrderState();

      alert(

`Payment Failed

${response.error.description}`

      );

    }

  );

  razorpay.open();

}
/* =========================
   SAVE CUSTOMER DATA
========================= */

function saveCustomerData(){

  const customerData = {

    name:

    document.getElementById(
    "customerName"
    ).value,

    phone:

    document.getElementById(
    "customerPhone"
    ).value,

    email:

    document.getElementById(
    "customerEmail"
    ).value,

    houseNo:

    document.getElementById(
    "houseNo"
    ).value,

    street:

    document.getElementById(
    "street"
    ).value,

    city:

    document.getElementById(
    "city"
    ).value,

    pincode:

    document.getElementById(
    "pincode"
    ).value,

    landmark:

    document.getElementById(
    "landmark"
    ).value,

    instructions:

    document.getElementById(
    "instructions"
    ).value

  };

  localStorage.setItem(

    "fryzaaCustomer",

    JSON.stringify(
    customerData
    )

  );

}
/* =========================
   RESTORE CUSTOMER DATA
========================= */

function restoreCustomerData(){

  const savedData =

  JSON.parse(

    localStorage.getItem(
    "fryzaaCustomer"
    )

  );

  if(!savedData)
  return;

  document.getElementById(
  "customerName"
  ).value =

  savedData.name || "";

  document.getElementById(
  "customerPhone"
  ).value =

  savedData.phone || "";

  document.getElementById(
  "customerEmail"
  ).value =

  savedData.email || "";

  document.getElementById(
  "houseNo"
  ).value =

  savedData.houseNo || "";

  document.getElementById(
  "street"
  ).value =

  savedData.street || "";

  document.getElementById(
  "city"
  ).value =

  savedData.city || "";

  document.getElementById(
  "pincode"
  ).value =

  savedData.pincode || "";

  document.getElementById(
  "landmark"
  ).value =

  savedData.landmark || "";

  document.getElementById(
  "instructions"
  ).value =

  savedData.instructions || "";

}
/* =========================
   AUTO SAVE
========================= */

document
.querySelectorAll(

"input, textarea"

)

.forEach(field => {

  field.addEventListener(

    "input",

    saveCustomerData

  );

});
/* =========================
   CLEAR CUSTOMER DATA
========================= */
/* =========================
   CLEAR CART
========================= */

function clearCart(){

  localStorage.removeItem(
    "fryzaaCart"
  );

}

function clearCustomerData(){

  localStorage.removeItem(
    "fryzaaCustomer"
  );

}

/* =========================
   BUTTON HELPERS
========================= */

function setLoading(){

  placeOrderBtn.disabled =
  true;

  placeOrderBtn.innerText =

  "Processing...";

}

function stopLoading(){

  placeOrderBtn.disabled =
  false;

  placeOrderBtn.innerText =

  "Place Order";

}
function resetOrderState(){

  isOrderProcessing =
  false;

  stopLoading();

}
/* =========================
   APP READY
========================= */

console.log(

"✅ Fryzaa Checkout Ready"

);