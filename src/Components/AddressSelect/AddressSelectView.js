import React from "react";
import { useTranslation } from "react-i18next";
import { AddressSelectContainer } from "./AddressSelectContainer";
import { AddressSelectList } from "./AddressSelectList";
import { AddressSelectSubmit } from "./AddressSelectSubmit";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";
import { Button } from "../../SubComponents/Button";

export const AddressSelectView = (props) => {
  const { t } = useTranslation("address");

  return (
    <div id="pelcro-address-select-view">
      <div className="plc-mb-6 plc-text-center plc-text-gray-700 pelcro-title-wrapper">
        <h4 className="plc-text-2xl plc-font-semibold">
          {t("selectAddressTitle")}
        </h4>
        <p>{t("selectAddressSubtitle")}</p>
      </div>
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <AddressSelectContainer {...props}>
          <AlertWithContext />
          <AddressSelectList />
          <div className="plc-flex plc-justify-center plc-mt-4">
            <Button
              variant="outline"
              onClick={props.onAddNewAddress}
              id="pelcro-add-address"
            >
              {t("buttons.addAddress")}
            </Button>
          </div>
          <AddressSelectSubmit
            role="submit"
            className="plc-mt-4"
            name={t("buttons.selectAddress")}
            id="pelcro-submit"
          />
        </AddressSelectContainer>
      </form>
    </div>
  );
};
