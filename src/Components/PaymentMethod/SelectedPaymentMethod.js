import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { store } from "./PaymentMethodContainer";
import { usePelcro } from "../../hooks/usePelcro";
import { Button } from "../../SubComponents/Button";
import { getPaymentCardIcon } from "../../utils/utils";

export const SelectedPaymentMethod = () => {
  const { t } = useTranslation("paymentMethod");
  const {
    state: { isLoading }
  } = useContext(store);

  const { switchView, selectedPaymentMethodId } = usePelcro();
  const paymentMethod = window.Pelcro.user
    .read()
    ?.sources?.find?.((source) => {
      return source.id == selectedPaymentMethodId;
    });

  return (
    selectedPaymentMethodId && (
      <div
        key={paymentMethod.id}
        className="plc-px-2 plc-my-2 plc-text-gray-900 plc-rounded plc-shadow-md plc-ring-2 plc-ring-primary-400 pelcro-payment-method-wrapper"
      >
        <div
          className="plc-flex plc-items-center plc-px-1"
          id={`pelcro-payment-method-select-${paymentMethod.id}`}
        >
          <div className="plc-flex plc-items-center plc-justify-between plc-w-full">
            <div className="plc-flex plc-items-center plc-space-x-2">
              {getPaymentCardIcon(paymentMethod.properties?.brand)}

              <div className="plc-flex plc-flex-col plc-text-lg pelcro-payment-method-details">
                <p className="plc-font-semibold">
                  •••• •••• {paymentMethod.properties?.last4}
                </p>
                <p className="plc-text-sm plc-text-gray-500">
                  {t("select.expires")}{" "}
                  {paymentMethod.properties?.exp_month}/
                  {paymentMethod.properties?.exp_year}
                </p>
              </div>
            </div>

            <Button
              onClick={() => switchView("payment-method-select")}
              disabled={isLoading}
              variant="ghost"
              className="plc-text-primary-500"
            >
              {t("select.buttons.changePaymentMethod")}
            </Button>
          </div>
        </div>
      </div>
    )
  );
};