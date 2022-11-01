import React from 'react';
import { ReactComponent as PlusIcon } from "../../assets/plus.svg";

export const AddNew = ({ title, onClick }) => {

  const handleClick = () => {
    onClick?.()
  }

  return (
    <>
      {title && (
        <div className="plc-mt-5 plc-relative plc-text-primary-500">
          <hr className="plc-absolute plc-border-t-2 plc-my-4 plc-top-1.5 plc-w-full" />
          <button onClick={handleClick}className="plc-bg-white plc-flex plc-items-center plc-mx-auto plc-p-2 plc-relative focus-within:plc-outline-none">
            <PlusIcon className="plc-w-4 plc-h-4 plc-mr-1" />
            <span>{title}</span>
          </button>
        </div>
      )}
    </>
  );
};