// Meter view.
// Shows popup in the lower right if the user is not subsctibed to the site.
// It prompts the user to subscribe (go to Select view) or login (go to Login view).

import React, { useEffect, lazy, Suspense } from "react";
import { usePelcro } from "../../hooks/usePelcro";
// import { MeterView } from "./MeterView";
const MeterView = lazy(() =>
  import("./MeterView").then((module) => {
    return { default: module.MeterView };
  })
);

export const MeterModal = (props) => {
  const { resetView } = usePelcro();

  useEffect(() => {
    props.onDisplay?.();
  }, []);

  const onClose = () => {
    props.onClose?.();
    resetView();
  };

  return (
    <div
      id="pelcro-view-meter-modal"
      className="plc-fixed plc-bottom-0 plc-right-0 plc-w-full plc-p-4 plc-bg-white plc-border-t-4 plc-rounded plc-shadow-md motion-safe:plc-animate-slideInBottom sm:plc-m-4 sm:plc-max-w-md plc-z-max plc-border-primary-500"
    >
      <button
        type="button"
        className="plc-absolute plc-top-0 plc-text-2xl plc-text-gray-500 hover:plc-text-black focus:plc-text-black plc-right-1 plc-border-0 plc-bg-transparent hover:plc-bg-transparent focus:plc-bg-transparent pelcro-close-btn"
        aria-label="Close"
        onClick={onClose}
      >
        <span>×</span>
      </button>
      <div>
        <Suspense fallback={<p>Loading ...</p>}>
          <MeterView {...props} />
        </Suspense>
      </div>
    </div>
  );
};

MeterModal.viewId = "meter";
