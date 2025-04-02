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
          <AddressSelectList type={props.type} />
          <div className="plc-flex plc-justify-center plc-mt-8">

            <AddressSelectSubmit
              type={props.type}
              role="submit"
              className="plc-w-full plc-rounded-lg plc-bg-primary-600 plc-text-white plc-font-medium plc-py-3 plc-transition-all hover:plc-bg-primary-700 hover:plc-shadow-md"
              name={t("buttons.selectAddress")}
              id="pelcro-submit"
            />
          </div>

          <Link
            id="pelcro-add-address"
            onClick={props.onAddNewAddress}
            className="plc-mt-4 plc-w-full plc-flex plc-justify-center plc-items-center plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-transition-all hover:plc-bg-white hover:plc-border-gray-800 hover:plc-shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="plc-h-5 plc-w-5 plc-mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t("buttons.addAddress")}
          </Link>

        </AddressSelectContainer>
      </form>
    </div>
  );
};
