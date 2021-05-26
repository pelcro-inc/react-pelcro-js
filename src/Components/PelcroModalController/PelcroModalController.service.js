import React from "react";
import ReactDOM from "react-dom";
import { usePelcro } from "../../hooks/usePelcro";
import { isValidViewFromURL } from "../../utils/utils";

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

export const enableScroll = () => {
  document.body.classList.remove("pelcro-modal-open");
};

export const disableScroll = () => {
  if (!document.body.classList.contains("pelcro-modal-open")) {
    document.body.classList.add("pelcro-modal-open");
  }
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
