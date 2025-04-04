import React, { useState, useEffect } from "react";
import "./ToggleSwitch.css";

export const ToggleSwitch = ({ label, isActive, handleChange }) => {
  const [isToggled, setIsToggled] = useState(isActive ?? false);
  const onToggle = () => {
    setIsToggled(!isToggled);
    handleChange?.();
  };

  useEffect(() => {
    setIsToggled(isActive ?? false);
  }, [isActive]);

  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={isToggled}
        onChange={onToggle}
      />
      <span className={`switch ${isToggled ? 'plc-bg-primary-600' : ''}`} />
    </label>
  );
};
