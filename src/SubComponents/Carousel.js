import React, { useEffect, useRef } from "react";
import Slider from "react-slick";
import { ReactComponent as ArrowThinLeft } from "../assets/arrow-thin-left.svg";
import { ReactComponent as ArrowThinRight } from "../assets/arrow-thin-right.svg";

const NextArrow = ({
  onClick,
  className,
  size = "normal",
  mobileArrowDown = false
}) => (
  <button
    className={`plc-flex plc-text-gray-500 plc-w-11 plc-h-11 plc-items-center plc-justify-center plc-rounded-full plc-text-sm plc-absolute plc-transform hover:plc-text-gray-900 ${
      mobileArrowDown
        ? "plc-right-0 plc-bottom-0 sm:plc--right-14 sm:plc-top-1/2 sm:plc--translate-y-1/2"
        : "plc--right-14 plc-top-1/2 plc--translate-y-1/2"
    } ${className}`}
    onClick={onClick}
  >
    <ArrowThinRight
      stroke="currentColor"
      aria-hidden="true"
      focusable="false"
      className={`${
        size === "normal"
          ? "plc-w-7 plc-h-7"
          : size === "small"
          ? "plc-w-4 plc-h-4"
          : "plc-w-9 plc-h-9"
      }`}
    />
  </button>
);

const PrevArrow = ({
  onClick,
  className,
  size = "normal",
  mobileArrowDown = false
}) => (
  <button
    className={`plc-flex plc-text-gray-500 plc-w-11 plc-h-11 plc-items-center plc-justify-center plc-rounded-full plc-text-sm plc-absolute plc-transform hover:plc-text-gray-900 ${
      mobileArrowDown
        ? "plx-left-0 plc-bottom-0 sm:plc--left-14 sm:plc-top-1/2 sm:plc--translate-y-1/2"
        : "plc--left-14 plc-top-1/2 plc--translate-y-1/2"
    } ${className}`}
    onClick={onClick}
  >
    <ArrowThinLeft
      stroke="currentColor"
      aria-hidden="true"
      focusable="false"
      className={`${
        size === "normal"
          ? "plc-w-7 plc-h-7"
          : size === "small"
          ? "plc-w-4 plc-h-4"
          : "plc-w-9 plc-h-9"
      }`}
    />
  </button>
);

export function Carousel({
  slidesToShow = 3,
  slidesToScroll = 1,
  initialSlide = 0,
  dots = true,
  slidesCount,
  arrowsSize = "normal",
  paddingSize = "small",
  mobileArrowDown = false,
  children,
  ...otherProps
}) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.slickGoTo(initialSlide, true);
  }, [initialSlide]);

  const settings = {
    infinite: false,
    speed: 200,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToScroll,
    nextArrow: (
      <NextArrow
        size={arrowsSize}
        mobileArrowDown={mobileArrowDown}
      />
    ),
    prevArrow: (
      <PrevArrow
        size={arrowsSize}
        mobileArrowDown={mobileArrowDown}
      />
    ),
    initialSlide: initialSlide,
    dots: dots,
    customPaging: (i) => (
      <span className="plc-w-3 plc-h-3 plc-rounded-full plc-transition-all plc-bg-gray-400 plc-inline-flex plc-cursor-pointer hover:plc-bg-primary"></span>
    ),
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  return (
    <div
      className={`carousel-wrapper plc-relative  ${
        paddingSize === "small"
          ? "sm:plc-px-8"
          : paddingSize === "medium"
          ? "sm:plc-px-10"
          : "sm:plc-px-14"
      } ${mobileArrowDown ? "plc-px-0" : "plc-px-8"}`}
    >
      <Slider ref={ref} {...settings}>
        {children}
      </Slider>
    </div>
  );
}
