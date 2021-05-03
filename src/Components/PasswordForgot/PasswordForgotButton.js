import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { HANDLE_SUBMIT } from "../../utils/action-types";
import { store } from "./PasswordForgotContainer";

export const PasswordForgotButton = ({ name, ...otherProps }) => {
  const {
    state: { buttonDisabled, email, emailError },
    dispatch
  } = useContext(store);

  const { t } = useTranslation("passwordForgot");

  const [isDisabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(emailError || !email.length || buttonDisabled);
  }, [emailError, email, buttonDisabled]);

  return (
    <Button
      {...otherProps}
      onClick={() => dispatch({ type: HANDLE_SUBMIT })}
      disabled={isDisabled}
      isLoading={buttonDisabled}
    >
      {name ?? t("submit")}
    </Button>
  );
};
