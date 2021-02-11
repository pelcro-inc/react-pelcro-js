import React from "react";
import { useTranslation } from "react-i18next";
import { LoginContainer } from "./LoginContainer";
import { LoginPassword } from "./LoginPassword";
import { LoginButton } from "./LoginButton";
import { LoginEmail } from "./LoginEmail";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";

export function LoginView(props) {
  const { t } = useTranslation("login");

  return (
    <div id="pelcro-login-view">
      <div className="pelcro-title-container">
        <h4>{t("messages.loginTo")}</h4>
        <p>{t("messages.welcome")}</p>
      </div>
      <LoginContainer {...props}>
        <AlertWithContext />
        <div className="pelcro-form">
          <LoginEmail
            id="pelcro-input-email"
            errorId="pelcro-input-email-error"
            required
            placeholder={t("labels.emailPlaceholder")}
            label={t("labels.email")}
          />
          <LoginPassword
            id="pelcro-input-password"
            errorId="pelcro-input-password-error"
            required
            placeholder={t("labels.passwordPlaceholder")}
            label={t("labels.password")}
          />
          <p className="pelcro-footnote">* {t("labels.required")}</p>
          <LoginButton name={t("labels.login")} id="pelcro-submit" />
        </div>
      </LoginContainer>
    </div>
  );
}
