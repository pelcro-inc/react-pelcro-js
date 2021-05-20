import React from "react";
import { usePelcro } from "../../hooks/usePelcro";
import {
  init as initNativeButtons,
  authenticatedButtons,
  unauthenticatedButtons
} from "../common/PelcroNativeButtons";
import { disableScroll, enableScroll, initPaywalls } from "./service";

export const PelcroModalController = ({ children }) => {
  const { view, isAuthenticated, whenSiteReady } = usePelcro();

  React.useEffect(() => {
    whenSiteReady(() => {
      initPaywalls();
    });
  }, []);

  React.useEffect(() => {
    initNativeButtons();
  }, []);

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
      {isAuthenticated && authenticatedButtons()}
      {!isAuthenticated && unauthenticatedButtons()}
      {children.find(({ type }) => type?.id === view)}
    </div>
  );
};
