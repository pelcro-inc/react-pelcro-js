import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { usePelcro } from "../../hooks/usePelcro";
import { store } from "./SubscriptionSuspendContainer";
import { notify } from "../../SubComponents/Notification";
import ReactGA from "react-ga";
import ReactGA4 from "react-ga4";

export const SubscriptionSuspendButton = ({
  subscription,
  onClick,
  className
}) => {
  const { switchView } = usePelcro();

  const {
    state: { suspendDate, buttonDisabled },
    dispatch
  } = useContext(store);

  const { t } = useTranslation("subscriptionSuspend");
  const enableReactGA4 = window?.Pelcro?.uiSettings?.enableReactGA4;

  const suspendSubscription = (payload, onSuccess, onFailure) => {
    window.Pelcro.subscription.update(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        subscription_id: payload.subscription_id,
        suspend: 1,
        shipments_suspended_until: suspendDate
      },
      (err, res) => {
        if (err) {
          return onFailure?.(err);
        }

        if (enableReactGA4) {
          ReactGA4.event("Suspended", {
            nonInteraction: true
          });
        } else {
          ReactGA?.event?.({
            category: "ACTIONS",
            action: "Suspended",
            nonInteraction: true
          });
        }
        onSuccess?.(res);
      }
    );
  };

  const handleClick = () => {
    const payload = {
      subscription_id: subscription.id
    };

    onClick?.();

    // Close the modal
    switchView(null);

    // Show confirmation alert after closing the modal
    notify.confirm(
      (onSuccess, onFailure) => {
        suspendSubscription(payload, onSuccess, onFailure);
      },
      {
        confirmMessage: t(
          "messages.subCancellation.isSureToSuspendNow"
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
    <Button
      onClick={handleClick}
      className={`${className}`}
      disabled={buttonDisabled}
    >
      {t("messages.suspendNow")}
    </Button>
  );
};
