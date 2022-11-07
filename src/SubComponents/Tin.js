import React, {
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import { useTranslation } from "react-i18next";
import { SET_TIN } from "../utils/action-types";
import { Input } from "./Input";

export function Tin({
  initWithUserTin = true,
  store,
  ...otherProps
}) {
  const { t } = useTranslation("common");

  const {
    dispatch,
    state: { tin: stateTin }
  } = useContext(store);
  const [tin, setTin] = useState(stateTin);
  const [finishedTyping, setFinishedTyping] = useState(false);

  const handleInputChange = useCallback(
    (value) => {
      setTin(value);

      if (finishedTyping) {
        dispatch({
          type: SET_TIN,
          payload: tin
        });
      }
    },
    [dispatch, tin, finishedTyping]
  );

  useEffect(() => {
    handleInputChange(tin);
  }, [finishedTyping, tin, handleInputChange]);

  // Initialize tin field with user's tin (Tax Identification Number)
  const loadTinIntoField = () => {
    handleInputChange(window.Pelcro.user.read().tin);
    dispatch({
      type: SET_TIN,
      payload: window.Pelcro.user.read().tin
    });
  };

  useEffect(() => {
    if (initWithUserTin) {
      document.addEventListener("PelcroUserLoaded", () => {
        loadTinIntoField();
      });
      loadTinIntoField();

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
      value={tin}
      onChange={(e) => handleInputChange(e.target.value)}
      onBlur={() => setFinishedTyping(true)}
      onFocus={() => setFinishedTyping(false)}
      {...otherProps}
    />
  );
}
