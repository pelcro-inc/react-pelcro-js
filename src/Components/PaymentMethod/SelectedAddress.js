import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { store } from "./PaymentMethodContainer";
import { Button } from "../../SubComponents/Button";
import { usePelcro } from "../../hooks/usePelcro";

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
    <div className="plc-p-4 plc-my-4 last:plc-mb-0 plc-rounded plc-text-gray-900 pelcro-address-wrapper plc-shadow-md_dark plc-relative">
      {address && (
        <>
          <div
            className="pelcro-select-address-radio plc-order-2"
            id={`pelcro-address-select-${address.id}`}
            name="address"
          >
            <p className="pelcro-address-name plc-font-semibold">
              {t("labels.checkout.billingAddress")}
            </p>
            <p className="pelcro-address-company">
              {address.company}
            </p>
            <p className="pelcro-address-line1 plc-text-sm plc-mt-2">
              {address.line1}
            </p>
            <p className="pelcro-address-country plc-text-sm">
              {address.city}, {address.state_name}{" "}
              {address.postal_code}, {address.country_name}
            </p>
          </div>
          <Button
            onClick={onAddNewAddress}
            disabled={isLoading}
            variant="ghost"
            className="plc-text-primary-500 plc-absolute plc-top-4 plc-right-5"
          >
            {t("labels.checkout.changeBillingAddress")}
          </Button>
        </>
      )}

      {!address && (
        <>
          <div
            className="pelcro-select-address-radio plc-order-2"
            id={`pelcro-address-select-${address?.id}`}
            name="address"
          >
            <p className="pelcro-address-name plc-font-semibold">
              {t("labels.checkout.NoBillingAddress")}
            </p>
          </div>
          <Button
            onClick={onAddNewAddress}
            disabled={isLoading}
            variant="ghost"
            className="plc-text-primary-500 plc-absolute plc-top-4 plc-right-5"
          >
            {t("labels.checkout.addNewAddress")}
          </Button>
        </>
      )}
    </div>
  );
};
