import React, { useContext } from "react";
import { store } from "./PaymentMethodSelectContainer";
import { HANDLE_SUBMIT } from "../../utils/action-types";
import { Button } from "../../SubComponents/Button";
import { useTranslation } from "react-i18next";

export const PaymentMethodSelectSubmit = ({
  name,
  ...otherProps
}) => {
  const { t } = useTranslation("paymentMethod");
  const {
    dispatch,
    state: { selectedPaymentMethodId, isSubmitting }
  } = useContext(store);

  return (
    <Button
      {...otherProps}
      onClick={() => dispatch({ type: HANDLE_SUBMIT })}
      disabled={!selectedPaymentMethodId}
      isLoading={isSubmitting}
    >
      {name ?? t("select.buttons.selectPaymentMethod")}
    </Button>
  );
};
