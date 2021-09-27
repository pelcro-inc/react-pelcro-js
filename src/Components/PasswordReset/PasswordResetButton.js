import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { HANDLE_SUBMIT } from "../../utils/action-types";
import { store } from "./PasswordResetContainer";

export const PasswordResetButton = ({
  name,
  onClick,
  ...otherProps
}) => {
  const {
    state: { buttonDisabled },
    dispatch
  } = useContext(store);

  const { t } = useTranslation("passwordReset");

  return (
    <Button
      onClick={() => {
        dispatch({ type: HANDLE_SUBMIT });
        onClick?.();
      }}
      disabled={buttonDisabled}
      isLoading={buttonDisabled}
      {...otherProps}
    >
      {name ?? t("submit")}
    </Button>
  );
};
