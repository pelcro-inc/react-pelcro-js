import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { getPaymentCardIcon } from "../../utils/utils";
import { Radio } from "../../SubComponents/Radio";
import { SELECT_PAYMENT_METHOD } from "../../utils/action-types";
import { store } from "./PaymentMethodDeleteContainer";
import { PaymentMethodView } from "../PaymentMethod/PaymentMethodView";
import { PaymentMethodDeleteSubmit } from "./PaymentMethodDeleteSubmit";
import { usePelcro } from "../../components";

export const PaymentMethodDeleteList = (props) => {
  const { t } = useTranslation("paymentMethod");

  const {
    dispatch,
    state: {
      deleteOption,
      selectedPaymentMethodId,
      paymentMethods,
      skeletonLoader
    }
  } = useContext(store);

  const { paymentMethodToDelete } = usePelcro();

  const handlePaymentMethodSelect = (event) => {
    dispatch({
      type: SELECT_PAYMENT_METHOD,
      payload: event.target.value
    });
  };

  return (
    <>
      {skeletonLoader ? (
        <div className="plc-w-full plc-h-40 plc-bg-gray-300 plc-rounded-md plc-animate-pulse"></div>
      ) : (
        <>
          {paymentMethods && deleteOption === "select" && (
            <div>
              <div className="plc-px-3 plc-py-2 plc-space-y-4 plc-overflow-y-scroll no-scrollbar plc-max-h-80 pelcro-payment-method-select-wrapper plc-mb-4">
                {paymentMethods
                  .filter(
                    (paymentMethod) =>
                      paymentMethod?.id !== paymentMethodToDelete?.id
                  )
                  .map((paymentMethod) => {
                    const isSelected =
                      selectedPaymentMethodId ===
                      String(paymentMethod?.id);
                    return (
                      <div
                        key={paymentMethod?.id}
                        className={`plc-p-2 plc-pl-4 plc-shadow-md plc-text-gray-900 plc-rounded pelcro-payment-method-wrapper`}
                      >
                        <Radio
                          className="plc-flex plc-items-center pelcro-select-payment-method-radio"
                          labelClassName="plc-flex plc-items-center plc-space-x-2 plc-cursor-pointer plc-w-full"
                          id={`pelcro-payment-method-select-${paymentMethod?.id}`}
                          name="paymentMethod"
                          checked={isSelected}
                          value={paymentMethod?.id}
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
                              {paymentMethod.properties?.last4}
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
              <div className="plc-px-3">
                <PaymentMethodDeleteSubmit />
              </div>
            </div>
          )}
          {deleteOption === "add" && (
            <PaymentMethodView
              type="deletePaymentSource"
              showCoupon={false}
              showExternalPaymentMethods={false}
              showApplePayButton={false}
              onDisplay={props.onDisplay}
              onFailure={props.onFailure}
              onSuccess={props.onSuccess}
              setAsDefault={true}
            />
          )}
        </>
      )}
    </>
  );
};
