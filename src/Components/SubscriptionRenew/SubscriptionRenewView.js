import React from "react";
import { useTranslation } from "react-i18next";
import { PaymentMethodView } from "../PaymentMethod/PaymentMethodView";
import ErrMessage from "../common/ErrMessage";
import AlertSuccess from "../common/AlertSuccess";

export const SubscriptionRenewView = ({
  product,
  plan,
  subscriptionIdToRenew,
  onFailure,
  onSuccess
}) => {
  const { t } = useTranslation("messages");
  return (
    <div>
      <div className="pelcro-prefix-title-block">
        <h4>{product.paywall.subscribe_title}</h4>
        <p>
          {product.paywall.subscribe_subtitle} -{" "}
          {plan.amount_formatted}
          {plan.auto_renew && (
            <span>/({plan.interval_count})</span>
          )}{" "}
          {plan.interval}.
        </p>
      </div>

      <ErrMessage name="payment" />
      <AlertSuccess name="payment" />

      <div className="pelcro-prefix-payment-block">
        <div className="pelcro-prefix-alert pelcro-prefix-alert-success">
          <div className="pelcro-prefix-payment-message">
            <span>
              {t("youAreSafe")}{" "}
              <a
                className="pelcro-prefix-link"
                rel="nofollow"
                target="new"
                href="https://www.stripe.com/us/customers"
              >
                Stripe
              </a>{" "}
            </span>
          </div>
        </div>
        <div className="pelcro-prefix-form">
          <PaymentMethodView
            type="createPayment"
            showCoupon={true}
            plan={plan}
            subscriptionIdToRenew={subscriptionIdToRenew}
            product={product}
            onFailure={onFailure}
            onSuccess={onSuccess}
          />
        </div>
      </div>
    </div>
  );
};
