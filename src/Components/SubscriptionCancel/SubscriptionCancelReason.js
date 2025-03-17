import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { store } from "./SubscriptionCancelContainer";
import { SET_CANCEL_SUBSCRIPTION_REASON } from "../../utils/action-types";

export const SubscriptionCancelReason = (props) => {
  const { t } = useTranslation("subscriptionCancel");
  const { dispatch } = useContext(store);

  const handleOnTextAreaChange = (e) => {
    dispatch({
      type: SET_CANCEL_SUBSCRIPTION_REASON,
      payload: e.target.value.trim()
    });
  };

  return (
    <div className="plc-w-full">
      <textarea
        id="cancel-reason"
        rows="2"
        className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-white plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:bg-white plc-focus:shadow-sm"
        placeholder={t("labels.cancelReasonPlaceholder") || "Please tell us why you're cancelling (optional)"}
        onChange={handleOnTextAreaChange}
        onBlur={handleOnTextAreaChange}
        {...props}
      />
    </div>
  );
};
