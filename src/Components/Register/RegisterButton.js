import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { HANDLE_REGISTRATION } from "../../utils/action-types";
import { store } from "./RegisterContainer";

export const RegisterButton = ({ name, ...otherProps }) => {
  const {
    state: {
      emailError,
      passwordError,
      email,
      password,
      buttonDisabled
    },
    dispatch
  } = useContext(store);

  const { t } = useTranslation("register");

  const [isDisabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(
      buttonDisabled ||
        emailError ||
        passwordError ||
        !email.length ||
        !password.length
    );
  }, [buttonDisabled, emailError, passwordError, email, password]);

  return (
    <Button
      {...otherProps}
      onClick={() => dispatch({ type: HANDLE_REGISTRATION })}
      disabled={isDisabled}
      isLoading={buttonDisabled}
    >
      {name ?? t("messages.createAccount")}
    </Button>
  );
};
