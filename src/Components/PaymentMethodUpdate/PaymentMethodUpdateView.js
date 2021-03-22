import React from "react";
import { useTranslation } from "react-i18next";
import { PaymentMethodView } from "../PaymentMethod/PaymentMethodView";

export function PaymentMethodUpdateView(props) {
  const [t] = useTranslation("paymentCreate");

  return (
    <div id="pelcro-payment-method-update-view">
      <div className="plc-text-center">
        <h4 className="plc-mb-2 plc-text-xl">{t("title")}</h4>
        <p>{t("subtitle")}</p>
      </div>

      <PaymentMethodView
        successMessage={t("success")}
        showCoupon={false}
        onDisplay={props.onDisplay}
        onFailure={props.onFailure}
        onSuccess={props.onSuccess}
      />
    </div>
  );
}
