import React, {
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import {
  SET_PASSWORD,
  SET_PASSWORD_ERROR
} from "../utils/action-types";

/**
 *
 */
export function Password({
  placeholder,
  style,
  className,
  id,
  store,
  ...otherProps
}) {
  const {
    dispatch,
    state: { password: statePassword, passwordError }
  } = useContext(store);
  const [password, setPassword] = useState(statePassword);
  const [finishedTyping, setFinishedTyping] = useState(false);

  const handleInputChange = useCallback(
    value => {
      setPassword(value);

      if (password.length) {
        dispatch({ type: SET_PASSWORD, payload: password });
      } else if (finishedTyping) {
        dispatch({
          type: SET_PASSWORD_ERROR,
          payload: "Password is required."
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
        className={(passwordError ? "input-error " : "") + className}
        value={password}
        onChange={e => handleInputChange(e.target.value)}
        placeholder={placeholder || "Enter Your Password"}
        onBlur={() => setFinishedTyping(true)}
        onFocus={() => setFinishedTyping(false)}
        {...otherProps}
      ></input>
      <div>{passwordError}</div>
    </React.Fragment>
  );
}
