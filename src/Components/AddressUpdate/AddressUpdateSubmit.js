import React, { useContext } from "react";
import { store } from "./AddressUpdateContainer";
import { HANDLE_SUBMIT } from "../../utils/action-types";
import { Button } from "../../SubComponents/Button";
import { useTranslation } from "react-i18next";

export const AddressUpdateSubmit = ({ name, ...otherProps }) => {
  const {
    dispatch,
    state: { disableSubmit }
  } = useContext(store);

  const { t } = useTranslation("address");

  return (
    <Button
      {...otherProps}
      onClick={() => dispatch({ type: HANDLE_SUBMIT })}
      disabled={disableSubmit}
      isFullWidth={true}
    >
      {name ?? t("buttons.submit")}
    </Button>
  );
};
