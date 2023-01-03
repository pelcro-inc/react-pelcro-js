import React from "react";
import ReactGA from "react-ga";

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
