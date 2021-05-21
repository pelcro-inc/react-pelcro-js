import React from "react";
import ReactDOM from "react-dom";
import { usePelcro } from "../../hooks/usePelcro";

export const initPaywalls = () => {
  /**
   * returns true if the URL contains a supported view trigger URL
   * @return {boolean}
   */
  const isValidViewFromURL = () => {
    const view = window.Pelcro.helpers.getURLParameter("view");
    if (
      [
        "login",
        "register",
        "select",
        "redeem",
        "password-forgot",
        "password-forget",
        "password-reset",
        "password-change",
        "source-create",
        "user-edit",
        "newsletter",
        "address"
      ].includes(view)
    ) {
      return true;
    }

    return false;
  };

  if (window.Pelcro.site.read()?.settings === "subscription") {
    if (
      isValidViewFromURL() ||
      window.Pelcro.subscription.isSubscribedToSite()
    ) {
      return;
    }

    const { switchView } = usePelcro.getState();
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
