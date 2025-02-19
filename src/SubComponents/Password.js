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
import { ReactComponent as EyeShowIcon } from "../assets/eye-password-hide.svg";
import { ReactComponent as EyeIcon } from "../assets/eye-password-show.svg";

export function Password({ store, ...otherProps }) {
  const { t } = useTranslation("common");

  const {
    dispatch,
    state: { password: statePassword, passwordError }
  } = useContext(store);
  const [password, setPassword] = useState(statePassword);
  const [finishedTyping, setFinishedTyping] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="plc-relative">
      <Input
        type={showPassword ? "text" : "password"}
        error={passwordError}
        value={password}
        onChange={(e) => handleInputChange(e.target.value)}
        onBlur={() => setFinishedTyping(true)}
        onFocus={() => setFinishedTyping(false)}
        {...otherProps}
      />
      {window?.Pelcro?.uiSettings?.showPassword && (
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="plc-absolute plc-right-2  plc-transform plc--translate-y-1/2 plc-cursor-pointer plc-opacity-50 plc-w-9 plc-h-9"
          style={{
            top: "70%"
          }}
        >
          {showPassword ? (
            <EyeShowIcon className="plc-w-full plc-h-full" />
          ) : (
            <EyeIcon className="plc-w-full plc-h-full" />
          )}
        </span>
      )}
    </div>
  );
}
