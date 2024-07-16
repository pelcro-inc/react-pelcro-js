import React from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import { PaymentMethodView } from "../PaymentMethod/PaymentMethodView";
import { OrderCreateSummary } from "./OrderCreateSummary";

export const OrderCreateView = (props) => {
  const { t } = useTranslation("checkoutForm");
  const { order, selectedAddressId } = usePelcro();
  const skipPayment =
    window.Pelcro?.uiSettings?.skipPaymentForFreePlans;
  const showOrderButton =
    skipPayment &&
    (order?.price === 0 ||
      (order?.length > 0 &&
        order.every((item) => item?.price === 0)));
  const { addresses } = window?.Pelcro?.user?.read() ?? [];
  const user = window?.Pelcro?.user?.read() ?? [];

  const address = selectedAddressId
    ? addresses?.find((address) => address.id == selectedAddressId) ??
      null
    : addresses?.find(
        (address) => address.type == "shipping" && address.is_default
      ) ?? null;

  return (
    <div
      id="pelcro-order-create-view"
      className="plc-grid plc-grid-cols-1 md:plc-grid-cols-2 plc-gap-20"
    >
      <OrderCreateSummary order={order} />
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <div className="plc-flex plc-flex-row plc-justify-between plc-px-8 md:plc-px-0">
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
        <PaymentMethodView
          type="orderCreate"
          showCoupon={true}
          showExternalPaymentMethods={false}
          showApplePayButton={true}
          showOrderButton={showOrderButton}
          order={order}
          {...props}
        />
      </form>
    </div>
  );
};
