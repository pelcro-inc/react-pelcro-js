import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Select } from "../../SubComponents/Select";
import { TextArea } from "../../SubComponents/TextArea";
import { store } from "./SubscriptionCancelContainer";
import { SET_CANCEL_SUBSCRIPTION_REASON } from "../../utils/action-types";

export const SubscriptionCancelReason = (props) => {
  const { t } = useTranslation("subscriptionCancel");

  const { dispatch } = useContext(store);
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReasonText, setOtherReasonText] = useState("");

  // Get site reasons from Pelcro configuration
  const siteReasons = window.Pelcro.site.read().cancellation_reasons.map((reason) => ({
    value: reason,
    label: reason
  }));
  
  const cancellationReasons = [
    ...siteReasons,
    {
      value: "other",
      label: t("labels.cancelReasons.other")
    }
  ];

  const handleReasonSelect = (e) => {
    const value = e.target.value;
    setSelectedReason(value);
    
    if (value === "other") {
      // If "other" is selected, use the text input value
      dispatch({
        type: SET_CANCEL_SUBSCRIPTION_REASON,
        payload: otherReasonText.trim()
      });
    } else {
      // If a predefined reason is selected, use that value
      dispatch({
        type: SET_CANCEL_SUBSCRIPTION_REASON,
        payload: value
      });
    }
  };

  const handleOtherReasonChange = (e) => {
    const value = e.target.value;
    setOtherReasonText(value);
    
    // Only update the reason if "other" is currently selected
    if (selectedReason === "other") {
      dispatch({
        type: SET_CANCEL_SUBSCRIPTION_REASON,
        payload: value.trim()
      });
    }
  };

  return (
    <div className="plc-w-full plc-mb-6">
      <Select
        label={t("labels.cancelReason")}
        value={selectedReason}
        onChange={handleReasonSelect}
        required
        {...props}
      >
        <option value="">{t("labels.selectReason")}</option>
        {cancellationReasons.map((reason) => (
          <option key={reason.value} value={reason.value}>
            {reason.label}
          </option>
        ))}
      </Select>
      
      {selectedReason === "other" && (
        <TextArea
          label={t("labels.otherReason")}
          value={otherReasonText}
          onChange={handleOtherReasonChange}
          required
          className="plc-mt-3"
        />
      )}
    </div>
  );
};
