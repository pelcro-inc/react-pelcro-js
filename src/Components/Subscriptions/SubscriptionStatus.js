import React from "react";

export const SubscriptionStatus = ({ subscription, name, ...otherProps }) => {
  const status = subscription.cancel_at_period_end
    ? `Expires on ${subscription.current_period_end}`
    : `Renews on ${subscription.current_period_end}`;

  if (status) {
    return (
      <div className="pelcro-prefix-dashboard-text row" {...otherProps}>
        <span className="pelcro-prefix-dashboard-label col-4">{name}</span>
        <span className="pelcro-prefix-dashboard-value col-8">{status}</span>
      </div>
    );
  }
  return null;
};
