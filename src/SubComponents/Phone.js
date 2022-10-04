import React, {
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import { useTranslation } from "react-i18next";
import { SET_PHONE, SET_PHONE_ERROR } from "../utils/action-types";
import { Input } from "./Input";

export function Phone({ store, ...otherProps }) {
  const { t } = useTranslation("common");

  const {
    dispatch,
    state: { phone: statePhone, phoneError }
  } = useContext(store);
  const [phone, setPhone] = useState(statePhone);
  const [finishedTyping, setFinishedTyping] = useState(false);

  const handleInputChange = useCallback(
    (value) => {
      setPhone(value);

      if (phone?.length) {
        dispatch({ type: SET_PHONE, payload: phone });
      } else if (finishedTyping && otherProps.required) {
        dispatch({
          type: SET_PHONE_ERROR,
          payload: t("validation.enterPhone")
        });
      }
    },
    [dispatch, phone, finishedTyping]
  );

  useEffect(() => {
    handleInputChange(phone);
  }, [finishedTyping, phone, handleInputChange]);

  return (
    <Input
      type="tel"
      error={phoneError}
      value={phone}
      onChange={(e) => handleInputChange(e.target.value)}
      onBlur={() => setFinishedTyping(true)}
      onFocus={() => setFinishedTyping(false)}
      {...otherProps}
    />
  );
}
