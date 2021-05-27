import React from "react";
import { usePelcro } from "../../hooks/usePelcro";
import {
  init as initNativeButtons,
  authenticatedButtons,
  unauthenticatedButtons
} from "../common/PelcroNativeButtons";
import {
  disableScroll,
  enableScroll,
  initPaywalls,
  loadPaymentSDKs,
  renderShopView
} from "./PelcroModalController.service";

export const PelcroModalController = ({ children }) => {
  const { view, isAuthenticated, whenSiteReady } = usePelcro();

  React.useEffect(() => {
    whenSiteReady(() => {
      initPaywalls();
      loadPaymentSDKs();
    });
  }, []);

  React.useEffect(() => {
    initNativeButtons();
    renderShopView(
      children.find(({ type }) => type?.viewId === "shop")
    );
  }, []);

  React.useEffect(() => {
    if (window.Pelcro.user.isAuthenticated()) {
      authenticatedButtons();
    } else {
      unauthenticatedButtons();
    }
  }, [window.Pelcro.user.isAuthenticated()]);

  React.useEffect(() => {
    if (view === null || view === "meter") {
      return enableScroll();
    }

    if (view) {
      return disableScroll();
    }
  }, [view]);

  return (
    <div id="pelcro-app" className="pelcro-root">
      {isAuthenticated() &&
        children.find(
          ({ type }) => type?.viewId === "dashboard-open"
        )}

      {/* Conditionally render our modals */}
      {children.find(({ type }) => type?.viewId === view)}
    </div>
  );
};
