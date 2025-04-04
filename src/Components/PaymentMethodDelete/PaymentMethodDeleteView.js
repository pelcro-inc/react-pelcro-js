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
      <PaymentMethodDeleteContainer {...props}>
        <AlertWithContext />
        <PaymentMethodDetails />
        <PaymentMethodDeleteList />
        <div className="plc-space-x-3 plc-flex plc-flex-row plc-items-center plc-justify-center plc-mt-4">
          <PaymentMethodDeleteBack />
          <PaymentMethodDeleteSubmit />
        </div>
      </PaymentMethodDeleteContainer>
    </div>
  );
}
