import {
collection,
query,
where,
getDocs,
orderBy,
onSnapshot
}
from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
db
}
from
"../auth/firebase-config.js";

const ordersList =
document.getElementById(
"ordersList"
);

const userData =

JSON.parse(

localStorage.getItem(
"fryzaaUser"
)

);

if(!userData){

  window.location.href =
  "../auth/login.html";

}

loadOrders();

async function loadOrders(){

  try{

    const ordersQuery =

    query(

      collection(
      db,
      "orders"
      ),

      where(
      "userId",
      "==",
      userData.uid
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

      ordersList.innerHTML =

      `
      <div class="order-card">

        No Orders Found 🍔

      </div>
      `;

      return;

    }

    ordersList.innerHTML = "";

   snapshot.forEach(doc => {

  const order =
  doc.data();

  const itemNames =

  order.items
  .map(item =>

  `${item.name} x${item.quantity}`

  )
  .join(", ");

  ordersList.innerHTML +=

  `
  <div class="order-card">

    <div class="order-id">

      ${order.orderId}

    </div>

    <div class="order-date">

      ${new Date(
      order.createdAt
      ).toLocaleDateString()}

    </div>

    <div class="order-items">

      ${itemNames}

    </div>

    <div class="order-total">

      ₹${order.total}

    </div>

    <div class="order-status ${order.status}">
  ${getStatusText(order.status)}
</div>

    <button
    class="repeat-btn"
    onclick='repeatOrder(${JSON.stringify(order.items)})'
    >

      Repeat Order

    </button>

  </div>
  `;

});
  }

  catch(error){

    console.error(error);

    ordersList.innerHTML =

    `
    <div class="order-card">

      Error Loading Orders

    </div>
    `;

  }

}

function getStatusText(
status
){

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

      return "🟡 Pending";

  }

}
window.repeatOrder =

function(items){

  localStorage.setItem(

    "fryzaaCart",

    JSON.stringify(items)

  );

  alert(

    "🛒 Items added to cart!"

  );

  window.location.href =

  "../cart/cart.html";

};
/* =========================
   ORDER STATUS POPUP
========================= */

function showOrderPopup(message){

  const popup =
  document.getElementById(
    "orderStatusPopup"
  );

  const text =
  document.getElementById(
    "orderStatusMessage"
  );

  text.innerText = message;

  popup.classList.add(
    "show"
  );

  setTimeout(()=>{

    popup.classList.remove(
      "show"
    );

  },4000);

}
/* =========================
   REAL TIME ORDER STATUS
========================= */

function listenOrderUpdates(){

  const userId =
  localStorage.getItem(
    "fryzaaUserId"
  );

  if(!userId){
    return;
  }


  const ordersQuery = query(
    collection(db,"orders"),
    where(
      "userId",
      "==",
      userId
    )
  );


  let firstLoad = true;


  onSnapshot(
    ordersQuery,

    (snapshot)=>{


      if(firstLoad){

        firstLoad = false;

        return;

      }


      snapshot.docChanges()
      .forEach(change=>{


        if(
          change.type === "modified"
        ){


          const order =
          change.doc.data();


          showOrderPopup(
            `Your order is now ${order.status}`
          );


          console.log(
            "Order Updated:",
            order.status
          );

        }

      });

    }

  );

}


listenOrderUpdates();