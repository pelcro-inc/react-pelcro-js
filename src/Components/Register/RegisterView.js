import React from "react";
import { useTranslation } from "react-i18next";
import { RegisterContainer } from "./RegisterContainer";
import { RegisterEmail } from "./RegisterEmail";
import { RegisterPassword } from "./RegisterPassword";
import { RegisterButton } from "./RegisterButton";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";
import { usePelcro } from "../../hooks/usePelcro";

/**
 *
 */
export function RegisterView(props) {
  const { t } = useTranslation("register");
  const { product } = usePelcro();

  const title = product?.paywall?.register_title ?? t("title");
  const subtitle =
    product?.paywall?.register_subtitle ?? t("subtitle");

  return (
    <div id="pelcro-register-view">
      <div className="plc-mb-6 plc-text-center plc-text-gray-700 pelcro-title-wrapper">
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
        </RegisterContainer>
      </form>
    </div>
  );
}
