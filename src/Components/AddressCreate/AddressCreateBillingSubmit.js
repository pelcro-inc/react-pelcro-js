import React, { useContext } from "react";
import { store } from "./AddressCreateContainer";
import { HANDLE_BILLING_SUBMIT } from "../../utils/action-types";
import { Button } from "../../SubComponents/Button";
import { useTranslation } from "react-i18next";

export const AddressCreateBillingSubmit = ({
  name,
  onClick,
  ...otherProps
}) => {
  const {
    dispatch,
    state: { isSubmitting }
  } = useContext(store);

  const { t } = useTranslation("address");

  return (
    <Button
      onClick={() => {
        dispatch({ type: HANDLE_BILLING_SUBMIT });
        onClick?.();
      }}
      isLoading={isSubmitting}
      {...otherProps}
    >
      {name ?? t("buttons.submit")}
    </Button>
  );
};
