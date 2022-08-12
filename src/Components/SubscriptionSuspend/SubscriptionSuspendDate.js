import React, {useContext, useEffect} from "react";
import { useTranslation } from "react-i18next";
import { DatePicker } from "../../SubComponents/DatePicker";
import {store} from "./SubscriptionSuspendContainer";
import {SET_SUBSCRIPTION_SUSPEND_DATE, DISABLE_SUBMIT} from "../../utils/action-types";

const nowDate = new Date();
const nowDateISO = nowDate.toISOString().substr(0, 10);
const dayFromNowDateISO = new Date(
  new Date().setDate(nowDate.getDate() + 1)
)
  .toISOString()
  .substr(0, 10);

export const SubscriptionSuspendDate = (props) => {
  const { t } = useTranslation("subscriptionSuspend");

  const {dispatch, state} = useContext(store);

  const handleInputChange = (value) => {
    if (value) {
      dispatch({ type: DISABLE_SUBMIT, payload: false });
      dispatch({ type: SET_SUBSCRIPTION_SUSPEND_DATE, payload: value });
    }
  }

  useEffect(() => {
    handleInputChange(dayFromNowDateISO)
  }, [])
  

  return(
    <DatePicker 
      label={t("labels.suspensionDate")} 
      min={dayFromNowDateISO}
      value={state.suspendDate ?? dayFromNowDateISO}
      onChange={(e) => handleInputChange(e.target.value)}
      {...props} 
    />
  );
}
