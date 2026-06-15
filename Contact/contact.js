/* =========================
   FRYZAA CONTACT PAGE JS
========================= */

/* =========================
   HAMBURGER MENU
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
   CLOSE MENU ON LINK CLICK
========================= */

document
.querySelectorAll(".nav-links a")
.forEach(link=>{

  link.addEventListener("click",()=>{

    hamburger.classList.remove("open");

    navLinks.classList.remove("active");

  });

});

/* =========================
   ACTIVE NAV LINK
========================= */

const currentPage =
window.location.pathname;

document
.querySelectorAll(".nav-links a")
.forEach(link=>{

  if(
    currentPage.includes(
      link.getAttribute("href")
    )
  ){

    link.classList.add("active");

  }

});

/* =========================
   CONTACT FORM
========================= */

const contactForm =
document.querySelector("form");

if(contactForm){

  contactForm.addEventListener("submit",(e)=>{

    e.preventDefault();

    const name =
    contactForm.querySelector(
      'input[type="text"]'
    ).value;

    const email =
    contactForm.querySelector(
      'input[type="email"]'
    ).value;

    const message =
    contactForm.querySelector(
      "textarea"
    ).value;

    if(
      name.trim() === "" ||
      email.trim() === "" ||
      message.trim() === ""
    ){

      alert(
        "Please fill all required fields."
      );

      return;

    }

    alert(
      "Thank You! Your message has been sent successfully."
    );

    contactForm.reset();

  });

}

/* =========================
   SOCIAL ICON HOVER EFFECT
========================= */

const socialIcons =
document.querySelectorAll(
  ".social-icons a"
);

socialIcons.forEach(icon=>{

  icon.addEventListener(
    "mouseenter",
    ()=>{

      icon.style.transform =
      "translateY(-6px) scale(1.05)";

    }
  );

  icon.addEventListener(
    "mouseleave",
    ()=>{

      icon.style.transform =
      "translateY(0) scale(1)";

    }
  );

});

/* =========================
   SCROLL ANIMATION
========================= */

const revealElements =
document.querySelectorAll(
  ".info-card,.form-container,.map-section,.social-section"
);

function revealOnScroll(){

  revealElements.forEach(el=>{

    const top =
    el.getBoundingClientRect().top;

    const windowHeight =
    window.innerHeight;

    if(top < windowHeight - 100){

      el.classList.add("show");

    }

  });

}

window.addEventListener(
  "scroll",
  revealOnScroll
);

revealOnScroll();

/* =========================
   CONSOLE MESSAGE
========================= */

console.log(
  "FRYZAA CONTACT PAGE READY 🚀"
);