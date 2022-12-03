import React, {
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import { useTranslation } from "react-i18next";
import {
  SET_USERNAME,
  SET_USERNAME_ERROR
} from "../utils/action-types";
import { Input } from "./Input";

export function UpdateUserNameInput({
  initWithUserName = true,
  store,
  ...otherProps
}) {
  const { t } = useTranslation("common");

  const {
    dispatch,
    state: { username: stateUsername, usernameError }
  } = useContext(store);
  const [username, setUsername] = useState(stateUsername);
  const [finishedTyping, setFinishedTyping] = useState(false);

  const handleInputChange = useCallback(
    (value) => {
      setUsername(value);

      if (finishedTyping) {
        if (username?.length) {
          dispatch({
            type: SET_USERNAME,
            payload: username
          });
        } else {
          if (otherProps.required) {
            dispatch({
              type: SET_USERNAME_ERROR,
              payload: t("validation.enterUsername")
            });
          } else {
            dispatch({ type: SET_USERNAME, payload: username });
          }
        }
      }
    },
    [dispatch, username, finishedTyping]
  );

  useEffect(() => {
    handleInputChange(username);
  }, [finishedTyping, username, handleInputChange]);

  // Initialize username field with user's username
  const loadFirstNameIntoField = () => {
    handleInputChange(window.Pelcro.user.read().username);
    dispatch({
      type: SET_USERNAME,
      payload: window.Pelcro.user.read().username
    });
  };

  useEffect(() => {
    if (initWithUserName) {
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
      error={usernameError}
      value={username}
      onChange={(e) => handleInputChange(e.target.value)}
      onBlur={() => setFinishedTyping(true)}
      onFocus={() => setFinishedTyping(false)}
      {...otherProps}
    />
  );
}
