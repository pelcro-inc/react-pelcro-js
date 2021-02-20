import React, { useContext } from "react";
import { Button } from "../../SubComponents/Button";
import { HANDLE_USER_UPDATE } from "../../utils/action-types";
import { store } from "./UserUpdateContainer";

export const UserUpdateButton = ({ name, ...otherProps }) => {
  const {
    state: { buttonDisabled },
    dispatch
  } = useContext(store);

  return (
    <Button
      {...otherProps}
      onClick={() => dispatch({ type: HANDLE_USER_UPDATE })}
      disabled={buttonDisabled}
      isFullWidth={true}
    >
      {name}
    </Button>
  );
};
