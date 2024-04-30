import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { SELECT_PAYMENT_METHOD } from "../../utils/action-types";
import { store } from "./PaymentMethodDeleteContainer";
import { usePelcro } from "../../hooks/usePelcro";
import { Select } from "../../SubComponents/Select";

export const PaymentMethodDeleteList = (props) => {
  const { t } = useTranslation("paymentMethod");

  const {
    dispatch,
    state: {
      selectedPaymentMethodId,
      paymentMethods,
      skeletonLoader,
      showPaymentMethodSelect
    }
  } = useContext(store);

  const { paymentMethodToDelete } = usePelcro();

  const createPaymentMethodItems = () => {
    if (paymentMethods.length) {
      return paymentMethods
        .filter(
          (paymentMethod) =>
            paymentMethod?.id !== paymentMethodToDelete?.id
        )
        .map((paymentMethod) =>
          paymentMethod.properties.brand === "bacs_debit" ? (
            <option key={paymentMethod.id} value={paymentMethod.id}>
              bacs - {paymentMethod.properties.last4}
            </option>
          ) : (
            <option key={paymentMethod.id} value={paymentMethod.id}>
              {paymentMethod.properties.brand} -{" "}
              {paymentMethod.properties.last4} -{" "}
              {paymentMethod.properties.exp_month} /
              {paymentMethod.properties.exp_year}
            </option>
          )
        );
    }
  };

  const handlePaymentMethodSelect = (event) => {
    dispatch({
      type: SELECT_PAYMENT_METHOD,
      payload: event.target.value
    });
  };

  if (showPaymentMethodSelect) {
    return (
      <>
        {skeletonLoader ? (
          <div className="plc-w-full plc-h-8 plc-bg-gray-300 plc-rounded-md plc-animate-pulse"></div>
        ) : (
          <>
            {paymentMethods && (
              <div className="plc-mt-4">
                <Select
                  label={t("delete.options.select")}
                  name="default-payment-method"
                  onChange={handlePaymentMethodSelect}
                  value={selectedPaymentMethodId}
                >
                  <option value="" disabled selected></option>
                  {createPaymentMethodItems()}
                </Select>
              </div>
            )}
          </>
        )}
      </>
    );
  } else {
    return null;
  }
};
