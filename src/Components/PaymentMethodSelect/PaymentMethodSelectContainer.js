import React, { createContext, useEffect } from "react";
import useReducerWithSideEffects, {
  Update,
  UpdateWithSideEffect
} from "use-reducer-with-side-effects";
import { usePelcro } from "../../hooks/usePelcro";
import {
  HANDLE_SUBMIT,
  LOAD_PAYMENT_METHODS,
  SELECT_PAYMENT_METHOD,
  SKELETON_LOADER
} from "../../utils/action-types";

const moveDefaultPaymentMethodToStart = (paymentMethods) => {
  const defaultPaymentMethod =
    getDefaultPaymentMethod(paymentMethods);
  const paymentMethodsWithoutDefault = paymentMethods.filter(
    (paymentMethod) => paymentMethod.id !== defaultPaymentMethod.id
  );

  if (defaultPaymentMethod.status !== "chargeable") {
    return paymentMethodsWithoutDefault;
  }

  return [defaultPaymentMethod, ...paymentMethodsWithoutDefault];
};

const getDefaultPaymentMethod = (paymentMethods) => {
  const defaultPaymentMethod = paymentMethods.find(
    (paymentMethod) => paymentMethod.is_default
  );
  return defaultPaymentMethod;
};

const initialState = {
  paymentMethods: [],
  selectedPaymentMethodId: null,
  skeletonLoader: true,
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
  className = "",
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

  const getInitialSelectedMethodId = (paymentMethods) => {
    if (selectedPaymentMethodIdFromStore) {
      return selectedPaymentMethodIdFromStore;
    }

    const defaultMethod = getDefaultPaymentMethod(paymentMethods);
    if (defaultMethod && defaultMethod.status === "chargeable") {
      return String(defaultMethod.id);
    }
    return null;
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
            selectedPaymentMethodId: getInitialSelectedMethodId(
              action.payload
            )
          });

        case SKELETON_LOADER:
          return Update({ ...state, skeletonLoader: action.payload });

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
            type: LOAD_PAYMENT_METHODS,
            payload: res.data ?? []
          });
          dispatch({
            type: SKELETON_LOADER,
            payload: false
          });
        }
      }
    );
  }, []);

  return (
    <div
      style={{ ...style }}
      className={`pelcro-container pelcro-payment-select-container ${className}`}
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

export { PaymentMethodSelectContainer, store };
