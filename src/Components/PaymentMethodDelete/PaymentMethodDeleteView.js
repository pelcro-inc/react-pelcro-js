import React from "react";
import { useTranslation } from "react-i18next";
import { PaymentMethodDeleteList } from "./PaymentMethodDeleteList";
import { PaymentMethodDeleteOptions } from "./PaymentMethodDeleteOptions";
import { PaymentMethodDeleteContainer } from "./PaymentMethodDeleteContainer";

export function PaymentMethodDeleteView() {
  const [t] = useTranslation("paymentMethod");

  return (
    <div id="pelcro-payment-method-delete-view">
      <div className="plc-mb-2 plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4 className="plc-text-2xl plc-font-semibold">
          {t("delete.title")}
        </h4>
        <p>{t("delete.subtitle")}</p>
      </div>
      <PaymentMethodDeleteContainer>
        <PaymentMethodDeleteOptions />
        <PaymentMethodDeleteList />
      </PaymentMethodDeleteContainer>
    </div>
  );
}
