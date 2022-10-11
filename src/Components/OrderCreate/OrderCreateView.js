import React from "react";
import { PaymentMethodView } from "../PaymentMethod/PaymentMethodView";

export const OrderCreateView = (props) => {
  return (
    <div id="pelcro-order-create-view">
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <PaymentMethodView
          type="orderCreate"
          showCoupon={true}
          showExternalPaymentMethods={false}
          {...props}
        />
      </form>
    </div>
  );
};
