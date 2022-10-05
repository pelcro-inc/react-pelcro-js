import React, { useState } from "react";


/**
 * @typedef {Object} DashboardLinkType
 * @property {boolean} [show=true] conditionally show the item, defaults to true
 * @property {string} name defined name for the item
 * @property {Element} icon icon element
 * @property {string} title item header title
 * @property {onClick} onClick function will be called on click
 */

/**
 * DashboardLink component
 * @param {DashboardLinkType} DashboardLink
 * @return {JSX}
 */
export const DashboardLink = ({
  show = true,
  activeDashboardLink,
  name,
  icon,
  title,
  setActiveDashboardLink
}) => {

  const isActive = activeDashboardLink === name;

  return show ? (
    <div
      id={name}
      className={`plc-border-l-4 plc-border-transparent plc-border-solid plc-group
        ${
          isActive
            ? "plc-border-solid plc-bg-grey-200 plc-border-primary-400"
            : "hover:plc-bg-gray-100"
        }`}
    >
      <header
        onClick={() => setActiveDashboardLink(name)}
        className="plc-flex plc-items-center plc-justify-between plc-p-5 plc-px-4 plc-cursor-pointer plc-select-none sm:plc-px-8"
      >
        <span
          className={`plc-flex plc-text-lg plc-items-center ${
            isActive ? "plc-text-primary-400" : "plc-text-gray-500"
          }`}
        >
          {icon}
          {title}
        </span>
      </header>
    </div>
  ) : null;
};
