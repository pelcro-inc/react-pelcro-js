import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { SUBMIT_PAYMENT, DISABLE_SUBMIT } from "../../utils/action-types";
import { store } from "../PaymentMethod/PaymentMethodContainer";

export const OrderCreateFreeButton = ({ name, onClick, ...otherProps }) => {
  const {
    state: {
      disableSubmit
    },
    dispatch
  } = useContext(store);

  const { t } = useTranslation("checkoutForm");

  const [isDisabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(
        disableSubmit
    );
  }, [disableSubmit]);

  return (
    <Button
      className='plc-w-full'
      onClick={() => {
        dispatch({ type: DISABLE_SUBMIT, payload: true });
        dispatch({ type: SUBMIT_PAYMENT });
        onClick?.();
      }}
      disabled={isDisabled}
      isLoading={disableSubmit}
      {...otherProps}
    >
      {t("labels.submit")}
    </Button>
  );
};
