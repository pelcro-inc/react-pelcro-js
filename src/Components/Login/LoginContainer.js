import React, { createContext, useReducer } from "react";

const initialState = { email: "", password: "" };
const store = createContext(initialState);
const { Provider } = store;

const LoginContainer = ({ style, className, children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "setEmail":
        return { ...state, email: action.payload };
      case "setPassword":
        return { ...state, password: action.payload };
      default:
        throw new Error();
    }
  }, initialState);

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

export { LoginContainer, store };
