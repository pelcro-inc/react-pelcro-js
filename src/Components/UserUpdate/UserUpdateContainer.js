import React, { createContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update
} from "use-reducer-with-side-effects";
import {
  SET_FIRST_NAME,
  SET_LAST_NAME,
  SET_DISPLAY_NAME,
  SET_PHONE,
  SET_TEXT_FIELD,
  HANDLE_USER_UPDATE,
  DISABLE_USER_UPDATE_BUTTON
} from "../../utils/action-types";
import { getErrorMessages } from "../common/Helpers";
import { showError, showSuccess } from "../../utils/showing-error";

const initialState = {
  email: window.Pelcro.user.read()?.email,
  firstName: window.Pelcro.user.read()?.first_name,
  lastName: window.Pelcro.user.read()?.last_name,
  displayName: window.Pelcro.user.read()?.display_name,
  phone: window.Pelcro.user.read()?.phone,
  buttonDisabled: false,
  textFields: {}
};

const store = createContext(initialState);
const { Provider } = store;

const UserUpdateContainer = ({
  style,
  className,
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
    { firstName, lastName, phone, textFields, displayName },
    dispatch
  ) => {
    window.Pelcro.user.update(
      {
        auth_token: window.Pelcro.user.read().auth_token,
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
          onFailure(err);
          return showError(
            getErrorMessages(err),
            "pelcro-error-user-edit"
          );
        } else {
          showSuccess(
            t("messages.userUpdated"),
            "pelcro-success-user-edit"
          );
          onSuccess();
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
    <div style={{ ...style }} className={className}>
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
