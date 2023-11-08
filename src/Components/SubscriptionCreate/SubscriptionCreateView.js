import React from "react";
import { useTranslation } from "react-i18next";
import { SubscriptionCreateFreePlanButton } from "./SubscriptionCreateFreePlanButton";
import { usePelcro } from "../../hooks/usePelcro";
import {
  getFormattedPriceByLocal,
  getPageOrDefaultLanguage
} from "../../utils/utils";
import { PaymentMethodView } from "../PaymentMethod/PaymentMethodView";

export const SubscriptionCreateView = ({
  onSuccess = () => {},
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

    const priceFormatted = getFormattedPriceByLocal(
      plan?.amount * (plan?.quantity ?? 1),
      plan?.currency,
      getPageOrDefaultLanguage()
    );

    return (
      <p className="plc-text-gray-600">
        <span className="plc-font-bold">
          {product.name} - {plan.nickname}
        </span>
        <br />
        <span className="plc-text-xl plc-font-semibold plc-text-primary-600">
          {priceFormatted}{" "}
        </span>
        <span className="plc-font-thin">
          {autoRenewed ? "/" : t("labels.for")} {intervalText}
        </span>
      </p>
    );
  };

  return (
    <div id="pelcro-subscription-create-view">
      <div className="plc-flex plc-flex-row plc-items-center plc-mb-6 plc-text-left plc-text-gray-900 pelcro-title-wrapper">
        <div className="plc-w-full plc-font-semibold plc-text-left plc-text-gray-900">
          {plan && getPricingText(plan)}
        </div>
        <div className="plc-flex-grow"></div>
        <div className="plc-w-1/4">
          <img
            src={product.image}
            alt=""
            className="plc-rounded-md"
          />
        </div>
      </div>

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
