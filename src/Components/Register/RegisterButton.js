import React, { useContext, useState, useEffect } from "react";
import { Button } from "../../SubComponents/Button";
import { showError } from "../../utils/showing-error";
import { getErrorMessages } from "../common/Helpers";

export const RegisterButton = ({
  store,
  resetView,
  onSuccess = () => {},
  ...otherProps
}) => {
  const {
    state: { emailError, passwordError, email, password }
  } = useContext(store);

  const [isDisabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(
      emailError || passwordError || !email.length || !password.length
    );
  }, [emailError, passwordError, email, password]);

  const handleRegister = () => {
    setDisabled(true);
    window.Pelcro.user.register({ email, password }, (err, res) => {
      setDisabled(false);

      if (err) {
        return showError(getErrorMessages(err), "pelcro-error-register");
      } else {
        resetView();
        onSuccess();
      }
    });
  };

  return (
    <Button
      {...otherProps}
      onClick={() => handleRegister()}
      disabled={isDisabled}
    >
      {otherProps.name || "Register"}
    </Button>
  );
};
