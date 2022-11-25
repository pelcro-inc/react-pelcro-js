import React, { createContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update,
  SideEffect
} from "use-reducer-with-side-effects";
import { usePelcro } from "../../components";
import {
  SET_EMAILS,
  SET_EMAILS_ERROR,
  HANDLE_LIST_MEMBERS,
  HANDLE_INVITE_MEMBERS,
  HANDLE_REMOVE_MEMBER,
  UPDATE_INVITE_BUTTON,
  UPDATE_MEMBERS,
  UPDATE_REMOVE_MEMBER_ID,
  SHOW_ALERT,
} from "../../utils/action-types";
import { getErrorMessages } from "../common/Helpers";

const initialState = {
  emails: "",
  emailsError: null,
  buttonDisabled: false,
  removeMemberId:null,
  members:[],
  alert: {
    type: "error",
    content: ""
  }
};
const store = createContext(initialState);
const { Provider } = store;

const SubscriptionManageMembersContainer = ({
  style,
  className = "",
  onSuccess = () => {},
  onFailure = () => {},
  children
}) => {
  
  const {
    subscriptionToManageMembers
  } = usePelcro();
  const subscription_id = subscriptionToManageMembers?.id;

  const handleListMembers = ({}, dispatch) => {
    window.Pelcro.subscription.listMembers(
      {
        auth_token: window.Pelcro?.user?.read()?.auth_token,
        subscription_id
      },
      (err, res) => {
        dispatch({ type: UPDATE_INVITE_BUTTON, payload: false });
        
        if (err) {
          dispatch({
            type: SHOW_ALERT,
            payload: { type: "error", content: getErrorMessages(err) }
          });
          onFailure(err);
        } else {
          dispatch({
            type: UPDATE_MEMBERS,
            payload: res.data
          });
          onSuccess(res);
        }
      }
    );
  };

  const handleInviteMembers = ({ emails }, dispatch) => {
    const emailsArr = emails.split(",");
    window.Pelcro.subscription.inviteMembers(
      {
        auth_token: window.Pelcro?.user?.read()?.auth_token,
        subscription_id,
        emails: emailsArr
      },
      (err, res) => {
        dispatch({ type: UPDATE_INVITE_BUTTON, payload: false });
        
        if (err) {
          dispatch({
            type: SHOW_ALERT,
            payload: { type: "error", content: getErrorMessages(err) }
          });
          onFailure(err);
        } else {
          dispatch({ type: HANDLE_LIST_MEMBERS });
          onSuccess(res);
        }
      }
    );
  };

  const handleRemoveMember = ({ removeMemberId }, dispatch) => {
    window.Pelcro.subscription.removeMember(
      {
        auth_token: window.Pelcro?.user?.read()?.auth_token,
        subscription_id,
        id: removeMemberId
      },
      (err, res) => {
        dispatch({ type: UPDATE_REMOVE_MEMBER_ID, payload: null });

        if (err) {
          dispatch({
            type: SHOW_ALERT,
            payload: { type: "error", content: getErrorMessages(err) }
          });
          onFailure(err);
        } else {
          dispatch({ type: HANDLE_LIST_MEMBERS });
          onSuccess(res);
        }
      }
    );
  };

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case SET_EMAILS:
          return Update({
            ...state,
            emails: action.payload,
            emailsError: null
          });
        case SET_EMAILS_ERROR:
          return Update({
            ...state,
            emailsError: action.payload,
            emails: ""
          });
        case SHOW_ALERT:
          return Update({
            ...state,
            alert: action.payload
          });
        case UPDATE_MEMBERS:
          return Update({
            ...state,
            members: action.payload
          });
        case UPDATE_REMOVE_MEMBER_ID:
          return Update({
            ...state,
            removeMemberId: action.payload
          });
        case UPDATE_INVITE_BUTTON:
          return Update({ ...state, buttonDisabled: action.payload });
        case HANDLE_LIST_MEMBERS:
          return UpdateWithSideEffect(
            { ...state },
            (state, dispatch) => handleListMembers(state, dispatch)
          );
        case HANDLE_INVITE_MEMBERS:
          return UpdateWithSideEffect(
            { ...state, buttonDisabled: true },
            (state, dispatch) => handleInviteMembers(state, dispatch)
          );
        case HANDLE_REMOVE_MEMBER:
          return UpdateWithSideEffect(
            { ...state },
            (state, dispatch) => handleRemoveMember(state, dispatch)
          );

        default:
          return state;
      }
    },
    initialState
  );

  useEffect(() => {
    dispatch({ type: HANDLE_LIST_MEMBERS });
  }, []);

  return (
    <div
      style={{ ...style }}
      className={`pelcro-container pelcro-manage-members-container ${className}`}
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

export { SubscriptionManageMembersContainer, store };
