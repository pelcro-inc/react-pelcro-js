import React from "react";
import { SubscriptionActionButton } from "./SubscriptionActionButton";
import { SubscriptionStatus } from "./SubscriptionStatus";
import { PlanName } from "./PlanName";
import { ShipmentsRemaining } from "./ShipmentsRemaining";

export const SubscriptionsListView = (props) => {
  const subscriptions = window.Pelcro.subscription.list();
  if (!subscriptions) return null;

  return subscriptions.map((sub) => {
    return (
      <div
        key={"dashboard-subscription-" + sub.id}
        className="pelcro-prefix-dashboard-subscriptions"
      >
        <div>
          <PlanName name="Plan" subscription={sub} />
        </div>
        <div>
          <SubscriptionStatus name="Status" subscription={sub} />
        </div>
        <div>
          <ShipmentsRemaining subscription={sub} name="Shipments remaining" />
        </div>
        <div>
          <div className="pelcro-prefix-dashboard-text row">
            <span className="pelcro-prefix-dashboard-label col-4">Actions</span>
            <div className="col-8">
              <SubscriptionActionButton
                subscription={sub}
                unsubscribeName="Unsubscribe"
                reactivateName="Reactivate"
                renewName="Renew"
                setView={props.setView}
              />
            </div>
          </div>
        </div>
      </div>
    );
  });
};
