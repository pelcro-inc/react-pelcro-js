import React, { useContext } from "react";
import { store } from "./CartContainer";
import { HANDLE_SUBMIT } from "../../utils/action-types";
import { Button } from "../../SubComponents/Button";

export const CartSubmit = ({ name, ...otherProps }) => {
  const {
    dispatch,
    state: { isEmpty, disableSubmit }
  } = useContext(store);

  if (!isEmpty) {
    return (
      <Button
        {...otherProps}
        onClick={() => dispatch({ type: HANDLE_SUBMIT })}
        disabled={disableSubmit}
        isFullWidth={true}
      >
        {name}
      </Button>
    );
  }
  return null;
};
