import React from "react";
import { useTranslation } from "react-i18next";
import {
  getFormattedPriceByLocal,
  getPageOrDefaultLanguage
} from "../../../utils/utils";
import { AddNew } from "../AddNew";
import { Card } from "../Card";

export const DonationsMenu = (props) => {
  const { t } = useTranslation("dashboard");

  const subscriptions = getDonationSubs()
    .sort((a, b) => a.expires_at - b.expires_at)
    .sort((a, b) => a.renews_at - b.renews_at)
    .map((sub) => {
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
        </tr>
      );
    });

  return (
    <Card
      id="pelcro-dashboard-donation-menu"
      className="plc-max-w-80% plc-m-auto"
      title={t("labels.donations")}
    >
      <table className="plc-w-full plc-table-fixed pelcro-donations-table plc-text-left">
        <thead className="plc-text-xs plc-font-semibold plc-tracking-wider plc-text-gray-400 plc-uppercase ">
          <tr>
            <th className="plc-w-1/4">{t("labels.plan")}</th>
            <th className="plc-w-1/4">{t("labels.startDate")}</th>
          </tr>
        </thead>
        <tbody>{subscriptions}</tbody>
      </table>
    </Card>
  );
};

function getDonationSubs() {
  const donations =
    window.Pelcro.subscription
      ?.list()
      ?.filter((sub) => sub.plan.is_donation && !sub.is_gift_donor) ??
    [];

  const canceledDonations =
    window.Pelcro.user
      .read()
      .expired_subscriptions?.filter(
        (sub) => sub.plan.is_donation && !sub.is_gift_donor
      ) ?? [];

  return [...donations, ...canceledDonations];
}

function formatStartDate(date) {
  const startDate = new Date(date);
  return new Intl.DateTimeFormat("en-CA").format(startDate);
}
