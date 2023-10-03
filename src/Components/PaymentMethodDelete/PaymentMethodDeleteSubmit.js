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
    state: { selectedPaymentMethodId, isSubmitting }
  } = useContext(store);

  return (
    <Button
      onClick={() => {
        dispatch({ type: HANDLE_SUBMIT });
        onClick?.();
      }}
      disabled={!selectedPaymentMethodId}
      isLoading={isSubmitting}
      className="plc-w-full"
      {...otherProps}
    >
      {name ?? t("select.buttons.selectPaymentMethod")}
    </Button>
  );
};
