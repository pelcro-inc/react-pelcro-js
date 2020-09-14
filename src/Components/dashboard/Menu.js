// The button in the lower right that shows the dashboard.

import React from "react";

const Menu = props => {
  const { openDashboard } = props;
  return (
    <div className="pelcro-prefix-pelcro-view">
      <button
        name="menu"
        id="pelcro-view-menu"
        onClick={openDashboard}
      >
        <div className="pelcro-prefix-menu-arrow">{"\u003C"}</div>
      </button>
    </div>
  );
};

export default Menu;
