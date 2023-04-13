import React, { useEffect, useRef } from "react";
import Slider from "react-slick";
import { ReactComponent as ArrowThinRight } from "../../assets/arrow-thin-right.svg";
import { ReactComponent as ArrowThinLeft } from "../../assets/arrow-thin-left.svg";

const NextArrow = ({ onClick, className }) => (
  <button
    className={`sm:plc-flex plc-hidden plc-text-gray-500 plc-w-11 plc-h-11 plc-items-center plc-justify-center plc-rounded-full plc-text-sm plc-absolute plc-top-1/2 plc--right-12 plc-transform plc--translate-y-1/2 hover:plc-text-gray-900 ${className}`}
    onClick={onClick}
  >
    <ArrowThinRight
      stroke="currentColor"
      aria-hidden="true"
      focusable="false"
      className="plc-h-7 plc-w-7"
    />
  </button>
);

const PrevArrow = ({ onClick, className }) => (
  <button
    className={`sm:plc-flex plc-hidden plc-text-gray-500 plc-w-11 plc-h-11 plc-items-center plc-justify-center plc-rounded-full plc-text-sm plc-absolute plc-top-1/2 plc--left-12 plc-transform plc--translate-y-1/2 hover:plc-text-gray-900 ${className}`}
    onClick={onClick}
  >
    <ArrowThinLeft
      stroke="currentColor"
      aria-hidden="true"
      focusable="false"
      className="plc-h-7 plc-w-7"
    />
  </button>
);

export function TabsCarousel({
  slidesToShow = 3,
  slidesToScroll = 1,
  slidesCount,
  initialSlide = 0,
  children,
  ...otherProps
}) {
  const ref = useRef(null);

  useEffect(() => {
    console.log("initial slide", initialSlide);
    ref.current.slickGoTo(initialSlide, true);
  }, [initialSlide]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 200,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToScroll,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    initialSlide: initialSlide,
    customPaging: (i) => (
      <span className="plc-w-3 plc-h-3 plc-rounded-full plc-transition-all plc-bg-gray-400 plc-inline-flex plc-cursor-pointer hover:plc-opacity-30"></span>
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
    <div className="carousel-wrapper plc-relative sm:plc-px-8 plc-px-0">
      <Slider ref={ref} {...settings}>
        {children}
      </Slider>
    </div>
  );
}
