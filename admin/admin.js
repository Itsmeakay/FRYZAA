import {
collection,
getDocs,
query,
orderBy,
doc,
updateDoc,
deleteDoc,
onSnapshot
}
from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
db
}
from
"../auth/firebase-config.js";


/* =========================
   ADMIN CHECK
========================= */

const userData =

JSON.parse(

localStorage.getItem(
"fryzaaUser"
)

);

if(

!userData ||

userData.email !==

"adminfryzaa@gmail.com"

){

  alert(
  "Access Denied"
  );

  window.location.href =

  "../Home/index.html";

}

/* =========================
   DOM
========================= */

const ordersContainer =

document.getElementById(
"ordersContainer"
);

const totalCustomersEl =

document.getElementById(
"totalCustomers"
);

const totalOrdersEl =
document.getElementById(
"totalOrders"
);

const pendingOrdersEl =
document.getElementById(
"pendingOrders"
);

const processingOrdersEl =
document.getElementById(
"processingOrders"
);

const outForDeliveryOrdersEl =
document.getElementById(
"outForDeliveryOrders"
);

const cancelledOrdersEl =
document.getElementById(
"cancelledOrders"
);

const deliveredOrdersEl =
document.getElementById(
"deliveredOrders"
);

const totalRevenueEl =
document.getElementById(
"totalRevenue"
);

const searchInput =
document.getElementById(
"searchInput"
);

const todayOrdersEl =

document.getElementById(
"todayOrders"
);

const todayRevenueEl =

document.getElementById(
"todayRevenue"
);

const refreshBtn =

document.getElementById(
"refreshBtn"
);

const productsContainer =
document.getElementById(
"productsContainer"
);

const ordersTab =
document.getElementById(
"ordersTab"
);

const productsTab =
document.getElementById(
"productsTab"
);

const productSearch =
document.getElementById(
"productSearch"
);

const storeToggle =
document.getElementById(
"storeToggle"
);

const storeStatusText =
document.getElementById(
"storeStatusText"
);



/* =========================
   LOAD ORDERS
========================= */

loadOrders();

ordersTab.addEventListener(

  "click",

  ()=>{

    ordersContainer.style.display =
    "block";

    productsContainer.style.display =
    "none";

    productSearch.style.display =
"none";

    ordersTab.classList.add(
    "active-tab"
    );

    productsTab.classList.remove(
    "active-tab"
    );

  }

);

productsTab.addEventListener(

  "click",

  ()=>{

    ordersContainer.style.display =
    "none";

    productsContainer.style.display =
    "block";

    productSearch.style.display =
"block";

    productsTab.classList.add(
    "active-tab"
    );

    ordersTab.classList.remove(
    "active-tab"
    );

    loadProducts();

  }

);

function formatStatus(status){

  switch(status){

    case "pending":
      return "🟡 Pending";

    case "accepted":
      return "🟢 Accepted";

    case "processing":
      return "🟠 Processing";

    case "out-for-delivery":
      return "🚚 Out For Delivery";

    case "delivered":
      return "✅ Delivered";

    case "cancelled":
      return "❌ Cancelled";

    default:
      return status;

  }

}

async function loadOrders(){

  try{

    const ordersQuery =

    query(

      collection(
      db,
      "orders"
      ),

      orderBy(
      "createdAt",
      "desc"
      )

    );

    const snapshot =

    await getDocs(
    ordersQuery
    );

    if(snapshot.empty){

      ordersContainer.innerHTML =

      "No Orders Found";

      return;

    }
    let uniqueCustomers =

new Set();

    let totalOrders = 0;

let pendingOrders = 0;

let processingOrders = 0;

let outForDeliveryOrders = 0;

let cancelledOrders = 0;

let deliveredOrders = 0;

let totalRevenue = 0;

let todayOrders = 0;

let todayRevenue = 0;

    ordersContainer.innerHTML = "";

    snapshot.forEach(doc => {

      const order =
doc.data();

const docId =
doc.id;

totalOrders++;

totalRevenue +=

Number(
order.total || 0
);
if(
order.customer?.phone
){

  uniqueCustomers.add(

  order.customer.phone

  );

}

const today =

new Date()
.toDateString();

const orderDate =

new Date(
order.createdAt
)
.toDateString();

if(
today === orderDate
){

  todayOrders++;

  todayRevenue +=

  Number(
  order.total || 0
  );

}

if(
order.status ===
"pending"
){

  pendingOrders++;

}

if(
order.status ===
"processing"
){

  processingOrders++;

}

if(
order.status ===
"out-for-delivery"
){

  outForDeliveryOrders++;

}

if(
order.status ===
"cancelled"
){

  cancelledOrders++;

}

if(
order.status ===
"delivered"
){

  deliveredOrders++;

}
      ordersContainer.innerHTML += `
<div class="admin-order-card">

  <div class="order-header">

  <div>

    <h3>

      ${order.orderId}

    </h3>

    <p class="customer-name">

      ${order.customer?.name || "Customer"}

    </p>

  </div>

  <div>

    <p class="order-price">

      ₹${order.total}

    </p>

  </div>

</div>

  <button

class="details-btn"

onclick="toggleDetails('${docId}')"

>

View Details

</button>

  <div

id="details-${docId}"

class="order-details"

>

<p>

<strong>Name:</strong>

${order.customer?.name || "Customer"}

</p>

<strong>Payment:</strong>

${order.paymentMethod || "COD"}

</p>

<p>

<strong>Coupon:</strong>

${order.coupon || "NONE"}

</p>

<p>

<strong>Discount:</strong>

₹${order.discount || 0}

</p>

<p>

<strong>Total:</strong>

₹${order.total}

</p>

<p>

<strong>Address:</strong>

${order.customer?.houseNo || ""},

${order.customer?.street || ""},

${order.customer?.city || ""}

</p>

<p>

<strong>Pincode:</strong>

${order.customer?.pincode || ""}

</p>

<p>

<strong>Date:</strong>

${new Date(
order.createdAt
).toLocaleString()}

</p>

<div class="order-items">

  <strong>

    Items:

  </strong>

  ${
  order.items
  ?.map(item =>

  `<div>

  🍔 ${item.name}

  (${item.quantity})

  × ₹${item.price}

  </div>`

  )
  .join("")

  }

</div>

  <div class="status-row">

<span class="status-badge ${order.status}">

${formatStatus(order.status)}

</span>

</div>

  <div class="status-buttons">

    <button
    onclick="updateStatus('${docId}','accepted')"
    >
    Accept
    </button>

    <button
    onclick="updateStatus('${docId}','processing')"
    >
    Processing
    </button>

    <button
    onclick="updateStatus('${docId}','out-for-delivery')"
    >
    Out For Delivery
    </button>

    <button
    onclick="updateStatus('${docId}','delivered')"
    >
    Delivered
    </button>

    <button
onclick="updateStatus('${docId}','cancelled')">
Cancel Order
</button>


  </div>

  </div>

</div>
`;

    });

    if(totalCustomersEl){

  totalCustomersEl.innerText =

  uniqueCustomers.size;

}

    if(todayOrdersEl){

  todayOrdersEl.innerText =

  todayOrders;

}

if(todayRevenueEl){

  todayRevenueEl.innerText =

  `₹${todayRevenue}`;

}
    if(totalOrdersEl){

  totalOrdersEl.innerText =
  totalOrders;

}

if(pendingOrdersEl){

  pendingOrdersEl.innerText =
  pendingOrders;

}

if(processingOrdersEl){

  processingOrdersEl.innerText =
  processingOrders;

}

if(outForDeliveryOrdersEl){

  outForDeliveryOrdersEl.innerText =
  outForDeliveryOrders;

}

if(cancelledOrdersEl){

  cancelledOrdersEl.innerText =
  cancelledOrders;

}

if(deliveredOrdersEl){

  deliveredOrdersEl.innerText =
  deliveredOrders;

}

if(totalRevenueEl){

  totalRevenueEl.innerText =
  `₹${totalRevenue}`;

}

  }

  catch(error){

    console.error(error);

  }

}
window.updateStatus =
async function(
docId,
status
){

  await updateDoc(

    doc(
      db,
      "orders",
      docId
    ),

    {
      status
    }

  );

  loadOrders();

};

window.toggleStock =
async function(
productId,
currentStock
){

  await updateDoc(

    doc(
      db,
      "products",
      productId
    ),

    {
      stock:
      !currentStock
    }

  );

  loadProducts();

};
window.editPrice =
async function(
productId,
productName,
currentPrice
){

  const newPrice =

  prompt(

    `Enter New Price For ${productName}`,

    currentPrice

  );

  if(
    !newPrice
  ){
    return;
  }

  await updateDoc(

    doc(
      db,
      "products",
      productId
    ),

    {
      price:
      Number(newPrice)
    }

  );

  alert(
    "Price Updated Successfully"
  );

  loadProducts();

};
window.deleteProduct =
async function(
productId
){

  const confirmDelete =

  confirm(
  "Delete Product?"
  );

  if(
  !confirmDelete
  ){

    return;

  }

  await deleteDoc(

    doc(
      db,
      "products",
      productId
    )

  );

  alert(
  "Product Deleted"
  );

  loadProducts();

};

async function loadProducts(){

  try{

    const snapshot =

    await getDocs(

      collection(
        db,
        "products"
      )

    );

    productsContainer.innerHTML = "";

    snapshot.forEach(productDoc => {

      const product =
      productDoc.data();

      const productId =
      productDoc.id;

      productsContainer.innerHTML += `

     <div
class="admin-order-card product-card"
data-name="${product.name.toLowerCase()}"
>

        <h3>

          ${product.name}

        </h3>

        <p>

          Price:
          ₹${product.price || "-"}

        </p>

        <p>

Type:

${
product.type === "veg"

?

"🟢 Veg"

:

"🔴 Non Veg"

}

</p>
        <p>

          Stock:

          ${
          product.stock === false

          ?

          "❌ Out Of Stock"

          :

          "✅ In Stock"
          }

        </p>

        <div class="status-buttons">
         <button
onclick="editPrice(
'${productId}',
'${product.name}',
'${product.price || 0}'
)">
Edit Price
</button>
          <button
onclick="toggleStock(
'${productId}',
${product.stock}
)">

          ${
          product.stock === false

          ?

          "Enable Stock"

          :

          "Disable Stock"
          }

          </button>

          <button
          onclick="deleteProduct(
          '${productId}'
          )">

          Delete

          </button>

        </div>

      </div>

      `;

    });

  }

  catch(error){

    console.error(error);

  }

}
setInterval(

()=>{

  loadOrders();

},

10000
);
if(productSearch){

  productSearch.addEventListener(

    "input",

    ()=>{

      const value =

      productSearch.value
      .toLowerCase()
      .trim();

      document
      .querySelectorAll(
      ".product-card"
      )
      .forEach(card => {

        const productName =

        card.dataset.name || "";

        if(
  productName.includes(value)
){

  card.style.display = "";

}
else{

  card.style.display = "none";

}
      });

    }

  );

}
window.toggleDetails = function(orderId){

  const details = document.getElementById(
    `details-${orderId}`
  );

  if(!details){
    console.log("Details not found");
    return;
  }

  if(details.style.display === "block"){

    details.style.display = "none";

  }

  else{

    details.style.display = "block";

  }

};
/* =========================
   ADMIN NEW ORDER NOTIFICATION
========================= */
const notificationSound =
new Audio(
"../assets/sounds/mixkit-bell-notification-933.wav"
);
notificationSound.volume = 0.5;
const notificationCount =
document.getElementById(
  "notificationCount"
);

function listenNewOrders(){

  const ordersQuery = query(
    collection(db,"orders"),
    orderBy("createdAt","desc")
  );

  let firstLoad = true;

  onSnapshot(
    ordersQuery,

    (snapshot)=>{

      if(firstLoad){

        notificationCount.innerText = 0;

        firstLoad = false;

        return;
      }

      const newOrders =
      snapshot.docChanges()
      .filter(change =>
        change.type === "added"
      );

      if(newOrders.length > 0){

        let currentCount =
        Number(
          notificationCount.innerText
        );

        notificationCount.innerText =
        currentCount + newOrders.length;


        // Sound future me add karenge
        console.log(
          "🔔 New Order Received"
        );
        showNotificationPopup();
      notificationSound.currentTime = 0;

notificationSound.play()
.catch(error => {
  console.log(
    "Sound blocked:",
    error
  );
});

      }

    }

  );

}

listenNewOrders();
const notificationBell =
document.querySelector(".notification-box");

if(notificationBell){

  notificationBell.addEventListener(
    "click",
    ()=>{

      document
      .getElementById("ordersTab")
      .click();

      document
      .getElementById("notificationCount")
      .innerText = "0";

    }

  );

}
function showNotificationPopup(){

  const popup =
  document.getElementById(
    "notificationPopup"
  );

  popup.classList.add(
    "show"
  );

  setTimeout(()=>{

    popup.classList.remove(
      "show"
    );

  },4000);

}