import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { SUBSCRIBE, DISABLE_SUBMIT } from "../../utils/action-types";
import { store } from "../PaymentMethod/PaymentMethodContainer";

export const SubscriptionCreateFreePlanButton = ({ name, onClick, ...otherProps }) => {
  const {
    state: {
      disableSubmit
    },
    dispatch
  } = useContext(store);

  const { t } = useTranslation("common");

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
        dispatch({ type: SUBSCRIBE });
        onClick?.();
      }}
      disabled={isDisabled}
      isLoading={disableSubmit}
      {...otherProps}
    >
      {t("buttons.subscribe")}
    </Button>
  );
};
