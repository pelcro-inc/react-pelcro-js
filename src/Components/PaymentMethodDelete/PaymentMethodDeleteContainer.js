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
  SET_PAYMENT_METHODS
} from "../../utils/action-types";
import { getErrorMessages } from "../common/Helpers";

const initialState = {
  paymentMethods: [],
  selectedPaymentMethodId: null,
  isSubmitting: false,
  deleteOption: "add",
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
          // if (res.data.length !== 1) {
          //   dispatch({
          //     type: SET_DELETE_PAYMENT_METHOD_OPTION,
          //     payload: "select"
          //   });
          // } else {
          //   dispatch({
          //     type: SET_DELETE_PAYMENT_METHOD_OPTION,
          //     payload: "add"
          //   });
          // }
        }
      }
    );
  }, []);

  const setDefaultPaymentMethod = () => {
    const { selectedPaymentMethodId: paymentMethodId } = state;
    window.Pelcro.paymentMethods.update(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        payment_method_id: paymentMethodId,
        is_default: true
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

        deletePaymentMethod();
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
          return onFailure?.(err);
        }
        dispatch({
          type: SHOW_ALERT,
          payload: {
            type: "success",
            content: "messages.sourceUpdated"
          }
        });
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
            { ...state, isSubmitting: true },
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
