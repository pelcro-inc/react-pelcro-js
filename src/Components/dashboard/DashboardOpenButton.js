// The button in the lower right that shows the dashboard.

import React from "react";

export const DashboardOpenButton = (props) => {
  const { openDashboard } = props;
  return (
    <div className="pelcro-prefix-pelcro-view">
      <button
        className="border-2 border-primary-300"
        name="menu"
        id="pelcro-view-menu"
        onClick={openDashboard}
      >
        <svg
          className="text-primary-400 hover:text-primary-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};
