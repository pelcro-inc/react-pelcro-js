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
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <PaymentMethodView
          type="orderCreate"
          showCoupon={true}
          showExternalPaymentMethods={false}
          showApplePayButton={true}
          showOrderButton={showOrderButton}
          order={order}
          {...props}
        />
      </form>
    </div>
  );
};
