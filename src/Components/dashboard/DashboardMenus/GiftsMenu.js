import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../SubComponents/Button";
import {
  getFormattedPriceByLocal,
  getPageOrDefaultLanguage
} from "../../../utils/utils";
import { AddNew } from "../AddNew";
import { Card } from "../Card";
import { ReactComponent as RefreshIcon } from "../../../assets/refresh.svg";
import { ReactComponent as PlusIcon } from "../../../assets/plus.svg";
import { usePelcro } from "../../../hooks/usePelcro";

export const GiftsMenu = (props) => {
  const { t } = useTranslation("dashboard");
  const { switchView, set } = usePelcro();
  const giftRecipients =
    window.Pelcro.user.read()?.gift_recipients ?? [];

  const setIsRenewingGift = (isRenewingGift) => set({ isRenewingGift });

  const renderGiftRecipients = ({ disableSubmit }) => {
    const giftedSubscriptions = giftRecipients
      ?.sort((a, b) => a.expires_at - b.expires_at)
      ?.sort((a, b) => a.renews_at - b.renews_at)
      ?.map((recipient) => {
        // Renew click
        const onRenewClick = () => {
          const productId = recipient.plan?.product?.id;
          const planId = recipient.plan?.id;
          const product = window.Pelcro.product.getById(productId);
          const plan = window.Pelcro.plan.getById(planId);
          props?.setProductAndPlan(product, plan);
          props?.setSubscriptionIdToRenew(recipient.id);
          setIsRenewingGift(true);
          switchView("plan-select");
        };

        return (
          <tr
            key={"dashboard-gift-recipients-" + recipient.id}
            className="plc-align-top"
          >
            {/* User info section */}
            <td
              className="plc-pr-2 plc-text-gray-500 plc-truncate"
              title={recipient.email}
            >
              {(recipient.first_name || recipient.last_name) && (
                <span className="plc-font-semibold">
                  {recipient.first_name} {recipient.last_name}
                </span>
              )}
              <br />
              <span className="plc-text-xs">{recipient.email}</span>
            </td>
            {/* Plan info section */}
            <td className="plc-truncate">
              {recipient.plan.nickname && (
                <>
                  <span className="plc-font-semibold plc-text-gray-500">
                    {recipient.plan.nickname}
                  </span>
                  <br />
                  <span className="plc-text-xs plc-text-gray-400">
                    {getFormattedPriceByLocal(
                      recipient.plan.amount,
                      recipient.plan.currency,
                      getPageOrDefaultLanguage()
                    )}
                  </span>
                </>
              )}
            </td>

            {/* Subscription status section */}
            {recipient.status && (
              <td>
                {/* Pill */}
                <span
                  className={`plc-inline-flex plc-p-1 plc-text-xs plc-font-semibold ${
                    props?.getSubscriptionStatus(recipient).bgColor
                  } plc-uppercase ${
                    props?.getSubscriptionStatus(recipient).textColor
                  } plc-rounded-lg`}
                >
                  {props?.getSubscriptionStatus(recipient).icon}
                  {props?.getSubscriptionStatus(recipient).title}
                </span>
                <br />
                <div className="plc-mb-4 plc-text-xs plc-text-gray-500">
                  {recipient.status && (
                    <span className="plc-inline-block plc-mt-1 plc-underline">
                      {
                        props?.getSubscriptionStatus(recipient)
                          .content
                      }
                    </span>
                  )}
                </div>
              </td>
            )}

            {/* Recipient sub renew section */}
            {recipient.cancel_at_period_end === 1 && (
              <td>
                <Button
                  variant="ghost"
                  icon={<RefreshIcon className="plc-w-4 plc-h-4" />}
                  className="plc-text-blue-400"
                  onClick={onRenewClick}
                  disabled={disableSubmit}
                  data-key={recipient.id}
                >
                  {t("labels.renew")}
                </Button>
              </td>
            )}
          </tr>
        );
      });

    return (
      <table className="plc-w-full plc-table-fixed pelcro-gifts-table plc-text-left">
        <thead className="plc-text-xs plc-font-semibold plc-tracking-wider plc-text-gray-400 plc-uppercase ">
          <tr>
            <th className="plc-w-1/4">{t("labels.recipient")}</th>
            <th className="plc-w-1/4">{t("labels.plan")}</th>
            <th className="plc-w-1/4">{t("labels.status.title")}</th>
            <th className="plc-w-1/4">{t("labels.actions")}</th>
          </tr>
        </thead>
        {/* Spacer */}
        <tbody>
          <tr className="plc-h-4"></tr>
          {giftedSubscriptions}
        </tbody>
      </table>
    );
  };

  return (
    <Card
      id="pelcro-dashboard-gifts-menu"
      className="plc-max-w-100% md:plc-max-w-80% plc-m-auto"
      title={t("labels.gifts")}
    >
      {renderGiftRecipients(props)}
      <AddNew
        title={t("labels.addGift")}
        onClick={() => props?.displayProductSelect({ isGift: true })}
      />
    </Card>
  );
};
