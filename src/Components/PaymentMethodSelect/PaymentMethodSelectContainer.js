import React, { createContext, useEffect } from "react";
import useReducerWithSideEffects, {
  Update,
  UpdateWithSideEffect
} from "use-reducer-with-side-effects";
import { usePelcro } from "../../hooks/usePelcro";
import {
  HANDLE_SUBMIT,
  LOAD_PAYMENT_METHODS,
  SELECT_PAYMENT_METHOD
} from "../../utils/action-types";

const moveDefaultPaymentMethodToStart = (paymentMethods) => {
  const defaultPaymentMethod = window.Pelcro.user.read()?.source;

  const paymentMethodsWithoutDefault = paymentMethods.filter(
    (paymentMethod) => paymentMethod.id !== defaultPaymentMethod.id
  );

  return [defaultPaymentMethod, ...paymentMethodsWithoutDefault];
};

const initialState = {
  paymentMethods: [],
  selectedPaymentMethodId: null,
  isSubmitting: false,
  alert: {
    type: "error",
    content: ""
  }
};

const store = createContext(initialState);
const { Provider } = store;

const PaymentMethodSelectContainer = ({
  style,
  className,
  onSuccess = () => {},
  children
}) => {
  const {
    set,
    selectedPaymentMethodId: selectedPaymentMethodIdFromStore
  } = usePelcro();

  const submitPaymentMethod = ({ selectedPaymentMethodId }) => {
    set({ selectedPaymentMethodId });

    return onSuccess(selectedPaymentMethodId);
  };

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case SELECT_PAYMENT_METHOD:
          return Update({
            ...state,
            selectedPaymentMethodId: action.payload
          });

        case LOAD_PAYMENT_METHODS:
          return Update({
            ...state,
            paymentMethods: moveDefaultPaymentMethodToStart(
              action.payload
            ),
            selectedPaymentMethodId:
              selectedPaymentMethodIdFromStore ??
              String(window.Pelcro.user.read()?.source?.id)
          });

        case HANDLE_SUBMIT:
          return UpdateWithSideEffect(
            { ...state, isSubmitting: true },
            (state, dispatch) => submitPaymentMethod(state, dispatch)
          );

        default:
          return state;
      }
    },
    initialState
  );

  useEffect(() => {
    dispatch({
      type: LOAD_PAYMENT_METHODS,
      payload: window.Pelcro.user.read().sources ?? []
    });
  }, []);

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

export { PaymentMethodSelectContainer, store };
