import { saveToMetadataButton } from "./saveToMetadata";

export const init = (app) => {
  saveToMetadataButton.init(app);
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
          const skuId = Number(e.target.dataset.skuId);
          // initialize with current product listing
          const allProducts =
            window.Pelcro.ecommerce.products
              .read()
              .flatMap((prod) => prod.skus.map((sku) => sku))
              // reset the cart quantities, button's associated item should be the only item in cart
              .map((sku) => {
                sku.quantity = 0;
                return sku;
              }) ?? [];

          const productIndex = allProducts.findIndex(
            (prod) => prod.id === skuId
          );

          if (productIndex === -1) {
            return;
          }

          // set quantity of the product to 1 as it's a direct purchase button
          allProducts[productIndex] = {
            ...allProducts[productIndex],
            quantity: 1
          };

          app.setProductsForCart(allProducts);
          app.setOrder([
            {
              sku_id: skuId,
              quantity: 1
            }
          ]);

          if (window.Pelcro.user.isAuthenticated()) {
            app.setView("address");
          } else {
            app.setView("login");
          }
        }
      );
    }
  }
};

export const authenticatedButtons = (id) => {
  saveToMetadataButton.authenticated();
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
  saveToMetadataButton.unauthenticated();

  const pelcroLoginByClass = document.getElementsByClassName(
    "pelcro-login-button"
  );

  if (pelcroLoginByClass) {
    for (let i = 0; i < pelcroLoginByClass.length; i++) {
      pelcroLoginByClass.item(i).innerHTML = "Login";
    }
  }
};
