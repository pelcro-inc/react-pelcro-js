import React, { useContext } from "react";
import { store } from "../PelcroContainer";
import { Button } from "../../SubComponents/Button";
import {
  SET_PRODUCT_AND_PLAN,
  SET_SUBSCRIPTION_TO_RENEW,
} from "../../utils/action-types";

export const SubscriptionActionButton = ({
  subscription,
  unsubscribeName = "Unsubscribe",
  reactivateName = "Reactivate",
  renewName = "Renew",
  setView,
  ...otherProps
}) => {
  const { dispatch } = useContext(store);

  const reactivateSubscription = (subscription_id) => {
    window.Pelcro.subscription.reactivate(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        subscription_id: subscription_id,
      },
      (err, res) => {
        // setState({ disableSubmit: false });

        if (err) {
          return console.log(err);
        }

        setView("");
      }
    );
  };

  const cancelSubscription = (subscription_id) => {
    window.Pelcro.subscription.cancel(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        subscription_id: subscription_id,
      },
      (err, res) => {
        // setState({ disableSubmit: false });

        if (err) {
          return console.log(err);
        }

        setView("");
      }
    );
  };

  // Reactivate button click handlers
  const onReactivateClick = () => {
    reactivateSubscription(subscription.id);
  };

  // Renew click
  const onRenewClick = () => {
    const product_id = subscription.plan.product.id;
    const plan_id = subscription.plan.id;

    const product = window.Pelcro.product.getById(product_id);
    const plan = window.Pelcro.plan.getById(plan_id);

    dispatch({ type: SET_PRODUCT_AND_PLAN, payload: { product, plan } });
    dispatch({ type: SET_SUBSCRIPTION_TO_RENEW, payload: subscription.id });

    setView("select");
  };

  // Cancel button click handlers
  const onCancelClick = () => {
    const confirmation = window.confirm(
      "Are you sure you wanna cancel your subscription?"
    );

    if (confirmation === true) {
      cancelSubscription(subscription.id);
    }
  };

  return (
    <div>
      {subscription.cancel_at_period_end === 0 && (
        <Button
          className={otherProps.className || ""}
          style={{ ...otherProps.style }}
          onClick={onCancelClick}
          disabled={false}
        >
          {unsubscribeName}
        </Button>
      )}
      {subscription.cancel_at_period_end === 1 && (
        <Button
          className={otherProps.className || ""}
          style={{ ...otherProps.style }}
          onClick={onReactivateClick}
          disabled={false}
        >
          {reactivateName}
        </Button>
      )}
      {subscription.cancel_at_period_end === 1 && (
        <Button
          className={otherProps.className || ""}
          style={{ ...otherProps.style }}
          onClick={onRenewClick}
          disabled={false}
        >
          {renewName}
        </Button>
      )}
    </div>
  );
};
