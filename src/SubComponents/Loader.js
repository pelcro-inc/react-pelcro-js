import React from "react";
import PropTypes from "prop-types";

export const Loader = (props) => (
  <div
    className={`plc-w-full plc-flex plc-justify-center plc-items-center plc-self-center pelcro-loader-wrapper ${props.className}`}
  >
    <svg
      width={props.width}
      height={props.height}
      viewBox="0 0 120 30"
      xmlns="http://www.w3.org/2000/svg"
      fill={props.color}
      aria-label={props.label}
    >
      <circle cx="15" cy="15" r={props.radius + 6}>
        <animate
          attributeName="r"
          from="15"
          to="15"
          begin="0s"
          dur="0.8s"
          values="15;9;15"
          calcMode="linear"
          repeatCount="indefinite"
        />
        <animate
          attributeName="fillOpacity"
          from="1"
          to="1"
          begin="0s"
          dur="0.8s"
          values="1;.5;1"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        cx="60"
        cy="15"
        r={props.radius}
        attributeName="fillOpacity"
        from="1"
        to="0.3"
      >
        <animate
          attributeName="r"
          from="9"
          to="9"
          begin="0s"
          dur="0.8s"
          values="9;15;9"
          calcMode="linear"
          repeatCount="indefinite"
        />
        <animate
          attributeName="fillOpacity"
          from="0.5"
          to="0.5"
          begin="0s"
          dur="0.8s"
          values=".5;1;.5"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="105" cy="15" r={props.radius + 6}>
        <animate
          attributeName="r"
          from="15"
          to="15"
          begin="0s"
          dur="0.8s"
          values="15;9;15"
          calcMode="linear"
          repeatCount="indefinite"
        />
        <animate
          attributeName="fillOpacity"
          from="1"
          to="1"
          begin="0s"
          dur="0.8s"
          values="1;.5;1"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  </div>
);

Loader.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  label: PropTypes.string,
  radius: PropTypes.number
};

Loader.defaultProps = {
  height: 50,
  width: 35,
  color: "#32aea1",
  label: "Loading data..",
  radius: 9
};
