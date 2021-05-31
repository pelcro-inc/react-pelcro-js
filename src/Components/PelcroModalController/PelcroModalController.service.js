import React from "react";
import ReactDOM from "react-dom";
import ReactGA from "react-ga";
import { usePelcro } from "../../hooks/usePelcro";
import {
  displayAddressView,
  displayPaymentView,
  isValidViewFromURL
} from "../../utils/utils";

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
    enableURLTriggers: initViewFromURL,
    enableTheme: applyPelcroTheme,
    enablePaywalls: initPaywalls,
    enableGoogleAnalytics: initGATracking
  };

  // Only execute enabled options
  Object.entries(options)
    .filter(([_, value]) => value === true)
    .forEach(([key]) => optionsMethodsDict[key]?.());
};

export const initPaywalls = () => {
  if (window.Pelcro.site.read()?.settings === "subscription") {
    if (
      isValidViewFromURL() ||
      window.Pelcro.subscription.isSubscribedToSite()
    ) {
      return;
    }

    const { switchView } = usePelcro.getStore();
    const paywallMethods = window.Pelcro.paywall;

    if (paywallMethods?.displayMeterPaywall()) {
      switchView("meter");
    } else if (paywallMethods?.displayNewsletterPaywall()) {
      switchView("newsletter");
    } else if (paywallMethods?.displayPaywall()) {
      switchView("select");
    }
  }
};

export const loadPaymentSDKs = () => {
  // Load stripe's SDK
  window.Pelcro.helpers.loadSDK(
    "https://js.stripe.com/v3/",
    "pelcro-sdk-stripe-id"
  );

  // Load PayPal SDK's
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
};

export const initGATracking = () => {
  ReactGA?.initialize?.(
    window.Pelcro.site.read().google_analytics_id
  );
  ReactGA?.plugin?.require?.("ecommerce");
};

export const renderShopView = (shopComponent) => {
  const shopElement = document.getElementById("pelcro-shop");

  if (shopElement) {
    ReactDOM.render(
      <div className="pelcro-root">{shopComponent}</div>,
      shopElement
    );
  }
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

  const { whenSiteReady } = usePelcro.getStore();

  whenSiteReady(() => {
    const primaryColorHex = window.Pelcro.site.read()?.design_settings
      ?.primary_color;
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
  const view = window.Pelcro.helpers.getURLParameter("view");
  const { switchView, whenSiteReady } = usePelcro.getStore();
  if (isValidViewFromURL()) {
    whenSiteReady(() => {
      if (view === "select") {
        return initSubscriptionFromURL();
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

    const [productId, planId, isGift] = [
      window.Pelcro.helpers.getURLParameter("product_id"),
      window.Pelcro.helpers.getURLParameter("plan_id"),
      window.Pelcro.helpers.getURLParameter("is_gift")
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
      if (productId && planId) {
        return switchView("select");
      }

      return;
    }

    const { isAuthenticated } = usePelcro.getStore();

    if (!isAuthenticated()) {
      return switchView("register");
    }

    if (isGift) {
      return switchView("gift");
    }

    const requiresAddress = Boolean(selectedProduct.address_required);

    if (!requiresAddress) {
      return displayPaymentView();
    }

    return displayAddressView();
  });
};
