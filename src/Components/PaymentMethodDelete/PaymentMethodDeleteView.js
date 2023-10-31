import React from "react";
import { useTranslation } from "react-i18next";
import { PaymentMethodDeleteList } from "./PaymentMethodDeleteList";
import { PaymentMethodDeleteOptions } from "./PaymentMethodDeleteOptions";
import { PaymentMethodDeleteContainer } from "./PaymentMethodDeleteContainer";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";

export function PaymentMethodDeleteView(props) {
  const [t] = useTranslation("paymentMethod");

  return (
    <div id="pelcro-payment-method-delete-view">
      <div className="plc-mb-6 plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4 className="plc-text-2xl plc-font-semibold plc-mb-2">
          {t("delete.title")}
        </h4>
        <p className="">{t("delete.subtitle")}</p>
      </div>
      <PaymentMethodDeleteContainer {...props}>
        <AlertWithContext className="plc-mb-2" />
        <PaymentMethodDeleteOptions />
        <PaymentMethodDeleteList onSuccess={props.onSuccess} />
      </PaymentMethodDeleteContainer>
    </div>
  );
}
