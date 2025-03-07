import React, {
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import { useTranslation } from "react-i18next";
import {
  SET_PASSWORD,
  SET_PASSWORD_ERROR,
  DISABLE_SUBMIT
} from "../utils/action-types";
import { Input } from "./Input";
import { ReactComponent as CheckIcon } from "../assets/check-solid.svg";
import { ReactComponent as XIcon } from "../assets/x-icon.svg";

export function Password({ store, showStrength = false, ...otherProps }) {
  const { t } = useTranslation("common");

  const {
    dispatch,
    state: { password: statePassword, passwordError }
  } = useContext(store);
  const [password, setPassword] = useState(statePassword);
  const [finishedTyping, setFinishedTyping] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  // Password validation checks
  const passwordChecks = {
    minLength: password?.length >= 8,
    hasNumber: /\d/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const onRequirementsMet = (isValid) => {
    if (!isValid && password.length) {
      dispatch({
        type: SET_PASSWORD_ERROR,
        payload: ''
      });
    }
    else if (password.length) {
      dispatch({
        type: SET_PASSWORD,
        payload: password || ""
      });
    }
  };

  // Calculate password strength (0-5)
  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

  // Check if all requirements are met
  const allRequirementsMet = passwordStrength === 5;

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "plc-bg-red-500";
    if (passwordStrength <= 4) return "plc-bg-yellow-500";
    return "plc-bg-green-500";
  };

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

  useEffect(() => {
    if (showStrength) {
      onRequirementsMet(allRequirementsMet);
    }
  }, [passwordStrength, allRequirementsMet, onRequirementsMet]);

  return (
    <div>
      <Input
        type="password"
        error={passwordError}
        value={password}
        onChange={(e) => handleInputChange(e.target.value)}
        onBlur={() => {
          setFinishedTyping(true);
          setPasswordFocus(false);
        }}
        onFocus={() => setPasswordFocus(true)}
        {...otherProps}
      />

      {showStrength && (
        <div className={`plc-space-y-2 plc-transition-all plc-duration-200 ${passwordFocus || password ? "plc-opacity-100" : "plc-opacity-50"}`}>
          <div className="plc-h-1 plc-w-full plc-rounded-full plc-bg-gray-100 plc-mt-2">
            <div
              className={`plc-h-full plc-rounded-full plc-transition-all plc-duration-300 ${getPasswordStrengthColor()}`}
              style={{ width: `${(passwordStrength / 5) * 100}%` }}
            />
          </div>

          <div className="plc-grid plc-grid-cols-2 plc-gap-2 plc-text-sm">
            <div className="plc-flex plc-items-center plc-gap-2">
              {passwordChecks.minLength ? (
                <CheckIcon className="plc-h-4 plc-w-4 plc-text-green-500" />
              ) : (
                <XIcon className="plc-h-4 plc-w-4 plc-text-gray-300" />
              )}
              <span className="plc-text-gray-600">8+ characters</span>
            </div>
            <div className="plc-flex plc-items-center plc-gap-2">
              {passwordChecks.hasNumber ? (
                <CheckIcon className="plc-h-4 plc-w-4 plc-text-green-500" />
              ) : (
                <XIcon className="plc-h-4 plc-w-4 plc-text-gray-300" />
              )}
              <span className="plc-text-gray-600">Number</span>
            </div>
            <div className="plc-flex plc-items-center plc-gap-2">
              {passwordChecks.hasUppercase ? (
                <CheckIcon className="plc-h-4 plc-w-4 plc-text-green-500" />
              ) : (
                <XIcon className="plc-h-4 plc-w-4 plc-text-gray-300" />
              )}
              <span className="plc-text-gray-600">Uppercase</span>
            </div>
            <div className="plc-flex plc-items-center plc-gap-2">
              {passwordChecks.hasLowercase ? (
                <CheckIcon className="plc-h-4 plc-w-4 plc-text-green-500" />
              ) : (
                <XIcon className="plc-h-4 plc-w-4 plc-text-gray-300" />
              )}
              <span className="plc-text-gray-600">Lowercase</span>
            </div>
            <div className="plc-flex plc-items-center plc-gap-2">
              {passwordChecks.hasSpecial ? (
                <CheckIcon className="plc-h-4 plc-w-4 plc-text-green-500" />
              ) : (
                <XIcon className="plc-h-4 plc-w-4 plc-text-gray-300" />
              )}
              <span className="plc-text-gray-600">Special char</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
