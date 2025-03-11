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
    <div className="plc-text-left plc-mr-auto plc-my-6plc-w-1/2 plc-mx-auto ">
      <div className="plc-mx-auto plc-mb-4 plc-p-3 plc-bg-yellow-100 plc-text-yellow-800 plc-rounded-md plc-text-sm">
        {t("delete.alert", { defaultValue: t("delete.message") })}
      </div>

      {skeletonLoader ? (
        <div className="plc-w-full plc-h-16 plc-bg-gray-300 plc-rounded-md plc-animate-pulse"></div>
      ) : (
        <>
          {paymentMethodToDelete && (
            <div
              key={paymentMethodToDelete?.id}
              className="plc-relative plc-p-4 plc-shadow-md plc-text-gray-900 plc-rounded-lg plc-bg-white plc-border plc-border-gray-200 dark:plc-shadow-dark hover:plc-shadow-md hover:plc-shadow-gray-300/50 plc-transition-all plc-duration-300"
            >
              <div
                className="plc-flex plc-items-center plc-justify-between plc-w-full"
                id={`pelcro-payment-method-select-${paymentMethodToDelete?.id}`}
                name="paymentMethod"
              >
                <div className="plc-flex plc-items-center plc-space-x-4">
                  {getPaymentCardIcon(
                    paymentMethodToDelete.properties?.brand
                  )}

                  <div className="plc-flex plc-flex-col plc-text-lg">
                    <p className="plc-font-semibold plc-tracking-widest">
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

                {paymentMethodToDelete.is_default && (
                  <span className="plc-rounded-full plc-bg-gray-800 plc-text-white plc-inline-flex plc-h-7 plc-my-auto plc-items-center plc-py-1 plc-px-4 plc-text-sm">
                    {t("labels.default", { defaultValue: "Default" })}
                  </span>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
