import React from "react";
import { usePelcro } from "../../hooks/usePelcro";
import { PaymentMethodView } from "../PaymentMethod/PaymentMethodView";
import { SubscriptionCreateSummary } from "./SubscriptionCreateSummary";

export const SubscriptionCreateView = ({
  onSuccess = () => {},
  onFailure = () => {}
}) => {
  const { plan } = usePelcro();
  const skipPayment =
    window.Pelcro?.uiSettings?.skipPaymentForFreePlans;
  const showSubscriptionButton = skipPayment && plan?.amount === 0;

  return (
    <div id="pelcro-subscription-create-view">
      <SubscriptionCreateSummary />

      <PaymentMethodView
        type="createPayment"
        showCoupon={true}
        showExternalPaymentMethods={true}
        showApplePayButton={true}
        onSuccess={onSuccess}
        onFailure={onFailure}
        showSubscriptionButton={showSubscriptionButton}
      />
    </div>
  );
};
