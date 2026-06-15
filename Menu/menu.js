import {
  menuItems
}
from
"./menu-data.js";

import {
  collection,
  getDocs
}
from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
  db
}
from
"../auth/firebase-config.js";

/* =========================
   HAMBURGER
========================= */

const hamburger =
  document.querySelector(".hamburger");

const navLinks =
  document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {

  hamburger.classList.toggle("open");

  navLinks.classList.toggle("active");

});


/* =========================
   VARIABLES
========================= */

const menuGrid =
  document.getElementById("menuGrid");

const categoryTitle =
  document.getElementById("menuCategoryTitle");

const categoryButtons =
  document.querySelectorAll(".category-btn");

const vegBtn =
  document.getElementById("vegBtn");

const nonVegBtn =
  document.getElementById("nonVegBtn");

let currentCategory =
  "Burgers";

let currentType =
  "veg";

  let firestoreProducts = [];

  async function loadProducts(){

  try{

    const snapshot =

    await getDocs(

      collection(
        db,
        "products"
      )

    );

    firestoreProducts = [];

    snapshot.forEach(doc => {

      firestoreProducts.push({

        id: doc.id,

        ...doc.data()

      });

    });

    console.log(

      "Products Loaded:",

      firestoreProducts.length

    );

    displayItems();

  }

  catch(error){

    console.error(error);

  }

}
/* =========================
   DISPLAY ITEMS
========================= */

function displayItems() {

  menuGrid.innerHTML = "";

  const filteredItems =
    firestoreProducts.filter((item) => {

      return (
        item.category === currentCategory &&
        item.type === currentType
      );

    });

  categoryTitle.innerText =
    `${currentType === "veg" ? "Veg" : "Non Veg"} ${currentCategory}`;

  if(filteredItems.length === 0) {

    menuGrid.innerHTML = `

      <div class="empty-menu">

        No items available.

      </div>

    `;

    return;

  }

  filteredItems.forEach((item) => {

    menuGrid.innerHTML += `

      <div class="menu-card">

        <div class="menu-image">

          <img
            src="${item.image}"
            alt="${item.name}"
          >

          <span class="menu-tag">

            ${item.tag}

          </span>

        </div>

        <div class="menu-content">

          <div class="menu-top">

            <h3>
              ${item.name}
            </h3>

            ${
item.sizes &&
item.sizes.length > 0

?

`
<select class="size-select">

  ${item.sizes.map(size => `
    <option value="${size.price}">
      ${size.label} - ₹${size.price}
    </option>
  `).join("")}

</select>
`

:

`
<span class="menu-price">
  ₹${item.price}
</span>
`
}
          </div>

          <p>
            ${item.description}
          </p>

          <div class="menu-bottom">

            <div class="menu-rating">

              ⭐ ${item.rating}

            </div>

            ${
item.stock === false

?

`
<button
class="out-stock-btn"
disabled>

Out Of Stock

</button>
`

:

`
<button
class="add-cart-btn">

Add to Cart

</button>
`
}
          </div>

        </div>

      </div>

    `;

  });

  addCartFunction();

}

/* INITIAL LOAD */

loadProducts();

/* =========================
   CATEGORY BUTTONS
========================= */

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    categoryButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    currentCategory = button.getAttribute("data-category");

    displayItems();
  });
});

/* =========================
   VEG BUTTON
========================= */

vegBtn.addEventListener("click", () => {

  currentType = "veg";

  vegBtn.classList.add("active");

  nonVegBtn.classList.remove("active");

  /* HIDE NON VEG ONLY CATEGORIES */

  categoryButtons.forEach((button) => {

    const category =
      button.getAttribute("data-category");

    if (
      category === "Shawarma" ||
      category === "Fried Chicken"
    ) {

      button.style.display = "none";

    }

  });

  /* AUTO SWITCH CATEGORY */

  if (
    currentCategory === "Shawarma" ||
    currentCategory === "Fried Chicken"
  ) {

    currentCategory = "Burgers";

    categoryButtons.forEach((btn) => {

      btn.classList.remove("active");

      if (
        btn.getAttribute("data-category")
        === "Burgers"
      ) {

        btn.classList.add("active");

      }

    });

  }

  displayItems();

});
/* =========================
   NON VEG BUTTON
========================= */

nonVegBtn.addEventListener("click", () => {

  currentType = "nonveg";

  nonVegBtn.classList.add("active");

  vegBtn.classList.remove("active");

  /* SHOW ALL CATEGORIES */

  categoryButtons.forEach((button) => {

    button.style.display = "block";

  });

  displayItems();

});

/* =========================
   CART SYSTEM
========================= */

const cartCount =
  document.querySelector(".cart-count");


function updateCartCount(){

  const cart =
  JSON.parse(
    localStorage.getItem(
      "fryzaaCart"
    )
  ) || [];

  let total = 0;

  cart.forEach(item=>{

    total += item.quantity;

  });

  cartCount.innerText = total;

}


function addCartFunction() {

  const addButtons =
    document.querySelectorAll(".add-cart-btn");

  addButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const card =
      button.closest(".menu-card");

      const itemName =
      card.querySelector("h3").innerText;

      const itemImage =
      card.querySelector("img").src;

      let itemPrice;
      let itemSize = "";

      const sizeSelect =
      card.querySelector(".size-select");

      if(sizeSelect){

        itemPrice =
        parseInt(sizeSelect.value);

        itemSize =
        sizeSelect.options[
          sizeSelect.selectedIndex
        ].text;

      }else{

        const itemPriceText =
        card.querySelector(".menu-price")
        .innerText;

        itemPrice =
        parseInt(
          itemPriceText.replace(/[^\d]/g,"")
        );

      }

      let cart =
      JSON.parse(
        localStorage.getItem("fryzaaCart")
      ) || [];

      const existingItem =
      cart.find(item =>

        item.name === itemName &&

        item.size === itemSize

      );

      if(existingItem){

        existingItem.quantity++;

      }else{

        cart.push({

          name:itemName,

          size:itemSize,

          price:itemPrice,

          image:itemImage,

          quantity:1

        });

      }

      localStorage.setItem(
        "fryzaaCart",
        JSON.stringify(cart)
      );

      updateCartCount();

      button.innerText =
      "Added";

      button.style.background =
      "#00b894";

      button.style.color =
      "#ffffff";

      setTimeout(() => {

        button.innerText =
        "Add to Cart";

        button.style.background =
        "";

        button.style.color =
        "";

      }, 1200);

    });

  });

}

console.log(
  "FRYZAA MENU READY 🚀"
);
updateCartCount();

/* =========================
   USER SESSION
========================= */

const loginBtn =
document.getElementById(
"loginBtn"
);

const logoutBtn =
document.getElementById(
"logoutBtn"
);

const userData = JSON.parse(

localStorage.getItem(
"fryzaaUser"
)

);


if(userData){

  loginBtn.innerHTML =

  `<i class="fa-solid fa-user"></i>
   ${userData.name}`;

  loginBtn.href = "#";


  loginBtn.addEventListener(

    "click",

    (e)=>{

      e.preventDefault();


      document
      .querySelector(
      ".user-menu"
      )
      .classList
      .toggle(
      "active"
      );

    }

  );

}


/* LOGOUT */

if(logoutBtn){

  logoutBtn.addEventListener(

    "click",

    ()=>{

      localStorage.removeItem(
        "fryzaaUser"
      );

      localStorage.removeItem(
        "fryzaaLoggedIn"
      );

      localStorage.removeItem(
        "fryzaaUserId"
      );


      location.reload();

    }

  );

}

