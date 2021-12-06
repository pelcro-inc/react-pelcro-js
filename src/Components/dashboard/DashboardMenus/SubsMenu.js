import React from "react";
import { notify } from "../../../SubComponents/Notification";
import { Button } from "../../../SubComponents/Button";
import { Accordion } from "../Accordion";
import { useTranslation } from "react-i18next";
import { ReactComponent as XCircleIcon } from "../../../assets/x-icon-solid.svg";
import { ReactComponent as RefreshIcon } from "../../../assets/refresh.svg";
import { ReactComponent as GiftIcon } from "../../../assets/gift.svg";
import { ReactComponent as PlusIcon } from "../../../assets/plus.svg";
import {
  getFormattedPriceByLocal,
  getPageOrDefaultLanguage
} from "../../../utils/utils";

export const SubsMenu = ({
  onClose,
  cancelSubscription,
  reactivateSubscription,
  setProductAndPlan,
  setSubscriptionIdToRenew,
  setView,
  getSubscriptionStatus,
  disableSubmit,
  displayProductSelect,
  displayRedeem
}) => {
  const { t } = useTranslation("dashboard");

  const subscriptions = window.Pelcro.subscription
    .list()
    ?.sort((a, b) => a.expires_at - b.expires_at)
    .sort((a, b) => a.renews_at - b.renews_at)
    .map((sub) => {
      // Cancel button click handlers
      const onCancelClick = () => {
        onClose?.();
        notify.confirm(
          (onSuccess, onFailure) => {
            cancelSubscription(sub.id, onSuccess, onFailure);
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
      };

      // Reactivate button click handlers
      const onReactivateClick = () => {
        reactivateSubscription(sub.id);
      };

      // Renew click
      const onRenewClick = () => {
        const product_id = sub.plan.product.id;
        const plan_id = sub.plan.id;

        const product = window.Pelcro.product.getById(product_id);
        const plan = window.Pelcro.plan.getById(plan_id);

        setProductAndPlan(product, plan);
        setSubscriptionIdToRenew(sub.id);
        setView("plan-select");
      };

      return (
        <tr
          key={"dashboard-subscription-" + sub.id}
          className="plc-w-full plc-align-top"
        >
          <td className="plc-truncate">
            {sub.plan.nickname && (
              <>
                <span className="plc-font-semibold plc-text-gray-500">
                  {sub.plan.nickname}
                </span>
                <br />
                <span className="plc-text-xs plc-text-gray-400">
                  {getFormattedPriceByLocal(
                    sub.plan.amount,
                    sub.plan.currency,
                    getPageOrDefaultLanguage()
                  )}
                </span>
              </>
            )}
          </td>
          <td>
            {/* Pill */}
            <span
              className={`plc-inline-flex plc-p-1 plc-text-xs plc-font-semibold ${
                getSubscriptionStatus(sub).bgColor
              } plc-uppercase ${
                getSubscriptionStatus(sub).textColor
              } plc-rounded-lg`}
            >
              {getSubscriptionStatus(sub).icon}
              {getSubscriptionStatus(sub).title}
            </span>
            <br />
            <div className="plc-mb-4 plc-text-xs plc-text-gray-500">
              {sub.status && (
                <span className="plc-inline-block plc-mt-1 plc-underline">
                  {getSubscriptionStatus(sub).content}
                </span>
              )}
              <br />
              {sub.shipments_remaining ? (
                <span className="plc-inline-block plc-mt-1">
                  {sub.shipments_remaining} {t("labels.shipments")}
                </span>
              ) : null}
            </div>
          </td>

          <td>
            {sub.cancel_at_period_end === 0 && (
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
            )}
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
            {sub.cancel_at_period_end === 1 && (
              <Button
                variant="ghost"
                className="plc-text-blue-400 pelcro-dashboard-sub-renew-button"
                icon={<RefreshIcon />}
                onClick={onRenewClick}
                disabled={disableSubmit}
                data-key={sub.id}
              >
                {t("labels.renew")}
              </Button>
            )}
          </td>
        </tr>
      );
    });

  return (
    <table className="plc-w-full plc-table-fixed">
      <thead className="plc-text-xs plc-font-semibold plc-tracking-wider plc-text-gray-400 plc-uppercase ">
        <tr>
          <th className="plc-w-5/12 ">{t("labels.plan")}</th>
          <th className="plc-w-4/12 ">{t("labels.status.title")}</th>
          <th className="plc-w-3/12 ">{t("labels.actions")}</th>
        </tr>
      </thead>
      <tbody>
        {/* Spacer */}
        <tr className="plc-h-4"></tr>
        {subscriptions}
        <tr>
          <td colSpan="4" className="plc-p-1">
            <Button
              variant="ghost"
              icon={<PlusIcon className="plc-w-4 plc-h-4 plc-mr-1" />}
              className="plc-w-full plc-h-8 plc-font-semibold plc-tracking-wider plc-text-gray-900 plc-uppercase plc-rounded-none hover:plc-bg-gray-100"
              onClick={displayProductSelect}
            >
              {t("labels.addSubscription")}
            </Button>
          </td>
        </tr>
        <tr>
          <td colSpan="4" className="plc-p-1">
            <Button
              variant="ghost"
              icon={<GiftIcon className="plc-w-4 plc-h-4 plc-mr-1" />}
              className="plc-w-full plc-h-8 plc-font-semibold plc-tracking-wider plc-text-gray-900 plc-uppercase plc-rounded-none hover:plc-bg-gray-100"
              onClick={displayRedeem}
            >
              {t("labels.redeemGift")}
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
