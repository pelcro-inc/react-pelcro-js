import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { HANDLE_SUBMIT } from "../../utils/action-types";
import { store } from "./PasswordChangeContainer";

export const PasswordChangeButton = ({ name, ...otherProps }) => {
  const {
    state: {
      buttonDisabled,
      currentPasswordError,
      newPasswordError,
      confirmNewPasswordError
    },
    dispatch
  } = useContext(store);

  const { t } = useTranslation("passwordChange");

  const hasInvalidField =
    currentPasswordError ||
    newPasswordError ||
    confirmNewPasswordError;

  return (
    <Button
      {...otherProps}
      onClick={() => dispatch({ type: HANDLE_SUBMIT })}
      disabled={buttonDisabled || hasInvalidField}
      isLoading={buttonDisabled}
      isFullWidth={true}
    >
      {name ?? t("submit")}
    </Button>
  );
};
