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

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const expiryDate = formatDate(subscriptionToCancel?.current_period_end);

  return (
    <div id="pelcro-subscription-cancel-view">
      <SubscriptionCancelContainer {...props}>
        <div className="plc-flex plc-flex-col plc-items-start plc-justify-cente r">
          {/* Centered subscription icon */}
          <p className="pl-text-lg plc-my-6
           plc-text-red-500
          ">{t("messages.subscriptionEnd")} <span className="plc-font-bold">{expiryDate}</span>.</p>


          {/* Cancel options section */}
          <div className="plc-w-full plc-mb-6">
            <h3 className="plc-text-lg plc-font-medium plc-text-gray-900 plc-mb-3">
              {t("messages.cancelWhen")}
            </h3>

            <SubscriptionCancelOptions
              subscription={subscriptionToCancel}
            />
          </div>

          {/* Cancellation reason section */}
          <div className="plc-w-full plc-mb-6">
            <h3 className="plc-text-lg plc-font-medium plc-text-gray-900 plc-mb-3">
              {t("labels.cancelReason")}
            </h3>
            <SubscriptionCancelReason />
          </div>

          {/* Action buttons */}
          <div className="plc-grid plc-grid-cols-1 md:plc-grid-cols-2 plc-gap-4 plc-w-full plc-mb-4">
            <SubscriptionCancelButton
              className="plc-relative plc-w-full plc-rounded-lg plc-bg-gray-900 plc-px-4 plc-py-3 plc-text-sm plc-font-medium plc-text-white plc-transition-all plc-hover:bg-gray-800 plc-disabled:bg-gray-300 plc-disabled:cursor-not-allowed"
              subscription={subscriptionToCancel}
            >
              {t("labels.cancel")}
            </SubscriptionCancelButton>

            <Button
              variant="outline"
              className="plc-border plc-border-gray-300 plc-text-gray-700 plc-font-medium  plc-rounded-lg hover:plc-bg-gray-50 plc-transition-colors"
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
