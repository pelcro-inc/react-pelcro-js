import React from "react";
import Select from "react-select";

// Custom option component to show images and labels
const customSingleValue = ({ data }) => (
  <div className="custom-single-value">
    <img
      src={data.image}
      alt={data.label}
      style={{ width: 60, marginRight: 10, borderRadius: 4 }}
    />
    {data.label}
  </div>
);

const customOption = (props) => {
  const { data, innerRef, innerProps } = props;
  return (
    <div
      ref={innerRef}
      {...innerProps}
      className="custom-option"
      style={{ display: "flex", alignItems: "center" }}
    >
      <img
        src={data.image}
        alt={data.label}
        style={{ width: 60, marginRight: 10 }}
      />
      {data.label}
    </div>
  );
};

const ImageSelect = ({ optionsArray, ...props }) => {
  const options = optionsArray.map((option) => ({
    value: option?.id,
    label: option?.name,
    image: option?.image
  }));
  return (
    <Select
      className="plc-px-5"
      isSearchable={false} // Disable search feature
      options={options}
      placeholder="Select Gift"
      components={{
        Option: customOption,
        SingleValue: customSingleValue
      }}
      {...props}
    />
  );
};

export default ImageSelect;
