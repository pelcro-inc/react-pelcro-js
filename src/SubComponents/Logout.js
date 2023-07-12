import React from "react";
import ReactGA from "react-ga";
import ReactGA4 from "react-ga4";

const enableReactGA4 = window?.Pelcro?.uiSettings?.enableReactGA4;

export const Logout = (props) => {
  const handleLogout = () => {
    window.Pelcro.user.logout();

    if (enableReactGA4) {
      ReactGA4.gtag("event", "Logged out", {
        event_category: "ACTIONS",
        event_action: "Logged out",
        non_interaction: true
      });
    } else {
      ReactGA?.event?.({
        category: "ACTIONS",
        action: "Logged out",
        nonInteraction: true
      });
    }
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
