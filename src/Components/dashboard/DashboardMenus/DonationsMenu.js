import React from "react";
import { useTranslation } from "react-i18next";
import {
  getFormattedPriceByLocal,
  getPageOrDefaultLanguage,
  userMustVerifyEmail
} from "../../../utils/utils";
import { ReactComponent as XCircleIcon } from "../../../assets/x-icon-solid.svg";
import { ReactComponent as RefreshIcon } from "../../../assets/refresh.svg";
import { Button } from "../../../SubComponents/Button";
import { usePelcro } from "../../../hooks/usePelcro";
import { notify } from "../../../SubComponents/Notification";

export const DonationsMenu = ({
  onClose,
  reactivateSubscription,
  disableSubmit,
  cancelSubscription
}) => {
  const { t } = useTranslation("dashboard");
  const { switchView, setSubscriptionToCancel } = usePelcro();

  const donations = getDonationSubs()
    .sort((a, b) => a.expires_at - b.expires_at)
    .sort((a, b) => a.renews_at - b.renews_at)
    .map((sub) => {
      // Cancel button click handlers
      const onCancelClick = () => {
        const isImmediateCancelationEnabled =
          window.Pelcro.site.read().cancel_settings.status;

        if (isImmediateCancelationEnabled) {
          setSubscriptionToCancel(sub.id);
          return switchView("subscription-cancel");
        }

        if (userMustVerifyEmail()) {
          return switchView("email-verify");
        }

        onClose?.();
        notify.confirm(
          (onSuccess, onFailure) => {
            cancelSubscription(sub.id, onSuccess, onFailure);
          },
          {
            confirmMessage: t(
              "messages.donationCancellation.isSureToCancel"
            ),
            loadingMessage: t(
              "messages.donationCancellation.loading"
            ),
            successMessage: t(
              "messages.donationCancellation.success"
            ),
            errorMessage: t("messages.donationCancellation.error")
          },
          {
            closeButtonLabel: t("labels.donationCancellation.goBack")
          }
        );
      };

      // Reactivate button click handlers
      const onReactivateClick = () => {
        if (userMustVerifyEmail()) {
          return switchView("email-verify");
        }

        reactivateSubscription(sub.id, true);
      };

      return (
        <tr
          key={sub.id}
          className="plc-w-full plc-align-top pelcro-donation-row"
        >
          <td className="plc-truncate">
            {sub.plan.nickname && (
              <>
                <span className="plc-font-semibold plc-text-gray-500 pelcro-donation-plan">
                  {sub.plan.nickname}
                </span>
                <br />
                <span className="plc-text-xs plc-text-gray-400 pelcro-donation-price">
                  {getFormattedPriceByLocal(
                    sub.plan.amount * sub.quantity,
                    sub.plan.currency,
                    getPageOrDefaultLanguage()
                  )}
                </span>
              </>
            )}
          </td>
          <td>
            <div className="plc-mb-4 plc-text-gray-500 pelcro-donation-date">
              {sub.status && (
                <span>{formatStartDate(sub.start)}</span>
              )}
            </div>
          </td>
          <td>
            {sub.cancel_at_period_end === 1 &&
              sub.plan.auto_renew &&
              !sub.is_gift_recipient && (
                <Button
                  variant="ghost"
                  className="plc-text-green-400 focus:plc-ring-green-300 pelcro-dashboard-sub-reactivate-button"
                  icon={<RefreshIcon />}
                  onClick={onReactivateClick}
                  disabled={disableSubmit}
                  data-key={sub.id}
                >
                  {t("labels.reactivate")}
                </Button>
              )}

            {!sub.plan.auto_renew ||
            (sub.plan.auto_renew &&
              sub.cancel_at_period_end === 0) ? (
              <Button
                variant="ghost"
                className="plc-text-red-500 focus:plc-ring-red-500 pelcro-dashboard-sub-cancel-button"
                icon={<XCircleIcon />}
                onClick={onCancelClick}
                disabled={disableSubmit}
                data-key={sub.id}
              >
                {t("labels.unsubscribe")}
              </Button>
            ) : (
              ""
            )}
          </td>
        </tr>
      );
    });

  return (
    <table className="plc-w-full plc-table-fixed pelcro-donations-table">
      <thead className="plc-text-xs plc-font-semibold plc-tracking-wider plc-text-gray-400 plc-uppercase ">
        <tr>
          <th className="plc-w-6/12 ">{t("labels.plan")}</th>
          <th className="plc-w-6/12 ">{t("labels.startDate")}</th>
          <th className="plc-w-3/12 ">{t("labels.actions")}</th>
        </tr>
      </thead>
      <tbody>
        {/* Spacer */}
        <tr className="plc-h-4"></tr>
        {donations}
      </tbody>
    </table>
  );
};

function getDonationSubs() {
  const donations =
    window.Pelcro.subscription
      ?.list()
      ?.filter((sub) => sub.plan?.type === "donation") ?? [];

  const canceledDonations =
    window.Pelcro.user
      .read()
      .expired_subscriptions?.filter(
        (sub) => sub.plan?.type === "donation"
      ) ?? [];

  return [...donations, ...canceledDonations];
}

function formatStartDate(date) {
  const startDate = new Date(date);
  return new Intl.DateTimeFormat("en-CA").format(startDate);
}
