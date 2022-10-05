import React from 'react';

export const Card = ({ children, className = "", title, ...restProps }) => {
  return (
    <div
      className={`plc-bg-white plc-border-2 plc-p-6 plc-rounded ${className}`}
      id="plc-dashboard-card"
    >
      {title && (
        <>
          <h3 className='plc-font-medium plc-text-xl'>{title}</h3>
          <hr className='plc-border-t-2 plc-my-4'/>
        </>
      )}
      {children}
    </div>
  );
};