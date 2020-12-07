import React from "react";
import { useTranslation } from "react-i18next";
import ErrMessage from "../common/ErrMessage";
import { AddressCreateFirstName } from "./AddressCreateFirstName";
import { AddressCreateLastName } from "./AddressCreateLastName";
import { AddressCreateLine1 } from "./AddressCreateLine1";
import { AddressCreateCity } from "./AddressCreateCity";
import { AddressCreatePostalCode } from "./AddressCreatePostalCode";
import { AddressCreateSubmit } from "./AddressCreateSubmit";
import { AddressCreateContainer } from "./AddressCreateContainer";
import { AddressCreateCountrySelect } from "./AddressCreateCountrySelect";
import { AddressCreateStateSelect } from "./AddressCreateStateSelect";

export const AddressCreateView = (props) => {
  const { t } = useTranslation("address");
  return (
    <AddressCreateContainer {...props}>
      <div className="pelcro-prefix-title-clock">
        <h4>{t("title")}</h4>
      </div>

      <ErrMessage name="address" />

      <div className="pelcro-prefix-form">
        <div className="pelcro-prefix-row">
          <div className="col-md-6">
            <label
              className="pelcro-prefix-label"
              htmlFor="pelcro-input-first_name"
            >
              {t("labels.firstName")} *
            </label>
            <AddressCreateFirstName
              className="pelcro-prefix-input pelcro-prefix-form-control"
              autoComplete="first-name"
              id="pelcro-input-first_name"
              placeholder={t("labels.firstName")}
            />
          </div>
          <div className="col-md-6">
            <label
              className="pelcro-prefix-label"
              htmlFor="pelcro-input-last_name"
            >
              {t("labels.lastName")} *
            </label>
            <AddressCreateLastName
              className="pelcro-prefix-input pelcro-prefix-form-control"
              autoComplete="last-name"
              id="pelcro-input-last_name"
              placeholder={t("labels.lastName")}
            />
          </div>
        </div>
        <div className="pelcro-prefix-row">
          <div className="col-md-12">
            <label
              className="pelcro-prefix-label"
              htmlFor="pelcro-input-line1"
            >
              {t("labels.address")} *
            </label>
            <AddressCreateLine1
              className="pelcro-prefix-input pelcro-prefix-form-control"
              autoComplete="street-address"
              id="pelcro-input-line1"
              placeholder={t("labels.address")}
            />
          </div>
        </div>
        <div className="pelcro-prefix-row">
          <div className="col-md-6">
            <label
              className="pelcro-prefix-label"
              htmlFor="pelcro-input-postal_code"
            >
              {t("labels.code")} *
            </label>
            <AddressCreatePostalCode
              className="pelcro-prefix-input pelcro-prefix-form-control"
              autoComplete="postal-code"
              id="pelcro-input-postal_code"
              placeholder={t("labels.code")}
            />
          </div>
          <div className="col-md-6">
            <label
              className="pelcro-prefix-label"
              htmlFor="pelcro-input-city"
            >
              {t("labels.city")} *
            </label>
            <AddressCreateCity
              className="pelcro-prefix-input pelcro-prefix-form-control"
              autoComplete="address-level2"
              id="pelcro-input-city"
              placeholder={t("labels.city")}
            />
          </div>
        </div>
        <div className="pelcro-prefix-row">
          <div className="col-md-6">
            <label
              className="pelcro-prefix-label"
              htmlFor="pelcro-input-country"
            >
              {t("labels.country")} *
            </label>
            <AddressCreateCountrySelect
              className="pelcro-prefix-select pelcro-prefix-form-control"
              id="pelcro-input-country"
            />
          </div>
          <div className="col-md-6">
            <label
              className="pelcro-prefix-label"
              htmlFor="pelcro-input-region"
            >
              {t("labels.region")} *
            </label>
            <AddressCreateStateSelect
              className="pelcro-prefix-select pelcro-prefix-form-control"
              id="pelcro-input-state"
            />
          </div>
        </div>
        <small className="pelcro-prefix-footnote pelcro-prefix-form-text">
          * {t("labels.required")}
        </small>
        <AddressCreateSubmit
          name={t("buttons.submit")}
          id="address-submit"
        ></AddressCreateSubmit>
      </div>
    </AddressCreateContainer>
  );
};
