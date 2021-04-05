import React from "react";
import { useTranslation } from "react-i18next";
import { UserUpdateEmail } from "./UserUpdateEmail";
import { UserUpdateFirstName } from "./UserUpdateFirstName";
import { UserUpdateLastName } from "./UserUpdateLastName";
import { UserUpdatePhone } from "./UserUpdatePhone";
import { UserUpdateButton } from "./UserUpdateButton";
import { UserUpdateContainer } from "./UserUpdateContainer";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";

export const UserUpdateView = (props) => {
  const { t } = useTranslation("userEdit");

  return (
    <div id="pelcro-user-update-view">
      <div className="plc-mb-2 plc-text-center plc-text-gray-700 pelcro-title-wrapper">
        <h4 className="plc-text-xl plc-font-semibold">
          {t("labels.title")}
        </h4>
        <p>{t("labels.subtitle")}</p>
      </div>
      <form action="" className="plc-mt-2 pelcro-form">
        <UserUpdateContainer {...props}>
          <AlertWithContext />
          <div className="plc-flex plc-items-start">
            <UserUpdateEmail label={t("labels.email")} />
          </div>
          <div className="plc-flex plc-items-start">
            <UserUpdateFirstName
              autoComplete="first-name"
              id="pelcro-input-first-name"
              errorId="pelcro-input-first-name-error"
              label={t("labels.firstName")}
              autoFocus={true}
            />
            <UserUpdateLastName
              wrapperClassName="plc-ml-3"
              autoComplete="last-name"
              id="pelcro-input-last-name"
              errorId="pelcro-input-last-name-error"
              label={t("labels.lastName")}
            />
          </div>
          <div className="plc-flex plc-items-start">
            <UserUpdatePhone
              id="pelcro-input-phone"
              errorId="pelcro-input-phone-error"
              label={t("labels.phone")}
            />
          </div>
          <UserUpdateButton
            role="submit"
            className="plc-mt-2"
            name={t("labels.submit")}
            id="pelcro-submit"
          />
        </UserUpdateContainer>
      </form>
    </div>
  );
};
