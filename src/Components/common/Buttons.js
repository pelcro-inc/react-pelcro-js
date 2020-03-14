import localisation from "../../services/localisation";

const locale = localisation("buttons").getLocaleData();

export const init = app => {
  // if there are Login and Subscribe buttons on the page, we add event listeners which open modal windows

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
};

export const authenticatedButtons = id => {
  const pelcroLoginByClass = document.getElementsByClassName(
    "pelcro-login-button"
  );

  if (pelcroLoginByClass) {
    for (let i = 0; i < pelcroLoginByClass.length; i++) {
      pelcroLoginByClass.item(i).innerHTML = locale.account;
    }
  }
};

export const unauthenticatedButtons = id => {
  const pelcroLoginByClass = document.getElementsByClassName(
    "pelcro-login-button"
  );

  if (pelcroLoginByClass) {
    for (let i = 0; i < pelcroLoginByClass.length; i++) {
      pelcroLoginByClass.item(i).innerHTML = locale.login;
    }
  }
};
