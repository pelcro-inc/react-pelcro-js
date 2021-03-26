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
      <div className="plc-flex plc-flex-col plc-items-center plc-text-lg plc-font-semibold plc-text-center pelcro-title-wrapper">
        <h4>{title}</h4>
        <p>{subtitle}</p>
      </div>
      <div className="plc-mt-2 pelcro-form">
        <RegisterContainer {...props}>
          <AlertWithContext />
          <RegisterEmail
            id="pelcro-input-email"
            errorId="pelcro-input-email-error"
            label={t("labels.email")}
            required
          />
          <RegisterPassword
            id="pelcro-input-password"
            errorId="pelcro-input-password-error"
            label={t("labels.password")}
            required
          />
          <RegisterButton
            className="plc-mt-2"
            id="pelcro-submit"
            name={t("messages.createAccount")}
          />
        </RegisterContainer>
      </div>
    </div>
  );
}
