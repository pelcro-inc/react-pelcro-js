import React, { useContext } from "react";
import { notify } from "../../../SubComponents/Notification";
import { Button } from "../../../SubComponents/Button";
import { Accordion } from "../Accordion";
import { useTranslation } from "react-i18next";
import { ReactComponent as XCircleIcon } from "../../../assets/x-icon-solid.svg";
import { ReactComponent as RefreshIcon } from "../../../assets/refresh.svg";
import { ReactComponent as CalendarIcon } from "../../../assets/calendar.svg";
import { ReactComponent as GiftIcon } from "../../../assets/gift.svg";
// import { ReactComponent as PlusIcon } from "../../../assets/plus.svg";
import { ReactComponent as ChevronRightIcon } from "../../../assets/chevron-right.svg";
import { ReactComponent as CheckMarkIcon } from "../../../assets/check-mark.svg";
import { ReactComponent as PackageIcon } from "../../../assets/package.svg";
import {
  getFormattedPriceByLocal,
  getPageOrDefaultLanguage,
  userMustVerifyEmail
} from "../../../utils/utils";
import { usePelcro } from "../../../hooks/usePelcro";
import { Card } from "../Card";
import { AddNew } from "../AddNew";
import { store } from "../DashboardContainer";
import {
  CANCEL_SUBSCRIPTION,
  REACTIVATE_SUBSCRIPTION,
  UNSUSPEND_SUBSCRIPTION
} from "../../../utils/action-types";
import { TableEmptyState } from "../../../SubComponents/TableEmptyState";



export const SubscriptionsMenu = (props) => {
  const { t } = useTranslation("dashboard");
  const { switchView } = usePelcro();
  const subs = getNonDonationSubs();

  const displayRedeem = () => {
    return switchView("gift-redeem");
  };

  if (subs.length === 0) {
    return (
      <Card
        id="pelcro-dashboard-subscriptions-menu"
        title={t("labels.subscriptions")}
        description={t("labels.subscriptionsDescription")}
        className="plc-subscriptions-menu-width"
      >
        <TableEmptyState
          message={t("labels.noSubscriptions")}
          colSpan={6}
          className="plc-bg-white plc-my-5"
          hideHeader={true}
        />
        <div className="plc-mt-6 plc-flex plc-justify-end plc-items-center plc-gap-2">
          <AddNew
            title={t("labels.addSubscription")}
            onClick={() => props?.displayProductSelect({ isGift: false })}
          />
          <Button
            variant="outline"
            icon={<GiftIcon className="plc-w-4 plc-h-4 plc-mr-1" />}
            className='plc-w-full plc-overflow-hidden sm:plc-w-auto'
            onClick={displayRedeem}
          >
            {t("labels.redeemGift")}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      id="pelcro-dashboard-subscriptions-menu"
      title={t("labels.subscriptions")}
      description={t("labels.subscriptionsDescription")}
      className="plc-subscriptions-menu-width"
    >
      <div className="plc-flow-root">
        <div className="plc--mx-4 plc--my-2 plc-overflow-x-auto plc-sm:-mx-6 plc-lg:-mx-8">
          <div className="plc-inline-block plc-min-w-full plc-py-2 plc-align-middle">
            <table className="plc-min-w-full plc-divide-y plc-divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="plc-py-3.5 plc-pr-3 plc-pl-4 plc-text-left plc-text-sm plc-font-semibold plc-text-gray-900 plc-sm:pl-6 plc-lg:pl-8
                     plc-uppercase
                    "
                  >
                    {t("labels.product")}
                  </th>
                  <th scope="col" className="plc-px-3 plc-py-3.5 plc-text-left plc-text-sm plc-font-semibold plc-text-gray-900 plc-uppercase">
                    {t("labels.plan")}
                  </th>
                  <th scope="col" className="plc-px-3 plc-py-3.5 plc-text-left plc-text-sm plc-font-semibold plc-text-gray-900 plc-uppercase">
                    {t("labels.price")}
                  </th>
                  <th scope="col" className="plc-px-3 plc-py-3.5 plc-text-left plc-text-sm plc-font-semibold plc-text-gray-900 plc-uppercase">
                    {t("labels.status.title")}
                  </th>
                  <th scope="col" className="plc-px-3 plc-py-3.5 plc-text-left plc-text-sm plc-font-semibold plc-text-gray-900 plc-uppercase">
                    {t("labels.shipments")}
                  </th>
                  {/* <th scope="col" className="plc-relative plc-py-3.5 plc-pr-4  plc-text-sm plc-font-semibold plc-pl-3 plc-sm:pr-6 plc-lg:pr-8 plc-text-gray-900
                   plc-text-right
                  ">
                    {t("labels.actions")}
                  </th> */}
                </tr>
              </thead>
              <Accordion>
                <SubscriptionsItems {...props} />
              </Accordion>
            </table>
          </div>
        </div>
      </div>
      <div className="plc-mt-6 plc-flex plc-justify-end plc-items-center plc-gap-2" >
        <AddNew title={t("labels.addSubscription")} onClick={() => props?.displayProductSelect({ isGift: false })}
        />
        <Button
          variant="outline"
          icon={
            <GiftIcon className="plc-w-4 plc-h-4 plc-mr-1" />
          }
          className='plc-w-full plc-overflow-hidden sm:plc-w-auto'
          onClick={displayRedeem}
        >
          {t("labels.redeemGift")}
        </Button>
      </div>
    </Card>
  );
};

export const SubscriptionsItems = ({
  onClose,
  setProductAndPlan,
  setSubscriptionIdToRenew,
  getSubscriptionStatus,
  activeMenu,
  toggleActiveMenu
}) => {
  const {
    state: { disableSubmit },
    dispatch
  } = useContext(store);
  const { t } = useTranslation("dashboard");
  const {
    switchView,
    setSubscriptionToCancel,
    setSubscriptionToSuspend,
    set
  } = usePelcro();

  const subs = getNonDonationSubs();

  if (subs.length === 0) {
    return (
      <TableEmptyState
        message={t("labels.noSubscriptions")}
        colSpan={6}
        className="plc-bg-white my-6"
      />
    );
  }

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
            dispatch({
              type: CANCEL_SUBSCRIPTION,
              payload: {
                subscription_id: sub.id,
                onSuccess,
                onFailure
              }
            });
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

        dispatch({
          type: REACTIVATE_SUBSCRIPTION,
          payload: {
            subscription_id: sub.id
          }
        });
      };

      // Renew click
      const onRenewClick = () => {
        const product_id = sub.plan.product.id;
        const plan_id = sub.plan.id;

        const product = window.Pelcro.product.getById(product_id);
        const plan = window.Pelcro.plan.getById(plan_id);

        setProductAndPlan(product, plan);
        setSubscriptionIdToRenew(sub.id);
        switchView("plan-select");
      };

      // Manage members click
      const onManageMembersClick = () => {
        const subscriptionToManageMembers = sub;

        set({ subscriptionToManageMembers });
        switchView("manage-members");
      };

      // Suspend click
      const onSuspendClick = () => {
        if (userMustVerifyEmail()) {
          return switchView("email-verify");
        }
        setSubscriptionToSuspend(sub.id);
        return switchView("subscription-suspend");
      };

      // UnSuspend click
      const onUnSuspendClick = () => {
        if (userMustVerifyEmail()) {
          return switchView("email-verify");
        }

        onClose?.();
        notify.confirm(
          (onSuccess, onFailure) => {
            dispatch({
              type: UNSUSPEND_SUBSCRIPTION,
              payload: {
                subscription_id: sub.id,
                onSuccess,
                onFailure
              }
            });
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
          <tbody className="plc-divide-y plc-divide-gray-200 plc-bg-white">
            <tr
              onClick={() => {
                if (hasPhases) toggleActiveMenu(sub.id);
              }}
              key={sub.id}
              className={`${isActive ? "plc-bg-gray-100" : "hover:plc-bg-gray-50"
                }`}
            >
              <td className="plc-py-4 plc-pr-3 plc-pl-4 plc-text-sm plc-font-medium plc-whitespace-nowrap plc-text-gray-900 plc-sm:pl-6 plc-lg:pl-8">
                {sub.plan.product.name && (
                  <span className="">
                    {sub.plan.product.name}
                  </span>
                )}
              </td>
              <td className="plc-px-3 plc-py-4 plc-text-sm plc-whitespace-nowrap plc-text-gray-500">
                <span className=" plc-text-gray-500">
                  {sub.plan.nickname}
                </span>
                <div className="plc-inline md:plc-hidden">
                  <br />
                  <span className="plc-text-xs plc-text-gray-400">
                    {getFormattedPriceByLocal(
                      sub.plan.amount,
                      sub.plan.currency,
                      getPageOrDefaultLanguage()
                    )}
                  </span>
                </div>
              </td>
              <td className="plc-px-3 plc-py-4 plc-text-sm plc-whitespace-nowrap plc-text-gray-900">
                <span className="">
                  {getFormattedPriceByLocal(
                    sub.plan.amount,
                    sub.plan.currency,
                    getPageOrDefaultLanguage()
                  )}
                </span>
              </td>
              <td className="plc-px-3 plc-py-4 plc-text-sm plc-whitespace-nowrap plc-text-gray-900">
                {/* Pill */}
                <div className="plc-flex plc-items-center">
                  <span
                    className={`plc-inline-flex plc-text-xs plc-font-medium  plc-capitalize
                      
                    ${getSubscriptionStatus(sub).textColor} plc-rounded-lg`}
                  >
                    {getSubscriptionStatus(sub).icon}
                    {getSubscriptionStatus(sub).title}
                  </span>
                </div>
                {getSubscriptionStatus(sub).content && (
                  <span className="plc-text-xs plc-text-gray-500 ml-1">
                    {getSubscriptionStatus(sub).content}
                  </span>
                )}
              </td>
              <td className="plc-px-3 plc-py-4 plc-text-sm plc-whitespace-nowrap plc-text-gray-900">
                <div className="">
                  {sub.shipments_remaining ? (
                    <div className="">
                      <span className="plc-inline-block">
                        {sub.shipments_remaining}{" "}
                        <span className="plc-text-gray-500">
                          {t("labels.remaining")}
                        </span>
                      </span>

                    </div>
                  ) : (
                    <span className="plc-inline-block">
                      -
                    </span>
                  )}
                </div>
              </td>
              <td className="plc-text-right plc-justify-end">
                <div className="plc-flex plc-items-center plc-justify-end plc-w-full  plc-text-right">
                  {sub.cancel_at_period_end === 1 && sub.plan.auto_renew && !sub.is_gift_recipient && (
                    <>
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
                      <div className="plc-h-3 plc-w-px plc-bg-gray-300"></div>
                    </>
                  )}

                  {sub.cancel_at_period_end === 1 && sub.status !== "incomplete" && (
                    <>
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
                      <div className="plc-h-3 plc-w-px plc-bg-gray-300"></div>
                    </>
                  )}

                  {sub.shipments_suspended_until && isDateAfterToday(sub.shipments_suspended_until) && sub.shipments_remaining > 0 && (
                    <>
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
                      <div className="plc-h-3 plc-w-px plc-bg-gray-300"></div>
                    </>
                  )}

                  {((!sub.shipments_suspended_until && sub.shipments_remaining > 0) ||
                    (sub.shipments_suspended_until && !isDateAfterToday(sub.shipments_suspended_until))) && (
                      <>
                        <Button
                          variant="ghost"
                          className="plc-text-amber-700 focus:plc-ring-amber-500 pelcro-dashboard-sub-suspend-button"
                          icon={<CalendarIcon />}
                          onClick={onSuspendClick}
                          disabled={disableSubmit}
                          data-key={sub.id}
                        >
                          {t("labels.suspend")}
                        </Button>
                        <div className="plc-h-3 plc-w-px plc-bg-gray-300"></div>
                      </>
                    )}



                  {sub?.plan?.type === "membership" && (
                    <>
                      <Button
                        variant="ghost"
                        className="plc-text-blue-400 pelcro-dashboard-sub-manage-members-button"
                        icon={<RefreshIcon />}
                        onClick={onManageMembersClick}
                        disabled={disableSubmit}
                        data-key={sub.id}
                      >
                        {t("labels.manageMembers")}
                      </Button>
                      <div className="plc-h-3 plc-w-px plc-bg-gray-300"></div>
                    </>
                  )}
                  {!sub.plan.auto_renew || (sub.plan.auto_renew && sub.cancel_at_period_end === 0) ? (
                    <>
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
                    </>
                  ) : (
                    ""
                  )}

                </div>
              </td>

              <td>
                {hasPhases && (
                  <div
                    className={`plc-flex plc-items-center plc-justify-center plc-transition-transform plc-ease-out plc-transform plc-rounded-full plc-h-7 ${isActive
                      ? "plc-flex plc-place-items-center plc-h-7 plc-p-1 plc-bg-primary-400 plc-rounded-full"
                      : "accordion-chevron"
                      }`}
                  >
                    <span
                      className={`plc-transition plc-ease-out  ${isActive &&
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
                      <td className="plc-hidden md:plc-table-cell plc-w-2/12"></td>

                      <td className="plc-truncate">
                        {plan.nickname && (
                          <span className="plc-font-semibold plc-text-gray-500">
                            {plan.nickname}
                          </span>
                        )}
                      </td>

                      <td className="plc-hidden md:plc-table-cell plc-w-2/12"></td>

                      <td className="plc-py-2">
                        <span
                          className={`plc-inline-flex plc-p-1 plc-text-xs plc-font-semibold plc-uppercase plc-rounded-lg ${isCurrentPhase
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
                  <td colSpan="6">
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
  const today = new Date().setHours(0, 0, 0, 0);
  const newDate = new Date(date).setHours(0, 0, 0, 0);
  return newDate === today ? true : newDate > today;
}

SubscriptionsMenu.viewId = "subscriptions";
