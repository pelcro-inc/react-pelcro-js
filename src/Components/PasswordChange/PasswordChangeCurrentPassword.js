import React, { useContext, useCallback } from "react";
import {
  VALIDATE_PASSWORD,
  SET_PASSWORD,
  RESET_PASSWORD_ERROR
} from "../../utils/action-types";
import { store } from "./PasswordChangeContainer";

export function PasswordChangeCurrentPassword(props) {
  const {
    dispatch,
    state: { currentPassword, currentPasswordError }
  } = useContext(store);

  const handleBlur = useCallback(() => {
    return dispatch({ type: VALIDATE_PASSWORD });
  }, [dispatch]);

  const handleInputChange = useCallback(
    (value) => {
      dispatch({ type: SET_PASSWORD, payload: value });
    },
    [dispatch]
  );

  const handleFocus = useCallback(() => {
    dispatch({ type: RESET_PASSWORD_ERROR });
  }, [dispatch]);

  return (
    <input
      type="password"
      value={currentPassword}
      error={currentPasswordError}
      onChange={(e) => handleInputChange(e.target.value)}
      onBlur={handleBlur}
      onFocus={handleFocus}
      {...props}
    />
  );
}
