import { saveToMetadataButton } from "./saveToMetadata";
import { userHasAddress } from "../../../utils/utils";
import i18n from "../../../i18n";
import { usePelcro } from "../../../hooks/usePelcro";

const translations = i18n.t("common:buttons", {
  returnObjects: true
});

export const init = () => {
  saveToMetadataButton.init();

  const { switchView, set } = usePelcro.getState();

  const pelcroLoginButtonsByClass = document.getElementsByClassName(
    "pelcro-login-button"
  );

  if (pelcroLoginButtonsByClass.length !== 0) {
    for (let i = 0; i < pelcroLoginButtonsByClass.length; i++) {
      pelcroLoginButtonsByClass[i].addEventListener("click", () => {
        if (usePelcro.getState().isAuthenticated) {
          switchView("dashboard");
        } else {
          switchView("login");
        }
      });
    }
  }

  const pelcroRegisterButton = document.getElementById(
    "pelcro-register-button"
  );

  if (pelcroRegisterButton) {
    pelcroRegisterButton.addEventListener("click", () =>
      switchView("register")
    );
  }

  const pelcroRegisterButtonsByClass = document.getElementsByClassName(
    "pelcro-register-button"
  );

  if (pelcroRegisterButtonsByClass.length !== 0) {
    for (let j = 0; j < pelcroRegisterButtonsByClass.length; j++) {
      pelcroRegisterButtonsByClass[j].addEventListener("click", () =>
        switchView("register")
      );
    }
  }
  const pelcroCartButtonsByClass = document.getElementsByClassName(
    "pelcro-cart-button"
  );

  if (pelcroCartButtonsByClass.length !== 0) {
    for (let i = 0; i < pelcroCartButtonsByClass.length; i++) {
      pelcroCartButtonsByClass[i].addEventListener("click", () =>
        switchView("cart")
      );
    }
  }

  const cartButton = document.getElementById("pelcro-cart-button");

  if (cartButton) {
    cartButton.addEventListener("click", () => switchView("cart"));
  }

  const pelcroSubscribeButtonsByClass = document.getElementsByClassName(
    "pelcro-subscribe-button"
  );

  if (pelcroSubscribeButtonsByClass.length !== 0) {
    for (let j = 0; j < pelcroSubscribeButtonsByClass.length; j++) {
      if (
        pelcroSubscribeButtonsByClass[j].dataset &&
        "productId" in pelcroSubscribeButtonsByClass[j].dataset
      ) {
        pelcroSubscribeButtonsByClass[j].addEventListener(
          "click",
          (e) => {
            const productsList = window.Pelcro.product.list();
            if (!productsList?.length) return;

            const [productId, planId, isGift] = [
              e.target.dataset.productId,
              e.target.dataset.planId,
              e.target.dataset.isGift
            ];

            const selectedProduct = productsList.find(
              (product) => product.id === Number(productId)
            );

            const selectedPlan = selectedProduct?.plans?.find(
              (plan) => plan.id === Number(planId)
            );

            set({
              product: selectedProduct,
              plan: selectedPlan,
              isGift: Boolean(isGift)
            });

            switchView("select");
          }
        );
      } else {
        pelcroSubscribeButtonsByClass[j].addEventListener(
          "click",
          () => switchView("select")
        );
      }
    }
  }

  const giftButtonsByClass = document.getElementsByClassName(
    "pelcro-gift-button"
  );

  if (giftButtonsByClass.length !== 0) {
    for (let j = 0; j < giftButtonsByClass.length; j++) {
      giftButtonsByClass[j].addEventListener("click", (e) => {
        if (e.target.dataset.isGift === "true") {
          set({ isGift: true });
        }

        switchView("select");
      });
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

          set({ products: allProducts });
          set({ order: { items: [{ sku_id: skuId, quantity: 1 }] } });

          if (window.Pelcro.user.isAuthenticated()) {
            if (userHasAddress()) {
              switchView("address-select");
            } else {
              switchView("address");
            }
          } else {
            switchView("register");
          }
        }
      );
    }
  }
};

export const authenticatedButtons = () => {
  saveToMetadataButton.authenticated();

  const pelcroLoginByClass = document.getElementsByClassName(
    "pelcro-login-button"
  );

  if (pelcroLoginByClass) {
    for (let i = 0; i < pelcroLoginByClass.length; i++) {
      pelcroLoginByClass.item(i).innerHTML = translations.account;
    }
  }

  const removeHTMLButton = (buttonClass) => {
    const elements = document.getElementsByClassName(buttonClass);
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  };

  removeHTMLButton("pelcro-register-button");
};

export const unauthenticatedButtons = () => {
  saveToMetadataButton.unauthenticated();

  const pelcroLoginByClass = document.getElementsByClassName(
    "pelcro-login-button"
  );

  if (pelcroLoginByClass) {
    for (let i = 0; i < pelcroLoginByClass.length; i++) {
      pelcroLoginByClass.item(i).innerHTML = translations.login;
    }
  }
};
