import React, { useContext } from "react";
import { store } from "./CartContainer";
import { HANDLE_SUBMIT } from "../../utils/action-types";
import { Button } from "../../SubComponents/Button";
import { useTranslation } from "react-i18next";

export const CartSubmit = ({ name, ...otherProps }) => {
  const {
    dispatch,
    state: { isEmpty, disableSubmit }
  } = useContext(store);

  const { t } = useTranslation("cart");

  if (!isEmpty) {
    return (
      <Button
        {...otherProps}
        onClick={() => dispatch({ type: HANDLE_SUBMIT })}
        disabled={disableSubmit}
        isFullWidth={true}
      >
        {name ?? t("confirm")}
      </Button>
    );
  }
  return null;
};
