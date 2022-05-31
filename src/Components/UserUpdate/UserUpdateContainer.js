import React, { createContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update
} from "use-reducer-with-side-effects";
import {
  SET_EMAIL,
  SET_EMAIL_ERROR,
  SET_FIRST_NAME,
  SET_LAST_NAME,
  SET_DISPLAY_NAME,
  SET_PHONE,
  SET_TEXT_FIELD,
  HANDLE_USER_UPDATE,
  DISABLE_USER_UPDATE_BUTTON,
  SHOW_ALERT
} from "../../utils/action-types";
import { getErrorMessages } from "../common/Helpers";

const initialState = {
  email: window.Pelcro.user.read()?.email,
  emailError: null,
  firstName: window.Pelcro.user.read()?.first_name,
  lastName: window.Pelcro.user.read()?.last_name,
  displayName: window.Pelcro.user.read()?.display_name,
  phone: window.Pelcro.user.read()?.phone,
  buttonDisabled: false,
  textFields: {},
  alert: {
    type: "error",
    content: ""
  }
};

const store = createContext(initialState);
const { Provider } = store;

const UserUpdateContainer = ({
  style,
  className = "",
  onSuccess = () => {},
  onFailure = () => {},
  children
}) => {
  const { t } = useTranslation("userEdit");

  useEffect(() => {
    document.addEventListener("PelcroUserLoaded", () => {
      loadUserDataIntoFields();
    });

    loadUserDataIntoFields();
  }, []);

  const loadUserDataIntoFields = () => {
    const fields = [
      {
        type: SET_EMAIL,
        payload: window.Pelcro.user.read()?.email
      },
      {
        type: SET_FIRST_NAME,
        payload: window.Pelcro.user.read()?.first_name
      },
      {
        type: SET_LAST_NAME,
        payload: window.Pelcro.user.read()?.last_name
      },
      {
        type: SET_DISPLAY_NAME,
        payload: window.Pelcro.user.read()?.display_name
      },
      {
        type: SET_PHONE,
        payload: window.Pelcro.user.read()?.phone
      }
    ];

    fields
      .filter((field) => Boolean(field.payload))
      .forEach((field) => {
        dispatch(field);
      });
  };

  const handleUpdateUser = (
    { email, firstName, lastName, phone, textFields, displayName },
    dispatch
  ) => {
    window.Pelcro.user.update(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        email: email,
        first_name: firstName,
        last_name: lastName,
        display_name: displayName,
        phone: phone,
        metadata: { updated: "updated", ...textFields }
      },
      (err, res) => {
        dispatch({
          type: DISABLE_USER_UPDATE_BUTTON,
          payload: false
        });

        if (err) {
          dispatch({
            type: SHOW_ALERT,
            payload: {
              type: "error",
              content: getErrorMessages(err)
            }
          });
          onFailure(err);
        } else {
          dispatch({
            type: SHOW_ALERT,
            payload: {
              type: "success",
              content: t("messages.userUpdated")
            }
          });
          onSuccess(res);
        }
      }
    );
  };

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case SET_TEXT_FIELD:
          return Update({
            ...state,
            textFields: { ...state.textFields, ...action.payload }
          });

        case SET_EMAIL:
          return Update({
            ...state,
            email: action.payload
          });

        case SET_EMAIL_ERROR:
          return Update({
            ...state,
            emailError: action.payload
          });

        case SET_FIRST_NAME:
          return Update({
            ...state,
            firstName: action.payload
          });

        case SET_DISPLAY_NAME:
          return Update({
            ...state,
            displayName: action.payload
          });

        case SET_LAST_NAME:
          return Update({
            ...state,
            lastName: action.payload
          });

        case SET_PHONE:
          return Update({
            ...state,
            phone: action.payload
          });

        case SHOW_ALERT:
          return Update({
            ...state,
            alert: action.payload
          });

        case DISABLE_USER_UPDATE_BUTTON:
          return Update({ ...state, buttonDisabled: action.payload });
        case HANDLE_USER_UPDATE:
          return UpdateWithSideEffect(
            { ...state, buttonDisabled: true },
            (state, dispatch) => handleUpdateUser(state, dispatch)
          );

        default:
          return state;
      }
    },
    initialState
  );

  return (
    <div
      style={{ ...style }}
      className={`pelcro-container pelcro-user-update-container ${className}`}
    >
      <Provider value={{ state, dispatch }}>
        {children.length
          ? children.map((child, i) =>
              React.cloneElement(child, { store, key: i })
            )
          : React.cloneElement(children, { store })}
      </Provider>
    </div>
  );
};

export { UserUpdateContainer, store };
