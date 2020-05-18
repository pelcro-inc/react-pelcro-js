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

/**
 *
 */
export function ConfirmPassword({
  placeholder,
  style,
  className,
  id,
  store
}) {
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
    value => {
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
    <React.Fragment>
      <input
        type="password"
        id={id}
        style={{ ...style }}
        className={
          confirmPasswordError ? "input-error " : "" + className
        }
        value={password}
        onChange={e => handleInputChange(e.target.value)}
        placeholder={placeholder || "Enter Your Password again"}
        onBlur={() => setFinishedTyping(true)}
        onFocus={() => setFinishedTyping(false)}
      ></input>
      <div>{confirmPasswordError}</div>
    </React.Fragment>
  );
}
