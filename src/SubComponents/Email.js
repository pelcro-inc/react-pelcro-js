import React, { useContext } from "react";

export default function Email({ placeholder, styles, classNames, id, store }) {
  const { dispatch, state } = useContext(store);

  const handleInputChange = value => {
    dispatch({ type: "setEmail", payload: value });
  };

  return (
    <input
      type="text"
      id={id}
      style={{ ...styles }}
      className={classNames}
      value={state.email}
      onChange={e => handleInputChange(e.target.value)}
      placeholder={placeholder || "Enter Your Email"}
    ></input>
  );
}
