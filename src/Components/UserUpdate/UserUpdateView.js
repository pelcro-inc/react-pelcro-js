import React from "react";
import { useTranslation } from "react-i18next";
import ErrMessage from "../common/ErrMessage";
import AlertSuccess from "../common/AlertSuccess";
import {
  UserUpdateEmail,
  UserUpdateFirstName,
  UserUpdateLastName,
  UserUpdateDisplayName,
  UserUpdatePhone,
  UserUpdateButton,
  UserUpdateContainer,
  UserUpdateTextInput
} from "../../components";

export const UserUpdateView = (props) => {
  const { t } = useTranslation("userEdit");

  return (
    <UserUpdateContainer {...props}>
      <div className="pelcro-prefix-title-block">
        <h4>{t("labels.title")}</h4>
        <p>{t("labels.subtitle")}</p>
      </div>

      <ErrMessage name="user-edit" />
      <AlertSuccess name="user-edit" />

      <div className="pelcro-prefix-form">
        <div className="pelcro-prefix-row">
          <div className="col-md-12">
            <label
              className="pelcro-prefix-label"
              htmlFor="pelcro-input-email"
            >
              {t("labels.email")}{" "}
            </label>
            <UserUpdateEmail
              placeholder={t("labels.email")}
              className="pelcro-prefix-input pelcro-prefix-form-control"
            />
          </div>
        </div>

        <div className="pelcro-prefix-row">
          <div className="col-md-6">
            <label
              className="pelcro-prefix-label"
              htmlFor="pelcro-input-first_name"
            >
              {t("labels.firstName")}{" "}
            </label>
            <UserUpdateFirstName
              className="pelcro-prefix-input pelcro-prefix-form-control"
              placeholder={t("labels.firstName")}
            />
          </div>
          <div className="col-md-6">
            <label
              className="pelcro-prefix-label"
              htmlFor="pelcro-input-last_name"
            >
              {t("labels.lastName")}{" "}
            </label>
            <UserUpdateLastName
              className="pelcro-prefix-input pelcro-prefix-form-control"
              id="pelcro-input-last_name"
              placeholder={t("labels.lastName")}
            />
          </div>

          <div className="col-md-6">
            <label
              className="pelcro-prefix-label"
              htmlFor="pelcro-input-first_name"
            >
              {t("labels.firstName")}{" "}
            </label>
            <UserUpdateDisplayName
              className="pelcro-prefix-input pelcro-prefix-form-control"
              placeholder="Display Name"
            />
          </div>

          <div className="col-md-6">
            <label
              className="pelcro-prefix-label"
              htmlFor="pelcro-input-last_name"
            >
              Organization Name
            </label>
            <UserUpdateTextInput
              fieldName="organization"
              className="pelcro-prefix-input pelcro-prefix-form-control"
              id="pelcro-input-organization"
              placeholder={"organization"}
            />
          </div>
        </div>

        <div className="pelcro-prefix-row">
          <div className="col-md-12">
            <label
              className="pelcro-prefix-label"
              htmlFor="pelcro-input-phone"
            >
              {t("labels.phone")}{" "}
            </label>
            <UserUpdatePhone
              className="pelcro-prefix-input pelcro-prefix-form-control"
              id="pelcro-input-phone"
              placeholder={t("labels.phone")}
            />
          </div>
        </div>

        <small className="pelcro-prefix-footnote pelcro-prefix-form-text">
          * {t("labels.required")}
        </small>
        <UserUpdateButton
          className="pelcro-prefix-btn"
          name={t("labels.submit")}
          id="edit-submit"
        />
      </div>
    </UserUpdateContainer>
  );
};
