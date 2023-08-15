import React from "react";
import ReactGA from "react-ga";
import ReactGA4 from "react-ga4";

export const Logout = (props) => {
  const handleLogout = () => {
    window.Pelcro.user.logout();
    const enableReactGA4 = window?.Pelcro?.uiSettings?.enableReactGA4;

    if (enableReactGA4) {
      ReactGA4.event("Logged out", {
        nonInteraction: true
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
