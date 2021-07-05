import React from "react";
import { useTranslation } from "react-i18next";
import { RegisterContainer } from "./RegisterContainer";
import { RegisterEmail } from "./RegisterEmail";
import { RegisterPassword } from "./RegisterPassword";
import { RegisterButton } from "./RegisterButton";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";
import { usePelcro } from "../../hooks/usePelcro";
import { FacebookLoginButton } from "../common/FacebookLoginButton/FacebookLoginButton";
import { GoogleLoginButton } from "../common/GoogleLoginButton/GoogleLoginButton";

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
    window.Pelcro.site.read()?.google_app_id;

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
        </RegisterContainer>
      </form>
    </div>
  );
}
