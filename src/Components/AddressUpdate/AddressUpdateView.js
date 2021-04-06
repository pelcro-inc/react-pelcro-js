import React from "react";
import { useTranslation } from "react-i18next";
import { AddressUpdateFirstName } from "./AddressUpdateFirstName";
import { AddressUpdateLastName } from "./AddressUpdateLastName";
import { AddressUpdateLine1 } from "./AddressUpdateLine1";
import { AddressUpdateCity } from "./AddressUpdateCity";
import { AddressUpdatePostalCode } from "./AddressUpdatePostalCode";
import { AddressUpdateSubmit } from "./AddressUpdateSubmit";
import { AddressUpdateContainer } from "./AddressUpdateContainer";
import { AddressUpdateCountrySelect } from "./AddressUpdateCountrySelect";
import { AddressUpdateStateSelect } from "./AddressUpdateStateSelect";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";

export const AddressUpdateView = (props) => {
  const { t } = useTranslation("address");

  return (
    <div id="pelcro-address-update-view">
      <div className="plc-mb-4 plc-text-2xl plc-font-semibold plc-text-center plc-text-gray-700 pelcro-title-wrapper">
        <h4>{t("title")}</h4>
      </div>
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <AddressUpdateContainer {...props}>
          <AlertWithContext />
          <div className="plc-flex plc-space-x-3 plc-items-start">
            <AddressUpdateFirstName
              id="pelcro-input-first-name"
              errorId="pelcro-input-first-name-error"
              label={t("labels.firstName")}
              required
              autoFocus={true}
            />
            <AddressUpdateLastName
              id="pelcro-input-last-name"
              errorId="pelcro-input-last-name-error"
              label={t("labels.lastName")}
              required
            />
          </div>
          <div className="plc-flex plc-items-start">
            <AddressUpdateLine1
              id="pelcro-input-line1"
              errorId="pelcro-input-line1-error"
              label={t("labels.address")}
              required
            />
          </div>
          <div className="plc-flex plc-space-x-3 plc-items-start">
            <AddressUpdatePostalCode
              id="pelcro-input-postal_code"
              errorId="pelcro-input-postal-code-error"
              label={t("labels.code")}
              required
            />
            <AddressUpdateCity
              id="pelcro-input-city"
              errorId="pelcro-input-city-error"
              label={t("labels.city")}
              required
            />
          </div>
          <div className="plc-flex plc-space-x-3 plc-items-start">
            <AddressUpdateCountrySelect
              id="pelcro-input-country"
              errorId="pelcro-input-country-error"
              label={t("labels.country")}
              required
            />
            <AddressUpdateStateSelect
              id="pelcro-input-state"
              errorId="pelcro-input-state-error"
              label={t("labels.region")}
              required
            />
          </div>
          <p className="pelcro-footnote">* {t("labels.required")}</p>
          <AddressUpdateSubmit
            role="submit"
            className="plc-mt-2"
            name={t("buttons.submit")}
            id="pelcro-submit"
          />
        </AddressUpdateContainer>
      </form>
    </div>
  );
};
