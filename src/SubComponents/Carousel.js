import React from "react";
import Slider from "react-slick";

export function Carousel({
    slidesToShow = 3,
    slidesToScroll = 1,
    children,
  ...otherProps
}) {
  const settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: slidesToShow,
      slidesToScroll: slidesToScroll
    };

  return (
      <Slider {...settings}>
        {children}
      </Slider>
  );
}
