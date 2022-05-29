import React, {
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import { useTranslation } from "react-i18next";
import {
  SET_EMAIL_CONFRIM,
  SET_EMAIL_CONFORM_ERROR
} from "../utils/action-types";
import { Input } from "./Input";

export function EmailConfirm({
  initWithUserEmail = true,
  disableEmailValidation,
  store,
  ...otherProps
}) {
  const { t } = useTranslation("common");

  const {
    dispatch,
    state: {
      email: stateEmail,
      emailConfirm: stateEmailConfirm,
      emailConformError
    }
  } = useContext(store);
  const [emailConfirm, setEmailConfirm] = useState(stateEmailConfirm);
  const [finishedTyping, setFinishedTyping] = useState(false);

  console.log(stateEmail);

  const handleInputChange = useCallback(
    (value) => {
      setEmailConfirm(value);

      if (disableEmailValidation) {
        return dispatch({
          type: SET_EMAIL_CONFRIM,
          payload: emailConfirm
        });
      }

      if (isEmailMatch(stateEmail, emailConfirm)) {
        dispatch({
          type: SET_EMAIL_CONFORM_ERROR,
          payload: null
        });

        return dispatch({
          type: SET_EMAIL_CONFRIM,
          payload: emailConfirm
        });
      }

      if (finishedTyping) {
        if (emailConfirm?.length) {
          dispatch({
            type: SET_EMAIL_CONFORM_ERROR,
            payload: t("validation.validEmailConfirm")
          });
        } else {
          dispatch({
            type: SET_EMAIL_CONFORM_ERROR,
            payload: t("validation.enterEmailConfirm")
          });
        }
      }
    },
    [dispatch, emailConfirm, finishedTyping]
  );

  useEffect(() => {
    handleInputChange(emailConfirm);
  }, [finishedTyping, emailConfirm, handleInputChange]);

  const isEmailMatch = (stateEmail, emailConfirm) => {
    return stateEmail === emailConfirm;
  };

  return (
    <Input
      type="email"
      error={emailConformError}
      value={emailConfirm ?? ""}
      onChange={(e) => handleInputChange(e.target.value)}
      onBlur={() => setFinishedTyping(true)}
      onFocus={() => setFinishedTyping(false)}
      {...otherProps}
    />
  );
}
