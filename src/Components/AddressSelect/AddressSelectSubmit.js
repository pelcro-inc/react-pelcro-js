import React, { useContext } from "react";
import { store } from "./AddressSelectContainer";
import { HANDLE_SUBMIT } from "../../utils/action-types";
import { Button } from "../../SubComponents/Button";
import { useTranslation } from "react-i18next";

export const AddressSelectSubmit = ({
  name,
  onClick,
  ...otherProps
}) => {
  const {
    dispatch,
    state: { selectedAddressId, isSubmitting }
  } = useContext(store);

  const { t } = useTranslation("address");

  return (
    <Button
      onClick={() => {
        dispatch({ type: HANDLE_SUBMIT });
        onClick();
      }}
      disabled={!selectedAddressId}
      isLoading={isSubmitting}
      {...otherProps}
    >
      {name ?? t("buttons.submit")}
    </Button>
  );
};
