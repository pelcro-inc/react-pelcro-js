import { selectProduct } from "../Shop/ShopSelectProductButton";

export const init = (app) => {
  const pelcroLoginButtonsByClass = document.getElementsByClassName(
    "pelcro-login-button"
  );

  if (pelcroLoginButtonsByClass.length !== 0) {
    for (let i = 0; i < pelcroLoginButtonsByClass.length; i++) {
      pelcroLoginButtonsByClass[i].addEventListener(
        "click",
        app.displayLoginView
      );
    }
  }

  const pelcroRegisterButton = document.getElementById(
    "pelcro-register-button"
  );

  if (pelcroRegisterButton) {
    pelcroRegisterButton.addEventListener(
      "click",
      app.displayRegisterView
    );
  }

  const pelcroCartButtonsByClass = document.getElementsByClassName(
    "pelcro-cart-button"
  );

  if (pelcroCartButtonsByClass.length !== 0) {
    for (let i = 0; i < pelcroCartButtonsByClass.length; i++) {
      pelcroCartButtonsByClass[i].addEventListener(
        "click",
        app.displayCartView
      );
    }
  }

  const cartButton = document.getElementById("pelcro-cart-button");

  if (cartButton) {
    cartButton.addEventListener("click", app.displayCartView);
  }

  const pelcroSubscribeButtonsByClass = document.getElementsByClassName(
    "pelcro-subscribe-button"
  );

  if (pelcroSubscribeButtonsByClass.length !== 0) {
    for (let j = 0; j < pelcroSubscribeButtonsByClass.length; j++) {
      if (
        pelcroSubscribeButtonsByClass[j].dataset &&
        "productId" in pelcroSubscribeButtonsByClass[j].dataset &&
        "planId" in pelcroSubscribeButtonsByClass[j].dataset
      ) {
        pelcroSubscribeButtonsByClass[j].addEventListener(
          "click",
          app.setProductAndPlanByButton
        );
      } else if (
        pelcroSubscribeButtonsByClass[j].dataset &&
        "productId" in pelcroSubscribeButtonsByClass[j].dataset
      ) {
        pelcroSubscribeButtonsByClass[j].addEventListener(
          "click",
          app.setProduct
        );
      } else {
        pelcroSubscribeButtonsByClass[j].addEventListener(
          "click",
          app.displaySelectView
        );
      }
    }
  }

  const pelcroSaveButtonsByClass = document.getElementsByClassName(
    "pelcro-save-button"
  );

  const saveToMetadataByButton = (e) => {
    const key = e.currentTarget.dataset.key;
    const value = JSON.parse(JSON.stringify(e.currentTarget.dataset));
    delete value.key;
    let newVal = "";
    const pelcroUser = window.Pelcro.user.read();
    if (
      pelcroUser.metadata &&
      pelcroUser.metadata[`metadata_${key}`]
    ) {
      const oldValue = pelcroUser.metadata[`metadata_${key}`];
      if (typeof oldValue === "object" && oldValue.length) {
        newVal = [...oldValue, value];
      } else {
        newVal = [oldValue, value];
      }
    } else {
      newVal = [value];
    }

    window.Pelcro.user.saveToMetaData(
      {
        key,
        value: newVal,
        auth_token: window.Pelcro.user.read().auth_token
      },
      (err, resp) => {
        console.log(
          "window.Pelcro.user.saveToMetaData -> resp",
          resp
        );
      }
    );
  };

  if (pelcroSaveButtonsByClass.length !== 0) {
    for (let j = 0; j < pelcroSaveButtonsByClass.length; j++) {
      if (
        pelcroSaveButtonsByClass[j].dataset &&
        "key" in pelcroSaveButtonsByClass[j].dataset
      ) {
        pelcroSaveButtonsByClass[j].addEventListener(
          "click",
          saveToMetadataByButton
        );
      }
    }
  }

  const pelcroRegisterButtonsByClass = document.getElementsByClassName(
    "pelcro-register-button"
  );

  if (pelcroRegisterButtonsByClass.length !== 0) {
    for (let j = 0; j < pelcroRegisterButtonsByClass.length; j++) {
      pelcroRegisterButtonsByClass[j].addEventListener(
        "click",
        app.displayRegisterView
      );
    }
  }

  const giftButtonsByClass = document.getElementsByClassName(
    "pelcro-gift-button"
  );

  if (giftButtonsByClass.length !== 0) {
    for (let j = 0; j < giftButtonsByClass.length; j++) {
      giftButtonsByClass[j].addEventListener("click", app.setGift);
    }
  }

  if (window.Pelcro.ecommerce?.products?.read()?.length) {
    const pelcroAddToCartButtonsByClass = document.getElementsByClassName(
      "pelcro-add-to-cart-button"
    );

    if (pelcroAddToCartButtonsByClass.length !== 0) {
      for (let i = 0; i < pelcroAddToCartButtonsByClass.length; i++) {
        pelcroAddToCartButtonsByClass[i].addEventListener(
          "click",
          (e) => {
            window.Pelcro.cartProducts =
              window.Pelcro?.cartProducts || [];
            window.Pelcro.cartProducts.push(e.target.dataset.skuId);
          }
        );
      }
    }
  } else {
    document.addEventListener(
      "PelcroEcommerceProductsLoaded",
      function (e) {
        setTimeout(() => {
          const pelcroAddToCartButtonsByClass = document.getElementsByClassName(
            "pelcro-add-to-cart-button"
          );

          if (pelcroAddToCartButtonsByClass.length !== 0) {
            for (
              let i = 0;
              i < pelcroAddToCartButtonsByClass.length;
              i++
            ) {
              pelcroAddToCartButtonsByClass[i].addEventListener(
                "click",
                (e) => {
                  window.Pelcro.cartProducts =
                    window.Pelcro?.cartProducts || [];
                  window.Pelcro.cartProducts.push(
                    e.target.dataset.skuId
                  );
                }
              );
            }
          }
        }, 500);
      }
    );
  }

  const pelcroPurchaseButtonsByClass = document.getElementsByClassName(
    "pelcro-purchase-button"
  );

  if (pelcroPurchaseButtonsByClass.length !== 0) {
    for (let i = 0; i < pelcroPurchaseButtonsByClass.length; i++) {
      pelcroPurchaseButtonsByClass[i].addEventListener(
        "click",
        (e) => {
          app.setOrder([
            {
              sku_id: e.target.dataset.skuId,
              quantity: "1"
            }
          ]);
          app.setView("orderCreate");
        }
      );
    }
  }
};

export const authenticatedButtons = (id) => {
  const pelcroLoginByClass = document.getElementsByClassName(
    "pelcro-login-button"
  );

  if (pelcroLoginByClass) {
    for (let i = 0; i < pelcroLoginByClass.length; i++) {
      pelcroLoginByClass.item(i).innerHTML = "My account";
    }
  }
};

export const unauthenticatedButtons = (id) => {
  const pelcroLoginByClass = document.getElementsByClassName(
    "pelcro-login-button"
  );

  if (pelcroLoginByClass) {
    for (let i = 0; i < pelcroLoginByClass.length; i++) {
      pelcroLoginByClass.item(i).innerHTML = "Login";
    }
  }
};
