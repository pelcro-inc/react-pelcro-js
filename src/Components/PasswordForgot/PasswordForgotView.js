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
            className="plc-mt-2 plc-w-full"
            name={t("submit")}
            id="pelcro-submit"
          />
        </PasswordForgotContainer>
      </form>
    </div>
  );
};
