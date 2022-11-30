import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { HANDLE_LOGIN } from "../../utils/action-types";
import { store } from "./LoginContainer";

export const LoginButton = ({ name, onClick, ...otherProps }) => {
  const {
    state: {
      emailError,
      passwordError,
      usernameError,
      email,
      password,
      username,
      buttonDisabled
    },
    dispatch
  } = useContext(store);

  const { t } = useTranslation("login");

  const [isDisabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(
      emailError ||
        passwordError ||
        usernameError ||
        ((!email.length || !username.length) && !password.length) ||
        buttonDisabled
    );
  }, [emailError, passwordError, usernameError, email, password, username, buttonDisabled]);

  return (
    <Button
      onClick={() => {
        dispatch({ type: HANDLE_LOGIN });
        onClick?.();
      }}
      disabled={isDisabled}
      isLoading={buttonDisabled}
      {...otherProps}
    >
      {name ?? t("labels.login")}
    </Button>
  );
};
