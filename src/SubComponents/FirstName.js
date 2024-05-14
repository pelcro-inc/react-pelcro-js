import React, {
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import { useTranslation } from "react-i18next";
import {
  SET_FIRST_NAME,
  SET_FIRST_NAME_ERROR
} from "../utils/action-types";
import { Input } from "./Input";

export function FirstName({
  initWithUserFirstName = true,
  store,
  ...otherProps
}) {
  const { t } = useTranslation("common");

  const {
    dispatch,
    state: { firstName: stateFirstName, firstNameError }
  } = useContext(store);
  const [firstName, setFirstName] = useState(stateFirstName);
  const [finishedTyping, setFinishedTyping] = useState(false);

  const handleInputChange = useCallback(
    (value) => {
      setFirstName(value);

      if (finishedTyping) {
        if (firstName?.length) {
          dispatch({
            type: SET_FIRST_NAME,
            payload: firstName
          });
        } else {
          if (otherProps.required) {
            dispatch({
              type: SET_FIRST_NAME_ERROR,
              payload: t("validation.enterFirstName")
            });
          } else {
            dispatch({ type: SET_FIRST_NAME, payload: firstName });
          }
        }
      }
    },
    [dispatch, firstName, finishedTyping]
  );

  useEffect(() => {
    handleInputChange(firstName);
  }, [finishedTyping, firstName, handleInputChange]);

  // Initialize first name field with user's first name
  const loadFirstNameIntoField = () => {
    handleInputChange(window.Pelcro.user.read().first_name);
    dispatch({
      type: SET_FIRST_NAME,
      payload: window.Pelcro.user.read().first_name
    });
  };

  useEffect(() => {
    if (initWithUserFirstName) {
      document.addEventListener("PelcroUserLoaded", () => {
        loadFirstNameIntoField();
      });
      loadFirstNameIntoField();

      return () => {
        document.removeEventListener(
          "PelcroUserLoaded",
          handleInputChange
        );
      };
    }
  }, []);

  return (
    <Input
      type="text"
      error={firstNameError}
      value={firstName}
      onChange={(e) => handleInputChange(e.target.value)}
      onBlur={() => setFinishedTyping(true)}
      onFocus={() => setFinishedTyping(false)}
      {...otherProps}
    />
  );
}
