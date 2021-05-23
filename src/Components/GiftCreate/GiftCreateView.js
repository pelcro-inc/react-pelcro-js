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
      <div className="plc-mb-6 plc-text-2xl plc-font-semibold plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4>{t("gift.titles.firstTitle")}</h4>
      </div>
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <GiftCreateContainer {...props}>
          <AlertWithContext />
          <div className="plc-flex plc-items-start">
            <GiftCreateFirstName
              autoComplete="first-name"
              id="pelcro-input-first-name"
              errorId="pelcro-input-first-name-error"
              label={t("gift.labels.firstName")}
              autoFocus={true}
            />
            <GiftCreateLastName
              wrapperClassName="plc-ml-3"
              autoComplete="last-name"
              id="pelcro-input-last-name"
              errorId="pelcro-input-last-name-error"
              label={t("gift.labels.lastName")}
            />
          </div>
          <div className="plc-flex plc-items-start">
            <GiftCreateEmail
              id="pelcro-input-email"
              errorId="pelcro-input-email-error"
              autoComplete="off"
              label={t("gift.labels.email")}
              required
            />
          </div>
          <p className="plc-text-gray-900 pelcro-footnote">
            * {t("gift.labels.required")}
          </p>
          <GiftCreateSubmitButton
            role="submit"
            className="plc-mt-2 plc-w-full"
            name={t("gift.buttons.gift")}
            id="pelcro-submit"
          />
        </GiftCreateContainer>
      </form>
    </div>
  );
};
