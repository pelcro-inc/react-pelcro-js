import React from "react";
import { useTranslation } from "react-i18next";
import { PaymentMethodView } from "../PaymentMethod/PaymentMethodView";

export function PaymentMethodUpdateView(props) {
  const [t] = useTranslation("paymentCreate");

  return (
    <div id="pelcro-payment-method-update-view">
      <div className="plc-mb-2 plc-text-center plc-text-gray-700 pelcro-title-wrapper">
        <h4 className="plc-text-xl plc-font-semibold ">
          {t("title")}
        </h4>
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
