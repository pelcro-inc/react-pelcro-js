import React from "react";
import { useTranslation } from "react-i18next";
import ErrMessage from "../common/ErrMessage";
import {
  LoginContainer,
  LoginPassword,
  LoginButton,
  LoginEmail
} from "../../components";

export function LoginView(props) {
  const { t } = useTranslation("login");

  return (
    <div className="pelcro-prefix-modal-body">
      <div className="pelcro-prefix-title-block">
        <h4>{t("messages.loginTo")}</h4>
        <p>{t("messages.welcome")}</p>
      </div>

      <ErrMessage name={"login"} />

      <div className="pelcro-prefix-form">
        <LoginContainer {...props}>
          <div className="pelcro-prefix-form-group">
            <label className="pelcro-prefix-label" htmlFor="pelcro-input-email">
              {t("labels.email")} *
            </label>

            <LoginEmail
              className="pelcro-prefix-input pelcro-prefix-form-control"
              id="pelcro-input-email"
              required
              placeholder={t("labels.emailPlaceholder")}
            />
          </div>
          <div className="pelcro-prefix-form-group">
            <label
              className="pelcro-prefix-label"
              htmlFor="pelcro-input-password"
            >
              {t("labels.password")} *
            </label>
            <LoginPassword
              className="pelcro-prefix-input pelcro-prefix-form-control"
              id="pelcro-input-password"
              required
              placeholder={t("labels.passwordPlaceholder")}
            />
          </div>
          <small className="pelcro-prefix-footnote pelcro-prefix-form-text">
            * {t("labels.required")}
          </small>
          <LoginButton
            name={t("labels.login")}
            id="login-submit"
            className="pelcro-prefix-btn"
          />
        </LoginContainer>
      </div>
    </div>
  );
}

// Look into having classnames generated automatically in react. Maybe CSS in JS.
