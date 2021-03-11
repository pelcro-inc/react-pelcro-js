// Meter view.
// Shows popup in the lower right if the user is not subsctibed to the site.
// It prompts the user to subscribe (go to Select view) or login (go to Login view).

import React from "react";
import PropTypes from "prop-types";
import { MeterView } from "./MeterView";

export const MeterModal = (props) => (
  <div
    id="pelcro-view-meter"
    className="fixed bottom-0 right-0 w-full p-4 bg-white border-t-4 rounded shadow-md motion-safe:animate-slideInBottom sm:m-4 sm:max-w-md z-max border-primary-500"
  >
    <button
      type="button"
      className="absolute top-0 text-2xl text-gray-500 right-1 pelcro-close-btn"
      aria-label="Close"
      onClick={props.onClose}
    >
      <span>×</span>
    </button>
    <div>
      <MeterView {...props} />
    </div>
  </div>
);

MeterModal.propTypes = {
  plan: PropTypes.object,
  product: PropTypes.object,
  onClose: PropTypes.func
};
