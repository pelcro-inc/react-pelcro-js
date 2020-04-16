import React, { useContext } from "react";
import { AddressesListContainer, store } from "./AddressesListContainer";
import { SET_ADDRESS_ID } from "../../utils/action-types";

export const AddressesListView = (props) => {
  const { dispatch } = useContext(store);
  const { addresses } = window.Pelcro.user.read();

  const displayAddressEdit = (e) => {
    const selectedAddress = e.target.dataset.key;
    props.getAddressId(selectedAddress);
  };

  if (!addresses) {
    return (
      <div className="pelcro-prefix-dashboard-value">
        <button
          className="pelcro-prefix-link"
          type="button"
          onClick={() => props.setView("address")}
        >
          Add Address
        </button>
      </div>
    );
  }

  return (
    <AddressesListContainer setView={props.setView}>
      {addresses.map((address) => (
        <div key={"dashboard-address-" + address.id}>
          <span className="pelcro-prefix-dashboard-value">
            {address.line1} {address.line2}, {address.city}, {address.state},{" "}
            {address.country}
          </span>
          <div className="pelcro-prefix-dashboard-value">
            <button
              data-key={address.id}
              className="pelcro-prefix-link"
              type="button"
              onClick={displayAddressEdit}
            >
              Update Address
            </button>
          </div>
        </div>
      ))}
    </AddressesListContainer>
  );
};
