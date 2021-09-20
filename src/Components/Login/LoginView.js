import React from "react";
import { useTranslation } from "react-i18next";
import { LoginContainer } from "./LoginContainer";
import { LoginPassword } from "./LoginPassword";
import { LoginButton } from "./LoginButton";
import { LoginEmail } from "./LoginEmail";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";
import { FacebookLoginButton } from "../../Components/common/FacebookLoginButton/FacebookLoginButton";
import { Link } from "../../SubComponents/Link";
import { GoogleLoginButton } from "../common/GoogleLoginButton/GoogleLoginButton";

/**
 *
 */
export function LoginView(props) {
  const { t } = useTranslation("login");
  const socialLoginEnabled =
    window.Pelcro.site.read()?.facebook_app_id ||
    window.Pelcro.site.read()?.google_app_id;

  return (
    <div id="pelcro-login-view">
      <div className="plc-mb-6 plc-text-2xl plc-font-semibold plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4>{t("messages.loginTo")}</h4>
      </div>
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <LoginContainer {...props}>
          <AlertWithContext />
          <LoginEmail
            id="pelcro-input-email"
            errorId="pelcro-input-email-error"
            required
            label={t("labels.email")}
            autoFocus={true}
          />
          <LoginPassword
            id="pelcro-input-password"
            errorId="pelcro-input-password-error"
            required
            label={t("labels.password")}
          />
          <Link
            className="plc-flex plc-items-end plc-justify-end plc-text-sm plc-cursor-default plc-h-9"
            id="pelcro-link-forgot-password"
            onClick={props.onForgotPassword}
          >
            <span className="plc-cursor-pointer">
              {t("messages.forgotPassword")}
            </span>
          </Link>
          <LoginButton
            role="submit"
            className="plc-w-full plc-mt-2"
            name={t("labels.login")}
            id="pelcro-submit"
          />
          {socialLoginEnabled && (
            <div className="plc-mt-5">
              <div className="plc-flex plc-items-center plc-justify-between ">
                <hr className="plc-w-full plc-border-gray-300" />
                <span className="plc-flex-shrink-0 plc-p-2 plc-text-xs plc-text-gray-400 plc-uppercase">
                  {t("messages.socialLogin.label")}
                </span>
                <hr className="plc-w-full plc-border-gray-300" />
              </div>
              <div className="plc-flex plc-justify-center plc-px-5 plc-mt-1 plc-space-x-3">
                <GoogleLoginButton />
                <FacebookLoginButton />
              </div>
            </div>
          )}
        </LoginContainer>
      </form>
    </div>
  );
}
