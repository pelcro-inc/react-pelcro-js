import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { usePelcro } from "../../hooks/usePelcro";
import { store } from "./SubscriptionCancelContainer";
import { notify } from "../../SubComponents/Notification";
import { default as ReactGA1 } from "react-ga";
import { default as ReactGA4 } from "react-ga4";

const ReactGA = window?.Pelcro?.uiSettings?.enableReactGA4 ? ReactGA4 : ReactGA1;

export const SubscriptionCancelLaterButton = ({
  subscription,
  onClick,
  className,
}) => {
  const {switchView} = usePelcro();

  const {
    state: {cancelationReason},
    dispatch
  } = useContext(store);

  const { t } = useTranslation("subscriptionCancel");

  const cancelSubscription = (payload, onSuccess, onFailure) => {
    
    window.Pelcro.subscription.cancel(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        subscription_id: payload.subscription_id,
        mode: payload.mode,
      ...(payload.reason && { reason: payload.reason }),
      },
      (err, res) => {
        if (err) {
          return onFailure?.(err);
        }

        ReactGA?.event?.({
          category: "ACTIONS",
          action: "Canceled",
          nonInteraction: true
        });
        onSuccess?.(res);
      }
    );
  };

  const handleCancelNowClick = () => {
    const payload = {
      subscription_id: subscription.id,
      mode: "period_end",
      ...(cancelationReason && { reason: cancelationReason }),
    }

    onClick?.();
    
    //Close the modal
    switchView(null);
    
    //Show confirmation alert after closing the modal
    notify.confirm(
      (onSuccess, onFailure) => {
        cancelSubscription(payload, onSuccess, onFailure);
      },
      {
        confirmMessage: t(
          "messages.subCancellation.isSureToCancel"
        ),
        loadingMessage: t("messages.subCancellation.loading"),
        successMessage: t("messages.subCancellation.success"),
        errorMessage: t("messages.subCancellation.error")
      },
      {
        closeButtonLabel: t("labels.subCancellation.goBack")
      }
    );
    
  }

  return (
    <Button
      onClick={handleCancelNowClick}
      className={`${className}`}
    >
      {t("messages.cancelLater")}
    </Button>
  );
};
