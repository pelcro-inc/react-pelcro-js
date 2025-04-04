import React from 'react';
import { ReactComponent as PlusIcon } from "../../assets/plus.svg";
import { Button } from '../../SubComponents/Button';

export const AddNew = ({ title, onClick , className }) => {

  const handleClick = () => {
    onClick?.()
  }
  return (
    <>
      {title && (
        <Button
          variant="solid"
          icon={<PlusIcon />}
          onClick={handleClick}
          className={`plc-group plc-relative plc-w-full plc-overflow-hidden 
          sm:plc-w-auto ${className}`}
        >
          {title}
        </Button>

      )}
    </>
  );
};