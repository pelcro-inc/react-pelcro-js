import React, { useContext } from "react";
import { store } from "./InvoiceDetailsContainer";
import { HANDLE_SUBMIT } from "../../utils/action-types";
import { Button } from "../../SubComponents/Button";
import { useTranslation } from "react-i18next";

export const InvoiceDetailsPayButton = ({
  name,
  onClick,
  ...otherProps
}) => {
  const { dispatch } = useContext(store);

  const { t } = useTranslation("invoiceDetails");

  return (
    <Button
      onClick={() => {
        dispatch({ type: HANDLE_SUBMIT });
        onClick?.();
      }}
      {...otherProps}
    >
      {name ?? t("buttons.pay")}
    </Button>
  );
};
