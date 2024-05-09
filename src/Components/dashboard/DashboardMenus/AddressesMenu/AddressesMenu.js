import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as EditIcon } from "../../../../assets/edit.svg";
import { usePelcro } from "../../../../hooks/usePelcro";
import { Card } from "../../Card";
import { AddNew } from "../../AddNew";
import { Button } from "../../../../SubComponents/Button";

export const AddressesMenu = (props) => {
  const { t } = useTranslation("dashboard");
  const { switchDashboardView, set } = usePelcro();
  const [requestStates, setRequestStates] = useState({
    loading: false,
    success: false,
    failed: false
  });

  const displayAddressCreate = () => {
    return switchDashboardView("address-create");
  };

  const displayAddressEdit = (e) => {
    const addressId = e.currentTarget.dataset.key;
    const addressType = e.currentTarget.dataset.type;
    set({ addressIdToEdit: addressId });
    if (addressType === "shipping") {
      return switchDashboardView("address-edit");
    }

    if (addressType === "billing") {
      return switchDashboardView("billing-address-edit");
    }
  };

  return (
    <Card
      id="pelcro-dashboard-addresses-menu"
      className="plc-max-w-100% md:plc-max-w-60% plc-m-auto"
      title={t("labels.addresses")}
      requestStates={requestStates}
    >
      <AddressesItems
        requestStates={requestStates}
        setRequestStates={setRequestStates}
        displayAddressEdit={displayAddressEdit}
      />
      <AddNew
        title={t("labels.addAddress")}
        onClick={displayAddressCreate}
      />
    </Card>
  );
};

const AddressesItems = (props) => {
  const { t } = useTranslation("dashboard");
  // const [selectedAddressId, setSelectedAddressId] = useState(null);
  const addresses = window.Pelcro.user.read().addresses ?? [];

  // useEffect(() => {
  //   setSelectedAddressId(
  //     String(getDefaultShippingAddress(addresses)?.id)
  //   );
  // }, []);

  // const getDefaultShippingAddress = (addresses) => {
  //   return (
  //     addresses.find(
  //       (address) => address.type == "shipping" && address.is_default
  //     ) || false
  //   );
  // };

  // const getDefaultBillingAddress = (addresses) => {
  //   return (
  //     addresses.find(
  //       (address) => address.type == "billing" && address.is_default
  //     ) || false
  //   );
  // };

  // const moveDefaultAddressToStart = (addresses) => {
  //   const defaultShippingAddress =
  //     getDefaultShippingAddress(addresses);
  //   const defaultBillingAddress = getDefaultBillingAddress(addresses);
  //   const addressesWithoutDefault = addresses.filter(
  //     (address) => !address.is_default
  //   );

  //   return [
  //     defaultShippingAddress,
  //     defaultBillingAddress,
  //     ...addressesWithoutDefault
  //   ];
  // };

  // const addresses = moveDefaultAddressToStart(allAddresses);

  if (addresses.length === 0) return null;

  return addresses
    .sort((a, b) =>
      a.is_default === b.is_default ? 0 : a.is_default ? -1 : 1
    )
    .map((address, index) => (
      <div
        key={address.id}
        className="plc-py-2 plc-px-4 plc-mt-5 plc-flex plc-items-center plc-justify-between last:plc-mb-0 plc-rounded plc-text-gray-900 pelcro-address-wrapper plc-bg-white plc-shadow-md_dark"
      >
        <div className="plc-flex-1 plc-relative">
          <p className="pelcro-address-name plc-font-semibold">
            {address.first_name} {address.last_name}
          </p>
          <p className="pelcro-address-company">{address.company}</p>
          <p className="pelcro-address-line1 plc-text-sm plc-mt-2">
            {address.line1}
          </p>
          <p className="pelcro-address-country plc-text-sm">
            {address.city}, {address.state_name} {address.postal_code}
            , {address.country_name}
          </p>
        </div>
        <span className="plc-rounded-full plc-bg-gray-200 plc-text-black plc-inline-flex plc-items-start plc-py-1 plc-px-4 plc-text-sm plc-capitalize">
          {address.type === "shipping"
            ? t("labels.shipping")
            : t("labels.billing")}
        </span>
        {address.is_default && (
          <span className="plc-rounded-full plc-bg-gray-800 plc-text-white plc-inline-flex plc-items-start plc-py-1 plc-px-4 plc-text-sm plc-mr-4 plc-ml-2">
            {t("labels.default")}
          </span>
        )}

        <Button
          variant="icon"
          className="plc-text-gray-500"
          icon={<EditIcon />}
          id={"pelcro-button-update-address-" + index}
          data-key={address.id}
          data-type={address.type}
          onClick={props?.displayAddressEdit}
        ></Button>
      </div>
    ));
};

AddressesMenu.viewId = "addresses";
