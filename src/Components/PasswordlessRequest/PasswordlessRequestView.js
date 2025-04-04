import React from "react";
import { PasswordlessRequestContainer } from "./PasswordlessRequestContainer";
import { PasswordlessRequestViewButton } from "./PasswordlessRequestButton";
import { PasswordlessRequestEmail } from "./PasswordlessRequestEmail";
import { useTranslation } from "react-i18next";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";

export const PasswordlessRequestView = (props) => {
  const { t } = useTranslation("passwordlessRequest");

  return (
    <div id="pelcro-password-forgot-view">
      <form
        action="javascript:void(0);"
        className="plc-space-y-4"
      >
        <PasswordlessRequestContainer {...props}>
          <AlertWithContext />

          <div className="plc-space-y-6 plc-mt-6">
            <div className="plc-relative">
              <PasswordlessRequestEmail
                id="pelcro-input-email"
                required
                label={t("email")}
                placeholder={t("email")}
                autoFocus={true}
                className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
              />
            </div>

            <PasswordlessRequestViewButton
              role="submit"
              className="plc-relative plc-w-full plc-rounded-lg plc-bg-gray-900 plc-px-4 plc-py-3 plc-text-sm plc-font-medium plc-text-white plc-transition-all plc-hover:bg-gray-800 plc-disabled:bg-gray-300 plc-disabled:cursor-not-allowed"
              name={t("submit")}
              id="pelcro-submit"
            />
          </div>
        </PasswordlessRequestContainer>
      </form>
    </div>
  );
};
