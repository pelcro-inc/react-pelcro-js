import React from "react";
import { useTranslation } from "react-i18next";
import { PaymentMethodView } from "../PaymentMethod/PaymentMethodView";

export const OrderCreateView = (props) => {
  const { t } = useTranslation("payment");
  return (
    <div className="pelcro-order-create-view">
      <div className="flex flex-col items-center text-lg font-semibold text-center pelcro-title-wrapper">
        <h4>{t("labels.checkout.title")}</h4>
      </div>
      <div className="mt-2 pelcro-form">
        <PaymentMethodView
          type="orderCreate"
          showCoupon={false}
          showExternalPaymentMethods={false}
          {...props}
        />
      </div>
    </div>
  );
};
