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

  const auth0LoginEnabled =
    window.Pelcro.site.read()?.auth0_client_id;

  const socialLoginEnabled =
    window.Pelcro.site.read()?.facebook_app_id ||
    window.Pelcro.site.read()?.google_app_id ||
    auth0LoginEnabled;

  const showNameFields =
    window.Pelcro?.uiSettings?.enableNameFieldsInRegister;

  const nameFieldsRequired =
    window.Pelcro?.uiSettings?.requireNameFieldsInRegister;

  return (
    <div id="pelcro-register-view">
      <form
        action="javascript:void(0);"
        className="plc-space-y-4"
      >
        <RegisterContainer {...props}>
          <AlertWithContext />
          {socialLoginEnabled && (
            <div className="plc-mt-6 plc-grid plc-gap-4 plc-grid-cols-2 plc-sm:grid-cols-3">
              {/* <FacebookLoginButton className="" /> */}
              <GoogleLoginButton className="" />
              {auth0LoginEnabled && (
                <Auth0LoginButton className="" />
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
            {showNameFields && (
              <div className="plc-grid plc-grid-cols-2 plc-gap-4">
                <RegisterFirstName
                  id="pelcro-input-first-name"
                  placeholder={t("labels.firstName")}
                  label={`${t("labels.firstName")}${nameFieldsRequired ? " *" : ""}`}
                  errorId="pelcro-input-firstName-error"
                  required={nameFieldsRequired}
                  className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
                />
                <RegisterLastName
                  id="pelcro-input-last-name"
                  placeholder={t("labels.lastName")}
                  label={`${t("labels.lastName")}${nameFieldsRequired ? " *" : ""}`}
                  errorId="pelcro-input-lastName-error"
                  required={nameFieldsRequired}
                  className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
                />
              </div>
            )}

            <div className="plc-relative">
              <RegisterEmail
                id="pelcro-input-email"
                placeholder={t("labels.email")}
                errorId="pelcro-input-email-error"
                label={t("labels.email")}
                required
                autoFocus={true}
                className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
              />
            </div>

            <div className="plc-relative">
              <RegisterPassword
                id="pelcro-input-password"
                placeholder={t("labels.password")}
                errorId="pelcro-input-password-error"
                label={t("labels.password")}
                showStrength={true}
                required
                className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
              />
            </div>

            <RegisterButton
              role="submit"
              className="plc-relative plc-w-full plc-rounded-lg plc-bg-gray-900 plc-px-4 plc-py-3 plc-text-sm plc-font-medium plc-text-white plc-transition-all hover:plc-bg-gray-800 disabled:plc-bg-gray-300 disabled:plc-cursor-not-allowed"
              id="pelcro-submit"
              name={t("messages.createAccount")}
            />
          </div>

          {hasSecurityTokenEnabled() && (
            <p className="plc-text-sm plc-text-gray-500 plc-mt-1">
              <Trans i18nKey="messages:recaptcha">
                This site is protected by reCAPTCHA and the Google
                <Link
                  href="https://policies.google.com/privacy"
                  className="plc-text-sm plc-text-gray-600 plc-transition-colors hover:plc-text-gray-900 hover:plc-underline"
                >
                  Privacy Policy
                </Link>
                and
                <Link
                  href="https://policies.google.com/terms"
                  className="plc-text-sm plc-text-gray-600 plc-transition-colors hover:plc-text-gray-900 hover:plc-underline"
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
