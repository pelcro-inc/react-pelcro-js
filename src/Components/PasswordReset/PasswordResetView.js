import React from "react";
import {
  PasswordResetContainer,
  PasswordResetPassword,
  PasswordResetButton,
  PasswordResetEmail,
  PasswordResetConfirmPassword,
  AlertDanger,
  AlertSuccess
} from "../../components";
import { useTranslation } from "react-i18next";
import Authorship from "../common/Authorship";

export const PasswordResetView = props => {
  const { t } = useTranslation("passwordReset");
  return (
    <PasswordResetContainer {...props}>
      <div className="pelcro-prefix-title-block">
        <h4>{t("title")}</h4>
        <p>{t("subtitle")}</p>
      </div>

      <AlertDanger name="password-reset" />
      <AlertSuccess name="password-reset" />
      <div className="pelcro-prefix-form">
        <div className="pelcro-prefix-form-group">
          <label
            htmlFor="pelcro-input-email"
            className="pelcro-prefix-label"
          >
            {t("email")} *
          </label>
          <PasswordResetEmail
            className="pelcro-prefix-input pelcro-prefix-form-control"
            id="pelcro-input-email"
            required
            placeholder={t("email")}
          />
        </div>

        <div className="pelcro-prefix-form-group">
          <label
            htmlFor="pelcro-input-password"
            className="pelcro-prefix-label"
          >
            {t("password")} *
          </label>
          <PasswordResetPassword
            id="pelcro-input-password"
            className="pelcro-prefix-input pelcro-prefix-form-control"
            placeholder={t("password")}
            required
          />
        </div>

        <div className="pelcro-prefix-form-group">
          <label
            htmlFor="pelcro-input-confirm_password"
            className="pelcro-prefix-label"
          >
            {t("confirmPassword")} *
          </label>
          <PasswordResetConfirmPassword
            id="pelcro-input-confirm_password"
            className="pelcro-prefix-input pelcro-prefix-form-control"
            placeholder={t("confirmPassword")}
            required
          />
        </div>

        <PasswordResetButton
          className="pelcro-prefix-btn"
          name={t("submit")}
        />
        <small className="pelcro-prefix-footnote pelcro-prefix-form-text">
          * {t("required")}
        </small>
      </div>

      <div className="pelcro-prefix-modal-footer">
        <Authorship></Authorship>
      </div>
    </PasswordResetContainer>
  );
};
