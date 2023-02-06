import React from "react";
import ReactDOM from "react-dom";
import ReactGA from "react-ga";
import { usePelcro } from "../../hooks/usePelcro";
import {
  getStableViewID,
  isValidViewFromURL
} from "../../utils/utils";
import { init as initContentEntitlement } from "../common/contentEntitlement";
import { loadStripe } from "@stripe/stripe-js/pure";
import { notify } from "../../SubComponents/Notification";
import { getErrorMessages } from "../common/Helpers";
import i18n from "../../i18n";

/**
 * @typedef {Object} OptionsType
 * @property {boolean} loadPaymentSDKs
 * @property {boolean} enableURLTriggers
 * @property {boolean} enableTheme
 * @property {boolean} enablePaywalls
 * @property {boolean} enableGoogleAnalytics
 */

/**
 * Initializes pelcro features based on the options flag object
 * @param {OptionsType} options
 * @returns
 */
export const optionsController = (options) => {
  if (!options) {
    return;
  }

  const optionsMethodsDict = {
    loadPaymentSDKs: loadPaymentSDKs,
    loadAuth0SDK: loadAuth0SDK,
    enableURLTriggers: initViewFromURL,
    enableTheme: applyPelcroTheme,
    enablePaywalls: initPaywalls,
    loadSecuritySDK: initSecuritySdk,
    enableGoogleAnalytics: initGATracking
  };

  // Only execute enabled options
  Object.entries(options)
    .filter(([_, value]) => value === true)
    .forEach(([key]) => optionsMethodsDict[key]?.());
};

export const initPaywalls = () => {
  const paywallMethods = window.Pelcro.paywall;
  const viewFromURL = getStableViewID(
    window.Pelcro.helpers.getURLParameter("view")
  );

  if (window.Pelcro.site.read()?.settings === "subscription") {
    // blur entitlements based content
    const didBlurContent = initContentEntitlement();

    // Skip paywall if article is not restricted
    if (
      isValidViewFromURL(viewFromURL) ||
      !paywallMethods.isArticleRestricted()
    ) {
      return;
    }

    const { switchView } = usePelcro.getStore();

    if (paywallMethods?.displayMeterPaywall()) {
      /* 
        showing both the meter and the entitlements notification doesn't make sense from
        a product prespective + they would take half the screen on mobile devies, so we're
        not showing the meter, and only showing the entitlements notification.
        */
      if (!didBlurContent) {
        switchView("meter");
      }
    } else if (paywallMethods?.displayNewsletterPaywall()) {
      switchView("newsletter");
    } else if (paywallMethods?.displayPaywall()) {
      switchView("plan-select");
    }
  }
};

export const loadPaymentSDKs = () => {
  // Lazy load stripe's SDK
  const { whenUserReady } = usePelcro.getStore();
  const supportsVantiv = Boolean(
    window.Pelcro.site.read().vantiv_gateway_settings
  );
  const supportsTap = Boolean(
    window.Pelcro.site.read().tap_gateway_settings
  );

  whenUserReady(() => {
    if (!window.Stripe && !supportsVantiv && !supportsTap) {
      loadStripe(window.Pelcro.environment.stripe);
    }
  });

  // Load PayPal SDKs
  const supportsPaypal = Boolean(
    window.Pelcro.site.read().braintree_tokenization
  );

  if (supportsPaypal) {
    window.Pelcro.helpers.loadSDK(
      "https://js.braintreegateway.com/web/3.69.0/js/client.min.js",
      "braintree-sdk"
    );

    window.Pelcro.helpers.loadSDK(
      "https://js.braintreegateway.com/web/3.69.0/js/paypal-checkout.min.js",
      "braintree-paypal-sdk"
    );
  }

  // Load Vantiv SDKs
  if (supportsVantiv) {
    if (!window.jQuery) {
      window.Pelcro.helpers.loadSDK(
        "https://code.jquery.com/jquery-3.6.0.slim.min.js",
        "vantiv-jquery-sdk"
      );
    }

    if (!window.EprotectIframeClient) {
      const PRELIVE_URL =
        "https://request.eprotect.vantivprelive.com/eProtect/js/eProtect-iframe-client.min.js";
      const PRODUCTION_URL =
        "https://request.eprotect.vantivcnp.com/eProtect/js/eProtect-iframe-client3.min.js";
      const scriptUrlToUse =
        window.Pelcro.site.read().vantiv_gateway_settings
          .environment === "production"
          ? PRODUCTION_URL
          : PRELIVE_URL;
      window.Pelcro.helpers.loadSDK(
        scriptUrlToUse,
        "vantiv-eprotect-sdk"
      );
    }
  }

  // Load Tap SDKs
  if (supportsTap) {
    window.Pelcro.helpers.loadSDK(
      "https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.4/bluebird.min.js",
      "tap-bluebird"
    );

    window.Pelcro.helpers.loadSDK(
      "https://secure.gosell.io/js/sdk/tap.min.js",
      "tap-sdk"
    );
  }
};

export const loadAuth0SDK = () => {
  const auth0Enabled = Boolean(
    window.Pelcro.site.read().auth0_client_id &&
      window.Pelcro.site.read().auth0_base_url
  );

  if (auth0Enabled) {
    window.Pelcro.helpers.loadSDK(
      "https://cdn.auth0.com/js/auth0/9.18/auth0.min.js",
      "auth0-sdk"
    );
  }
};

export const load = () => {
  const auth0Enabled = Boolean(
    window.Pelcro.site.read().auth0_client_id &&
      window.Pelcro.site.read().auth0_base_url
  );

  if (auth0Enabled) {
    window.Pelcro.helpers.loadSDK(
      "https://cdn.auth0.com/js/auth0/9.18/auth0.min.js",
      "auth0-sdk"
    );
  }
};

export const initSecuritySdk = () => {
  const { whenSiteReady } = usePelcro.getStore();

  whenSiteReady(() => {
    const securityKey = window.Pelcro.site.read()?.security_key;
    if (!securityKey) return;
    window.Pelcro.helpers.loadSDK(
      `https://www.recaptcha.net/recaptcha/enterprise.js?render=${securityKey}`,
      "pelcro-security-enteprise"
    );
  });
};

export const initGATracking = () => {
  ReactGA?.initialize?.(
    window.Pelcro.site.read().google_analytics_id
  );
  ReactGA?.plugin?.require?.("ecommerce");
};

export const dispatchModalDisplayEvents = (modalName) => {
  ReactGA?.event?.({
    category: "VIEWS",
    action: `${modalName
      ?.replace("pelcro-", "")
      ?.replaceAll("-", " ")} viewed`,
    nonInteraction: true
  });

  window.Pelcro.insight.track("Modal Displayed", {
    name: `${modalName?.replace("pelcro-", "")?.replaceAll("-", " ")}`
  });

  const modalDisplayEvent = new CustomEvent("PelcroModalDisplay", {
    detail: { modalName }
  });
  document.dispatchEvent(modalDisplayEvent);
};

const { whenSiteReady, whenEcommerceLoaded } = usePelcro.getStore();

export const renderShopView = (shopComponent) => {
  whenEcommerceLoaded(() => {
    const shopElement = document.getElementById("pelcro-shop");

    if (shopElement) {
      ReactDOM.render(
        <div className="pelcro-root">{shopComponent}</div>,
        shopElement
      );
    }
  });
};

/**
 * Takes site's color config on pelcro and applies it to the UI
 */
export const applyPelcroTheme = () => {
  // copied from https://css-tricks.com/converting-color-spaces-in-javascript/#hex-to-hsl
  const hexToHsl = (H) => {
    // Convert hex to RGB first
    let r = 0;
    let g = 0;
    let b = 0;
    if (H.length == 4) {
      r = "0x" + H[1] + H[1];
      g = "0x" + H[2] + H[2];
      b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
      r = "0x" + H[1] + H[2];
      g = "0x" + H[3] + H[4];
      b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;
    let h = 0;
    let s = 0;
    let l = 0;

    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return {
      hue: String(h),
      saturation: `${s}%`,
      lightness: `${l}%`
    };
  };

  whenSiteReady(() => {
    const primaryColorHex =
      window.Pelcro.site.read()?.design_settings?.primary_color;
    if (!primaryColorHex) {
      return;
    }

    const primaryColorHsl = hexToHsl(primaryColorHex);
    document.documentElement.style.setProperty(
      "--plc-primary-hue",
      primaryColorHsl.hue
    );
    document.documentElement.style.setProperty(
      "--plc-primary-saturation",
      primaryColorHsl.saturation
    );
    document.documentElement.style.setProperty(
      "--plc-primary-lightness",
      primaryColorHsl.lightness
    );
  });
};

/**
 * Initializes a specific modal according to the url 'view' param
 */
export const initViewFromURL = () => {
  const view = getStableViewID(
    window.Pelcro.helpers.getURLParameter("view")
  );

  const { switchView, whenSiteReady } = usePelcro.getStore();
  if (isValidViewFromURL(view)) {
    whenSiteReady(() => {
      if (view === "plan-select") {
        return initSubscriptionFromURL();
      }

      if (view === "register") {
        const offlinePlanId =
          window.Pelcro.helpers.getURLParameter("plan_id");

        if (offlinePlanId) {
          return initOfflineSubscriptionFromURL(offlinePlanId);
        }
      }

      if (view === "order-create") {
        return initPurchaseFromUrl();
      }

      if (view === "cart") {
        return initCartFromUrl();
      }

      if (view === "email-verify") {
        return verifyEmailTokenFromUrl();
      }

      if (view === "passwordless-login") {
        return verifyLinkTokenFromUrl();
      }

      if (view === "passwordless-request") {
        return showPasswordlessRequestFromUrl();
      }

      if (view === "invoice-details") {
        return showInvoiceDetailsFromUrl();
      }

      if (view === "manage-members") {
        return showSubscriptionManageMembersFromUrl();
      }

      switchView(view);
    });
  }
};

/**
 * Initializes the subscription flow if 'product_id' & 'plan_id' params exist
 * with valid IDs. Otherwise, switches to the product selection flow
 */
export const initSubscriptionFromURL = () => {
  const { switchView, whenSiteReady, set } = usePelcro.getStore();

  whenSiteReady(() => {
    const productsList = window.Pelcro.product.list();
    if (!productsList?.length) return;

    const [productId, planId, isGiftParam] = [
      window.Pelcro.helpers.getURLParameter("product_id"),
      window.Pelcro.helpers.getURLParameter("plan_id"),
      window.Pelcro.helpers.getURLParameter("is_gift")
    ];
    const isGift = isGiftParam?.toLowerCase() === "true";

    const selectedProduct = productsList.find(
      (product) => product.id === Number(productId)
    );
    const selectedPlan = selectedProduct?.plans?.find(
      (plan) => plan.id === Number(planId)
    );

    set({
      product: selectedProduct,
      plan: selectedPlan,
      isGift
    });

    if (!selectedProduct || !selectedPlan) {
      return switchView("plan-select");
    }

    const {
      isAuthenticated,
      switchToAddressView,
      switchToPaymentView
    } = usePelcro.getStore();

    if (!isAuthenticated()) {
      return switchView("register");
    }

    if (isGift) {
      return switchView("gift-create");
    }

    const requiresAddress = Boolean(selectedProduct.address_required);

    if (!requiresAddress) {
      return switchToPaymentView();
    }

    return switchToAddressView();
  });
};

/**
 * Initializes offline subscription flow if 'plan_id' params exist
 * with valid IDs, Otherwise, ignore the param
 */
export const initOfflineSubscriptionFromURL = (offlinePlanId) => {
  const {
    switchView,
    whenSiteReady,
    isAuthenticated,
    switchToPaymentView,
    switchToAddressView,
    set
  } = usePelcro.getStore();

  whenSiteReady(() => {
    window.Pelcro.plan.getPlan(
      {
        plan_id: offlinePlanId
      },
      (error, response) => {
        if (error) {
          return;
        }

        const { plan } = response.data;

        const isGiftParam =
          window.Pelcro.helpers.getURLParameter("is_gift");
        const isGift = isGiftParam?.toLowerCase() === "true";

        set({
          plan,
          product: plan?.product,
          isGift
        });

        if (!isAuthenticated()) {
          return switchView("register");
        }

        if (isGift) {
          return switchView("gift-create");
        }

        const requiresAddress = Boolean(plan.address_required);

        if (!requiresAddress) {
          return switchToPaymentView();
        }

        return switchToAddressView();
      }
    );
  });
};

/**
 * Initializes the e-commerce quick purchase flow if 'sku_id' param exist
 * with valid IDs, Otherwise, ignore the param
 */
export const initPurchaseFromUrl = () => {
  const { whenEcommerceLoaded, purchaseItem } = usePelcro.getStore();

  whenEcommerceLoaded(() => {
    const skuId = window.Pelcro.helpers.getURLParameter("sku_id");
    purchaseItem(skuId);
  });
};

/**
 * Initializes the cart if 'sku_id' param exist with valid IDs,
 * Otherwise, ignore the param.
 */
export const initCartFromUrl = () => {
  const { whenEcommerceLoaded, addToCart, switchView } =
    usePelcro.getStore();

  whenEcommerceLoaded(() => {
    const skusIdsParam =
      window.Pelcro.helpers.getURLParameter("sku_id");

    const skusIds = skusIdsParam?.split(",");

    let hasAddedAnItemSuccessfully = false;

    skusIds?.forEach((skuId) => {
      const didAddItemSuccessfully = addToCart(skuId);
      if (didAddItemSuccessfully) {
        hasAddedAnItemSuccessfully = true;
      }
    });

    if (hasAddedAnItemSuccessfully) switchView("cart");
  });
};

const verifyEmailTokenFromUrl = () => {
  const { whenSiteReady } = usePelcro.getStore();

  const translations = i18n.t("verifyEmail:messages", {
    returnObjects: true
  });

  const emailToken = window.Pelcro.helpers.getURLParameter("token");

  const isEmailVerificationEnabled =
    window.Pelcro.site.read()?.email_verify_enabled ?? false;

  if (!emailToken || !isEmailVerificationEnabled) return;

  whenSiteReady(
    () => {
      window.Pelcro.user.verifyEmailToken(
        {
          token: emailToken
        },
        (err, res) => {
          if (err) {
            return notify.error(getErrorMessages(err));
          }

          return notify.success(translations.success);
        }
      );
    },
    { once: true }
  );
};

const verifyLinkTokenFromUrl = () => {
  const { whenSiteReady, resetView, isAuthenticated } =
    usePelcro.getStore();

  const translations = i18n.t("verifyLinkToken:messages", {
    returnObjects: true
  });

  const loginToken = window.Pelcro.helpers.getURLParameter("token");

  const passwordlessEnabled =
    window.Pelcro.site.read()?.passwordless_enabled;

  if (isAuthenticated() || !loginToken || !passwordlessEnabled)
    return;

  whenSiteReady(
    () => {
      window.Pelcro.user.verifyLoginToken(
        {
          token: loginToken
        },
        (err, res) => {
          if (err) {
            return notify.error(getErrorMessages(err));
          }
          const { auth_token } = res.data;
          window.Pelcro.user.refresh(
            {
              auth_token
            },
            (err, res) => {
              if (err) {
                return notify.error(getErrorMessages(err));
              }
              resetView();
              return notify.success(translations.success);
            }
          );
        }
      );
    },
    { once: true }
  );
};

const showPasswordlessRequestFromUrl = () => {
  const { isAuthenticated } = usePelcro.getStore();

  const passwordlessEnabled =
    window.Pelcro.site.read()?.passwordless_enabled;

  if (!passwordlessEnabled || isAuthenticated()) return;

  const { switchView } = usePelcro.getStore();

  return switchView("passwordless-request");
};

const showInvoiceDetailsFromUrl = () => {
  const {
    isAuthenticated,
    setInvoice,
    whenUserReady,
    whenSiteReady,
    switchView
  } = usePelcro.getStore();

  whenSiteReady(() => {
    if (!isAuthenticated()) {
      return switchView("login");
    }

    whenUserReady(() => {
      const invoiceId = window.Pelcro.helpers.getURLParameter("id");

      const wasSetSuccessfully = setInvoice(invoiceId);
      if (!wasSetSuccessfully) {
        const errorMessage = i18n.t("messages:invalidInvoice", {
          returnObjects: true
        });

        return notify.error(errorMessage);
      }

      const { invoice } = usePelcro.getStore();

      if (invoice.total === 0) {
        const errorMessage = i18n.t("messages:zeroTotalInvoice", {
          returnObjects: true
        });

        return notify.error(errorMessage);
      }

      return switchView("invoice-details");
    });
  });
};

const showSubscriptionManageMembersFromUrl = () => {
  const {
    isAuthenticated,
    setSubscriptionToManageMembers,
    whenUserReady,
    whenSiteReady,
    switchView
  } = usePelcro.getStore();

  whenSiteReady(() => {
    if (!isAuthenticated()) {
      return switchView("login");
    }

    whenUserReady(() => {
      const subscriptionId =
        window.Pelcro.helpers.getURLParameter("subscription_id");

      const wasSetSuccessfully =
        setSubscriptionToManageMembers(subscriptionId);
      if (!wasSetSuccessfully) {
        const errorMessage = i18n.t("messages:invalidSubscription", {
          returnObjects: true
        });

        return notify.error(errorMessage);
      }

      return switchView("manage-members");
    });
  });
};
