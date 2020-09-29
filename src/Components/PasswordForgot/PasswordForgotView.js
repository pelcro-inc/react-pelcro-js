import React from "react";
import { PasswordForgotContainer } from "./PasswordForgotContainer";
import { PasswordForgotButton } from "./PasswordForgotButton";
import { PasswordForgotEmail } from "./PasswordForgotEmail";
import { AlertDanger } from "../Alerts/AlertDanger";
import { AlertSuccess } from "../Alerts/AlertSuccess";
import { useTranslation } from "react-i18next";
import Authorship from "../common/Authorship";

export const PasswordForgotView = (props) => {
  const { t } = useTranslation("passwordForgot");
  return (
    <PasswordForgotContainer {...props}>
      <div className="pelcro-prefix-title-block">
        <h4>{t("title")}</h4>
        <p>{t("subtitle")}</p>
      </div>

      <AlertDanger name="password-forgot" />
      <AlertSuccess name="password-forgot" />

      <div className="pelcro-prefix-form">
        <div className="pelcro-prefix-form-group">
          <label
            htmlFor="pelcro-input-email"
            className="pelcro-prefix-label"
          >
            {t("email")} *
          </label>
          <PasswordForgotEmail
            className="pelcro-prefix-input pelcro-prefix-form-control"
            id="pelcro-input-email"
            required
            placeholder={t("email")}
          />
        </div>

        <PasswordForgotButton
          className="pelcro-prefix-btn"
          name={t("submit")}
        />
        <small className="pelcro-prefix-footnote pelcro-prefix-form-text">
          * {t("required")}
        </small>
      </div>

      <div className="pelcro-prefix-modal-footer">
        <small>
          {t("messages.alreadyHaveAccount")}
          <button
            className="pelcro-prefix-link"
            onClick={() => props.setView("login")}
          >
            {t("messages.loginHere")}
          </button>
        </small>
        <Authorship></Authorship>
      </div>
    </PasswordForgotContainer>
  );
};
