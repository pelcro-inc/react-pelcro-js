import React, { useContext, useMemo } from "react";
import Submit from "../common/Submit";
import { store } from "./GiftRedeemContainer";
import { HANDLE_SUBMIT } from "../../utils/action-types";

export const GiftRedeemSubmitButton = ({
  name,
  style,
  className
}) => {
  const {
    dispatch,
    state: { disableSubmit }
  } = useContext(store);

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
