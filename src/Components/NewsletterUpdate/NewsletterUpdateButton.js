import React, { useContext } from "react";
import { store } from "./NewsletterUpdateContainer";
import { HANDLE_SUBMIT } from "../../utils/action-types";
import { Button } from "../../SubComponents/Button";
import { useTranslation } from "react-i18next";

export const NewsletterUpdateButton = ({
  name,
  onClick,
  ...otherProps
}) => {
  const {
    dispatch,
    state: { isSubmitting, isListLoading }
  } = useContext(store);

  const { t } = useTranslation("newsletter");

  return (
    <Button
      onClick={() => {
        dispatch({ type: HANDLE_SUBMIT });
        onClick?.();
      }}
      disabled={isListLoading}
      isLoading={isSubmitting}
      {...otherProps}
    >
      {name ?? t("labels.submit")}
    </Button>
  );
};
