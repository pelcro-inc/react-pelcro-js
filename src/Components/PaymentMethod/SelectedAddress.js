import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { store } from "./PaymentMethodContainer";
import { Button } from "../../SubComponents/Button";
import { usePelcro } from "../../hooks/usePelcro";
import { ReactComponent as ArrowRight } from "../../assets/edit.svg";

export const SelectedAddress = ({ type }) => {
  const { t } = useTranslation("payment");
  const {
    state: { isLoading }
  } = useContext(store);
  const { switchView, set, selectedBillingAddressId } = usePelcro();

  const { addresses } = window?.Pelcro?.user?.read() ?? [];

  const address = selectedBillingAddressId
    ? addresses?.find(
      (address) => address.id == selectedBillingAddressId
    ) ?? null
    : addresses?.find(
      (address) => address.type == "billing" && address.is_default
    ) ?? null;

  const onAddNewAddress = () => {
    set({ flow: type });
    if (address) {
      switchView("billing-address-select");
    } else {
      switchView("billing-address-create");
    }
  };

  return (
    <div className="plc-p-3 plc-my-5 last:plc-mb-0 plc-rounded-lg plc-text-gray-800 pelcro-address-wrapper  plc-relative plc-bg-white plc-border plc-border-gray-200 plc-transition-all plc-duration-300">
      {address && (
        <div className="">
          <div className="plc-flex plc-flex-col plc-gap-2">
            <div className="plc-flex plc-justify-between plc-items-center plc-w-full">
              <h3 className="plc-text-lg plc-font-semibold plc-text-primary-600 plc-w-full">
                {t("labels.checkout.billingAddress")}
              </h3>
              <Button
                onClick={onAddNewAddress}
                disabled={isLoading}
                variant="ghost"
                className="plc-text-primary-600 plc-font-medium plc-flex plc-items-center plc-gap-1 plc-hover:bg-blue-50 plc-transition-colors plc-duration-200 plc-py-1.5 plc-rounded-md 
                plc-w-fit plc-align-right plc-underline
                "
              >
                <span className="plc-hidden sm:plc-inline">{t("labels.checkout.changeBillingAddress")}</span>
                <span className="sm:plc-hidden">Change</span>
                <ArrowRight className="plc-w-4 plc-h-4" />
              </Button>
            </div>
            <div className="plc-space-y-1 plc-text-gray-700">
              {address.company && (
                <p className="plc-text-sm plc-font-medium">{address.company}</p>
              )}
              <p className="plc-text-sm">
                {address.first_name} {address.last_name}
              </p>
              <p className="plc-text-sm">{address.line1}</p>
              <p className="plc-text-sm plc-text-gray-500">
                {address.city}, {address.state} {address.postal_code}, {address.country}
                {address?.phone && `, ${address.phone}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {!address && (
        <>
          <div
            className="pelcro-select-address-radio plc-order-2 plc-flex plc-flex-col plc-items-center plc-justify-center "
            id={`pelcro-address-select-${address?.id}`}
            name="address"
          >
            <p className="pelcro-address-name plc-font-bold plc-text-md plc-text-gray-600 plc-mb-1">
              {t("labels.checkout.NoBillingAddress")}
            </p>
            <Button
              onClick={onAddNewAddress}
              disabled={isLoading}
              variant="ghost"
              className="plc-mt-1 plc-text-primary-500 plc-font-semibold hover:plc-text-primary-600 plc-transition-colors plc-duration-200 plc-underline plc-text-base"
            >
              {t("labels.checkout.addNewAddress")}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
