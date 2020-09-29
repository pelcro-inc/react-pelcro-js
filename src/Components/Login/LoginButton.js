import React, { useContext, useState, useEffect } from "react";
import { Button } from "../../SubComponents/Button";
import { HANDLE_LOGIN } from "../../utils/action-types";

export const LoginButton = ({ store, ...otherProps }) => {
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
      {...otherProps}
      onClick={() => dispatch({ type: HANDLE_LOGIN })}
      disabled={isDisabled}
    >
      {otherProps.name || "Login"}
    </Button>
  );
};
