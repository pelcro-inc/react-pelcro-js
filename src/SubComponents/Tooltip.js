import React from "react";
import { ReactComponent as InfoCircleIcon } from "../assets/info-circle.svg";

/**
 *
 */
export const Tooltip = ({ value, className }) => {
  return (
    <div
      className={`plc-flex pelcro-tooltip-container plc-text-gray-400 ${className}`}
    >
      <div className="pelcro-tooltip-icon">
        <InfoCircleIcon />
      </div>
      <div className="plc-p-1 plc--mt-8 plc-text-sm plc-bg-gray-100 plc-border plc-rounded-md plc-shadow-lg pelcro-tooltip">
        {value}
      </div>
    </div>
  );
};
