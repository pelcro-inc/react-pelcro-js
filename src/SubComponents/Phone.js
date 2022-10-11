import React, {
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import { useTranslation } from "react-i18next";
import { SET_PHONE, SET_PHONE_ERROR } from "../utils/action-types";
import { Input } from "./Input";

export function Phone({
  initWithUserPhone = true,
  store,
  ...otherProps
}) {
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

      if (finishedTyping) {
        if (phone?.length) {
          dispatch({
            type: SET_PHONE,
            payload: phone
          });
        } else {
          if (otherProps.required) {
            dispatch({
              type: SET_PHONE_ERROR,
              payload: t("validation.enterPhone")
            });
          } else {
            dispatch({ type: SET_PHONE, payload: phone });
          }
        }
      }
    },
    [dispatch, phone, finishedTyping]
  );

  useEffect(() => {
    handleInputChange(phone);
  }, [finishedTyping, phone, handleInputChange]);

  // Initialize phone field with user's phone
  const loadPhoneIntoField = () => {
    handleInputChange(window.Pelcro.user.read().phone);
    dispatch({
      type: SET_PHONE,
      payload: window.Pelcro.user.read().phone
    });
  };

  useEffect(() => {
    if (initWithUserPhone) {
      document.addEventListener("PelcroUserLoaded", () => {
        loadPhoneIntoField();
      });
      loadPhoneIntoField();

      return () => {
        document.removeEventListener(
          "PelcroUserLoaded",
          handleInputChange
        );

        dispatch({
          type: SET_PHONE,
          payload: ""
        });
      };
    }
  }, []);

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
