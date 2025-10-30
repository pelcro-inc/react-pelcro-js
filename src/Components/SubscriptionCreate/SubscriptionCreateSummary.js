import React from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import {
  getFormattedPriceByLocal,
  getPageOrDefaultLanguage
} from "../../utils/utils";

export const SubscriptionCreateSummary = () => {
  const { t } = useTranslation("checkoutForm");
  const { product, plan, selectedAddressId } = usePelcro();

  const { addresses } = window?.Pelcro?.user?.read() ?? [];
  const user = window?.Pelcro?.user?.read() ?? [];

  const address = selectedAddressId
    ? addresses?.find((address) => address.id == selectedAddressId) ??
      null
    : addresses?.find(
        (address) => address.type == "shipping" && address.is_default
      ) ?? null;

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
    const {
      interval_translated: intervalTranslated,
      interval_count: intervalCount,
      interval
    } = plan;
    const intervalText = t("labels.interval", {
      interval: intervalTranslated ?? interval,
      count: intervalCount
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
        {/* Discount Badge */}
        {hasValidDiscount(plan) && (
          <span 
            className="plc-bg-green-500 plc-text-white plc-text-xs plc-font-bold plc-px-2 plc-py-1 plc-rounded plc-mr-2"
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
          {priceFormatted}{" "}
        </span>
        <span className="plc-font-thin">
          {autoRenewed ? "/" : t("labels.for")} {intervalText}
        </span>
      </p>
    );
  };

  return (
    <div>
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
      <div className="plc-flex plc-flex-row plc-justify-between">
        {address && (
          <>
            <div
              className="pelcro-select-address-radio plc-order-2"
              id={`pelcro-address-select-${address?.id}`}
              name="address"
            >
              <p className="pelcro-address-name plc-font-semibold">
                {t("labels.shippingAddress")}
              </p>
              <p className="pelcro-address-company">
                {address?.company}
              </p>
              <p className="pelcro-address-name plc-text-sm plc-mt-1">
                {address?.first_name} {address?.last_name}
              </p>
              <p className="pelcro-address-line1 plc-text-sm">
                {address?.line1}
              </p>
              <p className="pelcro-address-country plc-text-sm">
                {address?.city}, {address?.state}{" "}
                {address?.postal_code}, {address?.country}
              </p>
            </div>
          </>
        )}
        <div
          className="pelcro-select-address-radio plc-order-2"
          id={`pelcro-address-select-${address?.id}`}
          name="address"
        >
          <p className="pelcro-address-name plc-font-semibold">
            {t("labels.contactDetails")}
          </p>
          <p className="pelcro-address-name plc-text-sm plc-mt-1">
            {user.email}
          </p>
          <p className="pelcro-address-line1 plc-text-sm">
            {address?.phone}
          </p>
        </div>
      </div>
    </div>
  );
};
