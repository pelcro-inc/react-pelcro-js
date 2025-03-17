import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../SubComponents/Button";
import {
  getFormattedPriceByLocal,
  getPageOrDefaultLanguage
} from "../../../utils/utils";
import { AddNew } from "../AddNew";
import { Card } from "../Card";
import { ReactComponent as RefreshIcon } from "../../../assets/refresh.svg";
// import { ReactComponent as PlusIcon } from "../../../assets/plus.svg";
import { usePelcro } from "../../../hooks/usePelcro";
import { store } from "../DashboardContainer";
import { TableEmptyState } from "../../../SubComponents/TableEmptyState";

export const GiftsMenu = (props) => {
  const {
    state: { disableSubmit }
  } = useContext(store);
  const { t } = useTranslation("dashboard");
  const { switchView, set } = usePelcro();
  const giftRecipients =
    window.Pelcro.user.read()?.gift_recipients ?? [];

  const setIsRenewingGift = (isRenewingGift) =>
    set({ isRenewingGift });

  if (giftRecipients.length === 0) {
    return (
      <Card
        id="pelcro-dashboard-gifts-menu"
        title={t("labels.gifts")}
        className="plc-subscriptions-menu-width"
      >
        <TableEmptyState
          message={t("labels.noGifts")}
          colSpan={6}
          className="plc-bg-white plc-my-5"
          hideHeader={true}
        />
        <div className="plc-mt-6 plc-flex plc-justify-end plc-items-center plc-gap-2">
          <AddNew
            title={t("labels.addGift")}
            onClick={() => props?.displayProductSelect({ isGift: true })}
          />
        </div>
      </Card>
    );
  }

  return (
    <Card
      id="pelcro-dashboard-gifts-menu"
      title={t("labels.gifts")}
      className="plc-subscriptions-menu-width"
    >
      <div className="plc-flow-root">
        <div className="plc--mx-4 plc--my-2 plc-overflow-x-auto plc-sm:-mx-6 plc-lg:-mx-8">
          <div className="plc-inline-block plc-min-w-full plc-py-2 plc-align-middle">
            <table className="plc-min-w-full plc-divide-y plc-divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="plc-py-3.5 plc-pr-3 plc-pl-4 plc-text-left plc-text-sm plc-font-semibold plc-text-gray-900 plc-sm:pl-6 plc-lg:pl-8 plc-uppercase">
                    {t("labels.recipient")}
                  </th>
                  <th scope="col" className="plc-px-3 plc-py-3.5 plc-text-left plc-text-sm plc-font-semibold plc-text-gray-900 plc-uppercase">
                    {t("labels.plan")}
                  </th>
                  <th scope="col" className="plc-px-3 plc-py-3.5 plc-text-left plc-text-sm plc-font-semibold plc-text-gray-900 plc-uppercase">
                    {t("labels.status.title")}
                  </th>
                  <th scope="col" className="plc-px-3 plc-py-3.5 plc-text-left plc-text-sm plc-font-semibold plc-text-gray-900 plc-uppercase">
                    {t("labels.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="plc-divide-y plc-divide-gray-200">
                {giftRecipients
                  .sort((a, b) => a.expires_at - b.expires_at)
                  .sort((a, b) => a.renews_at - b.renews_at)
                  .map((recipient) => (
                    <tr key={`dashboard-gift-recipients-${recipient.id}`}>
                      <td className="plc-whitespace-nowrap plc-py-4 plc-pl-4 plc-pr-3 plc-text-sm plc-sm:pl-6 plc-lg:pl-8">
                        <div className="plc-font-medium plc-text-gray-900">
                          {recipient.first_name} {recipient.last_name}
                        </div>
                        <div className="plc-text-gray-500">{recipient.email}</div>
                      </td>
                      <td className="plc-whitespace-nowrap plc-px-3 plc-py-4 plc-text-sm plc-text-gray-500">
                        <div className="plc-font-medium plc-text-gray-900">
                          {recipient.plan.nickname}
                        </div>
                        <div className="plc-text-gray-500">
                          {getFormattedPriceByLocal(
                            recipient.plan.amount,
                            recipient.plan.currency,
                            getPageOrDefaultLanguage()
                          )}
                        </div>
                      </td>
                      <td className="plc-whitespace-nowrap plc-px-3 plc-py-4 plc-text-sm">
                        <span className={`plc-inline-flex plc-text-xs plc-font-medium plc-capitalize ${props?.getSubscriptionStatus(recipient).textColor} plc-rounded-lg`}>
                          {props?.getSubscriptionStatus(recipient).icon}
                          {props?.getSubscriptionStatus(recipient).title}
                        </span>
                        {props?.getSubscriptionStatus(recipient).content && (
                          <div className="plc-text-xs plc-text-gray-500 plc-mt-1">
                            {props?.getSubscriptionStatus(recipient).content}
                          </div>
                        )}
                      </td>
                      <td className="plc-whitespace-nowrap plc-px-3 plc-py-4 plc-text-sm">
                        {recipient.cancel_at_period_end === 1 && (
                          <Button
                            variant="ghost"
                            className="plc-text-blue-400"
                            icon={<RefreshIcon className="plc-w-4 plc-h-4" />}
                            onClick={() => {
                              const productId = recipient.plan?.product?.id;
                              const planId = recipient.plan?.id;
                              const product = window.Pelcro.product.getById(productId);
                              const plan = window.Pelcro.plan.getById(planId);
                              props?.setProductAndPlan(product, plan);
                              props?.setSubscriptionIdToRenew(recipient.id);
                              setIsRenewingGift(true);
                              switchView("plan-select");
                            }}
                            disabled={disableSubmit}
                            data-key={recipient.id}
                          >
                            {t("labels.renew")}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="plc-mt-6 plc-flex plc-justify-end">
        <AddNew
          title={t("labels.addGift")}
          onClick={() => props?.displayProductSelect({ isGift: true })}
        />
      </div>
    </Card>
  );
};

GiftsMenu.viewId = "gifts";
