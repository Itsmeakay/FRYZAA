import {

signInWithEmailAndPassword

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
getDoc

}

from

"https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

/* =========================
   LOGIN FORM
========================= */

const loginForm =

document.getElementById(
"loginForm"
);

loginForm.addEventListener(

"submit",

handleLogin

);

/* =========================
   LOGIN
========================= */

async function handleLogin(e){

  e.preventDefault();

  const email =

  document.getElementById(
  "loginEmail"
  ).value.trim();

  const password =

  document.getElementById(
  "loginPassword"
  ).value;

  if(

    !email ||
    !password

  ){

    alert(
    "Please fill all fields."
    );

    return;

  }

  try{

    const userCredential =

    await signInWithEmailAndPassword(

      auth,
      email,
      password

    );

    const user =

    userCredential.user;

    const userDoc =

await getDoc(

doc(
db,
"users",
user.uid
)

);

if(
userDoc.exists()
){

  localStorage.setItem(

    "fryzaaUser",

    JSON.stringify(

      userDoc.data()

    )

  );

}

    localStorage.setItem(

      "fryzaaLoggedIn",

      "true"

    );

    localStorage.setItem(

      "fryzaaUserId",

      user.uid

    );
   

    alert(
    "Login Successful ✅"
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
    "Invalid Email or Password"
    );

  }

}
const toggleLoginPassword =

document.getElementById(
"toggleLoginPassword"
);

const loginPassword =

document.getElementById(
"loginPassword"
);

toggleLoginPassword.addEventListener(

"click",

()=>{

  loginPassword.type =

  loginPassword.type ===
  "password"

  ?

  "text"

  :

  "password";

}
);