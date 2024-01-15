import React, {
  useContext,
  useState,
  useCallback,
  useEffect
} from "react";
import { Loader } from "../SubComponents/Loader";
import { useTranslation } from "react-i18next";
import {
  SET_TEXT_FIELD,
  SET_TEXT_FIELD_ERROR
} from "../utils/action-types";
import { Input } from "./Input";

export function TextInput({
  initWithFieldName = true,
  store,
  fieldName,
  ...otherProps
}) {
  const { t } = useTranslation("common");
  const {
    dispatch,
    state: {
      [fieldName]: stateFieldName,
      [fieldName + "Error"]: fieldNameError,
      loading
    }
  } = useContext(store);
  const [fieldNameState, setFieldNameState] =
    useState(stateFieldName);
  const [finishedTyping, setFinishedTyping] = useState(false);

  const handleInputChange = useCallback(
    (value) => {
      setFieldNameState(value);

      if (finishedTyping) {
        if (fieldNameState?.length) {
          dispatch({
            type: SET_TEXT_FIELD,
            payload: {
              [fieldName]: value,
              [fieldName + "Error"]: null
            }
          });
        } else {
          if (otherProps.required) {
            dispatch({
              type: SET_TEXT_FIELD_ERROR,
              payload: {
                [fieldName + "Error"]: t(
                  "validation.enterFieldName",
                  { fieldName: otherProps.label }
                ),
                [fieldName]: null
              }
            });
          } else {
            dispatch({
              type: SET_TEXT_FIELD,
              payload: {
                [fieldName]: value,
                [fieldName + "Error"]: null
              }
            });
          }
        }
      }
    },
    [dispatch, fieldNameState, finishedTyping] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    handleInputChange(fieldNameState);
  }, [finishedTyping, fieldNameState, handleInputChange]);

  // Initialize field name field with user's first name
  const loadFieldNameIntoField = () => {
    handleInputChange(
      window.Pelcro?.user?.read()?.metadata?.[fieldName]
    );
    dispatch({
      type: SET_TEXT_FIELD,
      payload: window.Pelcro?.user?.read()?.metadata?.[fieldName]
    });
  };

  useEffect(() => {
    if (initWithFieldName) {
      document.addEventListener("PelcroUserLoaded", () => {
        loadFieldNameIntoField();
      });
      loadFieldNameIntoField();

      return () => {
        document.removeEventListener(
          "PelcroUserLoaded",
          handleInputChange
        );
      };
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return <Loader />;
  }

  return (
    <Input
      type="text"
      error={fieldNameError}
      value={fieldNameState}
      defaultValue={window.Pelcro.user.read()?.metadata?.[fieldName]}
      onChange={(e) => handleInputChange(e.target.value)}
      onBlur={() => setFinishedTyping(true)}
      onFocus={() => setFinishedTyping(false)}
      {...otherProps}
    />
  );
}
