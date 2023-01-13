import React, {
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import { store } from "./SubscriptionManageMembersContainer";
import { Input } from "../../SubComponents/Input";
import { useTranslation } from "react-i18next";
import {
  SET_EMAILS,
  SET_EMAILS_ERROR
} from "../../utils/action-types";

export function SubscriptionManageMembersEmails(props) {
  const { t } = useTranslation("common");

  const {
    dispatch,
    state: { emails: stateEmails, emailsError }
  } = useContext(store);
  const [emails, setEmails] = useState(stateEmails);
  const [finishedTyping, setFinishedTyping] = useState(false);

  const handleInputChange = useCallback(
    (value) => {
      setEmails(value);

      if (emails.length) {
        dispatch({ type: SET_EMAILS, payload: emails });
      } else if (finishedTyping) {
        dispatch({
          type: SET_EMAILS_ERROR,
          payload: t("validation.enterEmails")
        });
      }
    },
    [dispatch, emails, finishedTyping]
  );

  useEffect(() => {
    handleInputChange(emails);
  }, [finishedTyping, emails, handleInputChange]);

  return (
    <Input
      type="text"
      error={emailsError}
      value={emails}
      onChange={(e) => handleInputChange(e.target.value)}
      onBlur={() => setFinishedTyping(true)}
      onFocus={() => setFinishedTyping(false)}
      {...props}
    />
  );
}
