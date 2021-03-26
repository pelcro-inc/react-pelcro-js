import React from "react";
import { useTranslation } from "react-i18next";
import { LoginContainer } from "./LoginContainer";
import { LoginPassword } from "./LoginPassword";
import { LoginButton } from "./LoginButton";
import { LoginEmail } from "./LoginEmail";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";
import { Link } from "../../SubComponents/Link";

export function LoginView(props) {
  const { t } = useTranslation("login");

  return (
    <div id="pelcro-login-view">
      <div className="plc-mb-2 plc-text-xl plc-font-semibold plc-text-center plc-text-gray-700 pelcro-title-wrapper">
        <h4>{t("messages.loginTo")}</h4>
      </div>
      <div className="plc-mt-2 pelcro-form">
        <LoginContainer {...props}>
          <AlertWithContext />
          <LoginEmail
            id="pelcro-input-email"
            errorId="pelcro-input-email-error"
            required
            label={t("labels.email")}
          />
          <LoginPassword
            id="pelcro-input-password"
            errorId="pelcro-input-password-error"
            required
            label={t("labels.password")}
          />
          <Link
            className="plc-flex plc-justify-end"
            id="pelcro-link-forget-password"
            onClick={props.onForgotPassword}
          >
            {t("messages.forgotPassword")}
          </Link>
          <LoginButton
            className="plc-mt-2"
            name={t("labels.login")}
            id="pelcro-submit"
          />
        </LoginContainer>
      </div>
    </div>
  );
}
