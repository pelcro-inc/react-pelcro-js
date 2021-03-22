import React from "react";
import { PasswordForgotContainer } from "./PasswordForgotContainer";
import { PasswordForgotButton } from "./PasswordForgotButton";
import { PasswordForgotEmail } from "./PasswordForgotEmail";
import { useTranslation } from "react-i18next";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";

export const PasswordForgotView = (props) => {
  const { t } = useTranslation("passwordForgot");
  return (
    <div id="pelcro-password-forgot-view">
      <div className="plc-flex plc-flex-col plc-items-center plc-text-lg plc-font-semibold plc-text-center pelcro-title-wrapper">
        <h4>{t("title")}</h4>
        <p>{t("subtitle")}</p>
      </div>
      <div className="plc-mt-2 pelcro-form">
        <PasswordForgotContainer {...props}>
          <AlertWithContext />
          <PasswordForgotEmail
            id="pelcro-input-email"
            required
            placeholder={t("email")}
            label={t("email")}
          />
          <PasswordForgotButton
            className="plc-mt-2"
            name={t("submit")}
            id="pelcro-submit"
          />
        </PasswordForgotContainer>
      </div>
    </div>
  );
};
