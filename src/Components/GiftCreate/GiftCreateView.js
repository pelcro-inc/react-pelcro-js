import React from "react";
import { useTranslation } from "react-i18next";
import { GiftCreateContainer } from "./GiftCreateContainer";
import { GiftCreateSubmitButton } from "./GiftCreateSubmitButton";
import { GiftCreateEmail } from "./GiftCreateEmail";
import { GiftCreateFirstName } from "./GiftCreateFirstName";
import { GiftCreateLastName } from "./GiftCreateLastName";

export const GiftCreateView = (props) => {
  const { t } = useTranslation("register");
  return (
    <GiftCreateContainer {...props}>
      <div className="pelcro-prefix-row">
        <div className="col-sm-6">
          <label
            className="pelcro-prefix-label"
            htmlFor="pelcro-gift-create-input-first_name"
          >
            {t("gift.labels.firstName")}
          </label>
          <GiftCreateFirstName
            className="pelcro-prefix-input pelcro-prefix-form-control"
            autoComplete="first-name"
            id="pelcro-gift-create-input-first_name"
            placeholder={t("gift.labels.firstNamePlaceholder")}
          ></GiftCreateFirstName>
        </div>
        <div className="col-sm-6">
          <label
            className="pelcro-prefix-label"
            htmlFor="pelcro-gift-create-input-last_name"
          >
            {t("gift.labels.lastName")}
          </label>
          <GiftCreateLastName
            className="pelcro-prefix-input pelcro-prefix-form-control"
            autoComplete="last-name"
            id="pelcro-gift-create-input-last_name"
            placeholder={t("gift.labels.lastNamePlaceholder")}
          ></GiftCreateLastName>
        </div>
      </div>
      <div className="pelcro-prefix-row">
        <div className="col-sm-12">
          <label
            className="pelcro-prefix-label"
            htmlFor="pelcro-gift-create-input-email"
          >
            {t("gift.labels.email")} *
          </label>
          <GiftCreateEmail
            className="pelcro-prefix-input pelcro-prefix-form-control"
            id="pelcro-gift-create-input-email"
            placeholder={t("gift.labels.emailPlaceholder")}
            autocomplete="off"
          ></GiftCreateEmail>
        </div>
      </div>

      <small className="pelcro-prefix-footnote pelcro-prefix-form-text">
        * {t("gift.labels.required")}
      </small>

      <GiftCreateSubmitButton
        name={t("gift.buttons.gift")}
        className="pelcro-prefix-btn"
      ></GiftCreateSubmitButton>
    </GiftCreateContainer>
  );
};
