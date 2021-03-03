import React, {
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import { useTranslation } from "react-i18next";
import { SET_EMAIL, SET_EMAIL_ERROR } from "../utils/action-types";

/**
 *
 */
export function Email({
  initWithUserEmail = true,
  disableEmailValidation,
  placeholder,
  style,
  className,
  id,
  store,
  ...otherProps
}) {
  const { t } = useTranslation("common");

  const {
    dispatch,
    state: { email: stateEmail, emailError }
  } = useContext(store);
  const [email, setEmail] = useState(stateEmail);
  const [finishedTyping, setFinishedTyping] = useState(false);

  const handleInputChange = useCallback(
    (value) => {
      setEmail(value);

      if (disableEmailValidation) {
        return dispatch({ type: SET_EMAIL, payload: email });
      }

      if (isEmailValid(email)) {
        return dispatch({ type: SET_EMAIL, payload: email });
      }

      if (finishedTyping) {
        if (email?.length) {
          dispatch({
            type: SET_EMAIL_ERROR,
            payload: t("validation.validEmail")
          });
        } else {
          dispatch({
            type: SET_EMAIL_ERROR,
            payload: t("validation.enterEmail")
          });
        }
      }
    },
    [dispatch, email, finishedTyping]
  );

  useEffect(() => {
    handleInputChange(email);
  }, [finishedTyping, email, handleInputChange]);

  // Initialize email field with user's email
  const loadEmailIntoField = () => {
    handleInputChange(window.Pelcro.user.read().email);
  };

  useEffect(() => {
    if (initWithUserEmail) {
      document.addEventListener("PelcroUserLoaded", () => {
        loadEmailIntoField();
      });
      loadEmailIntoField();

      return () => {
        document.removeEventListener(
          "PelcroUserLoaded",
          handleInputChange
        );
      };
    }
  }, []);

  const isEmailValid = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  return (
    <React.Fragment>
      <input
        type="email"
        id={id}
        style={{ ...style }}
        className={(emailError ? "input-error " : "") + className}
        value={email ?? ""}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={placeholder || "Enter Your Email"}
        onBlur={() => setFinishedTyping(true)}
        onFocus={() => setFinishedTyping(false)}
        {...otherProps}
      ></input>
      <div>{emailError}</div>
    </React.Fragment>
  );
}
