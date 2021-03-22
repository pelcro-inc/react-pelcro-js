import React from "react";

export const Logout = (props) => {
  const handleLogout = () => {
    window.Pelcro.user.logout();

    props.ReactGA.event({
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
