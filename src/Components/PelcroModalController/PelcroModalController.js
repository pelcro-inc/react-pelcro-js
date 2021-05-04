import React from "react";
import { usePelcro } from "../../hooks/usePelcro";
import {
  init as initNativeButtons,
  authenticatedButtons,
  unauthenticatedButtons
} from "../common/PelcroNativeButtons";

export const PelcroModalController = ({ children }) => {
  React.useEffect(() => {
    initNativeButtons();
  }, []);

  const { view, isAuthenticated } = usePelcro();

  return (
    <div id="pelcro-app" className="pelcro-root">
      {isAuthenticated && authenticatedButtons()}
      {!isAuthenticated && unauthenticatedButtons()}
      {children.find(({ type }) => type?.id === view)}
    </div>
  );
};
