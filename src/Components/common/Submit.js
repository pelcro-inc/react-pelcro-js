import React from "react";

const Submit = ({ disabled, id, text, onClick, style = {}, className }) => {
  return (
    <div className="submit">
      <button
        disabled={disabled}
        name="submit"
        style={style}
        className={`pelcro-prefix-btn ${className}`}
        id={id}
        type="submit"
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
};

export default Submit;
