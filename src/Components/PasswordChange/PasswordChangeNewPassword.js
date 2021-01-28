import React, { useContext, useCallback } from "react";
import {
  VALIDATE_NEW_PASSWORD,
  SET_NEW_PASSWORD,
  RESET_NEW_PASSWORD_ERROR
} from "../../utils/action-types";
import { store } from "./PasswordChangeContainer";

export function PasswordChangeNewPassword({
  placeholder,
  style,
  className,
  id,
  ...otherProps
}) {
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

  return (
    <React.Fragment>
      <input
        type="password"
        id={id}
        style={{ ...style }}
        className={className}
        value={newPassword}
        onChange={(e) => handleInputChange(e.target.value)}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        aria-invalid={Boolean(newPasswordError)}
        aria-describedby="pelcro-input-new_password-error"
        {...otherProps}
      />
      <div id="pelcro-input-new_password-error" aria-live="assertive">
        {newPasswordError}
      </div>
    </React.Fragment>
  );
}
