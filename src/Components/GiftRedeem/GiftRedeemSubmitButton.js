import React, { useContext } from "react";
import { store } from "./GiftRedeemContainer";
import { HANDLE_SUBMIT } from "../../utils/action-types";
import { Button } from "../../SubComponents/Button";

export const GiftRedeemSubmitButton = ({ name, ...otherProps }) => {
  const {
    dispatch,
    state: { disableSubmit }
  } = useContext(store);

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
};
