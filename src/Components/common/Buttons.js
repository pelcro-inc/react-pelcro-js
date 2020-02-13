import localisation from "../../utils/localisation";

const locale = localisation("buttons").getLocaleData();

export const init = app => {
  // if there are Login and Subscribe buttons on the page, we add event listeners which open modal windows
  const loginButton = document.getElementById("login-button");

  if (loginButton) {
    loginButton.addEventListener("click", app.displayLoginView);
  }

  const registerButton = document.getElementById("register-button");

  if (registerButton) {
    registerButton.addEventListener("click", app.displayRegisterView);
  }

  const cartButton = document.getElementById("cart-button");

  if (cartButton) {
    cartButton.addEventListener("click", app.displayCartView);
  }

  const subscribeButton = document.getElementById("subscribe-button");

  if (subscribeButton) {
    subscribeButton.addEventListener("click", app.displaySelectView);
  }

  const loginButtonsByClass = document.getElementsByClassName("login-button");

  if (loginButtonsByClass.length !== 0) {
    for (let i = 0; i < loginButtonsByClass.length; i++) {
      loginButtonsByClass[i].addEventListener("click", app.displayLoginView);
    }
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

  const subscribeButtonsByClass = document.getElementsByClassName(
    "subscribe-button"
  );

  if (subscribeButtonsByClass.length !== 0) {
    for (let j = 0; j < subscribeButtonsByClass.length; j++) {
      if (
        subscribeButtonsByClass[j].dataset &&
        "productId" in subscribeButtonsByClass[j].dataset &&
        "planId" in subscribeButtonsByClass[j].dataset
      ) {
        subscribeButtonsByClass[j].addEventListener(
          "click",
          app.setProductAndPlanByButton
        );
      } else if (
        subscribeButtonsByClass[j].dataset &&
        "productId" in subscribeButtonsByClass[j].dataset
      ) {
        subscribeButtonsByClass[j].addEventListener("click", app.setProduct);
      } else {
        subscribeButtonsByClass[j].addEventListener(
          "click",
          app.displaySelectView
        );
      }
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
  const loginById = document.getElementById("login-button");

  if (loginById) {
    loginById.innerHTML = locale.account;
  }

  const loginByClass = document.getElementsByClassName("login-button");

  if (loginByClass) {
    for (let i = 0; i < loginByClass.length; i++) {
      loginByClass.item(i).innerHTML = locale.account;
    }
  }

  const pelcroLoginByClass = document.getElementsByClassName(
    "pelcro-login-button"
  );

  if (loginByClass) {
    for (let i = 0; i < pelcroLoginByClass.length; i++) {
      pelcroLoginByClass.item(i).innerHTML = locale.account;
    }
  }
};

export const unauthenticatedButtons = id => {
  const loginById = document.getElementById("login-button");

  if (loginById) {
    loginById.innerHTML = locale.login;
  }

  const loginByClass = document.getElementsByClassName("login-button");

  if (loginByClass) {
    for (let i = 0; i < loginByClass.length; i++) {
      loginByClass.item(i).innerHTML = locale.login;
    }
  }

  const pelcroLoginByClass = document.getElementsByClassName(
    "pelcro-login-button"
  );

  if (pelcroLoginByClass) {
    for (let i = 0; i < pelcroLoginByClass.length; i++) {
      pelcroLoginByClass.item(i).innerHTML = locale.login;
    }
  }
};
