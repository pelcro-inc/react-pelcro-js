import React, {
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import { useTranslation } from "react-i18next";
import { SET_EMAIL, SET_EMAIL_ERROR } from "../utils/action-types";
import { Input } from "./Input";

export function Email({
  initWithUserEmail = true,
  disableEmailValidation,
  store,
  enableEmailEdit,
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
        dispatch({
          type: SET_EMAIL_ERROR,
          payload: null
        });
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
    if (!enableEmailEdit) {
      loadEmailIntoField();
    }
  }, [enableEmailEdit]);

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
    const re =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return re.test(email);
  };

  return (
    <Input
      type="email"
      error={emailError}
      value={email ?? ""}
      onChange={(e) => handleInputChange(e.target.value)}
      onBlur={() => setFinishedTyping(true)}
      onFocus={() => setFinishedTyping(false)}
      {...otherProps}
    />
  );
}
