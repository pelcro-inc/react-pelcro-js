import React from "react";
import { useTranslation } from "react-i18next";
import { RegisterContainer } from "./RegisterContainer";
import { RegisterEmail } from "./RegisterEmail";
import { RegisterPassword } from "./RegisterPassword";
import { RegisterButton } from "./RegisterButton";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";

export function RegisterView(props) {
  const { t } = useTranslation("register");

  const title = props.product?.paywall?.register_title ?? t("title");
  const subtitle =
    props.product?.paywall?.register_subtitle ?? t("subtitle");

  return (
    <div id="pelcro-register-view">
      <div className="flex flex-col items-center text-lg font-semibold text-center pelcro-title-wrapper">
        <h4>{title}</h4>
        <p>{subtitle}</p>
      </div>
      <div className="mt-2 pelcro-form">
        <RegisterContainer {...props}>
          <AlertWithContext />
          <RegisterEmail
            id="pelcro-input-email"
            errorId="pelcro-input-email-error"
            placeholder={t("labels.emailPlaceholder")}
            label={t("labels.email")}
            required
          />
          <RegisterPassword
            id="pelcro-input-password"
            errorId="pelcro-input-password-error"
            placeholder={t("labels.passwordPlaceholder")}
            label={t("labels.password")}
            required
          />
          <RegisterButton
            className="mt-2"
            id="pelcro-submit"
            name={t("messages.createAccount")}
          />
        </RegisterContainer>
      </div>
    </div>
  );
}
