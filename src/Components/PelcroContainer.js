import React, { createContext, useReducer } from "react";
import { SET_VIEW } from "../utils/action-types";

const initialState = {
  selectedAddress: null,
  view: null
};

const store = createContext(initialState);
const { Provider } = store;

const PelcroContainer = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case SET_VIEW:
        return { ...state, ...action.payload };

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
