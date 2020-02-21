// Meter view.
// Shows popup in the lower right if the user is not subsctibed to the site.
// It prompts the user to subscribe (go to Select view) or login (go to Login view).

import React from "react";
import PropTypes from "prop-types";
import { MeterView } from "./MeterView";

export const MeterModal = props => (
  <div className="pelcro-prefix-view">
    <div
      id="pelcro-view-meter"
      className="col-sm-4 col-md-3"
      data-animation="from-bottom"
      data-autoshow="200"
    >
      <button
        type="button"
        className="pelcro-prefix-close"
        aria-label="Close"
        onClick={props.resetView}
      >
        <span>&times;</span>
      </button>
      <div>
        <MeterView {...props} />
      </div>
    </div>
  </div>
);

MeterModal.propTypes = {
  plan: PropTypes.object,
  product: PropTypes.object,
  resetView: PropTypes.func
};
