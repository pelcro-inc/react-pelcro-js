import React, {
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import {
  SET_CONFIRM_PASSWORD,
  SET_CONFIRM_PASSWORD_ERROR,
  CONFIRM_PASSWORD_USED
} from "../utils/action-types";
import { Input } from "./Input";

/**
 *
 */
export function ConfirmPassword({ store, ...otherProps }) {
  const {
    dispatch,
    state: {
      confirmPassword: stateConfirmPassword,
      confirmPasswordError
    }
  } = useContext(store);
  const [password, setPassword] = useState(stateConfirmPassword);
  const [finishedTyping, setFinishedTyping] = useState(false);

  useEffect(
    () => dispatch({ type: CONFIRM_PASSWORD_USED, payload: true }),
    [dispatch]
  );

  const handleInputChange = useCallback(
    (value) => {
      setPassword(value);

      if (password.length) {
        dispatch({ type: SET_CONFIRM_PASSWORD, payload: password });
      } else if (finishedTyping) {
        dispatch({
          type: SET_CONFIRM_PASSWORD_ERROR,
          payload: "Confirm password is required."
        });
      }
    },
    [dispatch, password, finishedTyping]
  );

  useEffect(() => {
    handleInputChange(password);
  }, [finishedTyping, password, handleInputChange]);

  return (
    <Input
      type="password"
      error={confirmPasswordError}
      value={password}
      onChange={(e) => handleInputChange(e.target.value)}
      onBlur={() => setFinishedTyping(true)}
      onFocus={() => setFinishedTyping(false)}
      {...otherProps}
    />
  );
}
