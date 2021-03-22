import React, { useContext, useCallback } from "react";
import { Input } from "../../SubComponents/Input";
import {
  RESET_CONFIRM_NEW_PASSWORD_ERROR,
  SET_CONFIRM_NEW_PASSWORD,
  VALIDATE_CONFIRM_NEW_PASSWORD
} from "../../utils/action-types";
import { store } from "./PasswordChangeContainer";

export function PasswordChangeConfirmNewPassword(props) {
  const {
    dispatch,
    state: { confirmNewPassword, confirmNewPasswordError }
  } = useContext(store);

  const handleBlur = useCallback(() => {
    return dispatch({ type: VALIDATE_CONFIRM_NEW_PASSWORD });
  }, [dispatch]);

  const handleInputChange = useCallback(
    (value) => {
      dispatch({ type: SET_CONFIRM_NEW_PASSWORD, payload: value });
    },
    [dispatch]
  );

  const handleFocus = useCallback(() => {
    dispatch({ type: RESET_CONFIRM_NEW_PASSWORD_ERROR });
  }, [dispatch]);

  return (
    <Input
      type="password"
      value={confirmNewPassword}
      error={confirmNewPasswordError}
      onChange={(e) => handleInputChange(e.target.value)}
      onBlur={handleBlur}
      onFocus={handleFocus}
      {...props}
    />
  );
}
