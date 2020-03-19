import React, { useContext, useState, useEffect } from "react";
import { Button } from "../../SubComponents/Button";
import { HANDLE_REGISTRATION } from "../../utils/action-types";

export const RegisterButton = ({ store, ...otherProps }) => {
  const {
    state: { emailError, passwordError, email, password },
    dispatch
  } = useContext(store);

  const [isDisabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(
      emailError || passwordError || !email.length || !password.length
    );
  }, [emailError, passwordError, email, password]);

  return (
    <Button
      {...otherProps}
      onClick={() => dispatch({ type: HANDLE_REGISTRATION })}
      disabled={isDisabled}
    >
      {otherProps.name || "Register"}
    </Button>
  );
};
