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
