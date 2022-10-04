import React, {
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import { useTranslation } from "react-i18next";
import {
  SET_LAST_NAME,
  SET_LAST_NAME_ERROR
} from "../utils/action-types";
import { Input } from "./Input";

export function LastName({ store, ...otherProps }) {
  const { t } = useTranslation("common");

  const {
    dispatch,
    state: { lastName: stateLastName, lastNameError }
  } = useContext(store);
  const [lastName, setLastName] = useState(stateLastName);
  const [finishedTyping, setFinishedTyping] = useState(false);

  const handleInputChange = useCallback(
    (value) => {
      setLastName(value);

      if (lastName?.length) {
        dispatch({ type: SET_LAST_NAME, payload: lastName });
      } else if (finishedTyping && otherProps.required) {
        dispatch({
          type: SET_LAST_NAME_ERROR,
          payload: t("validation.enterLastName")
        });
      }
    },
    [dispatch, lastName, finishedTyping]
  );

  useEffect(() => {
    handleInputChange(lastName);
  }, [finishedTyping, lastName, handleInputChange]);

  return (
    <Input
      type="text"
      error={lastNameError}
      value={lastName}
      onChange={(e) => handleInputChange(e.target.value)}
      onBlur={() => setFinishedTyping(true)}
      onFocus={() => setFinishedTyping(false)}
      {...otherProps}
    />
  );
}
