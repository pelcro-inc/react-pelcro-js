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
  enableGoogleAnalytics: false,
  disablePageViewEvents: false
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
       <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-300 to-gray-100 animate-gradient-xy relative overflow-hidden">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,transparent,black,transparent)] pointer-events-none" />

      {/* Animated background circles */}
      {/* <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 -top-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -right-4 -top-4 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary-900 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div> */}

      {/* Buttons container with backdrop blur */}
      <div className="relative flex flex-wrap items-center justify-center gap-4 p-8 rounded-xl backdrop-blur-sm bg-white/10">
        <button
          className="pelcro-login-button min-w-[120px] px-4 py-2 bg-gray-900 text-white rounded-lg font-medium transition-all hover:bg-gray-800 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-lg"
          data-login-text="Sign in"
          data-dashboard-text="My Dashboard"
        >
          Login
        </button>

        <button className="pelcro-register-button min-w-[120px] px-4 py-2 bg-transparent text-gray-900 rounded-lg font-medium border border-gray-900 transition-all hover:bg-gray-900 hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-lg">
          Register
        </button>

        <button className="pelcro-subscribe-button min-w-[120px] px-4 py-2 bg-white text-gray-900 rounded-lg font-medium border border-gray-200 transition-all hover:bg-gray-50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-lg">
          Subscribe
        </button>

      </div>
    </div>
      
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
