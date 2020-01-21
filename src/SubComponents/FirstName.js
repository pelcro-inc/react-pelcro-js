import React, { useContext } from "react";

export function FirstName({ placeholder, style, className, id, store }) {
  const { dispatch, state } = useContext(store);

  const handleInputChange = value => {
    dispatch({ type: "setFirstName", payload: value });
  };

  return (
    <input
      type="text"
      id={id}
      style={{ ...style }}
      className={className}
      value={state.firstName}
      onChange={e => handleInputChange(e.target.value)}
      placeholder={placeholder || "Enter Your First Name"}
    ></input>
  );
}
