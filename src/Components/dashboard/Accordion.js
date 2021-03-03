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
      className={`border-l-2 border-transparent border-solid group
        ${
          isActive
            ? "border-solid bg-grey-200 border-primary-400"
            : "hover:bg-primary-50"
        }`}
    >
      <header className="flex items-center justify-between p-5 px-8 cursor-pointer select-none">
        <span
          className={`flex text-lg ${
            isActive ? "text-primary-400" : "text-gray-500"
          }`}
        >
          {icon}
          {title}
        </span>
        <div
          className={`flex items-center justify-center transition-transform ease-out transform rounded-full w-7 h-7 ${
            isActive
              ? "flex place-items-center w-7 h-7 p-1 bg-primary-400 rounded-full"
              : "group-hover:translate-x-1"
          }`}
        >
          <span
            className={`transition ease-out  ${
              isActive
                ? "text-white transform rotate-90"
                : "text-gray-600  group-hover:text-primary-400"
            }`}
          >
            <ChevronRightIcon />
          </span>
        </div>
      </header>

      <div
        className={`ml-8 overflow-auto transition-transform origin-right transform ${
          isActive ? "max-h-80 scale-x-100" : "max-h-0 scale-x-0"
        }`}
      >
        {content}
      </div>
    </div>
  );
};
