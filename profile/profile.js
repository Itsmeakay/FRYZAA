import {
doc,
getDoc,
updateDoc
}
from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
db
}
from
"../auth/firebase-config.js";

/* =========================
   ELEMENTS
========================= */

const profileName =

document.getElementById(
"profileName"
);

const profileEmail =

document.getElementById(
"profileEmail"
);

const profilePhone =

document.getElementById(
"profilePhone"
);

const saveProfileBtn =

document.getElementById(
"saveProfileBtn"
);

const selectedAvatarEl =

document.getElementById(
"selectedAvatar"
);

const avatarOptions =

document.querySelectorAll(
".avatar-option"
);

/* =========================
   USER
========================= */

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

/* =========================
   AVATAR
========================= */

let selectedAvatar =

"😎";

avatarOptions.forEach(
avatar => {

avatar.addEventListener(

"click",

()=>{

selectedAvatar =

avatar.innerText;

selectedAvatarEl.innerText =

selectedAvatar;

avatarOptions.forEach(
a =>

a.classList.remove(
"active"
)

);

avatar.classList.add(
"active"
);

}

);

}
);

/* =========================
   LOAD PROFILE
========================= */

loadProfile();

async function loadProfile(){

  try{

    const userRef =

    doc(
    db,
    "users",
    userData.uid
    );

    const userDoc =

    await getDoc(
    userRef
    );

    if(
    userDoc.exists()
    ){

      const data =

      userDoc.data();

      profileName.value =

      data.name || "";

      profileEmail.value =

      data.email || "";

      profilePhone.value =

      data.phone || "";

      if(
      data.avatar
      ){

        selectedAvatar =

        data.avatar;

        selectedAvatarEl.innerText =

        data.avatar;

      }

    }

  }

  catch(error){

    console.error(error);

  }

}

/* =========================
   SAVE PROFILE
========================= */

saveProfileBtn.addEventListener(

"click",

async ()=>{

  try{

    await updateDoc(

      doc(
      db,
      "users",
      userData.uid
      ),

      {

        name:

        profileName.value,

        phone:

        profilePhone.value,

        avatar:

        selectedAvatar

      }

    );

    const updatedUser = {

      ...userData,

      name:

      profileName.value,

      phone:

      profilePhone.value,

      avatar:

      selectedAvatar

    };

    localStorage.setItem(

      "fryzaaUser",

      JSON.stringify(
      updatedUser
      )

    );

    alert(

      "✅ Profile Updated"

    );

  }

  catch(error){

    console.error(error);

    alert(

      "❌ Failed To Update Profile"

    );

  }

}
);