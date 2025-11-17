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

  // Discount helper methods
  const hasValidDiscount = (plan) => {
    if (!plan?.metadata) return false;
    
    const discountPercentage = Number(plan.metadata.original_discount_percentage);
    const originalAmount = plan.metadata.original_amount;
    
    return (
      !isNaN(discountPercentage) && 
      discountPercentage > 0 && 
      discountPercentage <= 100 &&
      originalAmount && 
      String(originalAmount).trim().length > 0
    );
  };

  const formatOriginalAmount = (plan) => {
    if (!hasValidDiscount(plan)) return null;
    
    const originalAmount = plan.metadata.original_amount;
    const currencySymbol = plan.amount_formatted?.match(/[^\d.,\s]+/)?.[0] || "";
    const numericAmount = typeof originalAmount === "string" ? parseFloat(originalAmount) : originalAmount;
    
    if (isNaN(numericAmount)) return null;
    
    return `${currencySymbol}${numericAmount.toFixed(2)}`;
  };

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
        {/* Discount Badge */}
        {hasValidDiscount(plan) && (
          <span 
            className="plc-bg-red-500 plc-text-white plc-text-xs plc-font-bold plc-px-2 plc-py-1 plc-rounded plc-mr-2"
            aria-label={`${plan.metadata.original_discount_percentage} percent discount`}
            role="status"
          >
            {plan.metadata.original_discount_percentage}% OFF
          </span>
        )}
        {/* Original Price (Strikethrough) */}
        {hasValidDiscount(plan) && (
          <span 
            className="plc-text-gray-400 plc-line-through plc-text-sm plc-mr-2"
            aria-label={`Original price ${formatOriginalAmount(plan)}`}
          >
            {formatOriginalAmount(plan)}
          </span>
        )}
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
        showApplePayButton={true}
        onSuccess={onSuccess}
        onGiftRenewalSuccess={onGiftRenewalSuccess}
        onFailure={onFailure}
        showSubscriptionButton={showSubscriptionButton}
      />
    </div>
  );
};
