import React from "react";
import { PasswordForgotContainer } from "./PasswordForgotContainer";
import { PasswordForgotButton } from "./PasswordForgotButton";
import { PasswordForgotEmail } from "./PasswordForgotEmail";
import { useTranslation } from "react-i18next";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";

export const PasswordForgotView = (props) => {
  const { t } = useTranslation("passwordForgot");
  return (
    <div className="pelcro-password-forgot-view">
      <div className="pelcro-title-container">
        <h4>{t("title")}</h4>
        <p>{t("subtitle")}</p>
      </div>
      <PasswordForgotContainer {...props}>
        <AlertWithContext />
        <div className="pelcro-form">
          <PasswordForgotEmail
            id="pelcro-input-email"
            required
            placeholder={t("email")}
            label={t("email")}
          />
          <PasswordForgotButton
            name={t("submit")}
            id="pelcro-submit"
          />
          <small className="pelcro-footnote">* {t("required")}</small>
        </div>
      </PasswordForgotContainer>
    </div>
  );
};
