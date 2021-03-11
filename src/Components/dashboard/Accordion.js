import React, { useState } from "react";
import { ReactComponent as ChevronRightIcon } from "../../assets/chevron-right.svg";

/**
 * @typedef {Object} AccordionPropsType
 * @property {string} initialActiveMenu the default active menu
 */

/**
 * Accordion component
 * @param {AccordionPropsType} AccordionProps
 */
export const Accordion = ({ children, initialActiveMenu }) => {
  const [activeMenu, setActiveMenu] = useState(initialActiveMenu);

  return React.Children.map(children, (child, i) =>
    React.cloneElement(child, {
      activeMenu,
      setActiveMenu,
      key: i
    })
  );
};

/**
 * @typedef {Object} AccordionItemPropsType
 * @property {string} name defined name for the item
 * @property {Element} icon icon element
 * @property {string} title item header title
 * @property {Element} content content element
 * @property {string} activeMenu the default active menu [PASSED IMPLICITLY BY ACCORDION]
 * @property {(name: string) => void} setActiveMenu active menu setter [PASSED IMPLICITLY BY ACCORDION]
 */

/**
 * Accordion component
 * @param {AccordionItemPropsType} AccordionProps
 */
Accordion.item = function AccordionItem({
  name,
  icon,
  title,
  content,
  activeMenu,
  setActiveMenu
}) {
  const isActive = activeMenu === name;
  return (
    <div
      onClick={() => setActiveMenu(name)}
      id={name}
      className={`plc-border-l-2 plc-border-transparent plc-border-solid plc-group
        ${
          isActive
            ? "plc-border-solid plc-bg-grey-200 plc-border-primary-400"
            : "hover:plc-bg-primary-50"
        }`}
    >
      <header className="plc-flex plc-items-center plc-justify-between plc-p-5 plc-px-8 plc-cursor-pointer plc-select-none">
        <span
          className={`plc-flex plc-text-lg ${
            isActive ? "plc-text-primary-400" : "plc-text-gray-500"
          }`}
        >
          {icon}
          {title}
        </span>
        <div
          className={`plc-flex plc-items-center plc-justify-center plc-transition-transform plc-ease-out plc-transform plc-rounded-full plc-w-7 plc-h-7 ${
            isActive
              ? "plc-flex plc-place-items-center plc-w-7 plc-h-7 plc-p-1 plc-bg-primary-400 plc-rounded-full"
              : "group-hover:plc-translate-x-1"
          }`}
        >
          <span
            className={`plc-transition plc-ease-out  ${
              isActive
                ? "plc-text-white plc-transform plc-rotate-90"
                : "plc-text-gray-600  group-hover:plc-text-primary-400"
            }`}
          >
            <ChevronRightIcon />
          </span>
        </div>
      </header>

      <div
        className={`plc-ml-8 plc-overflow-auto plc-transition-transform plc-origin-right plc-transform ${
          isActive
            ? "plc-max-h-80 plc-scale-x-100"
            : "plc-max-h-0 plc-scale-x-0"
        }`}
      >
        {content}
      </div>
    </div>
  );
};
