import React, { useContext } from "react";
import { store } from "./SubscriptionOptionsContainer";
import { HANDLE_SUBMIT } from "../../utils/action-types";
import { Button } from "../../SubComponents/Button";
import { useTranslation } from "react-i18next";

export const SubscriptionOptionsSubmit = ({
  name,
  onClick,
  ...otherProps
}) => {
  const {
    dispatch,
    state: { selectedOption }
  } = useContext(store);

  const { t } = useTranslation("subscriptionOptions");

  return (
    <Button
      onClick={() => {
        dispatch({ type: HANDLE_SUBMIT });
        onClick?.();
      }}
      disabled={!selectedOption}
      {...otherProps}
    >
      {name ?? t("next")}
    </Button>
  );
};
