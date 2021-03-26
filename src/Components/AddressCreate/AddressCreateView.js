import React from "react";
import { useTranslation } from "react-i18next";
import { AddressCreateFirstName } from "./AddressCreateFirstName";
import { AddressCreateLastName } from "./AddressCreateLastName";
import { AddressCreateLine1 } from "./AddressCreateLine1";
import { AddressCreateCity } from "./AddressCreateCity";
import { AddressCreatePostalCode } from "./AddressCreatePostalCode";
import { AddressCreateSubmit } from "./AddressCreateSubmit";
import { AddressCreateContainer } from "./AddressCreateContainer";
import { AddressCreateCountrySelect } from "./AddressCreateCountrySelect";
import { AddressCreateStateSelect } from "./AddressCreateStateSelect";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";

export const AddressCreateView = (props) => {
  const { t } = useTranslation("address");
  return (
    <div id="pelcro-address-create-view">
      <div className="plc-flex plc-flex-col plc-items-center plc-text-lg plc-font-semibold plc-text-center pelcro-title-wrapper">
        <h4>{t("title")}</h4>
      </div>
      <div className="plc-mt-2 pelcro-form">
        <AddressCreateContainer {...props}>
          <AlertWithContext />
          <div className="plc-flex plc-space-x-3 plc-items-end">
            <AddressCreateFirstName
              id="pelcro-input-first-name"
              errorId="pelcro-input-first-name-error"
              required
              label={t("labels.firstName")}
            />
            <AddressCreateLastName
              id="pelcro-input-last-name"
              errorId="pelcro-input-last-name-error"
              required
              label={t("labels.lastName")}
            />
          </div>
          <div className="plc-flex plc-items-end">
            <AddressCreateLine1
              id="pelcro-input-line1"
              errorId="pelcro-input-line1-error"
              required
              label={t("labels.address")}
            />
          </div>
          <div className="plc-flex plc-space-x-3 plc-items-end">
            <AddressCreatePostalCode
              id="pelcro-input-postal-code"
              errorId="pelcro-input-postal-code-error"
              required
              label={t("labels.code")}
            />
            <AddressCreateCity
              id="pelcro-input-city"
              errorId="pelcro-input-city-error"
              label={t("labels.city")}
              required
            />
          </div>
          <div className="plc-flex plc-space-x-3 plc-items-end">
            <AddressCreateCountrySelect
              id="pelcro-input-country"
              errorId="pelcro-input-country-error"
              label={t("labels.country")}
              required
            />
            <AddressCreateStateSelect
              label={t("labels.region")}
              id="pelcro-input-state"
              errorId="pelcro-input-state-error"
              required
            />
          </div>
          <p className="pelcro-footnote">* {t("labels.required")}</p>
          <AddressCreateSubmit
            className="plc-mt-2"
            name={t("buttons.submit")}
            id="pelcro-submit"
          />
        </AddressCreateContainer>
      </div>
    </div>
  );
};
