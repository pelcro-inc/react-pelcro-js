import React from "react";
import { ReactComponent as ChevronRight } from "../../assets/chevron-right.svg";

/**
 * @typedef {Object} DashboardLinkType
 * @property {boolean} [show=true] conditionally show the item, defaults to true
 * @property {string} name defined name for the item
 * @property {Element} icon icon element
 * @property {string} title item header title
 * @property {string} [badge] optional badge text (like "Active")
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
  badge,
  setActiveDashboardLink
}) => {
  const isActive = activeDashboardLink === name;

  return show ? (
    <div
      id={name}
      className={`plc-border-l-4 plc-border-transparent plc-border-solid plc-group
        ${isActive
          ? "plc-border-solid plc-bg-gray-200 plc-border-primary"
          : "hover:plc-bg-gray-100"
        }`}
    >
      <header
        onClick={() => setActiveDashboardLink(name)}
        className="plc-flex plc-items-center plc-justify-between plc-py-3 plc-px-4 plc-cursor-pointer plc-select-none sm:plc-px-6"
      >
        <span
          className={`plc-flex plc-text-base plc-items-center plc-gap-3 ${isActive ? "plc-text-primary plc-font-medium" : "plc-text-gray-800"
            }`}
        >
          {icon}
          {title}
        </span>
        <div className="plc-flex plc-items-center plc-gap-3">
          {badge && (
            <span className={`plc-text-sm plc-font-medium plc-px-3 plc-py-1 plc-rounded-full ${badge === "Active" ? "plc-bg-green-100 plc-text-green-700" : "plc-bg-gray-100 plc-text-gray-700"
              }`}>
              {badge}
            </span>
          )}
          <ChevronRight className="plc-w-5 plc-h-5 plc-text-gray-400" />
        </div>
      </header>
    </div>
  ) : null;
};
