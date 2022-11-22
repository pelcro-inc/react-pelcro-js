import React, {
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import { useTranslation } from "react-i18next";
import { SET_USERNAME, SET_USERNAME_ERROR } from "../utils/action-types";
import { Input } from "./Input";

export function UserNameInput({
  initWithUserName = true,
  store,
  enableUsernameEdit,
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

      if (username?.length) {
        dispatch({ type: SET_USERNAME, payload: username });
      } else if(finishedTyping) {
        dispatch({
          type: SET_USERNAME_ERROR,
          payload: t("validation.enterUsername")
        });
      }
    },
    [dispatch, username, finishedTyping]
  );

  useEffect(() => {
    handleInputChange(username);
  }, [finishedTyping, username, handleInputChange]);

  return (
    <Input
      type="text"
      error={usernameError}
      value={username ?? ""}
      onChange={(e) => handleInputChange(e.target.value)}
      onBlur={() => setFinishedTyping(true)}
      onFocus={() => setFinishedTyping(false)}
      {...otherProps}
    />
  );
}
