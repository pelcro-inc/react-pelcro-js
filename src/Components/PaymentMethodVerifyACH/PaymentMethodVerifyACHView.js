import React from "react";
import { useTranslation } from "react-i18next";
import { PaymentMethodVerifyACHContainer } from "./PaymentMethodVerifyACHContainer";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";
import { PaymentMethodVerifyACHInput } from "./PaymentMethodVerifyACHInput";
import { PaymentMethodVerifyACHSubmit } from "./PaymentMethodVerifyACHSubmit";
import { PaymentMethodVerifyACHBack } from "./PaymentMethodVerifyACHBack";

export function PaymentMethodVerifyACHView(props) {
  const { t } = useTranslation("paymentMethod");

  return (
    <div id="pelcro-payment-method-verify-ach-view">
      <div className="plc-mb-6 plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4 className="plc-text-2xl plc-font-semibold plc-mb-2">
          {t("verifyACH.title")}
        </h4>
        <p className="plc-text-sm">{t("verifyACH.subtitle")}</p>
      </div>
      <PaymentMethodVerifyACHContainer {...props}>
        <AlertWithContext />
        <PaymentMethodVerifyACHInput />
        <div className="plc-space-x-0 plc-space-y-3 plc-w-full plc-flex plc-flex-col plc-items-center plc-justify-center plc-mt-4">
          <PaymentMethodVerifyACHSubmit />
          <PaymentMethodVerifyACHBack />
        </div>
      </PaymentMethodVerifyACHContainer>
    </div>
  );
}
