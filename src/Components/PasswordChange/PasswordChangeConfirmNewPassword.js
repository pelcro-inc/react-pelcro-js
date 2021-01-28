import React, { useContext, useCallback } from "react";
import {
  RESET_CONFIRM_NEW_PASSWORD_ERROR,
  SET_CONFIRM_NEW_PASSWORD,
  VALIDATE_CONFIRM_NEW_PASSWORD
} from "../../utils/action-types";
import { store } from "./PasswordChangeContainer";

export function PasswordChangeConfirmNewPassword({
  placeholder,
  style,
  className,
  id,
  ...otherProps
}) {
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
    <React.Fragment>
      <input
        type="password"
        id={id}
        style={{ ...style }}
        className={className}
        value={confirmNewPassword}
        onChange={(e) => handleInputChange(e.target.value)}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        aria-invalid={Boolean(confirmNewPasswordError)}
        aria-describedby="pelcro-input-confirm_new_password-error"
        {...otherProps}
      />
      <div
        id="pelcro-input-confirm_new_password-error"
        aria-live="assertive"
      >
        {confirmNewPasswordError}
      </div>
    </React.Fragment>
  );
}
