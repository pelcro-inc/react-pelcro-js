import React, { useContext, useEffect, useMemo } from "react";
import Submit from "../common/Submit";
import { store } from "./AddressCreateContainer";
import { HANDLE_SUBMIT } from "../../utils/action-types";

export const AddressCreateSubmit = ({ name, style, className }) => {
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
