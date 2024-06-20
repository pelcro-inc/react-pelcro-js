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
  SET_FIRST_NAME_ERROR,
  SET_LAST_NAME,
  SET_LAST_NAME_ERROR,
  SET_USERNAME,
  SET_USERNAME_ERROR,
  SET_COMPANY,
  SET_COMPANY_ERROR,
  SET_TITLE,
  SET_TITLE_ERROR,
  SET_DISPLAY_NAME,
  SET_PHONE,
  SET_TIN,
  SET_PHONE_ERROR,
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
  firstNameError: null,
  lastName: window.Pelcro.user.read()?.last_name,
  lastNameError: null,
  username: window.Pelcro.user.read()?.username,
  usernameError: null,
  company: window.Pelcro.user.read()?.organization?.name,
  companyError: null,
  title: window.Pelcro.user.read()?.title,
  titleError: null,
  displayName: window.Pelcro.user.read()?.display_name,
  phone: window.Pelcro.user.read()?.phone,
  phoneError: null,
  tin: window.Pelcro.user.read()?.tin,
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
        type: SET_USERNAME,
        payload: window.Pelcro.user.read()?.username
      },
      {
        type: SET_DISPLAY_NAME,
        payload: window.Pelcro.user.read()?.display_name
      },
      {
        type: SET_PHONE,
        payload: window.Pelcro.user.read()?.phone
      },
      {
        type: SET_TIN,
        payload: window.Pelcro.user.read()?.tin
      },
      {
        type: SET_COMPANY,
        payload: window.Pelcro.user.read()?.organization?.name
      },
      {
        type: SET_TITLE,
        payload: window.Pelcro.user.read()?.title
      }
    ];

    fields
      .filter((field) => Boolean(field.payload))
      .forEach((field) => {
        dispatch(field);
      });
  };

  const handleUpdateUser = (
    {
      email,
      firstName,
      lastName,
      username,
      phone,
      tin,
      textFields,
      displayName,
      company,
      title
    },
    dispatch
  ) => {
    window.Pelcro.user.update(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        email: email,
        first_name: firstName,
        last_name: lastName,
        ...(username && { username }),
        display_name: displayName,
        phone: phone,
        tin: tin,
        organization: company,
        title: title,
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
            email: action.payload,
            emailError: null
          });

        case SET_EMAIL_ERROR:
          return Update({
            ...state,
            emailError: action.payload,
            email: ""
          });

        case SET_FIRST_NAME:
          return Update({
            ...state,
            firstName: action.payload,
            firstNameError: null
          });

        case SET_FIRST_NAME_ERROR:
          return Update({
            ...state,
            firstNameError: action.payload,
            firstName: ""
          });

        case SET_DISPLAY_NAME:
          return Update({
            ...state,
            displayName: action.payload
          });

        case SET_LAST_NAME:
          return Update({
            ...state,
            lastName: action.payload,
            lastNameError: null
          });

        case SET_LAST_NAME_ERROR:
          return Update({
            ...state,
            lastNameError: action.payload,
            lastName: ""
          });

        case SET_USERNAME:
          return Update({
            ...state,
            username: action.payload,
            usernameError: null
          });

        case SET_USERNAME_ERROR:
          return Update({
            ...state,
            usernameError: action.payload,
            username: ""
          });
        case SET_COMPANY:
          return Update({
            ...state,
            company: action.payload,
            companyError: null
          });

        case SET_COMPANY_ERROR:
          return Update({
            ...state,
            companyError: action.payload,
            company: ""
          });
        case SET_TITLE:
          return Update({
            ...state,
            title: action.payload,
            titleError: null
          });

        case SET_TITLE_ERROR:
          return Update({
            ...state,
            titleError: action.payload,
            title: ""
          });

        case SET_PHONE:
          return Update({
            ...state,
            phone: action.payload,
            phoneError: null
          });

        case SET_TIN:
          return Update({
            ...state,
            tin: action.payload
          });

        case SET_PHONE_ERROR:
          return Update({
            ...state,
            phoneError: action.payload,
            phone: ""
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
          ? children.map((child, i) => {
              if (child) {
                return React.cloneElement(child, { store, key: i });
              }
            })
          : React.cloneElement(children, { store })}
      </Provider>
    </div>
  );
};

export { UserUpdateContainer, store };
