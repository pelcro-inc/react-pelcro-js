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
        <span className="plc-font-medium">
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
    <div className="plc-mt-3 plc-bg-white plc-rounded-lg plc-shadow-sm">
      <div className="plc-flex plc-flex-row plc-items-center plc-mb-3 plc-text-left plc-text-gray-900 plc-rounded-lg plc-border plc-border-gray-100 plc-p-2">
        <div className="plc-w-3/4 plc-font-normal plc-text-left">
          {plan && getPricingText(plan)}
        </div>
        <div className="plc-w-1/4 plc-pl-2">
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="plc-rounded-md plc-shadow-sm plc-object-cover plc-w-full"
            />
          )}
        </div>
      </div>

      <div className="plc-grid plc-grid-cols-2 plc-gap-2  plc-text-sm">
        {address && (
          <div className="plc-bg-gray-50 plc-py-2 plc-px-3 plc-rounded-md">
            <p className="pelcro-address-name plc-font-semibold plc-text-primary-600 plc-mb-1">
              {t("labels.shippingAddress")}
            </p>
            {address?.company && (
              <p className="pelcro-address-company plc-mb-1">{address.company}</p>
            )}
            <p className="plc-mb-1">
              {address?.first_name} {address?.last_name}
            </p>
            <p className="plc-mb-1">{address?.line1}</p>
            <p>
              {address?.city}, {address?.state}{" "}
              {address?.postal_code}, {address?.country}
            </p>
          </div>
        )}

        <div className="plc-bg-gray-50 plc-p-3 plc-rounded-md">
          <p className="plc-font-semibold plc-text-primary-600 plc-mb-1">
            {t("labels.contactDetails")}
          </p>
          <p className="plc-mb-1">{user.email}</p>
          {address?.phone && <p>{address.phone}</p>}
        </div>
      </div>
    </div>
  );
};
