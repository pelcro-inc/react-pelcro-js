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
        className="space-y-4"
      >
        <LoginContainer {...props}>
          <AlertWithContext />
          {socialLoginEnabled && (
            <div className="mt-6 grid grid-cols-2 gap-4">
              <FacebookLoginButton className="" />
              <GoogleLoginButton className="" />
              {/* {auth0LoginEnabled && (
                <>
                  <Auth0LoginButton className="plc-flex plc-w-full" />
                </>
              )}
              {passwordlessEnabled && (
                <>
                  <LoginRequestLoginToken
                    onClick={props.onPasswordlessRequest}
                    className="plc-flex plc-w-full"
                  />
                </>
              )} */}


            </div>
          )}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm uppercase">
              <span className="bg-white px-2 text-gray-500">
                {t("messages.socialLogin.label")}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {enableLoginWithUsername ? (
              <div className="relative">

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
              <div className="relative">

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
            <div className="relative">

              <LoginPassword
                id="pelcro-input-password"
                errorId="pelcro-input-password-error"
                required
                label={t("labels.password")}
                placeholder={t("labels.passwordPlaceholder")}
              />
              <div className="mt-2 flex items-center justify-end">
                <Link
                  onClick={props.onForgotPassword}
                  id="pelcro-link-forgot-password"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900 hover:underline"
                >
                  {t("messages.forgotPassword")}
                </Link>
              </div>

            </div>

            <LoginButton
              role="submit"
              className="relative w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
              name={t("labels.login")}
              id="pelcro-submit"
            />

          </div>

          
        </LoginContainer>
      </form>
    </div>
  );
}
