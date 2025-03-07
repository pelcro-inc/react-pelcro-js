import React from "react";
import { useTranslation } from "react-i18next";
import { LoginContainer } from "./LoginContainer";
import { LoginPassword } from "./LoginPassword";
import { LoginButton } from "./LoginButton";
import { LoginRequestLoginToken } from "./LoginRequestLoginToken";
import { LoginEmail } from "./LoginEmail";
import { LoginUsername } from "./LoginUsername";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";
import { FacebookLoginButton } from "../../Components/common/FacebookLoginButton/FacebookLoginButton";
import { Link } from "../../SubComponents/Link";
import { GoogleLoginButton } from "../common/GoogleLoginButton/GoogleLoginButton";
import { Auth0LoginButton } from "../common/Auth0LoginButton/Auth0LoginButton";

/**
 *
 */
export function LoginView(props) {
  const { t } = useTranslation("login");
  const auth0LoginEnabled =
    window.Pelcro.site.read()?.auth0_client_id;

  const socialLoginEnabled =
    window.Pelcro.site.read()?.facebook_app_id ||
    window.Pelcro.site.read()?.google_app_id ||
    auth0LoginEnabled;

  const passwordlessEnabled =
    window.Pelcro.site.read()?.passwordless_enabled;

  const enableLoginWithUsername =
    window.Pelcro?.uiSettings?.enableLoginWithUsername;

  return (
    <div id="pelcro-login-view">
      <form
        action="javascript:void(0);"
        className="plc-space-y-4"
      >
        <LoginContainer {...props}>
          <AlertWithContext />
          {socialLoginEnabled && (
            <div className={`plc-mt-6 plc-grid plc-gap-4 ${auth0LoginEnabled && passwordlessEnabled
              ? 'plc-grid-cols-2'
              : 'plc-grid-cols-1 plc-sm:grid-cols-3'
              }`}>
              {/* <FacebookLoginButton className="" /> */}
              <GoogleLoginButton className="" />
              {/* {auth0LoginEnabled && (
                <Auth0LoginButton className="" />
              )} */}
              {passwordlessEnabled && (
                <LoginRequestLoginToken
                  onClick={props.onPasswordlessRequest}
                  className=""
                />
              )}
            </div>
          )}
          <div className="plc-relative plc-my-6">
            <div className="plc-absolute plc-inset-0 plc-flex plc-items-center">
              <div className="plc-w-full plc-border-t plc-border-gray-200" />
            </div>
            <div className="plc-relative plc-flex plc-justify-center plc-text-sm plc-uppercase">
              <span className="plc-bg-white plc-px-2 plc-text-gray-500">
                {t("messages.socialLogin.label")}
              </span>
            </div>
          </div>

          <div className="plc-space-y-4">
            {enableLoginWithUsername ? (
              <div className="plc-relative">
                <LoginUsername
                  id="pelcro-input-username"
                  errorId="pelcro-input-username-error"
                  required
                  label={t("labels.username")}
                  placeholder={t("labels.username")}
                  autoFocus={true}
                />
              </div>
            ) : (
              <div className="plc-relative">
                <LoginEmail
                  id="pelcro-input-email"
                  errorId="pelcro-input-email-error"
                  required
                  label={t("labels.email")}
                  placeholder={t("labels.emailPlaceholder")}
                  autoFocus={true}
                />
              </div>
            )}
            <div className="plc-relative">
              <LoginPassword
                id="pelcro-input-password"
                errorId="pelcro-input-password-error"
                required
                showStrength={false}
                label={t("labels.password")}
                placeholder={t("labels.passwordPlaceholder")}
              />
              <div className="plc-mt-2 plc-flex plc-items-center plc-justify-end">
                <Link
                  onClick={props.onForgotPassword}
                  id="pelcro-link-forgot-password"
                  className="plc-text-sm plc-text-gray-600 plc-transition-colors plc-hover:text-gray-900 plc-hover:underline"
                >
                  {t("messages.forgotPassword")}
                </Link>
              </div>
            </div>

            <LoginButton
              role="submit"
              className="plc-relative plc-w-full plc-rounded-lg plc-bg-gray-900 plc-px-4 plc-py-3 plc-text-sm plc-font-medium plc-text-white plc-transition-all plc-hover:bg-gray-800 plc-disabled:bg-gray-300 plc-disabled:cursor-not-allowed"
              name={t("labels.login")}
              id="pelcro-submit"
            />
          </div>
        </LoginContainer>
      </form>
    </div>
  );
}
