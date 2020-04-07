import React from "react";

export const ShipmentsRemaining = ({ subscription, name }) => {
  if (subscription.shipments_remaining) {
    return (
      <div className="pelcro-prefix-dashboard-text row">
        <span className="pelcro-prefix-dashboard-label col-4">{name}</span>
        <span className="pelcro-prefix-dashboard-value col-8">
          {subscription.shipments_remaining}
        </span>
      </div>
    );
  }
  return null;
};
