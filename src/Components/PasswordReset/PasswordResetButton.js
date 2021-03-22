import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { HANDLE_SUBMIT } from "../../utils/action-types";
import { store } from "./PasswordResetContainer";

export const PasswordResetButton = ({ name, ...otherProps }) => {
  const {
    state: { buttonDisabled },
    dispatch
  } = useContext(store);

  const { t } = useTranslation("passwordReset");

  return (
    <Button
      {...otherProps}
      onClick={() => dispatch({ type: HANDLE_SUBMIT })}
      disabled={buttonDisabled}
      isLoading={buttonDisabled}
      isFullWidth={true}
    >
      {name ?? t("submit")}
    </Button>
  );
};
