/* =========================
   HAMBURGER
========================= */

const hamburger =
document.querySelector(".hamburger");

const navLinks =
document.querySelector(".nav-links");

if(hamburger){

  hamburger.addEventListener("click",()=>{

    hamburger.classList.toggle("open");

    navLinks.classList.toggle("active");

  });

}

/* =========================
   CART DATA
========================= */

let cart =
JSON.parse(
localStorage.getItem("fryzaaCart")
) || [];

const cartItemsContainer =
document.getElementById("cartItems");

const emptyCart =
document.getElementById("emptyCart");

const itemTotalEl =
document.getElementById("itemTotal");

const grandTotalEl =
document.getElementById("grandTotal");

/* =========================
   RENDER CART
========================= */

function renderCart(){

  cartItemsContainer.innerHTML = "";

  if(cart.length === 0){

    emptyCart.style.display = "block";

    itemTotalEl.innerText =
    "₹0";

    grandTotalEl.innerText =
    "₹0";

    return;

  }

  emptyCart.style.display = "none";

  let itemTotal = 0;

  cart.forEach((item,index)=>{

    itemTotal +=
    item.price * item.quantity;

    cartItemsContainer.innerHTML += `

      <div class="cart-item">

        <div class="cart-item-image">

          <img
            src="${item.image}"
            alt="${item.name}"
          >

        </div>

        <div class="cart-item-content">

          <div>

            <h3>

              ${item.name}

            </h3>

            ${
              item.size
              ?
              `<div class="cart-item-size">
                ${item.size}
              </div>`
              :
              ""
            }

            <div class="cart-item-price">

              ₹${item.price}

            </div>

          </div>

          <div class="cart-actions">

            <div class="quantity-box">

              <button
                class="qty-btn"
                onclick="decreaseQty(${index})"
              >

                -

              </button>

              <span class="qty-value">

                ${item.quantity}

              </span>

              <button
                class="qty-btn"
                onclick="increaseQty(${index})"
              >

                +

              </button>

            </div>

            <button
              class="remove-btn"
              onclick="removeItem(${index})"
            >

              Remove

            </button>

          </div>

        </div>

      </div>

    `;

  });

  itemTotalEl.innerText =
  `₹${itemTotal}`;

  const grandTotal =
  itemTotal + 7 + 25;

  grandTotalEl.innerText =
  `₹${grandTotal}`;

}

/* =========================
   SAVE CART
========================= */

function saveCart(){

  localStorage.setItem(
    "fryzaaCart",
    JSON.stringify(cart)
  );

  renderCart();

}

/* =========================
   INCREASE
========================= */

function increaseQty(index){

  cart[index].quantity++;

  saveCart();

}

/* =========================
   DECREASE
========================= */

function decreaseQty(index){

  if(cart[index].quantity > 1){

    cart[index].quantity--;

  }else{

    cart.splice(index,1);

  }

  saveCart();

}

/* =========================
   REMOVE ITEM
========================= */

function removeItem(index){

  cart.splice(index,1);

  saveCart();

}

/* =========================
   CHECKOUT BUTTON
========================= */

const checkoutBtn =
document.querySelector(
  ".checkout-btn"
);

if(checkoutBtn){

  checkoutBtn.addEventListener(
    "click",
    ()=>{

      if(cart.length === 0){

        alert(
          "Your cart is empty."
        );

        return;

      }

      window.location.href =
      "../checkout/checkout.html";

    }
  );

}

/* =========================
   INITIAL LOAD
========================= */

renderCart();

console.log(
  "FRYZAA CART READY 🛒"
);