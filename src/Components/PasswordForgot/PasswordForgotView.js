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
      <div className="plc-mb-6 plc-text-center plc-text-gray-700 pelcro-title-wrapper">
        <h4 className="plc-text-2xl plc-font-semibold">
          {t("title")}
        </h4>
      </div>
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <PasswordForgotContainer {...props}>
          <AlertWithContext />
          <PasswordForgotEmail
            id="pelcro-input-email"
            required
            label={t("email")}
          />
          <PasswordForgotButton
            role="submit"
            className="plc-mt-2"
            name={t("submit")}
            id="pelcro-submit"
          />
        </PasswordForgotContainer>
      </form>
    </div>
  );
};
