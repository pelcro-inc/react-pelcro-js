import React, { useContext, useState, useEffect } from "react";
import { Button } from "../../SubComponents/Button";
import {
  HANDLE_LOGIN,
  HANDLE_SUBMIT
} from "../../utils/action-types";
import { store } from "./PasswordForgotContainer";

export const PasswordForgotButton = ({ ...otherProps }) => {
  const {
    state: { buttonDisabled },
    dispatch
  } = useContext(store);

  return (
    <Button
      {...otherProps}
      onClick={() => dispatch({ type: HANDLE_SUBMIT })}
      disabled={buttonDisabled}
    >
      {otherProps.name || "Submit"}
    </Button>
  );
};
