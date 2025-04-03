import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { store } from "./PaymentMethodContainer";
import { usePelcro } from "../../hooks/usePelcro";
import { Button } from "../../SubComponents/Button";
import { getPaymentCardIcon } from "../../utils/utils";
import { ReactComponent as EditIcon } from "../../assets/edit.svg";

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
        className=" pelcro-payment-method-wrapper"
      >
        <div>
          <div className="plc-flex plc-justify-between plc-items-center plc-mb-2">
            <h3 className="plc-font-semibold plc-text-gray-900">
              {t("select.paymentMethod")}
            </h3>
            <button 
              disabled={isLoading}
              onClick={() => switchView("payment-method-select")}
              className="plc-h-8 plc-text-primary-600 plc-flex plc-items-center plc-gap-1 plc-text-sm plc-font-medium">
              <EditIcon className="plc-w-4 plc-h-4" />
              Change
            </button>
          </div>
          <div className="plc-bg-gray-50 plc-p-4 plc-rounded-lg plc-flex plc-items-center plc-gap-3">
            <div className="plc-w-10 plc-h-6 plc-flex plc-items-center plc-justify-center">
              {getPaymentCardIcon(paymentMethod.properties?.brand)}
            </div>
            <div>
              <div className="plc-font-medium plc-flex plc-items-center plc-gap-2">
                <span className="plc-font-semibold plc-text-gray-900">
                  {paymentMethod?.properties?.brand === "bacs_debit"
                    ? "••••"
                    : "•••• •••• ••••"}{" "}
                  {paymentMethod.properties?.last4}
                </span>
              </div>
              {paymentMethod.properties.brand !== "bacs_debit" && (
                <p className="plc-text-sm plc-text-gray-500">
                  {t("select.expires")}{" "}
                  {paymentMethod.properties?.exp_month}/
                  {paymentMethod.properties?.exp_year}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};
