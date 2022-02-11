import React, { useContext } from "react";
import { store } from "./EmailVerifyContainer";
import { HANDLE_SUBMIT } from "../../utils/action-types";
import { Button } from "../../SubComponents/Button";
import { useTranslation } from "react-i18next";

export const EmailVerifyResendButton = ({
  name,
  onClick,
  ...otherProps
}) => {
  const {
    dispatch,
    state: { isSubmitting }
  } = useContext(store);

  const { t } = useTranslation("verifyEmail");

  return (
    <Button
      onClick={() => {
        dispatch({ type: HANDLE_SUBMIT });
        onClick?.();
      }}
      isLoading={isSubmitting}
      {...otherProps}
    >
      {name ?? t("labels.resend")}
    </Button>
  );
};
