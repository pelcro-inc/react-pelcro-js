import React, { useContext, useState, useEffect } from "react";
import { Button } from "../../SubComponents/Button";
import { HANDLE_REGISTRATION } from "../../utils/action-types";

export const RegisterButton = ({ store, name, ...otherProps }) => {
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
      isFullWidth={true}
    >
      {name}
    </Button>
  );
};
