import React, { useContext } from "react";
import { store } from "./AddressSelectContainer";
import { HANDLE_SUBMIT } from "../../utils/action-types";
import { Button } from "../../SubComponents/Button";
import { useTranslation } from "react-i18next";

export const AddressSelectSubmit = ({
  name,
  onClick,
  type = "shipping",
  ...otherProps
}) => {
  const {
    dispatch,
    state: {
      selectedAddressId,
      isSubmitting,
      selectedBillingAddressId
    }
  } = useContext(store);

  const { t } = useTranslation("address");

  return (
    <Button
      onClick={() => {
        dispatch({ type: HANDLE_SUBMIT });
        onClick?.();
      }}
      disabled={
        type == "shipping"
          ? selectedAddressId === "undefined" ||
            selectedAddressId === null ||
            !selectedAddressId
          : selectedBillingAddressId === "undefined" ||
            selectedBillingAddressId === null ||
            !selectedBillingAddressId
      }
      isLoading={isSubmitting}
      {...otherProps}
    >
      {name ?? t("buttons.submit")}
    </Button>
  );
};
