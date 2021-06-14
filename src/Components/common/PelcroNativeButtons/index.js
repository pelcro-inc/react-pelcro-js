import { saveToMetadataButton } from "./saveToMetadata";
import i18n from "../../../i18n";
import { usePelcro } from "../../../hooks/usePelcro";

const translations = i18n.t("common:buttons", {
  returnObjects: true
});

export const init = () => {
  saveToMetadataButton.init();

  const {
    switchView,
    set,
    isAuthenticated,
    switchToAddressView,
    switchToPaymentView,
    whenEcommerceLoaded,
    addToCart,
    purchaseItem
  } = usePelcro.getStore();

  const pelcroLoginButtonsByClass = document.getElementsByClassName(
    "pelcro-login-button"
  );

  if (pelcroLoginButtonsByClass.length !== 0) {
    for (let i = 0; i < pelcroLoginButtonsByClass.length; i++) {
      pelcroLoginButtonsByClass[i].addEventListener("click", () => {
        if (isAuthenticated()) {
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

  const pelcroRegisterButtonsByClass =
    document.getElementsByClassName("pelcro-register-button");

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

  const pelcroSubscribeButtonsByClass =
    document.getElementsByClassName("pelcro-subscribe-button");

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

            if (!selectedProduct || !selectedPlan) {
              return switchView("plan-select");
            }

            if (!isAuthenticated()) {
              return switchView("register");
            }

            if (isGift) {
              return switchView("gift-create");
            }

            const requiresAddress = Boolean(
              selectedProduct.address_required
            );

            if (!requiresAddress) {
              return switchToPaymentView();
            }

            return switchToAddressView();
          }
        );
      } else {
        pelcroSubscribeButtonsByClass[j].addEventListener(
          "click",
          () => switchView("plan-select")
        );
      }
    }
  }

  const pelcroOfflineSubButtonsByClass =
    document.getElementsByClassName(
      "pelcro-offline-subscribe-button"
    );

  if (pelcroOfflineSubButtonsByClass.length !== 0) {
    for (let j = 0; j < pelcroOfflineSubButtonsByClass.length; j++) {
      if (
        pelcroOfflineSubButtonsByClass[j].dataset &&
        "productId" in pelcroOfflineSubButtonsByClass[j].dataset &&
        "planId" in pelcroOfflineSubButtonsByClass[j].dataset
      ) {
        pelcroOfflineSubButtonsByClass[j].addEventListener(
          "click",
          (e) => {
            set({
              product: {
                id: e.target.dataset.productId
              },
              plan: {
                product_id: e.target.dataset.productId,
                id: e.target.dataset.planId
              }
            });

            window.Pelcro.plan.getPlan(
              {
                plan_id: e.target.dataset.planId
              },
              (error, response) => {
                if (error) {
                  return;
                }

                const { plan } = response.data;

                set({
                  plan,
                  product: plan?.product
                });

                if (!isAuthenticated()) {
                  return switchView("register");
                }

                const requiresAddress = Boolean(
                  plan.address_required
                );

                if (!requiresAddress) {
                  return switchToPaymentView();
                }

                return switchToAddressView();
              }
            );
          }
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

        switchView("plan-select");
      });
    }
  }

  whenEcommerceLoaded(() => {
    const pelcroAddToCartButtonsByClass =
      document.getElementsByClassName("pelcro-add-to-cart-button");

    if (pelcroAddToCartButtonsByClass.length !== 0) {
      for (let i = 0; i < pelcroAddToCartButtonsByClass.length; i++) {
        pelcroAddToCartButtonsByClass[i].addEventListener(
          "click",
          (e) => {
            addToCart(Number(e.target.dataset.skuId));
          }
        );
      }
    }
  });

  const pelcroPurchaseButtonsByClass =
    document.getElementsByClassName("pelcro-purchase-button");

  if (pelcroPurchaseButtonsByClass.length !== 0) {
    for (let i = 0; i < pelcroPurchaseButtonsByClass.length; i++) {
      pelcroPurchaseButtonsByClass[i].addEventListener(
        "click",
        (e) => {
          const skuId = Number(e.target.dataset.skuId);

          const allProducts =
            window.Pelcro.ecommerce.products.getSkus();

          const product = allProducts.find(
            (prod) => prod.id === skuId
          );

          if (!product) {
            return;
          }

          purchaseItem(skuId);

          if (isAuthenticated()) {
            switchToAddressView();
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
