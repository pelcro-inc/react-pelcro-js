import React, { useContext } from "react";
import { Radio } from "../../SubComponents/Radio";
import {
  SELECT_ADDRESS,
  SELECT_BILLING_ADDRESS
} from "../../utils/action-types";
import { store } from "./AddressSelectContainer";

export const AddressSelectList = ({ type = "shipping" }) => {
  const {
    dispatch,
    state: { addresses, selectedAddressId, selectedBillingAddressId }
  } = useContext(store);

  const handleAddressSelect = (event) => {
    if (type == "shipping") {
      dispatch({ type: SELECT_ADDRESS, payload: event.target.value });
    } else {
      dispatch({
        type: SELECT_BILLING_ADDRESS,
        payload: event.target.value
      });
    }
  };

  return (
    <div className="plc-overflow-y-auto  plc-max-h-96 pelcro-addresses-select-wrapper  plc-rounded-lg plc-my-6">
      {addresses.length === 0 ? (
        <div className="plc-text-center plc-py-6 plc-text-gray-500">
          No {type} addresses found.
        </div>
      ) : (
        addresses
          .sort((a, b) =>
            a.is_default === b.is_default ? 0 : a.is_default ? -1 : 1
          )
          .map(
            (address) =>
              address.type === type && (
                <div
                  key={address.id}
                  className={`plc-p-4 plc-mb-4 last:plc-mb-0 plc-rounded-lg plc-text-gray-900 pelcro-address-wrapper plc-bg-white plc-shadow-sm plc-border-2 plc-border-gray-200 hover:plc-border-primary-600 hover:plc-shadow-md transition-all ${(type === "shipping" ? selectedAddressId : selectedBillingAddressId) ===
                        String(address.id) ? "plc-border-primary-600" : ""
                    }`}
                >
                  <Radio
                    className="pelcro-select-address-radio plc-order-2"
                    labelClassName="plc-cursor-pointer plc-w-full plc-ml-0 plc-mr-2 plc-order-1"
                    id={`pelcro-address-select-${address.id}`}
                    name="address"
                    checked={
                      type === "shipping"
                        ? selectedAddressId === String(address.id)
                        : selectedBillingAddressId === String(address.id)
                    }
                    value={address.id}
                    onChange={handleAddressSelect}
                  >
                    <div className="plc-flex plc-justify-between plc-items-start">
                      <p className="pelcro-address-name plc-font-semibold plc-text-lg">
                        {address.first_name} {address.last_name}
                      </p>
                      {address.is_default && (
                        <span className="plc-bg-primary-600 plc-text-white plc-text-xs plc-px-2 plc-py-1 plc-rounded">
                          Default
                        </span>
                      )}
                    </div>
                    {address.company && (
                      <p className="pelcro-address-company plc-text-gray-700">
                        {address.company}
                      </p>
                    )}
                    <div className="plc-mt-3 plc-text-gray-600">
                      <p className="pelcro-address-line1 plc-text-sm">
                        {address.line1}
                      </p>
                      <p className="pelcro-address-country plc-text-sm">
                        {address.city}, {address.state_name}{" "}
                        {address.postal_code}, {address.country_name}
                      </p>
                      {address?.phone && (
                        <p className="pelcro-address-phone plc-text-sm plc-mt-1">
                          📞 {address.phone}
                        </p>
                      )}
                    </div>
                  </Radio>
                </div>
              )
          )
      )}
    </div>
  );
};
