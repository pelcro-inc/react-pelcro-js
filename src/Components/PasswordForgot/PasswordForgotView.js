import React from "react";
import { PasswordForgotContainer } from "./PasswordForgotContainer";
import { PasswordForgotButton } from "./PasswordForgotButton";
import { PasswordForgotEmail } from "./PasswordForgotEmail";
import { useTranslation } from "react-i18next";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";

export function PasswordForgotView(props) {
  const { t } = useTranslation("passwordForgot");

  return (
    <div id="pelcro-password-forgot-view">
      <form action="javascript:void(0);" className="plc-space-y-4">
        <PasswordForgotContainer {...props} className="plc-space-y-6">
          <AlertWithContext />
          <div className="plc-relative plc-mt-6">
            <PasswordForgotEmail
              type="email"
              required
              className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border-2 plc-focus:bg-white plc-focus:shadow-sm plc-focus:placeholder:text-gray-500"
              placeholder={t("email")}
              id="pelcro-input-email"
            />
          </div>

          <PasswordForgotButton
            type="submit"
            className="plc-relative plc-w-full plc-rounded-lg plc-bg-gray-900 plc-px-4 plc-py-3 plc-text-sm plc-font-medium plc-text-white plc-transition-all plc-hover:bg-gray-800 plc-disabled:bg-gray-200 plc-disabled:cursor-not-allowed"
            id="pelcro-submit"
          >
            {t("submit")}
          </PasswordForgotButton>
        </PasswordForgotContainer>
      </form>
    </div>
  );
}
