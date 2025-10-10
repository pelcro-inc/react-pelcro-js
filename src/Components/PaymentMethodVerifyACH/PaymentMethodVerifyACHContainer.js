import React, { createContext } from "react";
import useReducerWithSideEffects, {
  Update,
  UpdateWithSideEffect
} from "use-reducer-with-side-effects";
import { usePelcro } from "../../hooks/usePelcro";
import {
  HANDLE_SUBMIT,
  SHOW_ALERT,
  DISABLE_SUBMIT,
  LOADING,
  SET_VERIFICATION_CODE
} from "../../utils/action-types";
import { getErrorMessages } from "../common/Helpers";

const initialState = {
  verificationCode: "",
  isSubmitting: false,
  disableSubmit: true,
  isLoading: false,
  alert: {
    type: "error",
    content: ""
  }
};

const store = createContext(initialState);
const { Provider } = store;

const PaymentMethodVerifyACHContainer = ({
  style,
  className = "",
  onSuccess = () => {},
  onFailure = () => {},
  children
}) => {
  const { paymentMethodToVerify } = usePelcro();

  const verifyACH = () => {
    const { verificationCode } = state;
    console.log("verificationCode", verificationCode);
    console.log("paymentMethodToVerify", paymentMethodToVerify);
    window.Pelcro.paymentMethods.verifyACH(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        payment_method_id: paymentMethodToVerify.id,
        verification_code: verificationCode
      },
      (err, res) => {
        dispatch({ type: DISABLE_SUBMIT, payload: false });
        dispatch({ type: LOADING, payload: false });
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
        onSuccess(res);
      }
    );
  };

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case SET_VERIFICATION_CODE:
          const code = action.payload.toUpperCase();
          return Update({
            ...state,
            verificationCode: code,
            disableSubmit: code.length !== 6
          });

        case HANDLE_SUBMIT:
          return UpdateWithSideEffect(
            { ...state, disableSubmit: true, isLoading: true },
            (state, dispatch) => {
              verifyACH(state, dispatch);
            }
          );

        case SHOW_ALERT:
          return Update({
            ...state,
            alert: action.payload
          });

        case DISABLE_SUBMIT:
          return Update({ ...state, disableSubmit: action.payload });

        case LOADING:
          return Update({ ...state, isLoading: action.payload });

        default:
          return state;
      }
    },
    initialState
  );

  return (
    <div
      style={{ ...style }}
      className={`pelcro-container pelcro-payment-method-verify-ach-container ${className}`}
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

export { PaymentMethodVerifyACHContainer, store };
