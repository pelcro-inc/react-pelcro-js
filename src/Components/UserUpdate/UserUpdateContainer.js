import React, { createContext, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { store as pelcroStore } from "../PelcroContainer";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update
} from "use-reducer-with-side-effects";
import {
  SET_FIRST_NAME,
  SET_LAST_NAME,
  SET_PHONE,
  SET_TEXT_FIELD,
  HANDLE_USER_UPDATE,
  DISABLE_USER_UPDATE_BUTTON
} from "../../utils/action-types";
import { getErrorMessages } from "../common/Helpers";
import { showError, showSuccess } from "../../utils/showing-error";

const initialState = {
  email: window.Pelcro.user.read().email,
  firstName: window.Pelcro.user.read().first_name,
  lastName: window.Pelcro.user.read().last_name,
  phone: window.Pelcro.user.read().phone,
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
  // const {
  //   state: { pelcroUserLoaded },
  // } = useContext(pelcroStore);
  const [pelcroUserLoaded, setUserLoaded] = useState(false);
  const { t } = useTranslation("userEdit");

  setTimeout(() => {
    setUserLoaded(true);
  }, 2000);

  const handleUpdateUser = (
    { firstName, lastName, phone, textFields },
    dispatch
  ) => {
    window.Pelcro.user.update(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        first_name: firstName,
        last_name: lastName,
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
          throw new Error();
      }
    },
    initialState
  );

  if (pelcroUserLoaded) {
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
  }

  return null;
};

export { UserUpdateContainer, store };
