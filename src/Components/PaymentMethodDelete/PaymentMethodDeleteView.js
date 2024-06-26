import React from "react";
import { useTranslation } from "react-i18next";
import { PaymentMethodDeleteList } from "./PaymentMethodDeleteList";
import { PaymentMethodDeleteContainer } from "./PaymentMethodDeleteContainer";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";
import { PaymentMethodDetails } from "./PaymentMethodDetails";
import { PaymentMethodDeleteSubmit } from "./PaymentMethodDeleteSubmit";
import { PaymentMethodDeleteBack } from "./PaymentMethodDeleteBack";

export function PaymentMethodDeleteView(props) {
  const { t } = useTranslation("paymentMethod");

  return (
    <div id="pelcro-payment-method-delete-view">
      <div className="plc-mb-6 plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4 className="plc-text-2xl plc-font-semibold plc-mb-2">
          {t("delete.title")}
        </h4>
        <p className="plc-text-sm">{t("delete.subtitle")}</p>
      </div>
      <PaymentMethodDeleteContainer {...props}>
        <AlertWithContext />
        <PaymentMethodDetails />
        <PaymentMethodDeleteList />
        <p className="plc-text-sm plc-text-justify">
          {t("delete.message")}
        </p>
        <div className="plc-space-x-0 plc-space-y-3 plc-w-full plc-flex plc-flex-col plc-items-center plc-justify-center plc-mt-4">
          <PaymentMethodDeleteSubmit />
          <PaymentMethodDeleteBack />
        </div>
      </PaymentMethodDeleteContainer>
    </div>
  );
}
