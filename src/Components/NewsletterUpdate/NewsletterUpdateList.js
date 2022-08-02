import React, { useContext } from "react";
import { Checkbox } from "../../SubComponents/Checkbox";
import { Loader } from "../../SubComponents/Loader";
import { SET_SELECT } from "../../utils/action-types";
import { store } from "./NewsletterUpdateContainer";

export const NewsletterUpdateList = () => {
  const handleSelectNewsletter = (event) => {
    dispatch({ type: SET_SELECT, payload: event.target.value });
  };

  const {
    dispatch,
    state: { newsletters, isListLoading }
  } = useContext(store);

  if (isListLoading) {
    return <Loader width={60} height={100} />;
  }

  return (
    <div className="plc-max-h-80 plc-overflow-y-auto pelcro-newsletters-wrapper">
      {newsletters.map((newsletter) => (
        <div
          key={newsletter.id}
          className="plc-py-4 plc-px-1 plc-border-b plc-text-gray-900 pelcro-newsletter-wrapper last:plc-border-0"
        >
          <Checkbox
            className="pelcro-select-newsletter-checkbox"
            labelClassName="plc-cursor-pointer plc-w-full"
            id={`pelcro-newsletter-update-${newsletter.id}`}
            checked={newsletter.selected}
            value={newsletter.id}
            onChange={handleSelectNewsletter}
          >
            {newsletter.label}
          </Checkbox>
        </div>
      ))}
    </div>
  );
};
