import React from "react";
import { useTranslation } from "react-i18next";
import { PaymentMethodView } from "../PaymentMethod/PaymentMethodView";

export const SubscriptionRenewView = ({
  product,
  plan,
  giftRecipient,
  subscriptionIdToRenew,
  isRenewingGift,
  onFailure,
  onSuccess,
  onDisplay,
  onGiftRenewalSuccess
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
      <p className="text-gray-600">
        <span className="tracking-wider uppercase">
          {plan.nickname}
        </span>
        <br />
        <span className="text-xl font-semibold text-green-600">
          {plan.amount_formatted}{" "}
        </span>
        <span className="font-thin">
          {autoRenewed ? "/" : t("labels.for")} {formattedInterval}
        </span>
      </p>
    );
  };

  return (
    <div id="pelcro-subscription-renew-view">
      <div className="text-center">
        <h4 className="mb-2 text-xl">
          {product?.paywall?.subscribe_title ??
            window.Pelcro.paywall.read()?.subscribe_title}
        </h4>{" "}
        <p>
          {product?.paywall?.subscribe_subtitle ??
            window.Pelcro.paywall.read()?.subscribe_subtitle}
        </p>
        <div className="w-full p-2 mt-2 font-semibold text-center text-gray-700 bg-gray-100 border border-gray-200">
          {getPricingText(plan)}
        </div>
      </div>

      <PaymentMethodView
        type="createPayment"
        showCoupon={true}
        plan={plan}
        subscriptionIdToRenew={subscriptionIdToRenew}
        isRenewingGift={isRenewingGift}
        product={product}
        giftRecipient={giftRecipient}
        onFailure={onFailure}
        onSuccess={onSuccess}
        onDisplay={onDisplay}
        onGiftRenewalSuccess={onGiftRenewalSuccess}
      />
    </div>
  );
};
