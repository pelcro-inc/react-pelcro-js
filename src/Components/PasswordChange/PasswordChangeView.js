import React from "react";
import { PasswordChangeContainer } from "./PasswordChangeContainer";
import { PasswordChangeCurrentPassword } from "./PasswordChangeCurrentPassword";
import { PasswordChangeNewPassword } from "./PasswordChangeNewPassword";
import { PasswordChangeConfirmNewPassword } from "./PasswordChangeConfirmNewPassword";
import { PasswordChangeButton } from "./PasswordChangeButton";
import { useTranslation } from "react-i18next";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";

export const PasswordChangeView = (props) => {
  const { t } = useTranslation("passwordChange");

  return (
    <div id="pelcro-password-change-view">
      <form
        action="javascript:void(0);"
        className="plc-space-y-4"
      >
        <PasswordChangeContainer {...props}>
          <AlertWithContext />
          <div className="plc-space-y-4 plc-mt-6">
            <div className="plc-relative">
              <PasswordChangeCurrentPassword
                id="pelcro-input-password"
                errorId="pelcro-input-password-error"
                placeholder={t("currentPassword")}
                required
                className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
              />
            </div>

            <div className="plc-relative">
              <PasswordChangeNewPassword
                id="pelcro-input-new-password"
                errorId="pelcro-input-new-password-error"
                placeholder={t("newPassword")}
                required
                showStrength={true}
                className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
              />
            </div>

            <div className="plc-relative">
              <PasswordChangeConfirmNewPassword
                id="pelcro-input-confirm-password"
                errorId="pelcro-input-confirm-password-error"
                placeholder={t("confirmNewPassword")}
                required
                className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
              />
            </div>

            <PasswordChangeButton
              role="submit"
              className="plc-relative plc-w-full plc-rounded-lg plc-bg-gray-900 plc-px-4 plc-py-3 plc-text-sm plc-font-medium plc-text-white plc-transition-all plc-hover:bg-gray-800 plc-disabled:bg-gray-300 plc-disabled:cursor-not-allowed"
              id="pelcro-submit"
            />
          </div>
        </PasswordChangeContainer>
      </form>
    </div>
  );
};
