
import { db } from "../auth/firebase-config.js";

import {
  doc,
  getDoc
}
from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

//    HAMBURGER MENU
const hamburger = document.querySelector(".hamburger");

const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {

  navLinks.classList.toggle("active");

  hamburger.classList.toggle("open");

});

//CLOSE MENU ON LINK CLICK

const navItems = document.querySelectorAll(".nav-links a");

navItems.forEach((item) => {

  item.addEventListener("click", () => {

    navLinks.classList.remove("active");

    hamburger.classList.remove("open");

  });

});
//HAMBURGER ANIMATION
hamburger.addEventListener("click", () => {

  const spans = hamburger.querySelectorAll("span");

  spans[0].classList.toggle("top");

  spans[1].classList.toggle("middle");

  spans[2].classList.toggle("bottom");

});
//NAVBAR SCROLL EFFECT
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

  if (window.scrollY > 50) {

    navbar.style.background = "rgba(0,0,0,0.9)";

    navbar.style.backdropFilter = "blur(15px)";

    navbar.style.boxShadow =
      "0 5px 25px rgba(0,0,0,0.4)";

  }

  else {

    navbar.style.background =
      "rgba(0,0,0,0.45)";

    navbar.style.backdropFilter =
      "blur(12px)";

    navbar.style.boxShadow = "none";

  }

});
// HERO BUTTON ANIMATION
const heroButtons =
  document.querySelectorAll(
    ".hero-order-btn, .hero-menu-btn"
  );

heroButtons.forEach((button) => {

  button.addEventListener("mouseenter", () => {

    button.style.transform =
      "translateY(-5px) scale(1.03)";

  });

  button.addEventListener("mouseleave", () => {

    button.style.transform =
      "translateY(0) scale(1)";

  });

});
//SCROLL DOWN BUTTON
const scrollDown =
  document.querySelector(".scroll-down");

scrollDown.addEventListener("click", () => {

  window.scrollTo({

    top: window.innerHeight,

    behavior: "smooth"

  });

});

//ACTIVE NAV LINK
const sections =
  document.querySelectorAll("section");

window.addEventListener("scroll", () => {

  let current = "";

  sections.forEach((section) => {

    const sectionTop =
      section.offsetTop - 200;

    if (scrollY >= sectionTop) {

      current = section.getAttribute("class");

    }

  });

});
//PRELOADER READY
window.addEventListener("load", () => {

  document.body.classList.add("loaded");

});
//CONSOLE MESSAGE
console.log(

  "%cFRYZAA WEBSITE LOADED SUCCESSFULLY 🚀",

  "color: #ffb800; font-size:16px; font-weight:bold;"

);
/* =========================
   USER SESSION
========================= */

const loginBtn =
document.getElementById(
"loginBtn"
);

const userDropdown =
document.getElementById(
"userDropdown"
);

const logoutBtn =
document.getElementById(
"logoutBtn"
);

const userData =

JSON.parse(

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

async function checkStoreStatus(){

  const storeDoc = await getDoc(
    doc(db,"settings","store")
  );

  if(!storeDoc.exists()){
    return;
  }

  const data = storeDoc.data();

  const banner =
  document.getElementById(
    "storeClosedBanner"
  );

  console.log(
    "Store Data:",
    data.isOpen
  );

  banner.style.display =
    data.isOpen
    ? "none"
    : "block";

}

checkStoreStatus();

/* =========================
   HOME BURGERS ADD TO CART
========================= */

const addCartButtons =
document.querySelectorAll(".add-cart-btn");

addCartButtons.forEach((button)=>{

  button.addEventListener("click", ()=>{

    const item = {

      name: button.dataset.name,

      price: Number(button.dataset.price),

      image: button.dataset.image,

      quantity: 1

    };


    let cart = JSON.parse(
      localStorage.getItem("fryzaaCart")
    ) || [];


    const existingItem = cart.find(
      product => product.name === item.name
    );


    if(existingItem){

      existingItem.quantity += 1;

    }

    else{

      cart.push(item);

    }


    localStorage.setItem(
      "fryzaaCart",
      JSON.stringify(cart)
    );


    updateCartCount();


    alert(
      `${item.name} added to cart 🍔`
    );

  });

});


/* CART COUNT UPDATE */

function updateCartCount(){

  const cart = JSON.parse(
    localStorage.getItem("fryzaaCart")
  ) || [];


  let totalItems = 0;


  cart.forEach(item=>{

    totalItems += item.quantity;

  });


  const count =
  document.querySelector(".cart-count");


  if(count){

    count.innerText = totalItems;

  }

}


/* PAGE LOAD PAR COUNT SET */

updateCartCount();
