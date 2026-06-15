import {

createUserWithEmailAndPassword

}

from

"https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {

auth,
db

}

from

"./firebase-config.js";

import {
doc,
setDoc
}
from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";



/* =========================
   SIGNUP FORM
========================= */

const signupForm =

document.getElementById(
"signupForm"
);

signupForm.addEventListener(

"submit",

handleSignup

);

/* =========================
   SIGNUP
========================= */

async function handleSignup(e){

  e.preventDefault();

  const name =

  document.getElementById(
  "signupName"
  ).value.trim();

  const phone =

  document.getElementById(
  "signupPhone"
  ).value.trim();

  const email =

  document.getElementById(
  "signupEmail"
  ).value.trim();

  const password =

  document.getElementById(
  "signupPassword"
  ).value;

  const confirmPassword =

  document.getElementById(
  "confirmPassword"
  ).value;

  if(

    !name ||
    !phone ||
    !email ||
    !password ||
    !confirmPassword

  ){

    alert(
    "Please fill all fields."
    );

    return;

  }

  if(password !== confirmPassword){

    alert(
    "Passwords do not match."
    );

    return;

  }

  try{

    const userCredential =

    await createUserWithEmailAndPassword(

      auth,
      email,
      password

    );

    const user =

    userCredential.user;

    await setDoc(

doc(
db,
"users",
user.uid
),

{

  uid:user.uid,

  name:name,

  phone:phone,

  email:email,

  createdAt:

  new Date()
  .toISOString()

}

);

    localStorage.setItem(

      "fryzaaUser",

      JSON.stringify({

        uid:user.uid,

        name:name,

        email:email,

        phone:phone

      })

    );

    alert(
    "Account Created Successfully ✅"
    );

    if(
user.email ===
"adminfryzaa@gmail.com"
){

  window.location.href =
  "../admin/admin.html";

}

else{

  window.location.href =
  "../Home/index.html";

}

  }

  catch(error){

    alert(
    error.message
    );

  }

}
const signupPassword =

document.getElementById(
"signupPassword"
);

const confirmPasswordInput =

document.getElementById(
"confirmPassword"
);

document.getElementById(
"toggleSignupPassword"
).addEventListener(

"click",

()=>{

  signupPassword.type =

  signupPassword.type ===
  "password"

  ?

  "text"

  :

  "password";

}
);

document.getElementById(
"toggleConfirmPassword"
).addEventListener(

"click",

()=>{

  confirmPasswordInput.type =

  confirmPasswordInput.type ===
  "password"

  ?

  "text"

  :

  "password";

}
);