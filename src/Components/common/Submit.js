import React from "react";

/**
 * use atomic Button instead please
 */
const Submit = ({ disabled, id, text, onClick, className }) => {
  return (
    <div className="submit">
      <button
        name="submit"
        style={style}
        className={`pelcro-prefix-btn ${className}`}
        type="submit"
      >
        {text}
      </button>
    </div>
  );
};

export default Submit;
