import React, { useContext } from "react";
import { Button } from "../../SubComponents/Button";
import { HANDLE_SUBMIT } from "../../utils/action-types";

export const PasswordForgotButton = ({
  store,
  name,
  ...otherProps
}) => {
  const {
    state: { buttonDisabled },
    dispatch
  } = useContext(store);

  return (
    <Button
      {...otherProps}
      onClick={() => dispatch({ type: HANDLE_SUBMIT })}
      disabled={buttonDisabled}
      isFullWidth={true}
    >
      {name}
    </Button>
  );
};
