import React, { useContext, useEffect, useMemo } from "react";
import Submit from "../common/Submit";
import { store } from "./AddressUpdateContainer";
import { HANDLE_SUBMIT } from "../../utils/action-types";

export const AddressUpdateSubmit = ({ name, style, className }) => {
  const {
    dispatch,
    state: { disableSubmit },
  } = useContext(store);

  useEffect(() => console.log("SubmitCheckoutForm mounted"), []);

  return useMemo(
    () => (
      <Submit
        onClick={() => dispatch({ type: HANDLE_SUBMIT })}
        text={name}
        disabled={disableSubmit}
        style={style}
        className={className}
      />
    ),
    [className, name, disableSubmit, style]
  );
};
