import React from "react";
import { PasswordResetContainer } from "./PasswordResetContainer";
import { PasswordResetPassword } from "./PasswordResetPassword";
import { PasswordResetButton } from "./PasswordResetButton";
import { PasswordResetEmail } from "./PasswordResetEmail";
import { PasswordResetConfirmPassword } from "./PasswordResetConfirmPassword";
import { useTranslation } from "react-i18next";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";

export const PasswordResetView = (props) => {
  const { t } = useTranslation("passwordReset");
  return (
    <div id="pelcro-password-reset-view">
      <div className="plc-mb-6 plc-text-center plc-text-gray-700 pelcro-title-wrapper">
        <h4 className="plc-text-2xl plc-font-semibold">
          {t("title")}
        </h4>
        <p>{t("subtitle")}</p>
      </div>
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <PasswordResetContainer {...props}>
          <AlertWithContext />
          <PasswordResetEmail
            id="pelcro-input-email"
            errorId="pelcro-input-email-error"
            required
            label={t("email")}
          />
          <PasswordResetPassword
            id="pelcro-input-password"
            errorId="pelcro-input-password-error"
            required
            label={t("password")}
          />
          <PasswordResetConfirmPassword
            id="pelcro-input-confirm-password"
            errorId="pelcro-input-confirm-password-error"
            required
            label={t("confirmPassword")}
          />

          <PasswordResetButton
            role="submit"
            className="plc-mt-2"
            name={t("submit")}
            id="pelcro-submit"
          />
        </PasswordResetContainer>
      </form>
    </div>
  );
};
