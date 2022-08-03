import React from "react";
import { useTranslation } from "react-i18next";
import { AddressSelectContainer } from "./AddressSelectContainer";
import { AddressSelectList } from "./AddressSelectList";
import { AddressSelectSubmit } from "./AddressSelectSubmit";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";
import { Link } from "../../SubComponents/Link";

export const AddressSelectView = (props) => {
  const { t } = useTranslation("address");

  return (
    <div id="pelcro-address-select-view">
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <AddressSelectContainer {...props}>
          <AlertWithContext />
          <AddressSelectList />
          <div className="plc-flex plc-justify-center plc-mt-4">
            <Link
              id="pelcro-add-address"
              onClick={props.onAddNewAddress}
              className="plc-w-full plc-h-12 plc-flex plc-justify-center plc-border plc-items-center plc-border-solid plc-border-gray-300 plc-rounded plc-bg-white  hover:plc-border-primary-800"
            >
              {t("buttons.addAddress")}
            </Link>
          </div>
          <AddressSelectSubmit
            role="submit"
            className="plc-mt-4 plc-w-full"
            name={t("buttons.selectAddress")}
            id="pelcro-submit"
          />
        </AddressSelectContainer>
      </form>
    </div>
  );
};
