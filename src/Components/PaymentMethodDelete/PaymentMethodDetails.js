import React, { useContext } from "react";
import { store } from "./PaymentMethodDeleteContainer";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import { getPaymentCardIcon } from "../../utils/utils";

export const PaymentMethodDetails = () => {
  const {
    state: { skeletonLoader }
  } = useContext(store);

  const { t } = useTranslation("paymentMethod");

  const { paymentMethodToDelete } = usePelcro();

  return (
    <div className="plc-text-left plc-mr-auto plc-mb-6">
      <h4 className="plc-mb-2">{t("delete.details")}</h4>
      {skeletonLoader ? (
        <div className="plc-w-full plc-h-16 plc-bg-gray-300 plc-rounded-md plc-animate-pulse"></div>
      ) : (
        <>
          {paymentMethodToDelete && (
            <div
              key={paymentMethodToDelete?.id}
              className={`plc-p-2 plc-pl-4 plc-shadow-md_dark plc-text-gray-900 plc-rounded pelcro-payment-method-wrapper`}
            >
              <div
                className="plc-flex plc-items-center plc-space-x-2 plc-w-full pelcro-select-payment-method-radio"
                id={`pelcro-payment-method-select-${paymentMethodToDelete?.id}`}
                name="paymentMethod"
              >
                {getPaymentCardIcon(
                  paymentMethodToDelete.properties?.brand
                )}

                <div className="plc-flex plc-flex-col plc-text-lg pelcro-payment-method-details">
                  <p className="plc-font-semibold">
                    {paymentMethodToDelete?.properties?.brand ===
                    "bacs_debit"
                      ? "••••"
                      : "•••• •••• ••••"}{" "}
                    {paymentMethodToDelete.properties?.last4}
                  </p>
                  {paymentMethodToDelete.properties.brand !==
                    "bacs_debit" && (
                    <p className="plc-text-sm plc-text-gray-500">
                      {t("select.expires")}{" "}
                      {paymentMethodToDelete.properties?.exp_month}/
                      {paymentMethodToDelete.properties?.exp_year}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
