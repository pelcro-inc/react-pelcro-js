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
          <div className="plc-flex">
            <AddressCreateFirstName
              autoComplete="first-name"
              id="pelcro-input-first-name"
              errorId="pelcro-input-first-name-error"
              placeholder={t("labels.firstName")}
              required
              label={t("labels.firstName")}
            />
            <AddressCreateLastName
              wrapperClassName="plc-ml-3"
              autoComplete="last-name"
              id="pelcro-input-last-name"
              errorId="pelcro-input-last-name-error"
              required
              placeholder={t("labels.lastName")}
              label={t("labels.lastName")}
            />
          </div>
          <div className="plc-flex">
            <AddressCreateLine1
              autoComplete="street-address"
              id="pelcro-input-line1"
              errorId="pelcro-input-line1-error"
              required
              placeholder={t("labels.address")}
              label={t("labels.address")}
            />
          </div>
          <div className="plc-flex">
            <AddressCreatePostalCode
              autoComplete="postal-code"
              id="pelcro-input-postal-code"
              errorId="pelcro-input-postal-code-error"
              required
              placeholder={t("labels.code")}
              label={t("labels.code")}
            />
            <AddressCreateCity
              wrapperClassName="plc-ml-3"
              autoComplete="address-level2"
              id="pelcro-input-city"
              errorId="pelcro-input-city-error"
              placeholder={t("labels.city")}
              label={t("labels.city")}
              required
            />
          </div>
          <div className="plc-flex">
            <AddressCreateCountrySelect
              id="pelcro-input-country"
              errorId="pelcro-input-country-error"
              label={t("labels.country")}
              required
            />
            <AddressCreateStateSelect
              wrapperClassName="plc-ml-3"
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
