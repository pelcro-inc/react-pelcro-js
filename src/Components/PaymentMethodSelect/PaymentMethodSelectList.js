import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { getPaymentCardIcon } from "../../utils/utils";
import { Radio } from "../../SubComponents/Radio";
import { SELECT_PAYMENT_METHOD } from "../../utils/action-types";
import { store } from "./PaymentMethodSelectContainer";
import { Button } from "../../SubComponents/Button";
import { usePelcro } from "../../hooks/usePelcro";

export const PaymentMethodSelectList = () => {
  const { t } = useTranslation("paymentMethod");
  const { setPaymentMethodToVerify, switchView } = usePelcro();

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
            const needsVerification =
              paymentMethod.status === "pending";

            return (
              <div
                key={paymentMethod.id}
                className={`plc-p-2 plc-pl-4 plc-shadow-md plc-text-gray-900 plc-rounded pelcro-payment-method-wrapper ${
                  isSelected
                    ? "plc-ring-2 plc-ring-primary-400"
                    : "plc-ring-1 plc-ring-gray-200"
                }`}
              >
                <div className="plc-flex plc-items-center plc-justify-between">
                  <Radio
                    className="plc-flex plc-items-center pelcro-select-payment-method-radio plc-flex-grow"
                    labelClassName="plc-flex plc-items-center plc-space-x-2 plc-cursor-pointer plc-w-full"
                    id={`pelcro-payment-method-select-${paymentMethod.id}`}
                    name="paymentMethod"
                    checked={isSelected}
                    value={paymentMethod.id}
                    onChange={handlePaymentMethodSelect}
                    disabled={needsVerification}
                  >
                    {getPaymentCardIcon(
                      paymentMethod.properties?.brand
                    )}

                    <div className="plc-flex plc-flex-col plc-text-lg pelcro-payment-method-details plc-flex-grow">
                      <div className="plc-flex plc-items-center plc-gap-2">
                        <p className="plc-font-semibold">
                          •••• •••• {paymentMethod.properties?.last4}
                        </p>
                        {needsVerification && (
                          <span className="plc-rounded-full plc-bg-yellow-500 plc-text-white plc-text-xs plc-py-1 plc-px-2">
                            {t("select.pending")}
                          </span>
                        )}
                      </div>
                      <p className="plc-text-sm plc-text-gray-500">
                        {t("select.expires")}{" "}
                        {paymentMethod.properties?.exp_month}/
                        {paymentMethod.properties?.exp_year}
                      </p>
                    </div>
                  </Radio>
                  {needsVerification && (
                    <Button
                      className="plc-bg-yellow-500 plc-text-white plc-text-xs plc-px-3 plc-py-1 plc-h-8"
                      onClick={() => {
                        setPaymentMethodToVerify(paymentMethod);
                        switchView("payment-method-verify-ach");
                      }}
                    >
                      {t("select.verify")}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
