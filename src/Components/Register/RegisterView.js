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
import { RegisterPhone } from "./RegisterPhone";

/**
 *
 */
export function RegisterView(props) {
  const { t } = useTranslation("register");
  const { product } = usePelcro();

  const title = product?.paywall?.register_title ?? t("title");
  const subtitle =
    product?.paywall?.register_subtitle ?? t("subtitle");
  const socialLoginEnabled =
    window.Pelcro.site.read()?.facebook_app_id ||
    window.Pelcro.site.read()?.google_app_id ||
    window.Pelcro.site.read()?.auth0_client_id;

  const showNameFields =
    window.Pelcro?.uiSettings?.enableNameFieldsInRegister;

  const supportsTap = Boolean(
    window.Pelcro.site.read()?.tap_gateway_settings
  );

  return (
    <div id="pelcro-register-view">
      <div className="plc-mb-6 plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4 className="plc-text-2xl plc-font-semibold">{title}</h4>
        <p>{subtitle}</p>
      </div>
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <RegisterContainer {...props}>
          <AlertWithContext />
          {(showNameFields || supportsTap) && (
            <div className="plc-flex plc-items-start">
              <RegisterFirstName
                id="pelcro-input-first-name"
                label={t("labels.firstName")}
                errorId="pelcro-input-firstName-error"
                required={supportsTap ? true : false}
              />
              <RegisterLastName
                wrapperClassName="plc-ml-3"
                id="pelcro-input-last-name"
                label={t("labels.lastName")}
                errorId="pelcro-input-lastName-error"
                required={supportsTap ? true : false}
              />
            </div>
          )}

          {supportsTap && (
            <RegisterPhone
              id="pelcro-input-phone"
              errorId="pelcro-input-phone-error"
              label={t("labels.phone")}
              required={supportsTap ? true : false}
            />
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
                <Auth0LoginButton />
              </div>
            </div>
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
