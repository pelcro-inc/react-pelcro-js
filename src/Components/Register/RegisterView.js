import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { RegisterContainer } from "./RegisterContainer";
import { RegisterEmail } from "./RegisterEmail";
import { RegisterPassword } from "./RegisterPassword";
import { RegisterButton } from "./RegisterButton";
import { RegisterFirstName } from "./RegisterFirstName";
import { RegisterLastName } from "./RegisterLastName";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";
import { usePelcro } from "../../hooks/usePelcro";
import { FacebookLoginButton } from "../common/FacebookLoginButton/FacebookLoginButton";
import { GoogleLoginButton } from "../common/GoogleLoginButton/GoogleLoginButton";
import { Auth0LoginButton } from "../common/Auth0LoginButton/Auth0LoginButton";
import { Link } from "../../SubComponents/Link";

/**
 *
 */
export function RegisterView(props) {
  const { t } = useTranslation("register");
  const { product } = usePelcro();

  const socialLoginEnabled =
    window.Pelcro.site.read()?.facebook_app_id ||
    window.Pelcro.site.read()?.google_app_id ||
    window.Pelcro.site.read()?.auth0_client_id;

  const showNameFields =
    window.Pelcro?.uiSettings?.enableNameFieldsInRegister;

  return (
    <div id="pelcro-register-view">
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <RegisterContainer {...props}>
          <AlertWithContext />
          {socialLoginEnabled && (
            <div className="plc-mt-5">
              <div>
                <div className="plc-flex plc-justify-center plc-align-middle plc-flex-wrap ">
                  <GoogleLoginButton />
                  <span className="divider plc-w-[1px] plc-bg-gray-500 plc-h-4 plc-mx-4 plc-inline-flex"></span>
                  <FacebookLoginButton />
                </div>
                <Auth0LoginButton />
              </div>

              <div className="plc-flex plc-items-center plc-justify-between ">
                <hr className="plc-w-full plc-border-gray-300" />
                <span className="plc-flex-shrink-0 plc-p-2 plc-text-xs plc-text-gray-400 plc-uppercase">
                  {t("messages.socialLogin.label")}
                </span>
                <hr className="plc-w-full plc-border-gray-300" />
              </div>
            </div>
          )}

          {showNameFields && (
            <div className="plc-flex plc-items-start">
              <RegisterFirstName
                id="pelcro-input-first-name"
                label={t("labels.firstName")}
              />
              <RegisterLastName
                wrapperClassName="plc-ml-3"
                id="pelcro-input-last-name"
                label={t("labels.lastName")}
              />
            </div>
          )}
          <RegisterEmail
            id="pelcro-input-email"
            errorId="pelcro-input-email-error"
            label={t("labels.email")}
            required
            autoFocus={true}
          />
          <RegisterPassword
            id="pelcro-input-password"
            errorId="pelcro-input-password-error"
            label={t("labels.password")}
            required
          />
          <RegisterButton
            role="submit"
            className="plc-w-full plc-mt-2"
            id="pelcro-submit"
            name={t("messages.createAccount")}
          />
          {hasSecurityTokenEnabled() && (
            <p className="plc-text-sm plc-text-gray-500 plc-mt-1">
              <Trans i18nKey="messages:recaptcha">
                This site is protected by reCAPTCHA and the Google
                <Link
                  href="https://policies.google.com/privacy"
                  className="plc-text-sm plc-text-gray-500"
                >
                  Privacy Policy
                </Link>
                and
                <Link
                  href="https://policies.google.com/terms"
                  className="plc-text-sm plc-text-gray-500"
                >
                  Terms of Service
                </Link>
                apply.
              </Trans>
            </p>
          )}
        </RegisterContainer>
      </form>
    </div>
  );
}

/**
 * Checks if the current site has security token enabled
 * @return {boolean}
 */
function hasSecurityTokenEnabled() {
  return Boolean(window.Pelcro.site?.read()?.security_key);
}
