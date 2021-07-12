import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Radio } from "../../SubComponents/Radio";
import { SELECT_PAYMENT_METHOD } from "../../utils/action-types";
import { store } from "./PaymentMethodSelectContainer";

export const PaymentMethodSelectList = () => {
  const { t } = useTranslation("paymentMethod");

  const {
    dispatch,
    state: { paymentMethods, selectedPaymentMethodId }
  } = useContext(store);

  const handlePaymentMethodSelect = (event) => {
    dispatch({
      type: SELECT_PAYMENT_METHOD,
      payload: event.target.value
    });
  };

  return (
    <div className="plc-px-3 plc-py-2 plc-space-y-4 plc-overflow-y-scroll plc-max-h-80 pelcro-payment-method-select-wrapper">
      {paymentMethods.map((paymentMethod) => {
        const isSelected =
          selectedPaymentMethodId === String(paymentMethod.id);

        return (
          <div
            key={paymentMethod.id}
            className={`plc-p-2 plc-pl-4 plc-shadow-md plc-text-gray-900 plc-rounded pelcro-payment-method-wrapper ${
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
            </Radio>
          </div>
        );
      })}
    </div>
  );
};

export const getPaymentCardIcon = (name) => {
  const icons = {
    Visa: (
      <svg
        className="plc-w-16"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
      >
        <path
          fill="#1565C0"
          d="M15.186 19l-2.626 7.832c0 0-.667-3.313-.733-3.729-1.495-3.411-3.701-3.221-3.701-3.221L10.726 30v-.002h3.161L18.258 19H15.186zM17.689 30L20.56 30 22.296 19 19.389 19zM38.008 19h-3.021l-4.71 11h2.852l.588-1.571h3.596L37.619 30h2.613L38.008 19zM34.513 26.328l1.563-4.157.818 4.157H34.513zM26.369 22.206c0-.606.498-1.057 1.926-1.057.928 0 1.991.674 1.991.674l.466-2.309c0 0-1.358-.515-2.691-.515-3.019 0-4.576 1.444-4.576 3.272 0 3.306 3.979 2.853 3.979 4.551 0 .291-.231.964-1.888.964-1.662 0-2.759-.609-2.759-.609l-.495 2.216c0 0 1.063.606 3.117.606 2.059 0 4.915-1.54 4.915-3.752C30.354 23.586 26.369 23.394 26.369 22.206z"
        />
        <path
          fill="#FFC107"
          d="M12.212,24.945l-0.966-4.748c0,0-0.437-1.029-1.573-1.029c-1.136,0-4.44,0-4.44,0S10.894,20.84,12.212,24.945z"
        />
      </svg>
    ),
    MasterCard: (
      <svg
        className="plc-w-16"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
      >
        <path
          fill="#ff9800"
          d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z"
        />
        <path
          fill="#d50000"
          d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z"
        />
        <path
          fill="#ff3d00"
          d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z"
        />
      </svg>
    ),
    "American Express": (
      <svg
        className="plc-w-16"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
      >
        <path
          fill="#1976D2"
          d="M45,35c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V13c0-2.209,1.791-4,4-4h34c2.209,0,4,1.791,4,4V35z"
        />
        <path
          fill="#FFF"
          d="M22.255 20l-2.113 4.683L18.039 20h-2.695v6.726L12.341 20h-2.274L7 26.981h1.815l.671-1.558h3.432l.682 1.558h3.465v-5.185l2.299 5.185h1.563l2.351-5.095v5.095H25V20H22.255zM10.135 23.915l1.026-2.44 1.066 2.44H10.135zM37.883 23.413L41 20.018h-2.217l-1.994 2.164L34.86 20H28v6.982h6.635l2.092-2.311L38.767 27h2.21L37.883 23.413zM33.728 25.516h-4.011v-1.381h3.838v-1.323h-3.838v-1.308l4.234.012 1.693 1.897L33.728 25.516z"
        />
      </svg>
    )
  };

  return (
    icons[name] ?? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="plc-w-16"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    )
  );
};
