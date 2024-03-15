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
    <div className="plc-overflow-y-auto plc-p-2 plc-max-h-80 pelcro-addresses-select-wrapper">
      {addresses
        .sort((a, b) =>
          a.is_default === b.is_default ? 0 : a.is_default ? -1 : 1
        )
        .map(
          (address) =>
            address.type === type && (
              <div
                key={address.id}
                className="plc-p-4 plc-mb-4 last:plc-mb-0 plc-rounded plc-text-gray-900 pelcro-address-wrapper plc-bg-white plc-shadow-md_dark"
              >
                <Radio
                  className="pelcro-select-address-radio plc-order-2"
                  labelClassName="plc-cursor-pointer plc-w-full plc-ml-0 plc-mr-2 plc-order-1"
                  id={`pelcro-address-select-${address.id}`}
                  name="address"
                  checked={
                    type == "shipping"
                      ? selectedAddressId === String(address.id)
                      : selectedBillingAddressId ===
                        String(address.id)
                  }
                  value={address.id}
                  onChange={handleAddressSelect}
                >
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
                </Radio>
              </div>
            )
        )}
    </div>
  );
};
