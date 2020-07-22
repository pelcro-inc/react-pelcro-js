import React from "react";
import Header from "../common/Header";
import { CartView } from "./CartView";

export const CartModal = props => {
  return (
    <div className="pelcro-prefix-view">
      <div
        className="pelcro-prefix-modal pelcro-prefix-fade pelcro-prefix-show"
        id="pelcro-view-cart"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div
          className="pelcro-prefix-modal-dialog pelcro-prefix-modal-dialog-centered"
          role="document"
        >
          <div className="pelcro-prefix-modal-content">
            <Header
              closeButton={true}
              resetView={() => props.setView("")}
              site={window.Pelcro.site.read()}
            ></Header>
            <CartView {...props} />
          </div>
        </div>
      </div>
    </div>
  );
};
