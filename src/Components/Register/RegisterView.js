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
        className="space-y-4"
      >
        <RegisterContainer {...props}>
          <AlertWithContext />
          {socialLoginEnabled && (
            <div className="mt-6 grid gap-4" style={{gridTemplateColumns: auth0LoginEnabled ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)'}}>
              <FacebookLoginButton className="" />
              <GoogleLoginButton className="" />
              {auth0LoginEnabled && (
                <Auth0LoginButton className="" />
              )}
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
            {showNameFields && (
              <div className="grid grid-cols-2 gap-4">
                <RegisterFirstName
                  id="pelcro-input-first-name"
                  placeholder={t("labels.firstName")}
                  label={`${t("labels.firstName")}${nameFieldsRequired ? " *" : ""}`}
                  errorId="pelcro-input-firstName-error"
                  required={nameFieldsRequired}
                  className="w-full rounded-lg  border border-gray-200 bg-gray-50/30 px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-gray-800 focus:border-2 focus:bg-white focus:shadow-sm"
                />
                <RegisterLastName
                  id="pelcro-input-last-name"
                  placeholder={t("labels.lastName")}
                  label={`${t("labels.lastName")}${nameFieldsRequired ? " *" : ""}`}
                  errorId="pelcro-input-lastName-error"
                  required={nameFieldsRequired}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50/30 px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-gray-800 focus:border-2 focus:bg-white focus:shadow-sm"
                />
              </div>
            )}

            <div className="relative">
              <RegisterEmail
                id="pelcro-input-email"
                placeholder={t("labels.email")}
                errorId="pelcro-input-email-error"
                label={t("labels.email")}
                required
                autoFocus={true}
                className="w-full rounded-lg border-2 border-gray-200 bg-gray-50/30 px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-gray-800 focus:border-2 focus:bg-white focus:shadow-sm"
              />
            </div>

            <div className="relative">
              <RegisterPassword
                id="pelcro-input-password"
                placeholder={t("labels.password")}
                errorId="pelcro-input-password-error"
                label={t("labels.password")}
                required
                className="w-full rounded-lg border-2 border-gray-200 bg-gray-50/30 px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-gray-800 focus:border-2 focus:bg-white focus:shadow-sm"
              />
            </div>

            <RegisterButton
              role="submit"
              className="relative w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
              id="pelcro-submit"
              name={t("messages.createAccount")}
            />
          </div>

          {hasSecurityTokenEnabled() && (
            <p className="text-sm text-gray-500 mt-1">
              <Trans i18nKey="messages:recaptcha">
                This site is protected by reCAPTCHA and the Google
                <Link
                  href="https://policies.google.com/privacy"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900 hover:underline"
                >
                  Privacy Policy
                </Link>
                and
                <Link
                  href="https://policies.google.com/terms"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900 hover:underline"
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
