import React from "react";
import { useTranslation } from "react-i18next";
import {
  getFormattedPriceByLocal,
  getPageOrDefaultLanguage
} from "../../../utils/utils";

export const DonationsMenu = () => {
  const { t } = useTranslation("dashboard");

  const subscriptions = getDonationSubs()
    .sort((a, b) => a.expires_at - b.expires_at)
    .sort((a, b) => a.renews_at - b.renews_at)
    .map((sub) => {
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
                    sub.plan.amount * sub.quantity,
                    sub.plan.currency,
                    getPageOrDefaultLanguage()
                  )}
                </span>
              </>
            )}
          </td>
          <td>
            <div className="plc-mb-4 plc-text-gray-500">
              {sub.status && (
                <span>{formatStartDate(sub.start)}</span>
              )}
            </div>
          </td>
        </tr>
      );
    });

  return (
    <table className="plc-w-full plc-table-fixed">
      <thead className="plc-text-xs plc-font-semibold plc-tracking-wider plc-text-gray-400 plc-uppercase ">
        <tr>
          <th className="plc-w-6/12 ">{t("labels.plan")}</th>
          <th className="plc-w-6/12 ">{t("labels.startDate")}</th>
        </tr>
      </thead>
      <tbody>
        {/* Spacer */}
        <tr className="plc-h-4"></tr>
        {subscriptions}
      </tbody>
    </table>
  );
};

function getDonationSubs() {
  return (
    window.Pelcro.subscription
      ?.list()
      ?.filter((sub) => sub.plan.is_donation) ?? []
  );
}

function formatStartDate(date) {
  const startDate = new Date(date);
  return new Intl.DateTimeFormat("en-CA").format(startDate);
}
