import React from "react";
import { PasswordChangeContainer } from "./PasswordChangeContainer";
import { PasswordChangeCurrentPassword } from "./PasswordChangeCurrentPassword";
import { PasswordChangeNewPassword } from "./PasswordChangeNewPassword";
import { PasswordChangeConfirmNewPassword } from "./PasswordChangeConfirmNewPassword";
import { PasswordChangeButton } from "./PasswordChangeButton";
import { useTranslation } from "react-i18next";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";

export const PasswordChangeView = (props) => {
  const { t } = useTranslation("passwordChange");

  return (
    <div id="pelcro-password-change-view">
      <div className="flex flex-col items-center text-lg font-semibold pelcro-title-container">
        <h4>{t("title")}</h4>
        <p>{t("subtitle")}</p>
      </div>
      <div className="mt-2 pelcro-form">
        <PasswordChangeContainer {...props}>
          <AlertWithContext />
          <PasswordChangeCurrentPassword
            id="pelcro-input-password"
            errorId="pelcro-input-password-error"
            placeholder={t("currentPassword")}
            label={t("currentPassword")}
            required
          />
          <PasswordChangeNewPassword
            id="pelcro-input-new-password"
            errorId="pelcro-input-new-password-error"
            placeholder={t("newPassword")}
            label={t("newPassword")}
            required
          />
          <PasswordChangeConfirmNewPassword
            id="pelcro-input-confirm-password"
            errorId="pelcro-input-confirm-password-error"
            placeholder={t("confirmNewPassword")}
            label={t("confirmNewPassword")}
            required
          />
          <PasswordChangeButton
            className="mt-2"
            name={t("submit")}
            id="pelcro-submit"
          />
        </PasswordChangeContainer>
      </div>
    </div>
  );
};
