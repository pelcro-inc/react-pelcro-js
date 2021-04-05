import React from "react";
import { useTranslation } from "react-i18next";
import { PaymentMethodView } from "../PaymentMethod/PaymentMethodView";

export const SubscriptionCreateView = ({
  product,
  plan,
  giftRecipient,
  onSuccess = () => {},
  onFailure = () => {},
  onDisplay = () => {}
}) => {
  const { t } = useTranslation("checkoutForm");

  const getPricingText = (plan) => {
    const autoRenewed = plan.auto_renew;
    const { interval, intervalCount } = plan;

    const formattedInterval =
      intervalCount > 1
        ? `${intervalCount} ${interval}`
        : `1 ${interval}`;

    return (
      <p className="plc-text-gray-600">
        <span className="plc-tracking-wider plc-uppercase">
          {plan.nickname}
        </span>
        <br />
        <span className="plc-text-xl plc-font-semibold plc-text-primary-600">
          {plan.amount_formatted}{" "}
        </span>
        <span className="plc-font-thin">
          {autoRenewed ? "/" : t("labels.for")} {formattedInterval}
        </span>
      </p>
    );
  };

  return (
    <div id="pelcro-subscription-create-view">
      <div className="plc-flex plc-flex-col plc-items-center plc-mb-4 plc-text-center plc-text-gray-700 pelcro-title-wrapper sm:plc-px-8">
        <h4 className="plc-text-xl plc-font-semibold ">
          {product?.paywall?.subscribe_title ??
            window.Pelcro.paywall.read()?.subscribe_title}
        </h4>{" "}
        <p>
          {product?.paywall?.subscribe_subtitle ??
            window.Pelcro.paywall.read()?.subscribe_subtitle}
        </p>
        <div className="plc-w-full plc-p-2 plc-mt-2 plc-font-semibold plc-text-center plc-text-gray-700 plc-bg-gray-100 plc-border plc-border-gray-200">
          {getPricingText(plan)}
        </div>
      </div>

      <PaymentMethodView
        type="createPayment"
        showCoupon={true}
        showExternalPaymentMethods={true}
        plan={plan}
        product={product}
        giftRecipient={giftRecipient}
        onFailure={onFailure}
        onSuccess={onSuccess}
        onDisplay={onDisplay}
      />
    </div>
  );
};
