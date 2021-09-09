import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { HANDLE_REGISTRATION } from "../../utils/action-types";
import { store } from "./RegisterContainer";

export const RegisterButton = ({ name, onClick, ...otherProps }) => {
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
      onClick={() => {
        dispatch({ type: HANDLE_REGISTRATION });
        onClick?.();
      }}
      disabled={isDisabled}
      isLoading={buttonDisabled}
      {...otherProps}
    >
      {name ?? t("messages.createAccount")}
    </Button>
  );
};
