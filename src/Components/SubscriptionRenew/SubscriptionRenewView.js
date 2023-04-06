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
    const { interval, interval_count } = plan;
    const intervalText = t("labels.interval", {
      interval,
      count: interval_count
    });

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
          {autoRenewed ? "/" : t("labels.for")} {intervalText}
        </span>
      </p>
    );
  };

  return (
    <div id="pelcro-subscription-renew-view">
      <div className="plc-mb-6 plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4 className="plc-text-2xl plc-font-semibold ">
          {product?.paywall?.subscribe_title ??
            window.Pelcro.paywall.read()?.subscribe_title}
        </h4>{" "}
        <p>
          {product?.paywall?.subscribe_subtitle ??
            window.Pelcro.paywall.read()?.subscribe_subtitle}
        </p>
        <div className="plc-w-full plc-p-2 plc-mt-2 plc-font-semibold plc-text-center plc-text-gray-900 plc-bg-gray-100 plc-border plc-border-gray-200">
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
