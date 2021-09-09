import React, { useContext } from "react";
import { store } from "./GiftCreateContainer";
import { HANDLE_SUBMIT } from "../../utils/action-types";
import { Button } from "../../SubComponents/Button";
import { useTranslation } from "react-i18next";

export const GiftCreateSubmitButton = ({
  name,
  onClick,
  ...otherProps
}) => {
  const {
    dispatch,
    state: { disableSubmit }
  } = useContext(store);

  const { t } = useTranslation("register");

  return (
    <Button
      onClick={() => {
        dispatch({ type: HANDLE_SUBMIT });
        onClick();
      }}
      disabled={disableSubmit}
      {...otherProps}
    >
      {name ?? t("gift.buttons.gift")}
    </Button>
  );
};
