import React from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import { PaymentMethodView } from "../PaymentMethod/PaymentMethodView";

export const OrderCreateView = (props) => {
  const { t } = useTranslation("payment");
  const { order } = usePelcro();
  const skipPayment =
    window.Pelcro?.uiSettings?.skipPaymentForFreePlans;
  const showOrderButton =
    skipPayment &&
    (order?.price === 0 ||
      (order?.length > 0 &&
        order.every((item) => item?.price === 0)));

  return (
    <div id="pelcro-order-create-view">
      <div className="plc-mb-6 plc-text-2xl plc-font-semibold plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4>{t("labels.checkout.title")}</h4>
      </div>
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <PaymentMethodView
          type="orderCreate"
          showCoupon={true}
          showExternalPaymentMethods={false}
          showOrderButton={showOrderButton}
          order={order}
          {...props}
        />
      </form>
    </div>
  );
};
