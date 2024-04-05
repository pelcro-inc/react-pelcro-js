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
      isDisabled,
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
          ? isDisabled || !selectedPaymentMethodId
          : isDisabled
      }
      isLoading={isLoading}
      className="plc-w-full"
      {...otherProps}
    >
      {name ?? t("delete.buttons.delete")}
    </Button>
  );
};
