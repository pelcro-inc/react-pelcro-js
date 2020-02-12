// Header of the modal window. Contains closing button and site name.

import React from "react";
import PropTypes from "prop-types";

const Header = props => {
  return (
    <div className="pelcro-prefix-header">
      {props.closeButton && (
        <button
          name="close"
          type="button"
          className="pelcro-prefix-close"
          aria-label="Close"
          onClick={props.resetView}
        >
          <span>&times;</span>
        </button>
      )}
      <div className="pelcro-prefix-modal-header">
        {props.site.logo && (
          <img
            alt="avatar"
            className="pelcro-prefix-site-logo"
            src={props.site.logo.url}
          ></img>
        )}
        <h3 className="pelcro-prefix-site-name"> {props.site.name}</h3>
      </div>
    </div>
  );
};

Header.propTypes = {
  closeButton: PropTypes.bool,
  resetView: PropTypes.func,
  site: PropTypes.object
};

export default Header;
