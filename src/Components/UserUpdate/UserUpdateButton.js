import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { HANDLE_USER_UPDATE } from "../../utils/action-types";
import { store } from "./UserUpdateContainer";

export const UserUpdateButton = ({ name, ...otherProps }) => {
  const {
    state: { buttonDisabled },
    dispatch
  } = useContext(store);

  const { t } = useTranslation("userEdit");

  return (
    <Button
      {...otherProps}
      onClick={() => dispatch({ type: HANDLE_USER_UPDATE })}
      disabled={buttonDisabled}
      isLoading={buttonDisabled}
      className="plc-w-full"
    >
      {name ?? t("labels.submit")}
    </Button>
  );
};
