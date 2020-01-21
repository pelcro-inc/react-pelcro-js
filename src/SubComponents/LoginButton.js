import React, { useContext, useState, useEffect } from "react";
import { Button } from "./Button";
import { RESET_LOGIN_FORM } from "../utils/action-types";

export const LoginButton = props => {
  const {
    state: { emailError, passwordError, email, password },
    dispatch
  } = useContext(props.store);

  const [isDisabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(emailError || passwordError);
  }, [emailError, passwordError]);

  const handleLogin = () => {
    setDisabled(true);
    window.Pelcro.user.login({ email, password }, (err, res) => {
      setDisabled(false);

      if (!err) {
        alert("Logged In! ", err);
      } else {
        dispatch({ type: RESET_LOGIN_FORM });
        console.log("Error! ", err);
      }
    });
  };

  return (
    <Button {...props} onClick={() => handleLogin()} disabled={isDisabled}>
      {props.name || "Login"}
    </Button>
  );
};
