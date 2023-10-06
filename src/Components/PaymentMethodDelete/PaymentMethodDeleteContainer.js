import React, { createContext, useEffect } from "react";
import useReducerWithSideEffects, {
  Update,
  UpdateWithSideEffect
} from "use-reducer-with-side-effects";
import { usePelcro } from "../../hooks/usePelcro";
import {
  HANDLE_SUBMIT,
  SELECT_PAYMENT_METHOD,
  SET_DELETE_PAYMENT_METHOD_OPTION,
  SHOW_ALERT,
  SET_PAYMENT_METHODS,
  DISABLE_SUBMIT,
  LOADING,
  SKELETON_LOADER
} from "../../utils/action-types";
import { getErrorMessages } from "../common/Helpers";

const initialState = {
  paymentMethods: [],
  selectedPaymentMethodId: null,
  isSubmitting: false,
  deleteOption: "",
  disableSubmit: false,
  isLoading: false,
  skeletonLoader: true,
  alert: {
    type: "error",
    content: ""
  }
};

const store = createContext(initialState);
const { Provider } = store;

const PaymentMethodDeleteContainer = ({
  style,
  className = "",
  onSuccess = () => {},
  onFailure = () => {},
  children
}) => {
  const { paymentMethodToDelete } = usePelcro();

  useEffect(() => {
    window.Pelcro.paymentMethods.list(
      {
        auth_token: window.Pelcro.user.read().auth_token
      },
      (err, res) => {
        if (err) {
          return console.error(err);
        }

        if (res) {
          dispatch({
            type: SET_PAYMENT_METHODS,
            payload: res.data
          });
          dispatch({
            type: SKELETON_LOADER,
            payload: false
          });
          if (res.data.length !== 1) {
            dispatch({
              type: SET_DELETE_PAYMENT_METHOD_OPTION,
              payload: "select"
            });
          } else {
            dispatch({
              type: SET_DELETE_PAYMENT_METHOD_OPTION,
              payload: "add"
            });
          }
        }
      }
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setDefaultPaymentMethod = () => {
    const { selectedPaymentMethodId: paymentMethodId } = state;
    window.Pelcro.paymentMethods.setDefaultPaymentMethod(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        payment_method_id: paymentMethodId
      },
      (err, res) => {
        if (err) {
          onFailure(err);
          return dispatch({
            type: SHOW_ALERT,
            payload: {
              type: "error",
              content: getErrorMessages(err)
            }
          });
        }

        setTimeout(() => {
          deletePaymentMethod();
        }, 1000);
      }
    );
  };

  const deletePaymentMethod = () => {
    const { id: paymentMethodId } = paymentMethodToDelete;
    window.Pelcro.paymentMethods.deletePaymentMethod(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        payment_method_id: paymentMethodId
      },
      (err, res) => {
        if (err) {
          onFailure?.(err);
          return dispatch({
            type: SHOW_ALERT,
            payload: {
              type: "error",
              content: getErrorMessages(err)
            }
          });
        }
        dispatch({ type: DISABLE_SUBMIT, payload: false });
        dispatch({ type: LOADING, payload: false });
        onSuccess(res);
      }
    );
  };

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case SELECT_PAYMENT_METHOD:
          return Update({
            ...state,
            selectedPaymentMethodId: action.payload
          });

        case HANDLE_SUBMIT:
          return UpdateWithSideEffect(
            { ...state, disableSubmit: true, isLoading: true },
            (state, dispatch) =>
              setDefaultPaymentMethod(state, dispatch)
          );

        case SET_DELETE_PAYMENT_METHOD_OPTION:
          return Update({
            ...state,
            deleteOption: action.payload
          });

        case SET_PAYMENT_METHODS:
          return Update({
            ...state,
            paymentMethods: action.payload
          });

        case SHOW_ALERT:
          return Update({
            ...state,
            alert: action.payload
          });

        case DISABLE_SUBMIT:
          return Update({ ...state, disableSubmit: action.payload });

        case LOADING:
          return Update({ ...state, isLoading: action.payload });

        case SKELETON_LOADER:
          return Update({ ...state, skeletonLoader: action.payload });

        default:
          return state;
      }
    },
    initialState
  );

  return (
    <div
      style={{ ...style }}
      className={`pelcro-container pelcro-payment-method-delete-container ${className}`}
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

export { PaymentMethodDeleteContainer, store };
