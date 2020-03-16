import React from "react";
import { useTranslation } from "react-i18next";
import { CheckoutFormView } from "../CheckoutForm/CheckoutFormView";
import ErrMessage from "../common/ErrMessage";
import AlertSuccess from "../common/AlertSuccess";
import { PercentOff } from "./PercentOff";

export const CreatePaymentView = ({
  product,
  plan,
  setView,
  resetView,
  giftRecipient,
  subscriptionIdToRenew
}) => {
  const { t } = useTranslation("messages");
  return (
    <div>
      <div className="pelcro-prefix-title-block">
        <h4>{product.paywall.subscribe_title}</h4>
        <p>
          {product.paywall.subscribe_subtitle} - {plan.amount_formatted}
          {plan.auto_renew && <span>/({plan.interval_count})</span>}{" "}
          {plan.interval}. <PercentOff />
        </p>
      </div>

      <ErrMessage name="payment-create" />
      <AlertSuccess name="payment-create" />

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
          <CheckoutFormView
            type="createPayment"
            showCoupon={true}
            plan={plan}
            subscriptionIdToRenew={subscriptionIdToRenew}
            giftRecipient={giftRecipient}
            product={product}
            setView={setView}
            resetView={resetView}
          />
        </div>
      </div>
    </div>
  );
};
