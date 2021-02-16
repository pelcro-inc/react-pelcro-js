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
      <div className="flex flex-col items-center text-lg font-semibold pelcro-title-container">
        <h4>{t("title")}</h4>
        <p>{t("subtitle")}</p>
      </div>
      <div className="mt-2 pelcro-form">
        <PasswordResetContainer {...props}>
          <AlertWithContext />
          <PasswordResetEmail
            id="pelcro-input-email"
            errorId="pelcro-input-email-error"
            required
            placeholder={t("email")}
            label={t("email")}
          />
          <PasswordResetPassword
            id="pelcro-input-password"
            errorId="pelcro-input-password-error"
            placeholder={t("password")}
            required
            label={t("password")}
          />
          <PasswordResetConfirmPassword
            id="pelcro-input-confirm-password"
            errorId="pelcro-input-confirm-password-error"
            placeholder={t("confirmPassword")}
            required
            label={t("confirmPassword")}
          />

          <PasswordResetButton
            name={t("submit")}
            id="pelcro-submit"
          />
        </PasswordResetContainer>
      </div>
    </div>
  );
};
