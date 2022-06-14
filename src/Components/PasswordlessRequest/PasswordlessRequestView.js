import React from "react";
import { PasswordlessRequestContainer } from "./PasswordlessRequestContainer";
import { PasswordlessRequestViewButton } from "./PasswordlessRequestButton";
import { PasswordlessRequestEmail } from "./PasswordlessRequestEmail";
import { useTranslation } from "react-i18next";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";

export const PasswordlessRequestView = (props) => {
  const { t } = useTranslation("passwordlessRequest");
  return (
    <div id="pelcro-password-forgot-view">
      <div className="plc-mb-6 plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4 className="plc-text-2xl plc-font-semibold">
          {t("title")}
        </h4>
      </div>
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <PasswordlessRequestContainer {...props}>
          <AlertWithContext />
          <PasswordlessRequestEmail
            id="pelcro-input-email"
            required
            label={t("email")}
          />
          <PasswordlessRequestViewButton
            role="submit"
            className="plc-mt-2 plc-w-full"
            name={t("submit")}
            id="pelcro-submit"
          />
        </PasswordlessRequestContainer>
      </form>
    </div>
  );
};
