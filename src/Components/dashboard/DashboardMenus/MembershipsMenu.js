import React from "react";
import { Button } from "../../../SubComponents/Button";
import { useTranslation } from "react-i18next";
import { ReactComponent as CheckMarkIcon } from "../../../assets/check-mark.svg";
import { ReactComponent as EditIcon } from "../../../assets/edit.svg";
import { userMustVerifyEmail } from "../../../utils/utils";
import { usePelcro } from "../../../hooks/usePelcro";

export const MembershipsMenu = (props) => {
  const { t } = useTranslation("dashboard");

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
      </tbody>
      <MembershipsItems {...props} />
    </table>
  );
};

const MembershipsItems = () => {
  const { t } = useTranslation("dashboard");
  const { switchView, setSelectedMembership, switchToAddressView } =
    usePelcro();

  const memberships = getActiveMemberships();

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
      const membershipAddress = window.Pelcro.address
        .list()
        ?.find((address) => address.id === membership.address_id);

      return (
        <>
          { membership.subscription.ended_at === null &&
            <tr
              key={membership.id}
              className={`plc-w-full plc-align-top pelcro-membership-row`}
            >
              <td className="plc-truncate">
                {membership.subscription.plan.nickname && (
                  <>
                    <span className="plc-font-semibold plc-text-gray-500 pelcro-membership-plan">
                      {membership.subscription.plan.nickname}
                    </span>
                  </>
                )}
              </td>
              <td>
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
              </td>
              <td>
                <Button
                  variant="ghost"
                  icon={<EditIcon className="plc-w-4 plc-h-4" />}
                  className="plc-text-blue-400 focus:plc-ring-blue-500 pelcro-dashboard-membership-address-button"
                  onClick={() => onChangeAddressClick(membership.id)}
                >
                  {`${t("labels.edit")} ${t("labels.address")}`}
                </Button>
              </td>
            </tr>
          }
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
