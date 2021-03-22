import React, {
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import { useTranslation } from "react-i18next";
import {
  SET_PASSWORD,
  SET_PASSWORD_ERROR
} from "../utils/action-types";
import { Input } from "./Input";

export function Password({ store, ...otherProps }) {
  const { t } = useTranslation("common");

  const {
    dispatch,
    state: { password: statePassword, passwordError }
  } = useContext(store);
  const [password, setPassword] = useState(statePassword);
  const [finishedTyping, setFinishedTyping] = useState(false);

  const handleInputChange = useCallback(
    (value) => {
      setPassword(value);

      if (password.length) {
        dispatch({ type: SET_PASSWORD, payload: password });
      } else if (finishedTyping) {
        dispatch({
          type: SET_PASSWORD_ERROR,
          payload: t("validation.enterPassword")
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
      error={passwordError}
      value={password}
      onChange={(e) => handleInputChange(e.target.value)}
      onBlur={() => setFinishedTyping(true)}
      onFocus={() => setFinishedTyping(false)}
      {...otherProps}
    />
  );
}
