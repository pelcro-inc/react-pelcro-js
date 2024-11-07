import React from "react";
import { useTranslation } from "react-i18next";
import { GiftCreateContainer } from "./GiftCreateContainer";
import { GiftCreateSubmitButton } from "./GiftCreateSubmitButton";
import { GiftCreateEmail } from "./GiftCreateEmail";
import { GiftCreateFirstName } from "./GiftCreateFirstName";
import { GiftCreateLastName } from "./GiftCreateLastName";
import { GiftCreateStartDate } from "./GiftCreateStartDate";
import { GiftCreateMessage } from "./GiftCreateMessage";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";

export const GiftCreateView = (props) => {
  const { t } = useTranslation("register");
  return (
    <div id="pelcro-gift-create-view">
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <GiftCreateContainer {...props}>
          <AlertWithContext />
          <div className="plc-flex plc-items-start">
            <GiftCreateEmail
              id="pelcro-input-email"
              errorId="pelcro-input-email-error"
              autoComplete="off"
              label={t("gift.labels.email")}
              required
              autoFocus={true}
            />
          </div>
          <div className="plc-flex plc-items-start">
            <GiftCreateFirstName
              autoComplete="first-name"
              id="pelcro-input-first-name"
              errorId="pelcro-input-first-name-error"
              label={t("gift.labels.firstName")}
              initWithUserFirstName={false}
            />
            <GiftCreateLastName
              wrapperClassName="plc-ml-3"
              autoComplete="last-name"
              id="pelcro-input-last-name"
              errorId="pelcro-input-last-name-error"
              label={t("gift.labels.lastName")}
              initWithUserLastName={false}
            />
          </div>
          <div className="plc-flex plc-items-start">
            <GiftCreateStartDate
              autoComplete="start-date"
              id="pelcro-input-start-date"
              errorId="pelcro-input-start-date-error"
              label={t("gift.labels.startDate")}
            />
          </div>
          <div className="plc-flex plc-items-start">
            <GiftCreateMessage
              autoComplete="gift-message"
              id="pelcro-input-gift-message"
              errorId="pelcro-input-gift-message-error"
            />
          </div>

          <p className="plc-text-gray-900 pelcro-footnote">
            * {t("gift.labels.required")}
          </p>
          <GiftCreateSubmitButton
            role="submit"
            className="plc-w-full plc-mt-2"
            name={t("gift.buttons.gift")}
            id="pelcro-submit"
          />
        </GiftCreateContainer>
      </form>
    </div>
  );
};
