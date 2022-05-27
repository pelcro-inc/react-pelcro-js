import React, { createContext } from "react";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update,
  SideEffect
} from "use-reducer-with-side-effects";
import {
  LINK_TOKEN_VERIFY,
  SHOW_ALERT,
  LOADING
} from "../../utils/action-types";
import { getErrorMessages } from "../common/Helpers";

const initialState = {
  isLoading: true,
  isTokenValid: false,
  alert: {
    type: "error",
    content: ""
  }
};
const store = createContext(initialState);
const { Provider } = store;

const VerifyLinkTokenContainer = ({
  style,
  className = "",
  onSuccess = () => {},
  onFailure = () => {},
  children
}) => {
  const handleVerifyLinkToken = ({}, dispatch) => {
    const token = window.Pelcro.helpers.getURLParameter("token");
    window.Pelcro.user.verifyLoginToken({ token }, (err, res) => {
      dispatch({ type: LOADING, payload: false });

      if (err) {
        dispatch({
          type: SHOW_ALERT,
          payload: { type: "error", content: getErrorMessages(err) }
        });
        onFailure(err);
      } else {
        onSuccess(res);
      }
    });
  };

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case SHOW_ALERT:
          return Update({
            ...state,
            alert: action.payload
          });
        case LOADING:
          return Update({ ...state, isLoading: action.payload });
        case LINK_TOKEN_VERIFY:
          return UpdateWithSideEffect(
            { ...state, isLoading: true },
            (state, dispatch) => handleVerifyLinkToken(state, dispatch)
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
      className={`pelcro-container pelcro-login-container ${className}`}
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

export { VerifyLinkTokenContainer, store };
