import React from "react";

/**
 *
 */
export const Tooltip = ({ value, className }) => {
  return (
    <div className={`pelcro-tooltip ${className}`}>
      <div className="plc-flex tooltip-container">
        <div className="plc-text-xl tooltip-icon">🛈</div>
        <div className="plc-p-1 plc--mt-8 plc-text-sm plc-text-gray-600 plc-bg-gray-100 plc-border plc-rounded-md plc-shadow-lg tooltip">
          {value}
        </div>
      </div>
    </div>
  );
};
