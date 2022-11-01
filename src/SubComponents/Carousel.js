import React from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

export function Carousel({
  items,
  responsive,
  controlsStrategy,
  ...otherProps
}) {
  return (
    <AliceCarousel
      mouseTracking
      items={items}
      responsive={responsive}
      controlsStrategy={controlsStrategy}
    />
  );
}
