import React from "react";
import { useTranslation } from "react-i18next";
import { PaymentMethodView } from "../PaymentMethod/PaymentMethodView";

/**
 *
 */
export function PaymentMethodUpdateView(props) {
  const [t] = useTranslation("paymentMethod");

  return (
    <div id="pelcro-payment-method-update-view">
      <div className="plc-mb-2 plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4 className="plc-text-2xl plc-font-semibold ">
          {t("update.title")}
        </h4>
        <p>{t("update.subtitle")}</p>
      </div>

      <PaymentMethodView
        type="updatePaymentSource"
        showCoupon={false}
        showExternalPaymentMethods={false}
        showApplePayButton={false}
        onDisplay={props.onDisplay}
        onFailure={props.onFailure}
        onSuccess={props.onSuccess}
      />
    </div>
  );
}
