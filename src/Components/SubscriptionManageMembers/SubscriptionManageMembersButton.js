import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { HANDLE_INVITE_MEMBERS } from "../../utils/action-types";
import { store } from "./SubscriptionManageMembersContainer";

export const SubscriptionManageMembersButton = ({ name, onClick, ...otherProps }) => {
  const {
    state: {
      emailsError,
      emails,
      buttonDisabled
    },
    dispatch
  } = useContext(store);

  const { t } = useTranslation("subscriptionManageMembers");

  const [isDisabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(emailsError || !emails.length || buttonDisabled);
  }, [emailsError, emails, buttonDisabled]);

  return (
    <Button
      onClick={() => {
        dispatch({ type: HANDLE_INVITE_MEMBERS });
        onClick?.();
      }}
      disabled={isDisabled}
      isLoading={buttonDisabled}
      {...otherProps}
    >
      {name ?? t("labels.invite")}
    </Button>
  );
};
