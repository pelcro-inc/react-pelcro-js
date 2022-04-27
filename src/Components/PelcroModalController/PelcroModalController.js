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
  loadAuth0SDK: true,
  enableURLTriggers: true,
  enableTheme: true,
  enablePaywalls: true,
  loadSecuritySDK: true,
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

      {React.Children.map(children, (child) => child).find(
        ({ type }) => type?.viewId === "notification"
      )}

      {/* the reason we're doing this is to be able to tell if the select modal
      should filter the list by certain entitlements or not. we're trying to avoid
      adding a field to the usePelcro hook just to communicate this because then it
      would be considered part of the public API, so we decided to do this for now.
      if we face other cases where we need to pass certain data when using switchView,
      then this should be refactored and we should find a better way of handling these
      cases */}
      {view === "_plan-select-entitlements" &&
        React.Children.map(children, (child) => child).find(
          ({ type }) => type?.viewId === "plan-select"
        )}

      {/* Conditionally render our modals */}
      {React.Children.map(children, (child) => child).find(
        ({ type }) => type?.viewId === view
      )}
    </div>
  );
};
