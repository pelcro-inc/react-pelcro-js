import React from "react";
import { default as ReactGA1 } from "react-ga";
import { default as ReactGA4 } from "react-ga4";

const ReactGA = window?.Pelcro?.uiSettings?.enableReactGA4 ? ReactGA4 : ReactGA1;

export const Logout = (props) => {
  const handleLogout = () => {
    window.Pelcro.user.logout();

    ReactGA?.event?.({
      category: "ACTIONS",
      action: "Logged out",
      nonInteraction: true
    });
  };
  return (
    <button
      name="logout"
      className="pelcro-logout-btn"
      onClick={handleLogout}
      disabled={false}
    >
      Logout
    </button>
  );
};
