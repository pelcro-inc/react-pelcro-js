import React from "react";
import { useTranslation } from "react-i18next";
import { SubscriptionManageMembersContainer } from "./SubscriptionManageMembersContainer";
import { SubscriptionManageMembersButton } from "./SubscriptionManageMembersButton";
import { SubscriptionManageMembersEmails } from "./SubscriptionManageMembersEmails";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";
import { SubscriptionManageMembersList } from "./SubscriptionManageMembersList";

/**
 *
 */
export function SubscriptionManageMembersView(props) {
  const { t } = useTranslation("subscriptionManageMembers");

  return (
    <div id="pelcro-login-view">
      <div className="plc-font-semibold plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4 className="plc-text-2xl">{t("labels.inviteMembers")}</h4>
        <p>
          {t("labels.listNote")} 'john@example.com,jane@example.com'
        </p>
      </div>
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <SubscriptionManageMembersContainer {...props}>
          <AlertWithContext />
          <SubscriptionManageMembersEmails
            id="pelcro-input-email"
            errorId="pelcro-input-emails-error"
            required
            label={t("labels.emails")}
          />
          <SubscriptionManageMembersButton
            role="submit"
            className="plc-w-full"
            id="pelcro-submit"
          />
          <div className="plc-mt-1">
            <div className="plc-flex plc-items-center plc-justify-between ">
              <hr className="plc-w-full plc-border-gray-300" />
              <span className="plc-flex-shrink-0 plc-p-2 plc-text-xs plc-text-gray-400 plc-uppercase">
                {t("labels.listOfMembers")}
              </span>
              <hr className="plc-w-full plc-border-gray-300" />
            </div>
            {/* table */}
            <div className="plc-max-h-48 plc-overflow-x-hidden plc-overflow-y-auto">
              <table className="plc-w-full plc-table-fixed plc-text-center plc-p-2 plc-m-1">
                <thead className="plc-text-xs plc-font-semibold plc-tracking-wider plc-text-gray-400 plc-uppercase ">
                  <tr>
                    <th className="plc-w-6/12">
                      {t("labels.email")}
                    </th>
                    <th className="plc-w-3/12 ">
                      {t("labels.status")}
                    </th>
                    <th className="plc-w-3/12 ">
                      {t("labels.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <SubscriptionManageMembersList />
                </tbody>
              </table>
            </div>
          </div>
        </SubscriptionManageMembersContainer>
      </form>
    </div>
  );
}
