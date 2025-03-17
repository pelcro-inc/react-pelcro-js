import React, { useContext, useCallback } from "react";
import { Input } from "../../SubComponents/Input";
import {
  VALIDATE_NEW_PASSWORD,
  SET_NEW_PASSWORD,
  RESET_NEW_PASSWORD_ERROR
} from "../../utils/action-types";
import { store } from "./PasswordChangeContainer";
import { Password } from "../../SubComponents/Password";

export function PasswordChangeNewPassword(props) {
  const {
    dispatch,
    state: { newPassword, newPasswordError }
  } = useContext(store);

  const handleBlur = useCallback(() => {
    return dispatch({ type: VALIDATE_NEW_PASSWORD });
  }, [dispatch]);

  const handleInputChange = useCallback(
    (value) => {
      dispatch({ type: SET_NEW_PASSWORD, payload: value });
    },
    [dispatch]
  );

  const handleFocus = useCallback(() => {
    dispatch({ type: RESET_NEW_PASSWORD_ERROR });
  }, [dispatch]);

  // Use the Password component if showStrength is true
  if (props.showStrength) {
    return (
      <Password
        store={store}
        showStrength={true}
        value={newPassword ?? ""}
        error={newPasswordError}
        onChange={(e) => handleInputChange(e.target.value)}
        onBlur={handleBlur}
        onFocus={handleFocus}
        {...props}
      />
    );
  }

  // Otherwise use the regular Input component
  return (
    <Input
      type="password"
      value={newPassword ?? ""}
      error={newPasswordError}
      onChange={(e) => handleInputChange(e.target.value)}
      onBlur={handleBlur}
      onFocus={handleFocus}
      {...props}
    />
  );
}
