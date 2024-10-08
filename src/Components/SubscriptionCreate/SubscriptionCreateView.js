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
  onFailure = () => {},
  ...otherProps
}) => {
  const { t } = useTranslation("checkoutForm");
  const {
    product,
    plan,
    selectedDonationAmount,
    customDonationAmount
  } = usePelcro();
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

    const priceFormatted =
      plan.type === "donation" &&
      (selectedDonationAmount || customDonationAmount)
        ? getFormattedPriceByLocal(
            selectedDonationAmount
              ? selectedDonationAmount *
                  plan?.amount *
                  (plan?.quantity ?? 1)
              : customDonationAmount *
                  plan?.amount *
                  (plan?.quantity ?? 1),
            plan?.currency,
            getPageOrDefaultLanguage()
          )
        : getFormattedPriceByLocal(
            plan?.amount * (plan?.quantity ?? 1),
            plan?.currency,
            getPageOrDefaultLanguage()
          );

    return (
      <p className="plc-text-gray-600">
        <span className="plc-tracking-wider plc-uppercase">
          {plan.nickname}
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
      <div className="plc-flex plc-flex-col plc-items-center plc-mb-6 plc-text-center plc-text-gray-900 pelcro-title-wrapper sm:plc-px-8">
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
        showExternalPaymentMethods={true}
        showApplePayButton={true}
        onSuccess={onSuccess}
        onFailure={onFailure}
        showSubscriptionButton={showSubscriptionButton}
        {...otherProps}
      />
    </div>
  );
};
