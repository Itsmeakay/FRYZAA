import {
  collection,
  addDoc
}
from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
  db
}
from
"../auth/firebase-config.js";

import {
  menuItems
}
from
"../menu/menu-data.js";

const uploadBtn =
document.getElementById(
"uploadBtn"
);

uploadBtn.addEventListener(

  "click",

  async ()=>{

    try{

      uploadBtn.disabled =
      true;

      uploadBtn.innerText =
      "Uploading Products...";

      let uploaded = 0;

      for(const item of menuItems){

        let productPrice = 0;

        if(item.price){

          productPrice = parseInt(

            item.price.replace(
              /[^\d]/g,
              ""
            )

          );

        }

        await addDoc(

          collection(
            db,
            "products"
          ),

          {

            name:
            item.name,

            price:
            productPrice,

            category:
            item.category,

            type:
            item.type,

            image:
            item.image,

            tag:
            item.tag || "",

            rating:
            item.rating || "",

            description:
            item.description || "",

            sizes:
            item.sizes || [],

            stock:
            true,

            createdAt:
            new Date()
            .toISOString()

          }

        );

        uploaded++;

      }

      alert(
        `✅ ${uploaded} Products Uploaded Successfully`
      );

      uploadBtn.innerText =
      "Upload Complete";

    }

    catch(error){

      console.error(error);

      alert(
        "❌ Upload Failed"
      );

      uploadBtn.disabled =
      false;

      uploadBtn.innerText =
      "Upload All Products";

    }

  }

);