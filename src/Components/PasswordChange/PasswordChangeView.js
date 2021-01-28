import React from "react";
import { PasswordChangeContainer } from "./PasswordChangeContainer";
import { PasswordChangeCurrentPassword } from "./PasswordChangeCurrentPassword";
import { PasswordChangeNewPassword } from "./PasswordChangeNewPassword";
import { PasswordChangeConfirmNewPassword } from "./PasswordChangeConfirmNewPassword";
import { PasswordChangeButton } from "./PasswordChangeButton";
import { AlertDanger } from "../Alerts/AlertDanger";
import { AlertSuccess } from "../Alerts/AlertSuccess";
import { useTranslation } from "react-i18next";
import Authorship from "../common/Authorship";

export const PasswordChangeView = (props) => {
  const { t } = useTranslation("passwordChange");

  return (
    <PasswordChangeContainer {...props}>
      <div className="pelcro-prefix-title-block">
        <h4>{t("title")}</h4>
        <p>{t("subtitle")}</p>
      </div>
      <AlertDanger name="password-change" />
      <AlertSuccess name="password-change" />
      <div className="pelcro-prefix-form">
        <div className="pelcro-prefix-form-group">
          <label
            htmlFor="pelcro-input-password"
            className="pelcro-prefix-label"
          >
            {t("currentPassword")} *
          </label>
          <PasswordChangeCurrentPassword
            id="pelcro-input-password"
            className="pelcro-prefix-input pelcro-prefix-form-control"
            placeholder={t("currentPassword")}
            required
          />
        </div>

        <div className="pelcro-prefix-form-group">
          <label
            htmlFor="pelcro-input-new_password"
            className="pelcro-prefix-label"
          >
            {t("newPassword")} *
          </label>
          <PasswordChangeNewPassword
            id="pelcro-input-new_password"
            className="pelcro-prefix-input pelcro-prefix-form-control"
            placeholder={t("newPassword")}
            required
          />
        </div>

        <div className="pelcro-prefix-form-group">
          <label
            htmlFor="pelcro-input-confirm_new_password"
            className="pelcro-prefix-label"
          >
            {t("confirmNewPassword")} *
          </label>
          <PasswordChangeConfirmNewPassword
            id="pelcro-input-confirm_new_password"
            className="pelcro-prefix-input pelcro-prefix-form-control"
            placeholder={t("confirmNewPassword")}
            required
          />
        </div>

        <PasswordChangeButton
          className="pelcro-prefix-btn"
          name={t("submit")}
        />
        <small className="pelcro-prefix-footnote pelcro-prefix-form-text">
          * {t("required")}
        </small>
      </div>

      <div className="pelcro-prefix-modal-footer">
        <Authorship />
      </div>
    </PasswordChangeContainer>
  );
};
