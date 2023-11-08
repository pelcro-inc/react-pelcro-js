import React from "react";
import { PaymentMethodDeleteList } from "./PaymentMethodDeleteList";
import { PaymentMethodDeleteOptions } from "./PaymentMethodDeleteOptions";
import { PaymentMethodDeleteContainer } from "./PaymentMethodDeleteContainer";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";

export function PaymentMethodDeleteView(props) {
  return (
    <div id="pelcro-payment-method-delete-view">
      <PaymentMethodDeleteContainer {...props}>
        <AlertWithContext className="plc-mb-2" />
        <PaymentMethodDeleteOptions />
        <PaymentMethodDeleteList onSuccess={props.onSuccess} />
      </PaymentMethodDeleteContainer>
    </div>
  );
}
