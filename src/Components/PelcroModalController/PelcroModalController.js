import React from "react";
import { usePelcro } from "../../hooks/usePelcro";
import {
  init as initNativeButtons,
  authenticatedButtons,
  unauthenticatedButtons
} from "../common/PelcroNativeButtons";
import {
  optionsController,
  renderShopView
} from "./PelcroModalController.service";
import { enableScroll, disableScroll } from "../../utils/utils";

const defaultOptions = {
  loadPaymentSDKs: true,
  enableURLTriggers: true,
  enableTheme: true,
  enablePaywalls: true,
  enableGoogleAnalytics: false
};

export const PelcroModalController = ({
  rootId = "pelcro-app",
  options = defaultOptions,
  children
}) => {
  const { view, isAuthenticated, whenSiteReady } = usePelcro();

  React.useEffect(() => {
    initNativeButtons();
    renderShopView(
      React.Children.map(children, (child) => child).find(
        ({ type }) => type?.viewId === "shop"
      )
    );
  }, []);

  // default options are overridable by consumer's options
  const mergedOptions = { ...defaultOptions, ...options };

  React.useEffect(() => {
    whenSiteReady(() => {
      optionsController(mergedOptions);
    });
  }, [options]);

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
    <div id={rootId} className="pelcro-root">
      {isAuthenticated() &&
        React.Children.map(children, (child) => child).find(
          ({ type }) => type?.viewId === "dashboard-open"
        )}

      {/* Conditionally render our modals */}
      {React.Children.map(children, (child) => child).find(
        ({ type }) => type?.viewId === view
      )}
    </div>
  );
};
