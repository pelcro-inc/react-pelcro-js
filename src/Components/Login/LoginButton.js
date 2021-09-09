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
      email,
      password,
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
        !email.length ||
        !password.length ||
        buttonDisabled
    );
  }, [emailError, passwordError, email, password, buttonDisabled]);

  return (
    <Button
      onClick={() => {
        dispatch({ type: HANDLE_LOGIN });
        onClick();
      }}
      disabled={isDisabled}
      isLoading={buttonDisabled}
      {...otherProps}
    >
      {name ?? t("labels.login")}
    </Button>
  );
};
