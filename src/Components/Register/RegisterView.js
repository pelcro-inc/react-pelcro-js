import React from "react";
import { useTranslation } from "react-i18next";
import {
  RegisterContainer,
  RegisterEmail,
  RegisterPassword,
  RegisterButton,
  RegisterFirstName,
  RegisterLastName,
  RegisterCompany,
  RegisterJobTitle,
  RegisterSelect
} from "../../components";

export function RegisterView(props) {
  const { t } = useTranslation("register");

  return (
    <div className="pelcro-prefix-form">
      <RegisterContainer {...props}>
        <div className="pelcro-prefix-row">
          <div className="col-md-12">
            <label
              className="pelcro-prefix-label"
              htmlFor="pelcro-input-email"
            >
              {t("labels.email")} *
            </label>
            <RegisterEmail
              className="pelcro-prefix-input pelcro-prefix-form-control"
              id="pelcro-input-email"
              placeholder={t("labels.emailPlaceholder")}
            />

            <RegisterFirstName
              className="pelcro-prefix-input pelcro-prefix-form-control"
              placeholder="First name"
            />

            <RegisterLastName
              className="pelcro-prefix-input pelcro-prefix-form-control"
              placeholder="Last name"
            />

            <RegisterCompany
              className="pelcro-prefix-input pelcro-prefix-form-control"
              placeholder="Company name"
            />

            <RegisterSelect
              fieldName="userSelectTest"
              options={[
                { key: 1, value: "test 1" },
                { key: 2, value: "test 2" }
              ]}
              placeholder="-"
            />

            <RegisterJobTitle
              className="pelcro-prefix-input pelcro-prefix-form-control"
              placeholder="Job Title"
            />
          </div>
          <div className="col-md-12">
            <label
              className="pelcro-prefix-label"
              htmlFor="pelcro-input-password"
            >
              {t("labels.password")} *
            </label>
            <RegisterPassword
              className="pelcro-prefix-input pelcro-prefix-form-control"
              id="pelcro-input-password"
              placeholder={t("labels.passwordPlaceholder")}
            />
          </div>
        </div>

        <small className="pelcro-prefix-footnote pelcro-prefix-form-text">
          * {t("labels.required")}
        </small>

        <RegisterButton
          className="pelcro-prefix-btn"
          id="pelcro-registeration-submit"
          name={t("messages.createAccount")}
        />
      </RegisterContainer>
    </div>
  );
}
