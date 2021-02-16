import React, { useContext } from "react";
import { Button } from "../../SubComponents/Button";
import { HANDLE_SUBMIT } from "../../utils/action-types";
import { store } from "./PasswordChangeContainer";

export const PasswordChangeButton = ({ name, ...otherProps }) => {
  const {
    state: {
      buttonDisabled,
      currentPasswordError,
      newPasswordError,
      confirmNewPasswordError
    },
    dispatch
  } = useContext(store);

  const hasInvalidField =
    currentPasswordError ||
    newPasswordError ||
    confirmNewPasswordError;

  return (
    <Button
      {...otherProps}
      onClick={() => dispatch({ type: HANDLE_SUBMIT })}
      disabled={buttonDisabled || hasInvalidField}
      isFullWidth={true}
    >
      {name}
    </Button>
  );
};
