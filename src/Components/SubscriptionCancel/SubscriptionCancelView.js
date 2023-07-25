import React from "react";
import { useTranslation } from "react-i18next";
import { SubscriptionCancelContainer } from "./SubscriptionCancelContainer";
import { SubscriptionCancelReason } from "./SubscriptionCancelReason";
import { ReactComponent as SubscriptionIcon } from "../../assets/subscription.svg";
import { usePelcro } from "../../hooks/usePelcro";
import { SubscriptionCancelButton } from "./SubscriptionCancelButton";
import { SubscriptionCancelOptions } from "./SubscriptionCancelOptions";
import { Button } from "../../SubComponents/Button";

export const SubscriptionCancelView = (props) => {
  const { subscriptionToCancel, switchView } = usePelcro();

  const { t } = useTranslation("subscriptionCancel");

  const getPhases = () => {
    if (!subscriptionToCancel.schedule) return [];

    const currentPhaseStartDate =
      subscriptionToCancel?.schedule?.current_phase?.start_date;

    const currentPhase = subscriptionToCancel?.schedule?.phases?.find(
      (phase) => {
        return phase?.start_date === currentPhaseStartDate;
      }
    );

    const futurePhases =
      subscriptionToCancel?.schedule?.phases?.filter((phase) => {
        return phase?.start_date > currentPhaseStartDate;
      });

    return [currentPhase, ...futurePhases];
  };

  const hasPhases = getPhases().length > 0;

  const phases = subscriptionToCancel?.schedule?.phases;
  const lastPhase = phases[phases?.length - 1];

  return (
    <div id="pelcro-subscription-cancel-view">
      <div className="plc-mb-6 plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4 className="plc-text-2xl plc-font-semibold">
          {t("labels.title")}
          <span className="plc-text-gray-400 plc-text-base plc-block">
            ({subscriptionToCancel?.plan?.nickname})
          </span>
        </h4>
      </div>
      <SubscriptionCancelContainer {...props}>
        <div className="plc-flex plc-flex-col plc-items-center plc-justify-center plc-mt-4">
          <SubscriptionIcon className="plc-w-32 plc-h-32" />
          <p className="plc-mb-3 plc-text-gray-900 plc-text-left plc-mr-auto plc-whitespace-pre-line">
            {t("messages.subscriptionEnd")}{" "}
            {hasPhases
              ? new Date(
                  Number(`${lastPhase?.end_date}000`)
                ).toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })
              : new Date(
                  subscriptionToCancel?.current_period_end
                ).toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })}
            .
          </p>

          <SubscriptionCancelOptions
            subscription={subscriptionToCancel}
            hasPhases={hasPhases}
          />
          <SubscriptionCancelReason />

          <div className="plc-space-x-0 plc-space-y-3 md:plc-space-x-3 md:plc-space-y-0 plc-w-full plc-flex plc-flex-col md:plc-flex-row plc-items-center plc-justify-center">
            <SubscriptionCancelButton
              className="plc-w-3/4 md:plc-w-2/5"
              subscription={subscriptionToCancel}
            />

            <Button
              variant="outline"
              className="plc-w-3/4 md:plc-w-2/5"
              onClick={() => {
                switchView("dashboard");
              }}
            >
              {t("labels.subCancellation.goBack")}
            </Button>
          </div>
        </div>
      </SubscriptionCancelContainer>
    </div>
  );
};
