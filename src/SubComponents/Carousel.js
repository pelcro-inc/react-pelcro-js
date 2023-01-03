import React, { useRef, lazy, Suspense } from "react";
// import Slider from "react-slick";
const Slider = lazy(() => import("react-slick"));
import { ReactComponent as ArrowThinRight } from "../assets/arrow-thin-right.svg";
import { ReactComponent as ArrowThinLeft } from "../assets/arrow-thin-left.svg";

const NextArrow = ({ onClick, className }) => (
  <button
    className={`sm:plc-flex plc-hidden plc-text-white plc-w-11 plc-h-11 plc-bg-primary  plc-items-center plc-justify-center plc-rounded-full plc-text-sm plc-absolute plc-top-1/2 plc--right-16 plc-transform plc--translate-y-1/2 plc-border plc-border-primary hover:plc-bg-white hover:plc-text-primary ${className}`}
    onClick={onClick}
  >
    <ArrowThinRight
      stroke="currentColor"
      aria-hidden="true"
      focusable="false"
      className="plc-h-5 plc-w-5"
    />
  </button>
);

const PrevArrow = ({ onClick, className }) => (
  <button
    className={`sm:plc-flex plc-hidden plc-text-white plc-w-11 plc-h-11 plc-bg-primary plc-items-center plc-justify-center plc-rounded-full plc-text-sm plc-absolute plc-top-1/2 plc--left-16 plc-transform plc--translate-y-1/2 plc-border plc-border-primary hover:plc-bg-white hover:plc-text-primary ${className}`}
    onClick={onClick}
  >
    <ArrowThinLeft
      stroke="currentColor"
      aria-hidden="true"
      focusable="false"
      className="plc-h-5 plc-w-5"
    />
  </button>
);

export function Carousel({
  slidesToShow = 3,
  slidesToScroll = 1,
  slidesCount,
  children,
  ...otherProps
}) {
  const ref = useRef(null);

  const settings = {
    dots: true,
    infinite: false,
    speed: 200,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToScroll,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    initialSlide: 0,
    customPaging: (i) => (
      <span className="plc-w-3 plc-h-3 plc-rounded-full plc-transition-all plc-bg-primary plc-inline-flex plc-cursor-pointer hover:plc-opacity-30"></span>
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
    <div className="carousel-wrapper plc-relative sm:plc-px-16 plc-px-0">
      <Suspense fallback={<p>Loading ...</p>}>
        <Slider ref={ref} {...settings}>
          {children}
        </Slider>
      </Suspense>
    </div>
  );
}
