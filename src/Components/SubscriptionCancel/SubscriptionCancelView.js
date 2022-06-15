import React from "react";
import { useTranslation } from "react-i18next";
import { SubscriptionCancelContainer } from "./SubscriptionCancelContainer";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";
import { ReactComponent as SubscriptionIcon } from "../../assets/subscription.svg";
import { usePelcro } from "../../hooks/usePelcro";

export const SubscriptionCancelView = (props) => {
  const {subscriptionToCancel} = usePelcro();

  const { t } = useTranslation("subscriptionCancel");

  return (
    <div id="pelcro-subscription-cancel-view">
      <div className="plc-mb-6 plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4 className="plc-text-2xl plc-font-semibold">
          {t("labels.title")}
        </h4>
      </div>
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <SubscriptionCancelContainer {...props}>
          <AlertWithContext />
          <div className="plc-flex plc-flex-col plc-items-center plc-justify-center plc-mt-4">
            <SubscriptionIcon className="plc-w-32 plc-h-32" />
            <p className="plc-mb-1 plc-text-gray-900 plc-text-center plc-whitespace-pre-line">
              {t("messages.subscriptionEnd")} {subscriptionToCancel?.current_period_end}
            </p>
          </div>
        </SubscriptionCancelContainer>
      </form>
    </div>
  );
};