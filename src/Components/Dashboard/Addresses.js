import React, { useContext } from "react";
import { store } from "../PelcroContainer";
import { SET_VIEW } from "../../utils/action-types";

export const Addresses = () => {
  const { addresses } = window.Pelcro.user.read();
  const { dispatch } = useContext(store);

  const displayAddressEdit = e => {
    const selectedAddress = e.target.dataset.key;
    return dispatch({
      type: SET_VIEW,
      payload: { selectedAddress, view: "address-edit" }
    });
  };

  if (!addresses) return "";

  return addresses.map(address => {
    return (
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
    );
  });
};
