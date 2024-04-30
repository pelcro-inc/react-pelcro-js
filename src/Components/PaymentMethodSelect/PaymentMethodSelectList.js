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
    <div>
      {skeletonLoader ? (
        <div className="plc-w-full plc-h-20 plc-bg-gray-300 plc-rounded-md plc-animate-pulse"></div>
      ) : (
        <div className="plc-px-3 plc-py-2 plc-space-y-4 plc-overflow-y-scroll plc-max-h-80 pelcro-payment-method-select-wrapper">
          {paymentMethods.map((paymentMethod) => {
            const isSelected =
              selectedPaymentMethodId === String(paymentMethod.id);

            return (
              <div
                key={paymentMethod.id}
                className={`plc-p-2 plc-pl-4 plc-shadow-md plc-text-gray-900 plc-rounded plc-min-h-14 plc-flex plc-items-center pelcro-payment-method-wrapper ${
                  isSelected
                    ? "plc-ring-2 plc-ring-primary-400"
                    : "plc-ring-1 plc-ring-gray-200"
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
