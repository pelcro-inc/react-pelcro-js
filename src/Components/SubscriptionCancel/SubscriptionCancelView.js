import React from "react";
import { useTranslation } from "react-i18next";
import { SubscriptionCancelContainer } from "./SubscriptionCancelContainer";
import { SubscriptionCancelReason } from "./SubscriptionCancelReason";
import { ReactComponent as SubscriptionIcon } from "../../assets/subscription.svg";
import { usePelcro } from "../../hooks/usePelcro";
import { SubscriptionCancelNowButton } from "./SubscriptionCancelNowButton";
import { SubscriptionCancelLaterButton } from "./SubscriptionCancelLaterButton";

export const SubscriptionCancelView = (props) => {
  const { subscriptionToCancel } = usePelcro();

  console.log(subscriptionToCancel);

  const { t } = useTranslation("subscriptionCancel");

  return (
    <div id="pelcro-subscription-cancel-view">
      <div className="plc-mb-6 plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4 className="plc-text-2xl plc-font-semibold">
          {t("labels.title")}
          <span className="plc-text-gray-400 plc-text-base plc-block">
            ({subscriptionToCancel.plan.nickname})
          </span>
        </h4>
      </div>
      <SubscriptionCancelContainer {...props}>
        <div className="plc-flex plc-flex-col plc-items-center plc-justify-center plc-mt-4">
          <SubscriptionIcon className="plc-w-32 plc-h-32" />
          <p className="plc-mb-3 plc-text-gray-900 plc-text-center plc-whitespace-pre-line">
            {t("messages.subscriptionEnd")}{" "}
            {new Date(
              subscriptionToCancel?.current_period_end
            ).toLocaleDateString("en-CA", {
              year: "numeric",
              month: "short",
              day: "numeric"
            })}
            .
          </p>

          <SubscriptionCancelReason />

          <SubscriptionCancelNowButton
            className="plc-mb-2"
            subscription={subscriptionToCancel}
          />

          {subscriptionToCancel.cancel_at_period_end === 0 && (
            <SubscriptionCancelLaterButton
              subscription={subscriptionToCancel}
            />
          )}
        </div>
      </SubscriptionCancelContainer>
    </div>
  );
};
