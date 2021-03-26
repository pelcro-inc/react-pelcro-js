import React from "react";
import { useTranslation } from "react-i18next";
import { GiftCreateContainer } from "./GiftCreateContainer";
import { GiftCreateSubmitButton } from "./GiftCreateSubmitButton";
import { GiftCreateEmail } from "./GiftCreateEmail";
import { GiftCreateFirstName } from "./GiftCreateFirstName";
import { GiftCreateLastName } from "./GiftCreateLastName";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";

export const GiftCreateView = (props) => {
  const { t } = useTranslation("register");
  return (
    <div id="pelcro-gift-create-view">
      <div className="plc-flex plc-flex-col plc-items-center plc-text-lg plc-font-semibold plc-text-center pelcro-title-wrapper">
        <h4>{t("gift.titles.firstTitle")}</h4>
      </div>
      <div className="plc-mt-2 pelcro-form">
        <GiftCreateContainer {...props}>
          <AlertWithContext />
          <div className="plc-flex plc-items-end">
            <GiftCreateFirstName
              autoComplete="first-name"
              id="pelcro-input-first-name"
              errorId="pelcro-input-first-name-error"
              label={t("gift.labels.firstName")}
            />
            <GiftCreateLastName
              wrapperClassName="plc-ml-3"
              autoComplete="last-name"
              id="pelcro-input-last-name"
              errorId="pelcro-input-last-name-error"
              label={t("gift.labels.lastName")}
            />
          </div>
          <div className="plc-flex plc-items-end">
            <GiftCreateEmail
              id="pelcro-input-email"
              errorId="pelcro-input-email-error"
              autoComplete="off"
              label={t("gift.labels.email")}
              required
            />
          </div>
          <p className="pelcro-footnote">
            * {t("gift.labels.required")}
          </p>
          <GiftCreateSubmitButton
            className="plc-mt-2"
            name={t("gift.buttons.gift")}
            id="pelcro-submit"
          />
        </GiftCreateContainer>
      </div>
    </div>
  );
};
