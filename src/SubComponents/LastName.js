import React, { useContext } from "react";

export function LastName({ placeholder, style, className, id, store }) {
  const { dispatch, state } = useContext(store);

  const handleInputChange = value => {
    dispatch({ type: "setLastName", payload: value });
  };

  return (
    <input
      type="text"
      id={id}
      style={{ ...style }}
      className={className}
      value={state.lastName}
      onChange={e => handleInputChange(e.target.value)}
      placeholder={placeholder || "Enter Your Last Name"}
    ></input>
  );
}
