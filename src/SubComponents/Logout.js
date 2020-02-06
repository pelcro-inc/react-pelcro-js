import React from "react";

export const Logout = props => {
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
      className="pelcro-prefix-btn pelcro-prefix-logout-btn"
      onClick={handleLogout}
      disabled={false}
    >
      Logout
    </button>
  );
};
