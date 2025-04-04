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
      className="plc-profile-menu-width"
      title={t("labels.addresses")}
      requestStates={requestStates}
    >
      <div className="plc-space-y-4">
        <AddressesItems
          requestStates={requestStates}
          setRequestStates={setRequestStates}
          displayAddressEdit={displayAddressEdit}
        />
        <AddNew
          title={t("labels.addAddress")}
          onClick={displayAddressCreate}
          className="plc-mt-4"
        />
      </div>
    </Card>
  );
};

const AddressesItems = (props) => {
  const { t } = useTranslation("dashboard");
  const addresses = window.Pelcro.user.read().addresses ?? [];

  if (addresses.length === 0) return null;

  return (
    <div className="plc-space-y-4">
      {addresses
        .sort((a, b) =>
          a.is_default === b.is_default ? 0 : a.is_default ? -1 : 1
        )
        .map((address, index) => (
          <div
            key={address.id}
            className={`plc-p-4 plc-rounded-lg plc-bg-white plc-shadow-sm plc-border ${address.is_default
              ? "plc-ring-2 plc-ring-primary-400"
              : "plc-border-gray-200"
              } plc-transition-all hover:plc-shadow-md`}
          >
            <div className="plc-flex plc-items-start plc-justify-between">
              <div className="plc-flex-1">
                <p className="plc-font-semibold plc-text-gray-900">
                  {address.first_name} {address.last_name}
                </p>
                {address.company && (
                  <p className="plc-text-sm plc-text-gray-600">
                    {address.company}
                  </p>
                )}
                <div className="plc-mt-2 plc-space-y-1 plc-text-sm plc-text-gray-500">
                  <p>{address.line1}</p>
                  <p>
                    {address.city}, {address.state_name} {address.postal_code}
                  </p>
                  <p>{address.country_name}</p>
                  {address.phone && <p>{address.phone}</p>}
                </div>
              </div>

              <div className="plc-flex plc-flex-col plc-items-end plc-space-y-2">
                <div className="plc-flex plc-items-center plc-space-x-2">
                  <span className="plc-px-3 plc-py-1 plc-text-xs plc-font-medium plc-rounded-full plc-bg-gray-100 plc-text-gray-600">
                    {address.type === "shipping"
                      ? t("labels.shipping")
                      : t("labels.billing")}
                  </span>
                  {address.is_default && (
                    <span className="plc-px-3 plc-py-1 plc-text-xs plc-font-medium plc-rounded-full plc-bg-gray-800 plc-text-white">
                      {t("labels.default")}
                    </span>
                  )}
                </div>
                <Button
                  variant="icon"
                  className="plc-text-gray-400 hover:plc-text-gray-600 plc-transition-colors"
                  icon={<EditIcon className="plc-w-5 plc-h-5" />}
                  id={`pelcro-button-update-address-${index}`}
                  data-key={address.id}
                  data-type={address.type}
                  onClick={props?.displayAddressEdit}
                />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

AddressesMenu.viewId = "addresses";
