import React, {useContext} from "react";
import { useTranslation } from "react-i18next";
import { TextArea } from "../../SubComponents/TextArea";
import {store} from "./SubscriptionCancelContainer";
import {SET_CANCEL_SUBSCRIPTION_REASON} from "../../utils/action-types";

export const SubscriptionCancelReason = (props) => {
  const { t } = useTranslation("subscriptionCancel");

  const {dispatch, state} = useContext(store);

  const handleOnTextAreaBlur = (e) => {
    dispatch({ type: SET_CANCEL_SUBSCRIPTION_REASON, payload: e.target.value.trim() });
  }

  return(
    <TextArea label={t("labels.cancelReason")} onBlur={(e) => handleOnTextAreaBlur(e)} {...props} />
  );
}
