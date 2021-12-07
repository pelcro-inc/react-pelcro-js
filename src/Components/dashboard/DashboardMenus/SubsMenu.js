import React from "react";
import { notify } from "../../../SubComponents/Notification";
import { Button } from "../../../SubComponents/Button";
import { Accordion } from "../Accordion";
import { useTranslation } from "react-i18next";
import { ReactComponent as XCircleIcon } from "../../../assets/x-icon-solid.svg";
import { ReactComponent as RefreshIcon } from "../../../assets/refresh.svg";
import { ReactComponent as CalendarIcon } from "../../../assets/calendar.svg";
import { ReactComponent as GiftIcon } from "../../../assets/gift.svg";
import { ReactComponent as PlusIcon } from "../../../assets/plus.svg";
import { ReactComponent as ChevronRightIcon } from "../../../assets/chevron-right.svg";
import {
  getFormattedPriceByLocal,
  getPageOrDefaultLanguage
} from "../../../utils/utils";

export const SubscriptionsMenu = (props) => {
  const { t } = useTranslation("dashboard");

  return (
    <table className="plc-w-full plc-table-fixed">
      <thead className="plc-text-xs plc-font-semibold plc-tracking-wider plc-text-gray-400 plc-uppercase ">
        <tr>
          <th className="plc-w-3/12 ">{t("labels.plan")}</th>
          <th className="plc-w-4/12 ">{t("labels.status.title")}</th>
          <th className="plc-w-3/12 ">{t("labels.actions")}</th>
          <th className="plc-w-2/12 "></th>
        </tr>
      </thead>
      <tbody>
        {/* Spacer */}
        <tr className="plc-h-4"></tr>
      </tbody>
      <Accordion>
        <SubscriptionsItems {...props} />
      </Accordion>
      <tbody>
        <tr>
          <td colSpan="4" className="plc-p-1">
            <Button
              variant="ghost"
              icon={<PlusIcon className="plc-w-4 plc-h-4 plc-mr-1" />}
              className="plc-w-full plc-h-8 plc-font-semibold plc-tracking-wider plc-text-gray-900 plc-uppercase plc-rounded-none hover:plc-bg-gray-100"
              onClick={props.displayProductSelect}
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
              onClick={props.displayRedeem}
            >
              {t("labels.redeemGift")}
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export const SubscriptionsItems = ({
  onClose,
  cancelSubscription,
  reactivateSubscription,
  setProductAndPlan,
  setSubscriptionIdToRenew,
  setView,
  getSubscriptionStatus,
  disableSubmit,
  activeMenu,
  toggleActiveMenu
}) => {
  const { t } = useTranslation("dashboard");
  const subs = window.Pelcro.subscription.list();

  if (!subs || subs.length === 0) return null;

  return window.Pelcro.subscription
    .list()
    .sort((a, b) => a.expires_at - b.expires_at)
    .sort((a, b) => a.renews_at - b.renews_at)
    .map((sub) => {
      const isActive = activeMenu === sub.id;
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

      const getFuturePhases = () => {
        if (!sub.schedule) return [];

        const currentPhaseStartDate =
          sub.schedule.current_phase.start_date;

        return sub.schedule.phases.filter((phase) => {
          return phase.start_date > currentPhaseStartDate;
        });
      };

      const hasFuturePhases = getFuturePhases().length > 0;

      return (
        <React.Fragment key={sub.id}>
          <tbody>
            <tr
              onClick={() => toggleActiveMenu(sub.id)}
              key={sub.id}
              className={`plc-w-full plc-align-middle plc-cursor-pointer accordion-header ${
                isActive ? "plc-bg-gray-100" : "hover:plc-bg-gray-50"
              }`}
            >
              <td className="plc-truncate plc-py-2">
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
                <div className="plc-text-xs plc-text-gray-500">
                  {sub.status && (
                    <span className="plc-inline-block plc-mt-1 plc-underline">
                      {getSubscriptionStatus(sub).content}
                    </span>
                  )}
                  <br />
                  {sub.shipments_remaining ? (
                    <span className="plc-inline-block plc-mt-1">
                      {sub.shipments_remaining}{" "}
                      {t("labels.shipments")}
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

              <td>
                {hasFuturePhases && (
                  <div
                    className={`plc-flex plc-items-center plc-justify-center plc-transition-transform plc-ease-out plc-transform plc-rounded-full plc-w-7 plc-h-7 ${
                      isActive
                        ? "plc-flex plc-place-items-center plc-w-7 plc-h-7 plc-p-1 plc-bg-primary-400 plc-rounded-full"
                        : "accordion-chevron"
                    }`}
                  >
                    <span
                      className={`plc-transition plc-ease-out  ${
                        isActive &&
                        "plc-text-white plc-transform plc-rotate-90"
                      }`}
                    >
                      <ChevronRightIcon />
                    </span>
                  </div>
                )}
              </td>
            </tr>
          </tbody>

          <tbody>
            {isActive && (
              <>
                {getFuturePhases().map((phase) => {
                  const plan = phase.plans?.[0].plan;

                  const startDate = new Date(
                    Number(`${phase.start_date}000`)
                  );
                  const formattedStartDate = new Intl.DateTimeFormat(
                    "en-CA"
                  ).format(startDate);

                  const startDateString = `${t(
                    "labels.startsOn"
                  )} ${formattedStartDate}`;

                  return (
                    <tr
                      key={`${phase.start_date}-${phase.end_date}`}
                      className="pelcro-sub-phase-row plc-w-full plc-align-middle"
                    >
                      <td className="plc-truncate plc-py-2">
                        {plan.nickname && (
                          <span className="plc-font-semibold plc-text-gray-500">
                            {plan.nickname}
                          </span>
                        )}
                      </td>

                      <td>
                        <span
                          className={
                            "plc-inline-flex plc-p-1 plc-text-xs plc-font-semibold plc-text-blue-700 plc-bg-blue-100 plc-uppercase plc-rounded-lg"
                          }
                        >
                          <CalendarIcon />
                          {t("labels.status.scheduled")}
                        </span>
                        <br />
                        <div className="plc-text-xs plc-text-gray-500">
                          <span className="plc-inline-block plc-mt-1 plc-underline">
                            {startDateString}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan="4">
                    <hr className="plc-mt-4" />
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </React.Fragment>
      );
    });
};
