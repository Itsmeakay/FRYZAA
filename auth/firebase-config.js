import { initializeApp }

from

"https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {

getAuth

}

from

"https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {

getFirestore

}

from

"https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig = {

  apiKey:
  "AIzaSyBXx_wK6yHuA7NjXNgjctTe1Q9Q5XJiOf0",

  authDomain:
  "fryzaa-28ccb.firebaseapp.com",

  projectId:
  "fryzaa-28ccb",

  storageBucket:
  "fryzaa-28ccb.firebasestorage.app",

  messagingSenderId:
  "759849885574",

  appId:
  "1:759849885574:web:50bf3d8c6eae0d4c961607"

};

const app =
initializeApp(firebaseConfig);

export const auth =
getAuth(app);

export const db =
getFirestore(app);