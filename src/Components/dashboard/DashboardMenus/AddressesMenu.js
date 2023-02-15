import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as EditIcon } from "../../../assets/edit.svg";
import { usePelcro } from "../../../hooks/usePelcro";
import { Card } from "../Card";
import { AddNew } from "../AddNew";
import { Button } from "../../../SubComponents/Button";

export const AddressesMenu = (props) => {
  const { t } = useTranslation("dashboard");
  const [requestStates, setRequestStates] = useState({
    loading: false,
    success: false,
    failed: false
  });

  return (
    <Card
      id="pelcro-dashboard-addresses-menu"
      className="plc-max-w-100% md:plc-max-w-80% plc-m-auto"
      title={t("labels.addresses")}
      requestStates={requestStates}
    >
      <AddressesItems
        requestStates={requestStates}
        setRequestStates={setRequestStates}
        displayAddressEdit={props?.displayAddressEdit}
      />
      <AddNew
        title={t("labels.addAddress")}
        onClick={() => props?.displayAddressCreate()}
      />
    </Card>
  );
};

const AddressesItems = (props) => {
  const { t } = useTranslation("dashboard");
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const allAddresses = window.Pelcro.user.read().addresses ?? [];

  const getDefaultAddress = (addresses) => {
    return addresses.find((address) => address.is_default) || false;
  };

  const moveDefaultAddressToStart = (addresses) => {
    const defaultAddress = getDefaultAddress(addresses);
    const addressesWithoutDefault = addresses.filter(
      (address) => !address.is_default
    );

    return [defaultAddress, ...addressesWithoutDefault];
  };

  const addresses = moveDefaultAddressToStart(allAddresses);

  if (addresses.length === 0) return null;

  useEffect(() => {
    setSelectedAddressId(String(getDefaultAddress(addresses)?.id));
  }, []);

  return addresses.map(
    (address, index) =>
      address.type === "shipping" && (
        <div
          key={address.id}
          className={`plc-py-2 plc-px-4 plc-mt-5 plc-flex plc-items-center plc-justify-between last:plc-mb-0 plc-rounded plc-text-gray-900 pelcro-address-wrapper plc-bg-white plc-shadow-md_dark ${
            selectedAddressId === String(address.id) &&
            `plc-border-primary-400 plc-border-2`
          }`}
        >
          <div className="plc-flex-1 plc-relative">
            <p className="pelcro-address-name plc-font-semibold">
              {address.first_name} {address.last_name}
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
            {address.is_default && (
              <span className="plc-rounded-full plc-bg-gray-800 plc-text-white plc-inline-flex plc-items-start plc-py-1 plc-px-4 plc-text-sm plc-mt-4">
                {t("labels.default")}
              </span>
            )}
          </div>
          <Button
            variant="icon"
            className="plc-text-gray-500"
            icon={<EditIcon />}
            id={"pelcro-button-update-address-" + index}
            data-key={address.id}
            onClick={props?.displayAddressEdit}
          ></Button>
        </div>
      )
  );
};
