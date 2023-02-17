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
        className="plc-mt-2 pelcro-form"
      >
        <LoginContainer {...props}>
          <AlertWithContext />
          {socialLoginEnabled && (
            <div className="plc-my-5">
              <div>
                <ul
                  className={`${
                    (auth0LoginEnabled && !passwordlessEnabled) ||
                    (!auth0LoginEnabled && passwordlessEnabled)
                      ? "threeColumns"
                      : "twoColumns"
                  } loginOptions plc-block sm:plc-flex plc-flex-col sm:plc-flex-row plc-justify-center plc-flex-wrap plc-items-center`}
                >
                  <li>
                    <GoogleLoginButton className="plc-flex plc-w-full" />
                  </li>
                  <li>
                    <FacebookLoginButton className="plc-flex plc-w-full" />
                  </li>
                  {auth0LoginEnabled && (
                    <li>
                      <Auth0LoginButton className="plc-flex plc-w-full" />
                    </li>
                  )}
                  {passwordlessEnabled && (
                    <li>
                      <LoginRequestLoginToken
                        onClick={props.onPasswordlessRequest}
                        className="plc-flex plc-w-full"
                      />
                    </li>
                  )}
                </ul>
              </div>

              <div className="plc-flex plc-items-center plc-justify-between plc-mt-5">
                <hr className="plc-w-full plc-border-gray-300" />
                <span className="plc-flex-shrink-0 plc-px-2 plc-text-sm plc-text-gray-700 plc-uppercase">
                  {t("messages.socialLogin.label")}
                </span>
                <hr className="plc-w-full plc-border-gray-300" />
              </div>
            </div>
          )}

          {enableLoginWithUsername ? (
            <LoginUsername
              id="pelcro-input-username"
              errorId="pelcro-input-username-error"
              required
              label={t("labels.username")}
              autoFocus={true}
            />
          ) : (
            <LoginEmail
              id="pelcro-input-email"
              errorId="pelcro-input-email-error"
              required
              label={t("labels.email")}
              autoFocus={true}
            />
          )}
          <LoginPassword
            id="pelcro-input-password"
            errorId="pelcro-input-password-error"
            required
            label={t("labels.password")}
          />
          <div className="plc-flex plc-flex-row-reverse">
            <Link
              className="plc-inline-flex plc-text-sm plc-cursor-default plc-h-9"
              id="pelcro-link-forgot-password"
              onClick={props.onForgotPassword}
            >
              <span className="plc-cursor-pointer">
                {t("messages.forgotPassword")}
              </span>
            </Link>
          </div>
          <LoginButton
            role="submit"
            className="plc-w-full plc-mt-2"
            name={t("labels.login")}
            id="pelcro-submit"
          />
        </LoginContainer>
      </form>
    </div>
  );
}
