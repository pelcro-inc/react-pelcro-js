import React, { createContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update
} from "use-reducer-with-side-effects";
import {
  SHOW_ALERT,
  LOADING,
  HANDLE_SUBMIT,
  SET_SELECT,
  GET_NEWSLETTERS_FETCH,
  GET_NEWSLETTERS_SUCCESS,
  SWITCH_TO_UPDATE
} from "../../utils/action-types";
import { getErrorMessages } from "../common/Helpers";

const initialState = {
  didSubToNewslettersBefore: false,
  newsletters: [],
  isListLoading: true,
  isSubmitting: false,
  alert: {
    type: "error",
    content: ""
  }
};
const store = createContext(initialState);
const { Provider } = store;

const NewsletterUpdateContainer = ({
  style,
  className = "",
  onSuccess = () => {},
  onFailure = () => {},
  children
}) => {
  const [t] = useTranslation("address");

  const handleSubmit = (
    { newsletters, didSubToNewslettersBefore },
    dispatch
  ) => {
    const callback = (err, res) => {
      dispatch({ type: LOADING, payload: false });

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
        if (!didSubToNewslettersBefore) {
          dispatch({ type: SWITCH_TO_UPDATE });
        }
        dispatch({
          type: SHOW_ALERT,
          payload: {
            type: "success",
            content: t("messages.addressUpdated")
          }
        });
        onSuccess(res);
      }
    };

    const requestData = {
      email: window.Pelcro.user.read()?.email,
      source: "web",
      lists: newsletters
        .filter((newsletter) => newsletter.selected)
        .map((newsletter) => newsletter.id)
        .join(",")
    };

    if (didSubToNewslettersBefore) {
      window.Pelcro.newsletter.update(requestData, callback);
    } else {
      window.Pelcro.newsletter.create(requestData, callback);
    }
  };

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case GET_NEWSLETTERS_FETCH:
          return Update({
            ...state,
            isListLoading: true
          });

        case GET_NEWSLETTERS_SUCCESS:
          return Update({
            ...state,
            newsletters: action.payload.newsletters,
            didSubToNewslettersBefore:
              action.payload.didSubToNewslettersBefore,
            isListLoading: false
          });

        case SET_SELECT:
          return Update({
            ...state,
            newsletters: state.newsletters.map((newsletter) => {
              if (newsletter.id === action.payload) {
                return {
                  ...newsletter,
                  selected: !newsletter.selected
                };
              }
              return newsletter;
            })
          });

        case SWITCH_TO_UPDATE:
          return Update({
            ...state,
            didSubToNewslettersBefore: true
          });

        case SHOW_ALERT:
          return Update({
            ...state,
            alert: action.payload
          });

        case LOADING:
          return Update({ ...state, isSubmitting: action.payload });

        case HANDLE_SUBMIT:
          return UpdateWithSideEffect(
            { ...state, isSubmitting: true },
            (state, dispatch) => handleSubmit(state, dispatch)
          );

        default:
          return state;
      }
    },
    initialState
  );

  useEffect(() => {
    const getUserNewsletters = () => {
      dispatch({
        type: GET_NEWSLETTERS_FETCH
      });

      window.Pelcro.newsletter.getByEmail(
        window.Pelcro.user.read()?.email,
        (err, res) => {
          if (err) {
            return dispatch({
              type: SHOW_ALERT,
              payload: {
                type: "error",
                content: getErrorMessages(err)
              }
            });
          }

          const newsletters =
            window.Pelcro?.uiSettings?.newsletters ?? [];
          const selectedNewsletters =
            res.data.lists?.split(",") ?? [];
          const allNewslettersWithSelectedField = newsletters.map(
            (newsletter) => ({
              ...newsletter,
              id: String(newsletter.id),
              selected: selectedNewsletters.includes(
                String(newsletter.id)
              )
            })
          );
          dispatch({
            type: GET_NEWSLETTERS_SUCCESS,
            payload: {
              newsletters: allNewslettersWithSelectedField,
              didSubToNewslettersBefore: Boolean(res.data.email)
            }
          });
        }
      );
    };

    getUserNewsletters();
  }, []);

  return (
    <div
      style={{ ...style }}
      className={`pelcro-container pelcro-newsletter-update-container ${className}`}
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

export { NewsletterUpdateContainer, store };
