import React, { useContext, useState, useEffect } from "react";
import { Button } from "../../SubComponents/Button";
import {
  HANDLE_LOGIN,
  HANDLE_SUBMIT
} from "../../utils/action-types";
import { store } from "./PasswordResetContainer";

export const PasswordResetButton = ({ ...otherProps }) => {
  const {
    state: { email, password, passwordConfirmation, buttonDisabled },
    dispatch
  } = useContext(store);

  const [isDisabled, setDisabled] = useState(buttonDisabled);

  useEffect(() => {
    setDisabled(
      buttonDisabled ||
        !email.length ||
        !password.length ||
        !passwordConfirmation.length
    );
  }, [email, password]);

  return (
    <Button
      {...otherProps}
      onClick={() => dispatch({ type: HANDLE_SUBMIT })}
      disabled={isDisabled}
    >
      {otherProps.name || "Reset Password"}
    </Button>
  );
};
