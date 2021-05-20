import React from "react";
import { usePelcro } from "../../hooks/usePelcro";
import {
  init as initNativeButtons,
  authenticatedButtons,
  unauthenticatedButtons
} from "../common/PelcroNativeButtons";
import { initPaywalls } from "./service";

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

  return (
    <div id="pelcro-app" className="pelcro-root">
      {isAuthenticated && authenticatedButtons()}
      {!isAuthenticated && unauthenticatedButtons()}
      {children.find(({ type }) => type?.id === view)}
    </div>
  );
};
