// Shows submit button on the modal window.

import React from "react";
import PropTypes from "prop-types";

const Submit = props => {
  return (
    <div className="submit">
      <button
        disabled={props.disabled}
        name="submit"
        className="pelcro-prefix-btn"
        id={props.id}
        type="submit"
        onClick={props.onClick}
      >
        {props.text}
      </button>
    </div>
  );
};

Submit.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string,
  id: PropTypes.string
};

export default Submit;
