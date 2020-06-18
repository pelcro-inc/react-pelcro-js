import React, { useContext } from "react";
import { store } from "../PelcroContainer";
import { SET_VIEW } from "../../utils/action-types";

export const Subscriptions = props => {
  const { dispatch } = useContext(store);

  const subscriptions = window.Pelcro.subscription.list();
  if (!subscriptions) return "";

  const reactivateSubscription = subscription_id => {
    window.Pelcro.subscription.reactivate(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        subscription_id: subscription_id
      },
      (err, res) => {
        // setState({ disableSubmit: false });

        if (err) {
          return console.log(err);
        }

        return dispatch({
          type: SET_VIEW,
          payload: { view: null }
        });
      }
    );
  };

  const cancelSubscription = subscription_id => {
    window.Pelcro.subscription.cancel(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        subscription_id: subscription_id
      },
      (err, res) => {
        // setState({ disableSubmit: false });

        if (err) {
          return console.log(err);
        }

        props.ReactGA.event({
          category: "ACTIONS",
          action: "Canceled",
          nonInteraction: true
        });

        return dispatch({
          type: SET_VIEW,
          payload: { view: null }
        });
      }
    );
  };

  return subscriptions.map(sub => {
    // Cancel button click handlers
    const onCancelClick = () => {
      const confirmation = window.confirm(
        "Are you sure you wanna cancel your subscription?"
      );

      if (confirmation === true) {
        cancelSubscription(sub.id);
      }
    };

    // Reactivate button click handlers
    const onReactivateClick = () => {
      reactivateSubscription(sub.id);
    };

    // Renew click
    const onRenewClick = () => {
      const product_id = sub.plan.product.id;
      const plan_id = sub.plan.id;

      const product = window.Pelcro.product.getById(product_id);
      const plan = window.Pelcro.plan.getById(plan_id);

      props.setProductAndPlan(product, plan);
      props.setSubscriptionIdToRenew(sub.id);
      console.log("onRenewClick -> sub.id", sub.id);
      props.setView("select");
    };

    const status = sub.cancel_at_period_end
      ? `Expires on ${sub.current_period_end}`
      : `Renews on ${sub.current_period_end}`;

    return (
      <div
        key={"dashboard-subscription-" + sub.id}
        className="pelcro-prefix-dashboard-subscriptions"
      >
        <div>
          {sub.plan.nickname && (
            <div className="pelcro-prefix-dashboard-text row">
              <span className="pelcro-prefix-dashboard-label col-4">
                Plan
              </span>
              <span className="pelcro-prefix-dashboard-value col-8">
                {sub.plan.nickname}
              </span>
            </div>
          )}
        </div>
        <div>
          {sub.status && (
            <div className="pelcro-prefix-dashboard-text row">
              <span className="pelcro-prefix-dashboard-label col-4">
                Status
              </span>
              <span className="pelcro-prefix-dashboard-value col-8">
                {status}
              </span>
            </div>
          )}
        </div>
        <div>
          {sub.shipments_remaining && (
            <div className="pelcro-prefix-dashboard-text row">
              <span className="pelcro-prefix-dashboard-label col-4">
                Shipments remaining
              </span>
              <span className="pelcro-prefix-dashboard-value col-8">
                {sub.shipments_remaining}
              </span>
            </div>
          )}
        </div>
        <div>
          <div className="pelcro-prefix-dashboard-text row">
            <span className="pelcro-prefix-dashboard-label col-4">
              Actions
            </span>
            <div className="col-8">
              {sub.cancel_at_period_end === 0 && (
                <button
                  className="pelcro-prefix-link"
                  type="button"
                  onClick={onCancelClick}
                  disabled={false}
                >
                  Unsubscribe
                </button>
              )}
              {sub.cancel_at_period_end === 1 && (
                <button
                  className="pelcro-prefix-link"
                  type="button"
                  onClick={onReactivateClick}
                  disabled={false}
                >
                  Reactivate
                </button>
              )}
              {sub.cancel_at_period_end === 1 && (
                <button
                  className="pelcro-prefix-link"
                  type="button"
                  onClick={onRenewClick}
                  disabled={false}
                >
                  Renew
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  });
};
