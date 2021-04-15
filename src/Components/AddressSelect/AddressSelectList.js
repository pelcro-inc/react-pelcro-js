import React, { useContext } from "react";
import { Radio } from "../../SubComponents/Radio";
import { SELECT_ADDRESS } from "../../utils/action-types";
import { store } from "./AddressSelectContainer";

export const AddressSelectList = () => {
  const {
    dispatch,
    state: { addresses, selectedAddressId }
  } = useContext(store);

  const handleAddressSelect = (event) => {
    dispatch({ type: SELECT_ADDRESS, payload: event.target.value });
  };

  return (
    <div className="plc-overflow-y-scroll plc-max-h-80 pelcro-addresses-select-wrapper">
      {addresses.map((address) => (
        <div
          key={address.id}
          className="plc-p-2 plc-mx-3 plc-mt-2 plc-border plc-border-gray-400 plc-border-solid plc-rounded pelcro-address-wrapper"
        >
          <Radio
            inputClassName="plc-self-start pelcro-select-address-radio"
            labelClassName="plc-cursor-pointer plc-w-full"
            id={`pelcro-address-select-${address.id}`}
            name="address"
            checked={selectedAddressId === String(address.id)}
            value={address.id}
            onChange={handleAddressSelect}
          >
            <p className="pelcro-address-name">
              {address.first_name} {address.last_name}
            </p>
            <p className="pelcro-address-company">
              {address.company}
            </p>
            <p className="pelcro-address-line1">{address.line1}</p>
            <p className="pelcro-address-country">
              {address.city}, {address.state_name}{" "}
              {address.postal_code}, {address.country_name}
            </p>
          </Radio>
        </div>
      ))}
    </div>
  );
};
