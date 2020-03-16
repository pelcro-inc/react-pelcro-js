import React, { useContext, useState, useEffect } from "react";
import { Button } from "../../SubComponents/Button";
import { getErrorMessages } from "../common/Helpers";
import { showError } from "../../utils/showing-error";

export const LoginButton = props => {
  const {
    state: { emailError, passwordError, email, password },
    dispatch
  } = useContext(props.store);

  const [isDisabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(
      emailError || passwordError || !email.length || !password.length
    );
  }, [emailError, passwordError, email, password]);

  const handleLogin = () => {
    setDisabled(true);
    window.Pelcro.user.login({ email, password }, (err, res) => {
      setDisabled(false);

      if (err) {
        return showError(getErrorMessages(err), "pelcro-error-login");
      } else {
        props.resetView();
        props.onSuccess();
      }
    });
  };

  return (
    <Button {...props} onClick={() => handleLogin()} disabled={isDisabled}>
      {props.name || "Login"}
    </Button>
  );
};
