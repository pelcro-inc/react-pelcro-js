import React, { createContext, useReducer } from "react";
import {
  SET_PRODUCT_AND_PLAN,
  SET_SUBSCRIPTION_TO_RENEW,
} from "../utils/action-types";

const initialState = {
  selectedAddress: null,
  product: null,
  plan: null,
  isGift: false,
  subscriptionIdToRenew: null,
};

const store = createContext(initialState);
const { Provider } = store;

const PelcroContainer = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case SET_PRODUCT_AND_PLAN:
        return { ...state, ...action.payload };

      case SET_SUBSCRIPTION_TO_RENEW:
        return { ...state, subscriptionIdToRenew: action.payload };

      default:
        throw new Error();
    }
  }, initialState);

  return (
    <Provider value={{ state, dispatch }}>
      {children.length
        ? children.map((child, i) =>
            React.cloneElement(child, { store, key: i })
          )
        : React.cloneElement(children, { store })}
    </Provider>
  );
};

export { PelcroContainer, store };
