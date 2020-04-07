import React from "react";

export const PlanName = ({ subscription, name }) => {
  if (subscription.plan.nickname) {
    return (
      <div className="pelcro-prefix-dashboard-text row">
        <span className="pelcro-prefix-dashboard-label col-4">{name}</span>
        <span className="pelcro-prefix-dashboard-value col-8">
          {subscription.plan.nickname}
        </span>
      </div>
    );
  }
  return null;
};
