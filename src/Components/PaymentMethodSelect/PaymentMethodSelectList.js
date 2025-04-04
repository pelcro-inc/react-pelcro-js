import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { getPaymentCardIcon } from "../../utils/utils";
import { Radio } from "../../SubComponents/Radio";
import { SELECT_PAYMENT_METHOD } from "../../utils/action-types";
import { store } from "./PaymentMethodSelectContainer";

export const PaymentMethodSelectList = () => {
  const { t } = useTranslation("paymentMethod");

  const {
    dispatch,
    state: { paymentMethods, selectedPaymentMethodId, skeletonLoader }
  } = useContext(store);

  const handlePaymentMethodSelect = (event) => {
    dispatch({
      type: SELECT_PAYMENT_METHOD,
      payload: event.target.value
    });
  };

  return (
    <div className="plc-w-full plc-my-6">
      {skeletonLoader ? (
        <div className="plc-w-full plc-h-20 plc-bg-gray-300 plc-rounded-md plc-animate-pulse"></div>
      ) : (
        <div className=" plc-space-y-4  pelcro-payment-method-select-wrapper">
          {paymentMethods.map((paymentMethod) => {
            const isSelected =
              selectedPaymentMethodId === String(paymentMethod.id);

            return (
              <div
                key={paymentMethod.id}
                className={`plc-p-4 plc-mb-4 last:plc-mb-0 plc-rounded-lg plc-text-gray-900 pelcro-address-wrapper plc-bg-white plc-shadow-sm plc-border-2 plc-border-gray-200 hover:plc-border-primary-600 hover:plc-shadow-md transition-all plc-w-full ${
                  isSelected ? "plc-border-primary-600" : ""
                }`}

              >
                <Radio
                  className="plc-flex plc-items-center pelcro-select-payment-method-radio"
                  labelClassName="plc-flex plc-items-center plc-space-x-2 plc-cursor-pointer plc-w-full"
                  id={`pelcro-payment-method-select-${paymentMethod.id}`}
                  name="paymentMethod"
                  checked={isSelected}
                  value={paymentMethod.id}
                  onChange={handlePaymentMethodSelect}
                >
                  {getPaymentCardIcon(
                    paymentMethod.properties?.brand
                  )}

                  <div className="plc-flex plc-flex-col plc-text-lg pelcro-payment-method-details">
                    <p className="plc-font-semibold">
                      {paymentMethod?.properties?.brand ===
                      "bacs_debit"
                        ? "••••"
                        : "•••• •••• ••••"}{" "}
                      {paymentMethod?.properties?.last4}
                    </p>
                    {paymentMethod.properties.brand !==
                      "bacs_debit" && (
                      <p className="plc-text-sm plc-text-gray-500">
                        {t("select.expires")}{" "}
                        {paymentMethod.properties?.exp_month}/
                        {paymentMethod.properties?.exp_year}
                      </p>
                    )}
                  </div>
                </Radio>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
