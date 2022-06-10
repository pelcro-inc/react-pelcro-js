import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { HANDLE_PASSWORDLESS_LOGIN } from "../../utils/action-types";
import { store } from "./LoginContainer";

export const LoginRequestLoginToken = ({ name, onClick, ...otherProps }) => {
  const {
    state: {
      emailError,
      email,
      passwordlessButtonDisabled
    },
    dispatch
  } = useContext(store);

  const { t } = useTranslation("login");

  const [isDisabled, setDisabled] = useState(false);

  useEffect(() => {
    setDisabled(
      emailError ||
      !email.length
    );
  }, [emailError, email, passwordlessButtonDisabled]);

  return (
    <Button
      onClick={() => {
        dispatch({ type: HANDLE_PASSWORDLESS_LOGIN });
        onClick?.();
      }}
      disabled={isDisabled}
      isLoading={passwordlessButtonDisabled}
      {...otherProps}
    >
      {name ?? t("labels.passwordless")}
    </Button>
  );
};
