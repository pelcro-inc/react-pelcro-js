import React, { useContext } from "react";
import { store } from "./PaymentMethodDeleteContainer";
import { HANDLE_SUBMIT } from "../../utils/action-types";
import { Button } from "../../SubComponents/Button";
import { useTranslation } from "react-i18next";

export const PaymentMethodDeleteSubmit = ({
  name,
  onClick,
  ...otherProps
}) => {
  const { t } = useTranslation("paymentMethod");
  const {
    dispatch,
    state: {
      isLoading,
      disableSubmit,
      showPaymentMethodSelect,
      selectedPaymentMethodId
    }
  } = useContext(store);

  return (
    <Button
      onClick={() => {
        dispatch({ type: HANDLE_SUBMIT });
        onClick?.();
      }}
      disabled={
        showPaymentMethodSelect
          ? !selectedPaymentMethodId
          : disableSubmit
      }
      isLoading={isLoading}
      className="plc-w-full plc-bg-red-500 plc-text-white hover:plc-bg-red-600"
      {...otherProps}
    >
      {name ?? t("delete.buttons.delete")}
    </Button>
  );
};
