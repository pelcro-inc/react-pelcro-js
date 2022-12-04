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
import { ReactComponent as CheckMarkIcon } from "../../../assets/check-mark.svg";
import {
  getFormattedPriceByLocal,
  getPageOrDefaultLanguage,
  userMustVerifyEmail
} from "../../../utils/utils";
import { usePelcro } from "../../../hooks/usePelcro";
import { Card } from "../Card";
import { AddNew } from "../AddNew";

export const SubscriptionsMenu = (props) => {
  const { t } = useTranslation("dashboard");

  return (
    <Card
      id="pelcro-dashboard-subscriptions-menu"
      className="plc-max-w-80% plc-m-auto"
      title={t("labels.subscriptions")}
    >
      <table className="plc-w-full plc-table-fixed pelcro-subscriptions-table plc-text-left">
        <thead className="plc-text-xs plc-font-semibold plc-tracking-wider plc-text-gray-400 plc-uppercase ">
          <tr>
            <th className="plc-w-1/5">{t("labels.product")}</th>
            <th className="plc-w-1/5">{t("labels.plan")}</th>
            <th className="plc-w-1/5">{t("labels.price")}</th>
            <th className="plc-w-1/5">{t("labels.status.title")}</th>
            <th className="plc-w-1/5">{t("labels.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {/* Spacer */}
          <tr className="plc-h-4"></tr>
        </tbody>
        <Accordion>
          <SubscriptionsItems {...props} />
        </Accordion>
      </table>
      <AddNew
        title={t("labels.addSubscription")}
        onClick={props.displayProductSelect}
      />
      <table className="plc-w-full plc-table-fixed pelcro-subscriptions-table plc-text-left">
        <tbody>
          <tr>
            <td colSpan="5" className="plc-p-1">
              <Button
                variant="ghost"
                icon={
                  <GiftIcon className="plc-w-4 plc-h-4 plc-mr-1" />
                }
                className="plc-w-full plc-h-8 plc-font-semibold plc-tracking-wider plc-text-gray-900 plc-uppercase plc-rounded-none hover:plc-bg-gray-100"
                onClick={props.displayRedeem}
              >
                {t("labels.redeemGift")}
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
};

export const SubscriptionsItems = ({
  onClose,
  cancelSubscription,
  unSuspendSubscription,
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
  const {
    switchView,
    setSubscriptionToCancel,
    setSubscriptionToSuspend,
    isAuthenticated
  } = usePelcro();

  const subs = getNonDonationSubs();

  if (subs.length === 0) return null;

  return subs
    .sort((a, b) => a.expires_at - b.expires_at)
    .sort((a, b) => a.renews_at - b.renews_at)
    .map((sub) => {
      const isActive = activeMenu === sub.id;
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
        if (userMustVerifyEmail()) {
          return switchView("email-verify");
        }

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

      // Suspend click
      const onSuspendClick = () => {
        if (userMustVerifyEmail()) {
          return switchView("email-verify");
        }
        setSubscriptionToSuspend(sub.id);
        return setView("subscription-suspend");
      };

      // UnSuspend click
      const onUnSuspendClick = () => {
        if (userMustVerifyEmail()) {
          return switchView("email-verify");
        }

        onClose?.();
        notify.confirm(
          (onSuccess, onFailure) => {
            unSuspendSubscription(sub.id, onSuccess, onFailure);
          },
          {
            confirmMessage: t(
              "messages.subUnSuspend.isSureToUnSuspend"
            ),
            loadingMessage: t("messages.subUnSuspend.loading"),
            successMessage: t("messages.subUnSuspend.success"),
            errorMessage: t("messages.subUnSuspend.error")
          },
          {
            closeButtonLabel: t("labels.subCancellation.goBack")
          }
        );
      };

      const getPhases = () => {
        if (!sub.schedule) return [];

        const currentPhaseStartDate =
          sub.schedule.current_phase.start_date;

        const currentPhase = sub.schedule.phases.find((phase) => {
          return phase.start_date === currentPhaseStartDate;
        });

        const futurePhases = sub.schedule.phases.filter((phase) => {
          return phase.start_date > currentPhaseStartDate;
        });

        return [currentPhase, ...futurePhases];
      };

      const hasPhases = getPhases().length > 0;

      return (
        <React.Fragment key={sub.id}>
          <tbody>
            <tr
              onClick={() => {
                if (hasPhases) toggleActiveMenu(sub.id);
              }}
              key={sub.id}
              className={`plc-w-full plc-align-middle plc-cursor-pointer accordion-header ${
                isActive ? "plc-bg-gray-100" : "hover:plc-bg-gray-50"
              }`}
            >
              <td className="plc-truncate">
                {sub.plan.product.name && (
                  <span className="plc-font-semibold plc-text-gray-500">
                    {sub.plan.product.name}
                  </span>
                )}
              </td>
              <td className="plc-truncate">
                <span className="plc-font-semibold plc-text-gray-500">
                  {sub.plan.nickname}
                </span>
              </td>
              <td className="plc-truncate">
                <span className="plc-font-semibold plc-text-gray-500">
                  {getFormattedPriceByLocal(
                    sub.plan.amount,
                    sub.plan.currency,
                    getPageOrDefaultLanguage()
                  )}
                </span>
              </td>
              <td className="plc-py-2 truncate">
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
                {sub.cancel_at_period_end === 1 &&
                  sub.status !== "incomplete" && (
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

                {sub.shipments_suspended_until &&
                  isDateAfterToday(sub.shipments_suspended_until) &&
                  sub.shipments_remaining > 0 && (
                    <Button
                      variant="ghost"
                      className="plc-text-blue-400 pelcro-dashboard-sub-suspend-button"
                      icon={<XCircleIcon />}
                      onClick={onUnSuspendClick}
                      disabled={disableSubmit}
                      data-key={sub.id}
                    >
                      {t("labels.unsuspend")}
                    </Button>
                  )}

                {((!sub.shipments_suspended_until &&
                  sub.shipments_remaining > 0) ||
                  (sub.shipments_suspended_until &&
                    !isDateAfterToday(
                      sub.shipments_suspended_until
                    ))) && (
                  <Button
                    variant="ghost"
                    className="plc-text-red-500 focus:plc-ring-red-500 pelcro-dashboard-sub-suspend-button"
                    icon={<CalendarIcon />}
                    onClick={onSuspendClick}
                    disabled={disableSubmit}
                    data-key={sub.id}
                  >
                    {t("labels.suspend")}
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
              <td>
                {hasPhases && (
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
                {getPhases().map((phase, i) => {
                  const plan = phase.plans?.[0].plan;
                  const isCurrentPhase = i === 0;

                  const startDate = new Date(
                    Number(`${phase.start_date}000`)
                  );

                  const endDate = new Date(
                    Number(`${phase.end_date}000`)
                  );

                  const formattedStartDate = new Intl.DateTimeFormat(
                    "en-CA"
                  ).format(startDate);

                  const formattedEndDate = new Intl.DateTimeFormat(
                    "en-CA"
                  ).format(endDate);

                  const startDateString = `${t(
                    "labels.startsOn"
                  )} ${formattedStartDate}`;

                  const endDateString = `${t(
                    "labels.expiresOn"
                  )} ${formattedEndDate}`;

                  return (
                    <tr
                      key={`${phase.start_date}-${phase.end_date}`}
                      className="pelcro-sub-phase-row plc-w-full plc-align-middle"
                    >
                      <td className="plc-truncate">
                        {plan.nickname && (
                          <span className="plc-font-semibold plc-text-gray-500">
                            {plan.nickname}
                          </span>
                        )}
                      </td>

                      <td className="plc-py-2">
                        <span
                          className={`plc-inline-flex plc-p-1 plc-text-xs plc-font-semibold plc-uppercase plc-rounded-lg ${
                            isCurrentPhase
                              ? "plc-text-green-700 plc-bg-green-100"
                              : "plc-text-blue-700 plc-bg-blue-100"
                          }
                             `}
                        >
                          {isCurrentPhase ? (
                            <CheckMarkIcon />
                          ) : (
                            <CalendarIcon />
                          )}
                          {isCurrentPhase
                            ? t("labels.status.active")
                            : t("labels.status.scheduled")}
                        </span>
                        <br />
                        <div className="plc-text-xs plc-text-gray-500">
                          <span className="plc-inline-block plc-mt-1 plc-underline">
                            {isCurrentPhase
                              ? endDateString
                              : startDateString}
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

function getNonDonationSubs() {
  return (
    window.Pelcro.subscription
      ?.list()
      ?.filter((sub) => !sub.plan.is_donation) ?? []
  );
}

function isDateAfterToday(date) {
  const today = new Date().setHours(0,0,0,0);
  const newDate = new Date(date).setHours(0,0,0,0);
  return newDate === today ? true : newDate > today;
}
