import React from "react";

/**
 *
 */
export const Tooltip = ({ value, className }) => {
  return (
    <div className={`plc-flex pelcro-tooltip-container ${className}`}>
      <div className="plc-text-xl pelcro-tooltip-icon">🛈</div>
      <div className="plc-p-1 plc--mt-8 plc-text-sm plc-text-gray-600 plc-bg-gray-100 plc-border plc-rounded-md plc-shadow-lg pelcro-tooltip">
        {value}
      </div>
    </div>
  );
};
