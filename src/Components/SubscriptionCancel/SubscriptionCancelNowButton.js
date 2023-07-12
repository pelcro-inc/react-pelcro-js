import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { usePelcro } from "../../hooks/usePelcro";
import { store } from "./SubscriptionCancelContainer";
import { notify } from "../../SubComponents/Notification";
import ReactGA from "react-ga";
import ReactGA4 from "react-ga4";

const enableReactGA4 = window?.Pelcro?.uiSettings?.enableReactGA4;

export const SubscriptionCancelNowButton = ({
  subscription,
  onClick,
  className
}) => {
  const { switchView } = usePelcro();

  const {
    state: { cancelationReason },
    dispatch
  } = useContext(store);

  const { t } = useTranslation("subscriptionCancel");

  const cancelSubscription = (payload, onSuccess, onFailure) => {
    window.Pelcro.subscription.cancel(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        subscription_id: payload.subscription_id,
        mode: payload.mode,
        ...(payload.reason && { reason: payload.reason })
      },
      (err, res) => {
        if (err) {
          return onFailure?.(err);
        }

        if (enableReactGA4) {
          ReactGA4.gtag("event", "Canceled", {
            event_category: "ACTIONS",
            event_action: "Canceled",
            non_interaction: true
          });
        } else {
          ReactGA?.event?.({
            category: "ACTIONS",
            action: "Canceled",
            nonInteraction: true
          });
        }
        onSuccess?.(res);
      }
    );
  };

  const handleCancelNowClick = () => {
    const payload = {
      subscription_id: subscription.id,
      mode: "now",
      ...(cancelationReason && { reason: cancelationReason })
    };

    onClick?.();

    // Close the modal
    switchView(null);

    // Show confirmation alert after closing the modal
    notify.confirm(
      (onSuccess, onFailure) => {
        cancelSubscription(payload, onSuccess, onFailure);
      },
      {
        confirmMessage: t(
          "messages.subCancellation.isSureToCancelNow"
        ),
        loadingMessage: t("messages.subCancellation.loading"),
        successMessage: t("messages.subCancellation.success"),
        errorMessage: t("messages.subCancellation.error")
      },
      {
        closeButtonLabel: t("labels.subCancellation.goBack")
      }
    );
  };

  return (
    <Button onClick={handleCancelNowClick} className={`${className}`}>
      {t("messages.cancelNow")}
    </Button>
  );
};
