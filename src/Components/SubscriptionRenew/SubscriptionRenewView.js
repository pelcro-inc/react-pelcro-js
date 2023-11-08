import React from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import { PaymentMethodView } from "../PaymentMethod/PaymentMethodView";

export const SubscriptionRenewView = ({
  onSuccess = () => {},
  onGiftRenewalSuccess = () => {},
  onFailure = () => {}
}) => {
  const { t } = useTranslation("checkoutForm");
  const { product, plan } = usePelcro();
  const skipPayment =
    window.Pelcro?.uiSettings?.skipPaymentForFreePlans;
  const showSubscriptionButton = skipPayment && plan?.amount === 0;

  const getPricingText = (plan) => {
    const autoRenewed = plan.auto_renew;
    const { interval_translated, interval_count } = plan;
    const intervalText = t("labels.interval", {
      interval: interval_translated,
      count: interval_count
    });

    return (
      <p className="plc-text-gray-600">
        <span className="plc-font-bold">
          {product.name} - {plan.nickname}
        </span>
        <br />
        <span className="plc-text-xl plc-font-semibold plc-text-primary-600">
          {plan.amount_formatted}{" "}
        </span>
        <span className="plc-font-thin">
          {autoRenewed ? "/" : t("labels.for")} {intervalText}
        </span>
      </p>
    );
  };

  return (
    <div id="pelcro-subscription-renew-view">
      <div className="plc-flex plc-flex-col plc-items-center plc-mb-6 plc-text-left plc-text-gray-900 pelcro-title-wrapper">
        <div className="plc-w-full plc-font-semibold plc-text-left plc-text-gray-900">
          {plan && getPricingText(plan)}
        </div>
      </div>

      <PaymentMethodView
        type="createPayment"
        showCoupon={true}
        showExternalPaymentMethods={false}
        onSuccess={onSuccess}
        onGiftRenewalSuccess={onGiftRenewalSuccess}
        onFailure={onFailure}
        showSubscriptionButton={showSubscriptionButton}
      />
    </div>
  );
};
