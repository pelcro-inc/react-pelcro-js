import React, { useContext } from "react";
import { Radio } from "../../SubComponents/Radio";
import { SET_CANCEL_SUBSCRIPTION_OPTION } from "../../utils/action-types";
import { store } from "./SubscriptionCancelContainer";
import { useTranslation } from "react-i18next";

export const SubscriptionCancelOptions = ({
  subscription,
  hasPhases,
  onClick,
  className
}) => {
  const {
    state: { cancelationOption },
    dispatch
  } = useContext(store);

  const { t } = useTranslation("subscriptionCancel");

  const phases = subscription?.schedule?.phases;
  const lastPhase = !phases ? [] : phases[phases?.length - 1];

  const handleOptionSelect = (event) => {
    dispatch({
      type: SET_CANCEL_SUBSCRIPTION_OPTION,
      payload: event.target.value
    });
  };

  return (
    <div className="plc-text-left plc-mr-auto plc-mb-6">
      <p className="plc-mb-3">{t("messages.cancelWhen")}</p>
      {hasPhases && (
        <Radio
          onChange={handleOptionSelect}
          checked={cancelationOption === "period_end"}
          value="period_end"
        >
          {t("labels.endOn")}{" "}
          {new Date(
            Number(`${lastPhase?.end_date}000`)
          ).toLocaleDateString("en-CA", {
            year: "numeric",
            month: "short",
            day: "numeric"
          })}
        </Radio>
      )}
      <Radio
        onChange={handleOptionSelect}
        checked={cancelationOption === "current_period_end"}
        value="current_period_end"
      >
        {t("labels.endOn")}{" "}
        {new Date(
          subscription?.current_period_end
        ).toLocaleDateString("en-CA", {
          year: "numeric",
          month: "short",
          day: "numeric"
        })}
      </Radio>
      <Radio
        onChange={handleOptionSelect}
        checked={cancelationOption === "now"}
        value="now"
      >
        {t("labels.endImmediately")}
      </Radio>
    </div>
  );
};
