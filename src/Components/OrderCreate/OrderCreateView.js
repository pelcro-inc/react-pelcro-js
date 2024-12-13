import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import { PaymentMethodView } from "../PaymentMethod/PaymentMethodView";
import { OrderCreateSummary } from "./OrderCreateSummary";
import { notify } from "../../SubComponents/Notification";
import { isStagingEnvironment } from "../../utils/utils";
import axios from "axios";

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

  const [paymentInfo, setPaymentInfo] = useState({});

  async function fetchOrderSummary(orderSummaryPaylod) {
    const onSuccess = (response) => {
      setPaymentInfo({
        total: response?.data.total,
        shippingRate: response?.data.shipping_rate,
        subtotal: response?.data.subtotal,
        taxes: response?.data?.tax_rate
      });
    };

    const onError = (error) => {
      notify.error(t("errors.orderSummaryFailed"));
      console.error(error);
    };
    orderSummaryRequest(orderSummaryPaylod, onSuccess, onError);
  }

  useEffect(() => {
    if (!order?.length) {
      return;
    }

    const orderSummaryPayload = {
      items: order.map((item) => {
        return {
          sku_id: item.id,
          quantity: item.quantity
        };
      })
    };

    if (window.Pelcro.site.read()?.taxes_enabled) {
      orderSummaryPayload.address_id = selectedAddressId;
    }

    fetchOrderSummary(orderSummaryPayload);
  }, [order]);

  return (
    <div
      id="pelcro-order-create-view"
      className="plc-grid plc-grid-cols-1 md:plc-grid-cols-2 plc-gap-20"
    >
      <OrderCreateSummary order={order} paymentInfo={paymentInfo} />
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
          isSubmitDisabled={!paymentInfo.total}
          {...props}
        />
      </form>
    </div>
  );
};

// https://github.com/pelcro-inc/pelcro-client-sdk/blob/62e80cae05846919fff3f13e11981e00c15bdb66/src/models/ecommerce.js#L114 doesn't support passing address_id so we need to call API directly here
export const orderSummaryRequest = (
  orderSummaryPayload,
  onSuccess,
  onError
) => {
  const domain = isStagingEnvironment()
    ? "https://staging.pelcro.com"
    : "https://www.pelcro.com";
  const url = `${domain}/api/v1/sdk/ecommerce/order-summary`;

  const defaultParams = {
    site_id: window.Pelcro.siteid,
    language:
      window.Pelcro.helpers.getHtmlLanguageAttribute() ??
      window.Pelcro.language,
    device_hash: window.Pelcro.deviceHash,
    device_components: window.Pelcro.deviceComponents
  };

  axios.defaults.headers.common["Authorization"] =
    "Bearer " + window.Pelcro.user.read().auth_token;

  axios
    .post(url, {
      ...defaultParams,
      ...orderSummaryPayload
    })
    .then((resp) => {
      onSuccess(resp.data);
    })
    .catch((err) => {
      onError(err);
    });
};
