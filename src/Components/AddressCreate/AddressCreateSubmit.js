import React, { useContext } from "react";
import { store } from "./AddressCreateContainer";
import { HANDLE_SUBMIT } from "../../utils/action-types";
import { Button } from "../../SubComponents/Button";
import { useTranslation } from "react-i18next";

export const AddressCreateSubmit = ({ name, ...otherProps }) => {
  const {
    dispatch,
    state: { disableSubmit, isSubmitting }
  } = useContext(store);

  const { t } = useTranslation("address");

  return (
    <Button
      {...otherProps}
      onClick={() => dispatch({ type: HANDLE_SUBMIT })}
      disabled={disableSubmit}
      isLoading={isSubmitting}
      isFullWidth={true}
    >
      {name ?? t("buttons.submit")}
    </Button>
  );
};
