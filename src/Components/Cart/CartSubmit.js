import React, { useContext } from "react";
import { store } from "./CartContainer";
import { HANDLE_SUBMIT } from "../../utils/action-types";
import { Button } from "../../SubComponents/Button";
import { useTranslation } from "react-i18next";

export const CartSubmit = ({ name, ...otherProps }) => {
  const { dispatch } = useContext(store);

  const { t } = useTranslation("cart");

  return (
    <Button
      {...otherProps}
      onClick={() => dispatch({ type: HANDLE_SUBMIT })}
    >
      {name ?? t("confirm")}
    </Button>
  );
};
