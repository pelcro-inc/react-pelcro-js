import React, { useContext } from "react";
import Cropper from "react-easy-crop";
import {
  CROP_COMPLETE,
  SET_CROP,
  SET_ZOOM
} from "../../utils/action-types";
import { store } from "./ProfilePicChangeContainer";

export const ProfilePicChangeCropper = ({
  className = "",
  ...otherProps
}) => {
  const {
    state: { imageSrc, crop, zoom },
    dispatch
  } = useContext(store);

  return (
    <div
      className={`plc-relative plc-w-full plc-h-52 sm:plc-h-96 ${className}`}
    >
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        maxZoom={4}
        aspect={1}
        onCropChange={(location) =>
          dispatch({ type: SET_CROP, payload: location })
        }
        onCropComplete={(croppedArea, croppedAreaPixels) =>
          dispatch({
            type: CROP_COMPLETE,
            payload: croppedAreaPixels
          })
        }
        onZoomChange={(zoom) =>
          dispatch({ type: SET_ZOOM, payload: zoom })
        }
        zoomSpeed={0.5}
        showGrid={false}
        cropShape="round"
        disableAutomaticStylesInjection={true}
        classes={{
          containerClassName: "pelcro-cropper-container",
          mediaClassName: "pelcro-cropper-image",
          cropAreaClassName: "pelcro-cropper-area"
        }}
        {...otherProps}
      />
    </div>
  );
};
