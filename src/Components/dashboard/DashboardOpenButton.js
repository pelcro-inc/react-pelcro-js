// The button in the lower right that shows the dashboard.

import React from "react";

export const DashboardOpenButton = (props) => {
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
