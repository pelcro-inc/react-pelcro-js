import React from "react";
import { Button } from "../../../SubComponents/Button";
import { useTranslation } from "react-i18next";
import { ReactComponent as CheckMarkIcon } from "../../../assets/check-mark.svg";
import { ReactComponent as EditIcon } from "../../../assets/edit.svg";
import { userMustVerifyEmail } from "../../../utils/utils";
import { usePelcro } from "../../../hooks/usePelcro";
import { Card } from "../Card";
import { ToggleSwitch } from "../../../SubComponents/ToggleSwitch";

export const MembershipsMenu = (props) => {
  const { t } = useTranslation("dashboard");

  return (
    <Card
      id="pelcro-dashboard-donation-menu"
      className="plc-max-w-80% plc-m-auto plc-mt-20"
      title={t("labels.memberships")}
    >
      <table className="plc-w-full plc-table-fixed">
        <tbody>
          <MembershipsItems {...props} />
        </tbody>
      </table>
    </Card>
  );
};

const MembershipsItems = () => {
  const { t } = useTranslation("dashboard");
  const { switchView, setSelectedMembership, switchToAddressView } =
    usePelcro();

  const memberships = window.Pelcro.user.read().memberships ?? [];

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
              <td className="plc-text-right">
                <ToggleSwitch isActive={membership.status === "active"}/>
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
