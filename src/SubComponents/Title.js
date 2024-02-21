import React, {
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import { useTranslation } from "react-i18next";
import { SET_TITLE, SET_TITLE_ERROR } from "../utils/action-types";
import { Input } from "./Input";

export function Title({
  initWithUserTitle = true,
  store,
  ...otherProps
}) {
  const { t } = useTranslation("common");

  const {
    dispatch,
    state: { title: stateTitle, titleError }
  } = useContext(store);
  const [title, setTitle] = useState(stateTitle);
  const [finishedTyping, setFinishedTyping] = useState(false);

  const handleInputChange = useCallback(
    (value) => {
      setTitle(value);

      if (finishedTyping) {
        if (title?.length) {
          dispatch({
            type: SET_TITLE,
            payload: title
          });
        } else {
          if (otherProps.required) {
            dispatch({
              type: SET_TITLE_ERROR,
              payload: t("validation.enterTitle")
            });
          } else {
            dispatch({ type: SET_TITLE, payload: title });
          }
        }
      }
    },
    [dispatch, title, finishedTyping] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    handleInputChange(title);
  }, [finishedTyping, title, handleInputChange]);

  // Initialize title field with user's title
  const loadTitleIntoField = () => {
    handleInputChange(window.Pelcro?.user?.read()?.title);
    dispatch({
      type: SET_TITLE,
      payload: window.Pelcro?.user?.read()?.title
    });
  };

  useEffect(() => {
    if (initWithUserTitle) {
      document.addEventListener("PelcroUserLoaded", () => {
        loadTitleIntoField();
      });
      loadTitleIntoField();

      return () => {
        document.removeEventListener(
          "PelcroUserLoaded",
          handleInputChange
        );
      };
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Input
      type="text"
      error={titleError}
      value={title}
      onChange={(e) => handleInputChange(e.target.value)}
      onBlur={() => setFinishedTyping(true)}
      onFocus={() => setFinishedTyping(false)}
      {...otherProps}
    />
  );
}
