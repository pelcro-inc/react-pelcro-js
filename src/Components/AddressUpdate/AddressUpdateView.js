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
      <div className="plc-flex plc-flex-col plc-items-center plc-text-lg plc-font-semibold plc-text-center pelcro-title-wrapper">
        <h4>{t("title")}</h4>
      </div>
      <div className="plc-mt-2 pelcro-form">
        <AddressUpdateContainer {...props}>
          <AlertWithContext />
          <div className="plc-flex plc-space-x-3 plc-items-end">
            <AddressUpdateFirstName
              autoComplete="first-name"
              id="pelcro-input-first-name"
              errorId="pelcro-input-first-name-error"
              placeholder={t("labels.firstName")}
              label={t("labels.firstName")}
              required
            />
            <AddressUpdateLastName
              autoComplete="last-name"
              id="pelcro-input-last-name"
              errorId="pelcro-input-last-name-error"
              placeholder={t("labels.lastName")}
              label={t("labels.lastName")}
              required
            />
          </div>
          <div className="plc-flex plc-items-end">
            <AddressUpdateLine1
              autoComplete="street-address"
              id="pelcro-input-line1"
              errorId="pelcro-input-line1-error"
              placeholder={t("labels.address")}
              label={t("labels.address")}
              required
            />
          </div>
          <div className="plc-flex plc-space-x-3 plc-items-end">
            <AddressUpdatePostalCode
              autoComplete="postal-code"
              id="pelcro-input-postal_code"
              errorId="pelcro-input-postal-code-error"
              placeholder={t("labels.code")}
              label={t("labels.code")}
              required
            />
            <AddressUpdateCity
              autoComplete="address-level2"
              id="pelcro-input-city"
              errorId="pelcro-input-city-error"
              placeholder={t("labels.city")}
              label={t("labels.city")}
              required
            />
          </div>
          <div className="plc-flex plc-space-x-3 plc-items-end">
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
            className="plc-mt-2"
            name={t("buttons.submit")}
            id="pelcro-submit"
          />
        </AddressUpdateContainer>
      </div>
    </div>
  );
};
