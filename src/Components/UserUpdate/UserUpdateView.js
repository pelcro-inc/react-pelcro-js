import React from "react";
import { useTranslation } from "react-i18next";
import { UserUpdateEmail } from "./UserUpdateEmail";
import { UserUpdateFirstName } from "./UserUpdateFirstName";
import { UserUpdateLastName } from "./UserUpdateLastName";
import { UserUpdatePhone } from "./UserUpdatePhone";
import { UserUpdateButton } from "./UserUpdateButton";
import { UserUpdateUsername } from "./UserUpdateUsername";
import { UserUpdateContainer } from "./UserUpdateContainer";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";
import { UserUpdateProfilePic } from "./UserUpdateProfilePic";
import { UserUpdateTin } from "./UserUpdateTin";
import { UserUpdateDisplayName } from "./UserUpdateDisplayName";

export const UserUpdateView = (props) => {
  const { t } = useTranslation("userEdit");
  const supportsTap = Boolean(
    window.Pelcro.site.read()?.tap_gateway_settings
  );
  const showUsernameInput = window.Pelcro?.uiSettings?.enableLoginWithUsername;

  return (
    <div id="pelcro-user-update-view">
      <div className="plc-mb-6 plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4 className="plc-text-2xl plc-font-semibold">
          {t("labels.title")}
        </h4>
        <p>{t("labels.subtitle")}</p>
      </div>
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <UserUpdateContainer {...props}>
          <AlertWithContext />
          <UserUpdateProfilePic onClick={props.onPictureClick} />

          <UserUpdateEmail />

          <div className="plc-flex plc-items-start">
            <UserUpdateFirstName
              autoComplete="first-name"
              id="pelcro-input-first-name"
              errorId="pelcro-input-first-name-error"
              label={t("labels.firstName")}
              autoFocus={true}
              required={supportsTap ? true : false}
            />
            <UserUpdateLastName
              wrapperClassName="plc-ml-3"
              autoComplete="last-name"
              id="pelcro-input-last-name"
              errorId="pelcro-input-last-name-error"
              label={t("labels.lastName")}
              required={supportsTap ? true : false}
            />
          </div>
          <UserUpdateDisplayName
            id="pelcro-input-display-name"
            autoComplete="display-name"
            errorId="pelcro-input-display-name-error"
            label={t("labels.displayname")}
          />
          {showUsernameInput && (
            <UserUpdateUsername
              id="pelcro-input-user-name"
              autoComplete="user-name"
              errorId="pelcro-input-user-name-error"
              label={t("labels.username")}
            />
          )}
          <div className="plc-flex plc-items-start">
            <UserUpdatePhone
              id="pelcro-input-phone"
              errorId="pelcro-input-phone-error"
              label={t("labels.phone")}
              required={supportsTap ? true : false}
            />
          </div>
          <div className="plc-flex plc-items-start">
            <UserUpdateTin
              id="pelcro-input-tin"
              label={t("labels.tin")}
            />
          </div>
          <UserUpdateButton
            role="submit"
            className="plc-w-full plc-mt-2"
            name={t("labels.submit")}
            id="pelcro-submit"
          />
        </UserUpdateContainer>
      </form>
    </div>
  );
};
