// The button in the lower left that shows the dashboard.

import React from "react";
import { usePelcro } from "../../hooks/usePelcro";

export const DashboardOpenButton = ({ layout = "left" }) => {
  const { switchView } = usePelcro();

  return (
    <div
      className={`plc-fixed plc-bottom-4 pelcro-open-dashboard-btn ${
        layout == "left" ? "plc-left-4" : "plc-right-4"
      }`}
    >
      <button
        className="plc-bg-white plc-border-2 plc-rounded-full focus:plc-outline-none plc-border-primary-300 hover:plc-bg-white"
        name="menu"
        id="pelcro-view-menu"
        onClick={() => {
          switchView("dashboard");
        }}
      >
        <svg
          className="plc-w-10 plc-h-10 plc-text-primary-400 hover:plc-text-primary-500"
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

DashboardOpenButton.viewId = "dashboard-open";
