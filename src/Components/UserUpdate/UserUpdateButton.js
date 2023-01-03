import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { HANDLE_USER_UPDATE } from "../../utils/action-types";
import { store } from "./UserUpdateContainer";

export const UserUpdateButton = ({
  name,
  onClick,
  ...otherProps
}) => {
  const {
    state: { buttonDisabled, emailError },
    dispatch
  } = useContext(store);

  const { t } = useTranslation("userEdit");

  return (
    <Button
      onClick={() => {
        dispatch({ type: HANDLE_USER_UPDATE });
        onClick?.();
      }}
      disabled={buttonDisabled || emailError}
      isLoading={buttonDisabled && !emailError}
      {...otherProps}
    >
      {name ?? t("labels.submit")}
    </Button>
  );
};
