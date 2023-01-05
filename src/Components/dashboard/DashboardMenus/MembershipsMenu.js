import React from "react";
import { Button } from "../../../SubComponents/Button";
import { useTranslation } from "react-i18next";
import { ReactComponent as CheckMarkIcon } from "../../../assets/check-mark.svg";
import { ReactComponent as EditIcon } from "../../../assets/edit.svg";
import {
  getFormattedPriceByLocal,
  getPageOrDefaultLanguage,
  userMustVerifyEmail
} from "../../../utils/utils";
import { usePelcro } from "../../../hooks/usePelcro";
import { Card } from "../Card";

export const MembershipsMenu = (props) => {
  const { t } = useTranslation("dashboard");

  return (
    <Card
      id="pelcro-dashboard-donation-menu"
      className="plc-max-w-100% md:plc-max-w-80% plc-m-auto"
      title={t("labels.memberships")}
    >
      <table className="plc-w-full plc-table-fixed pelcro-memberships-table plc-text-left">
        <thead className="plc-text-xs plc-font-semibold plc-tracking-wider plc-text-gray-400 plc-uppercase ">
          <tr>
            <th className="plc-hidden md:plc-table-cell plc-w-1/5">{t("labels.product")}</th>
            <th className="plc-w-1/3 md:plc-w-1/5">{t("labels.plan")}</th>
            <th className="plc-hidden md:plc-table-cell plc-w-1/5">{t("labels.price")}</th>
            <th className="plc-w-1/3 md:plc-w-1/5">{t("labels.status.title")}</th>
            <th className="plc-w-1/3 md:plc-w-1/5">{t("labels.actions")}</th>
          </tr>
        </thead>
        <tbody>
          <MembershipsItems {...props} />
        </tbody>
      </table>
    </Card>
  );
};

const MembershipsItems = (props) => {
  const { t } = useTranslation("dashboard");
  const { switchView, setSelectedMembership, switchToAddressView } =
    usePelcro();

  const memberships = getActiveMemberships()

  const onChangeAddressClick = (membershipId) => {
    if (userMustVerifyEmail()) {
      return switchView("email-verify");
    }

    if (setSelectedMembership(membershipId)) {
      return switchToAddressView();
    }
  };

  if (memberships.length === 0) return null;

  return memberships
    .sort((a, b) => a.created_at - b.created_at)
    .map((membership) => {
      return (
        <>
          {membership.subscription.ended_at === null && (
            <tr
              key={membership.id}
              className={`plc-w-full pelcro-membership-row`}
            >
              <td className="plc-hidden md:plc-table-cell plc-truncate">
                <span className="plc-font-semibold plc-text-gray-500">
                  {membership.subscription.plan.product.name}
                </span>
              </td>
              <td className="plc-truncate">
                <span className="plc-font-semibold plc-text-gray-500">
                  {membership.subscription.plan.nickname}
                </span>
                <div className="plc-inline md:plc-hidden">
                  <br />
                  <span className="plc-text-xs plc-text-gray-400">
                    {getFormattedPriceByLocal(
                      membership.subscription.plan.amount,
                      membership.subscription.plan.currency,
                      getPageOrDefaultLanguage()
                    )}
                  </span>
                </div>
              </td>
              <td className="plc-hidden md:plc-table-cell plc-truncate">
                <span className="plc-font-semibold plc-text-gray-500">
                  {getFormattedPriceByLocal(
                    membership.subscription.plan.amount,
                    membership.subscription.plan.currency,
                    getPageOrDefaultLanguage()
                  )}
                </span>
              </td>
              <td className="plc-truncate plc-py-2">
                {/* Pill */}
                <span
                  className={`plc-inline-flex plc-p-1 plc-text-xs plc-font-semibold ${
                    getMemberShipStatus(membership.status).bgColor
                  } plc-uppercase ${
                    getMemberShipStatus(membership.status).textColor
                  } plc-rounded-lg`}
                >
                  {getMemberShipStatus(membership.status).icon}
                  {getMemberShipStatus(membership.status).title}
                </span>
                <br />
                <div className="plc-text-xs plc-text-gray-500">
                  {membership.subscription.status && (
                    <span className="plc-inline-block plc-mt-1 plc-underline">
                      {
                        props?.getSubscriptionStatus(
                          membership.subscription
                        ).content
                      }
                    </span>
                  )}
                  <br />
                  {membership.subscription.shipments_remaining ? (
                    <span className="plc-inline-block plc-mt-1">
                      {membership.subscription.shipments_remaining}{" "}
                      {t("labels.shipments")}
                    </span>
                  ) : null}
                </div>
              </td>
              <td className="plc-truncate">
                <Button
                  variant="ghost"
                  icon={<EditIcon className="plc-w-4 plc-h-4" />}
                  className="plc-text-blue-400 focus:plc-ring-blue-500 pelcro-dashboard-membership-address-button"
                  onClick={() => onChangeAddressClick(membership.id)}
                >
                  {`${t("labels.editAddress")}`}
                </Button>
              </td>
            </tr>
          )}
        </>
      );
    });
};

function getActiveMemberships() {
  return (
    window.Pelcro.user
      .read()
      .memberships?.filter(
        (membership) => membership.status === "active"
      ) ?? []
  );
}

function getMemberShipStatus(status) {
  return {
    title: status,
    textColor: "plc-text-green-700",
    bgColor: "plc-bg-green-100",
    icon: <CheckMarkIcon />
  };
}
