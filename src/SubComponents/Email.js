import React, { useContext, useState, useEffect, useCallback } from "react";
import { SET_EMAIL, SET_EMAIL_ERROR } from "../utils/action-types";

export function Email({
  placeholder,
  style,
  className,
  id,
  store,
  ...otherProps
}) {
  const {
    dispatch,
    state: { email: stateEmail, emailError }
  } = useContext(store);
  const [email, setEmail] = useState(stateEmail);
  const [finishedTyping, setFinishedTyping] = useState(false);

  const handleInputChange = useCallback(
    value => {
      setEmail(value);

      if (validateEmail(email)) {
        dispatch({ type: SET_EMAIL, payload: email });
      } else if (finishedTyping) {
        if (email.length) {
          dispatch({
            type: SET_EMAIL_ERROR,
            payload: "Please enter a valid email."
          });
        } else {
          dispatch({
            type: SET_EMAIL_ERROR,
            payload: "Email address is required."
          });
        }
      }
    },
    [dispatch, email, finishedTyping]
  );

  useEffect(() => {
    handleInputChange(email);
  }, [finishedTyping, email, handleInputChange]);

  const validateEmail = email => {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  return (
    <React.Fragment>
      <input
        type="email"
        id={id}
        style={{ ...style }}
        className={emailError ? "input-error " : "" + className}
        value={email}
        onChange={e => handleInputChange(e.target.value)}
        placeholder={placeholder || "Enter Your Email"}
        onBlur={() => setFinishedTyping(true)}
        onFocus={() => setFinishedTyping(false)}
        {...otherProps}
      ></input>
      <div>{emailError}</div>
    </React.Fragment>
  );
}
