import React from "react";
import { useTranslation } from "react-i18next";
import { PaymentMethodView } from "../PaymentMethod/PaymentMethodView";

export const OrderCreateView = (props) => {
  const { t } = useTranslation("payment");
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
          showCoupon={false}
          showExternalPaymentMethods={false}
          {...props}
        />
      </form>
    </div>
  );
};
