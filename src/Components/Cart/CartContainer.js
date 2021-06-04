import React, { createContext } from "react";
import useReducerWithSideEffects, {
  UpdateWithSideEffect
} from "use-reducer-with-side-effects";
import { HANDLE_SUBMIT } from "../../utils/action-types";

const initialState = {};
const store = createContext(initialState);
const { Provider } = store;

const CartContainer = ({
  style,
  className,
  onSuccess = () => {},
  onFailure = () => {},
  children
}) => {
  const submit = (state, dispatch) => {
    onSuccess();
  };

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case HANDLE_SUBMIT:
          return UpdateWithSideEffect(
            { ...state },
            (state, dispatch) => submit(state, dispatch)
          );
        default:
          return state;
      }
    },
    initialState
  );

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

export { CartContainer, store };
