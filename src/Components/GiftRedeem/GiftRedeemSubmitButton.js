import React, { useContext } from "react";
import { store } from "./GiftRedeemContainer";
import { HANDLE_SUBMIT } from "../../utils/action-types";
import { Button } from "../../SubComponents/Button";
import { useTranslation } from "react-i18next";

export const GiftRedeemSubmitButton = ({
  name,
  onClick,
  ...otherProps
}) => {
  const {
    dispatch,
    state: { disableSubmit, isSubmitting }
  } = useContext(store);

  const { t } = useTranslation("register");

  return (
    <Button
      onClick={() => {
        dispatch({ type: HANDLE_SUBMIT });
        onClick?.();
      }}
      disabled={disableSubmit}
      isLoading={isSubmitting}
      {...otherProps}
    >
      {name ?? t("redeem.buttons.redeem")}
    </Button>
  );
};
