import React, { useContext, useCallback } from "react";
import {
  VALIDATE_PASSWORD,
  SET_PASSWORD,
  RESET_PASSWORD_ERROR
} from "../../utils/action-types";
import { store } from "./PasswordChangeContainer";

export function PasswordChangeCurrentPassword({
  placeholder,
  style,
  className,
  id,
  ...otherProps
}) {
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
    <React.Fragment>
      <input
        type="password"
        id={id}
        style={{ ...style }}
        className={className}
        value={currentPassword}
        onChange={(e) => handleInputChange(e.target.value)}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        aria-invalid={Boolean(currentPasswordError)}
        aria-describedby="pelcro-input-password-error"
        {...otherProps}
      />
      <div id="pelcro-input-password-error" aria-live="assertive">
        {currentPasswordError}
      </div>
    </React.Fragment>
  );
}
