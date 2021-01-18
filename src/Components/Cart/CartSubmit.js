import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { store } from "./CartContainer";
import { HANDLE_SUBMIT } from "../../utils/action-types";

export const CartSubmit = ({ name, style, className }) => {
  const {
    dispatch,
    state: { isEmpty, disableSubmit }
  } = useContext(store);
  const { t } = useTranslation("cart");

  if (!isEmpty) {
    return (
      <button
        style={style}
        className={className}
        onClick={() => dispatch({ type: HANDLE_SUBMIT })}
        disabled={disableSubmit}
      >
        {t("confirm")}
      </button>
    );
  }
  return null;
};
