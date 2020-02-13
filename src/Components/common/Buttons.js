export const init = app => {
  const registerButton = document.getElementById("register-button");

  if (registerButton) {
    registerButton.addEventListener("click", app.displayRegisterView);
  }

  const cartButton = document.getElementById("cart-button");

  if (cartButton) {
    cartButton.addEventListener("click", app.displayCartView);
  }

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

  const registerButtonsByClass = document.getElementsByClassName(
    "register-button"
  );

  if (registerButtonsByClass.length !== 0) {
    for (let j = 0; j < registerButtonsByClass.length; j++) {
      registerButtonsByClass[j].addEventListener(
        "click",
        app.displayRegisterView
      );
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

  const productButtonsByClass = document.getElementsByClassName(
    "pelcro-product-button"
  );

  if (productButtonsByClass.length !== 0) {
    for (let j = 0; j < productButtonsByClass.length; j++) {
      productButtonsByClass[j].addEventListener("click", app.setProduct);
    }
  }

  const planButtonsByClass = document.getElementsByClassName(
    "pelcro-plan-button"
  );

  if (planButtonsByClass.length !== 0) {
    for (let j = 0; j < planButtonsByClass.length; j++) {
      planButtonsByClass[j].addEventListener(
        "click",
        app.setProductAndPlanByButton
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
      pelcroLoginByClass.item(i).innerHTML = "My account";
    }
  }
};

export const unauthenticatedButtons = id => {
  const pelcroLoginByClass = document.getElementsByClassName(
    "pelcro-login-button"
  );

  if (pelcroLoginByClass) {
    for (let i = 0; i < pelcroLoginByClass.length; i++) {
      pelcroLoginByClass.item(i).innerHTML = "Login";
    }
  }
};
