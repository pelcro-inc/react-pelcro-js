import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Radio } from "../../SubComponents/Radio";
import { store } from "./SubscriptionCancelContainer";
import { SET_CANCEL_SUBSCRIPTION_OPTION } from "../../utils/action-types";

// New cancellation option modal
export const SubscriptionCancelOptions = ({ subscription , hasPhases,
  onClick,
  className }) => {
  const { t } = useTranslation("subscriptionCancel");
  const {
    state: { cancelationOption },
    dispatch
  } = useContext(store);
  const phases = subscription?.schedule?.phases;
  const lastPhase = !phases ? [] : phases[phases?.length - 1]; 
  


  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };



  const handleOptionSelect = (event) => {
    dispatch({
      type: SET_CANCEL_SUBSCRIPTION_OPTION,
      payload: event.target.value
    });
  };

  return (
    <div className="plc-space-y-3">
      {subscription.cancel_at_period_end === 0 && (
        <div className="plc-relative plc-flex plc-items-start plc-rounded-lg plc-border plc-border-gray-200 plc-p-4 plc-transition-colors hover:plc-bg-gray-50">
          <Radio
            onChange={handleOptionSelect}
            checked={cancelationOption === "period_end"}
            value="period_end"
            className="plc-mt-0.5"
          >
            <div className="plc-ml-3">
              <span className="plc-block plc-text-sm plc-font-medium plc-text-gray-900">
                {t("labels.endOn")} {formatDate(subscription?.end_date)}
              </span>
              <span className="plc-mt-1 plc-block plc-text-sm plc-text-gray-500">
                {t("labels.currentPeriodEndDescription")}
              </span>
            </div>
          </Radio>
        </div>
      )}

      <div className="plc-relative plc-flex plc-items-start plc-rounded-lg plc-border plc-border-gray-200 plc-p-4 plc-transition-colors hover:plc-bg-gray-50">
        <Radio
          onChange={handleOptionSelect}
          checked={cancelationOption === "now"}
          value="now"
          className="plc-mt-0.5"
        >
          <div className="plc-ml-3">
            <span className="plc-block plc-text-sm plc-font-medium plc-text-gray-900">
              {t("labels.endImmediately")}
            </span>
            <span className="plc-mt-1 plc-block plc-text-sm plc-text-gray-500">
              {t("labels.endImmediatelyDescription")}
            </span>
          </div>
        </Radio>
      </div>
    </div>
  );
};
