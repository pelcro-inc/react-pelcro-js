import React from "react";
import { Button } from "../../../SubComponents/Button";
import { useTranslation } from "react-i18next";
import { ReactComponent as RefreshIcon } from "../../../assets/refresh.svg";
import { userMustVerifyEmail } from "../../../utils/utils";
import { usePelcro } from "../../../hooks/usePelcro";

export const MembershipsMenu = (props) => {
  const { t } = useTranslation("dashboard");

  return (
    <table className="plc-w-full plc-table-fixed">
      <thead className="plc-text-xs plc-font-semibold plc-tracking-wider plc-text-gray-400 plc-uppercase ">
        <tr>
          <th className="plc-w-3/12 ">{t("labels.plan")}</th>
          <th className="plc-w-6/12 ">{t("labels.status.title")}</th>
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
        <tr
          key={membership.id}
          className={`plc-w-full plc-align-top pelcro-membership-row`}
        >
          <td className="plc-truncate">
            {membership.plan.nickname && (
              <>
                <span className="plc-font-semibold plc-text-gray-500 pelcro-membership-plan">
                  {membership.plan.nickname}
                </span>
              </>
            )}
          </td>

          <td>
            <div className="plc-text-xs plc-text-gray-500">
              {membershipAddress && (
                <div className="pelcro-membership-address">
                  <p className="pelcro-membership-address-name">
                    {membershipAddress.first_name}{" "}
                    {membershipAddress.last_name}
                  </p>
                  <p className="pelcro-membership-address-company">
                    {membershipAddress.company}
                  </p>
                  <p className="pelcro-membership-address-line1">
                    {membershipAddress.line1}
                  </p>
                  <p className="pelcro-membership-address-country">
                    {membershipAddress.city},{" "}
                    {membershipAddress.state_name}{" "}
                    {membershipAddress.postal_code},{" "}
                    {membershipAddress.country_name}
                  </p>
                </div>
              )}
            </div>
          </td>
          {/* FIXME: fix labels and icons */}
          <td>
            <Button
              variant="ghost"
              icon={<RefreshIcon className="plc-w-4 plc-h-4" />}
              className="plc-text-blue-400 focus:plc-ring-blue-500 pelcro-dashboard-membership-address-button"
              onClick={() => onChangeAddressClick(membership.id)}
            >
              {t("labels.unsubscribe")}
            </Button>
          </td>
        </tr>
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
