import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { store } from "./PaymentMethodVerifyACHContainer";
import { Button } from "../../SubComponents/Button";
import { HANDLE_SUBMIT } from "../../utils/action-types";

export const PaymentMethodVerifyACHSubmit = () => {
  const { t } = useTranslation("paymentMethod");
  const {
    dispatch,
    state: { disableSubmit, isLoading }
  } = useContext(store);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: HANDLE_SUBMIT });
  };

  return (
    <Button
      id="pelcro-submit-verify-ach"
      className="plc-w-full"
      onClick={handleSubmit}
      disabled={disableSubmit}
      isLoading={isLoading}
    >
      {t("verifyACH.submit")}
    </Button>
  );
};
