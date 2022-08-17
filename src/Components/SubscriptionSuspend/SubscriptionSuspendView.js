import React from "react";
import { useTranslation } from "react-i18next";
import { SubscriptionSuspendContainer } from "./SubscriptionSuspendContainer";
import { SubscriptionSuspendDate } from "./SubscriptionSuspendDate";
import { ReactComponent as SubscriptionIcon } from "../../assets/subscription.svg";
import { usePelcro } from "../../hooks/usePelcro";
import { SubscriptionSuspendButton } from "./SubscriptionSuspendButton";

export const SubscriptionSuspendView = (props) => {
  const { subscriptionToSuspend } = usePelcro();

  const { t } = useTranslation("subscriptionSuspend");

  return (
    <div id="pelcro-subscription-suspend-view">
      <div className="plc-mb-6 plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4 className="plc-text-2xl plc-font-semibold">
          {t("labels.title")}
          <span className="plc-text-gray-400 plc-text-base plc-block">
            ({subscriptionToSuspend.plan.nickname})
          </span>
        </h4>
      </div>
      <SubscriptionSuspendContainer {...props}>
        <div className="plc-flex plc-flex-col plc-items-center plc-justify-center plc-mt-4">
          <SubscriptionIcon className="plc-w-32 plc-h-32" />
          <p className="plc-mb-3 plc-text-gray-900 plc-text-center plc-whitespace-pre-line">
            {t("messages.suspensionEnd")}.
          </p>

          <SubscriptionSuspendDate subscription={subscriptionToSuspend} />

          <SubscriptionSuspendButton
            className="plc-mb-2"
            subscription={subscriptionToSuspend}
          />

          
        </div>
      </SubscriptionSuspendContainer>
    </div>
  );
};
