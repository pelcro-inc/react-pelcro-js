import React, { createContext } from "react";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update,
  SideEffect
} from "use-reducer-with-side-effects";
import {
  HANDLE_USER_UPDATE,
  SHOW_ALERT,
  LOADING,
  SET_CROP,
  SET_ZOOM,
  CHANGE_IMAGE_FILE,
  CROP_COMPLETE,
  SET_IMAGE_SRC
} from "../../utils/action-types";
import { getErrorMessages } from "../common/Helpers";

const initialState = {
  imageSrc: null,
  crop: { x: 0, y: 0 },
  zoom: 1,
  croppedAreaPixels: null,
  isSubmitting: false,
  alert: {
    type: "error",
    content: ""
  }
};

const store = createContext(initialState);
const { Provider } = store;

const ProfilePicChangeContainer = ({
  style,
  className,
  onSuccess = () => {},
  onFailure = () => {},
  children
}) => {
  const handleUpdatePicture = async (
    { imageSrc, croppedAreaPixels },
    dispatch
  ) => {
    try {
      const croppedImage = await getCroppedAndResizedImg(
        imageSrc,
        croppedAreaPixels
      );

      window.Pelcro.user.uploadProfilePicture(
        {
          auth_token: window.Pelcro.user.read().auth_token,
          image: croppedImage
        },
        (err, res) => {
          dispatch({ type: LOADING, payload: false });
          if (err) {
            dispatch({
              type: SHOW_ALERT,
              payload: {
                type: "error",
                content: getErrorMessages(err)
              }
            });
            return onFailure(err);
          }
          return onSuccess();
        }
      );
    } catch (e) {
      console.error(e);
    }
  };

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case CHANGE_IMAGE_FILE:
          return SideEffect((state, dispatch) =>
            handleFileChange(action.payload, dispatch)
          );

        case SET_IMAGE_SRC:
          return Update({
            ...state,
            imageSrc: action.payload
          });

        case SET_ZOOM:
          return Update({
            ...state,
            zoom: action.payload
          });

        case SET_CROP:
          return Update({
            ...state,
            crop: action.payload
          });

        case CROP_COMPLETE:
          return Update({
            ...state,
            croppedAreaPixels: action.payload
          });

        case SHOW_ALERT:
          return Update({
            ...state,
            alert: action.payload
          });

        case LOADING:
          return Update({
            ...state,
            isSubmitting: action.payload
          });

        case HANDLE_USER_UPDATE:
          return UpdateWithSideEffect(
            { ...state, isSubmitting: true },
            (state, dispatch) => handleUpdatePicture(state, dispatch)
          );

        default:
          return state;
      }
    },
    initialState
  );

  return (
    <div style={{ ...style }} className={className}>
      <Provider value={{ state, dispatch }}>
        {children.length
          ? children.map((child, i) =>
              React.cloneElement(child, { store, key: i })
            )
          : React.cloneElement(children, { store })}
      </Provider>
    </div>
  );
};

/**
 * @param {File} imageSrc - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 */
const getCroppedAndResizedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const IMAGE_DIMENSION_IN_PX = 320;

  canvas.width = IMAGE_DIMENSION_IN_PX;
  canvas.height = IMAGE_DIMENSION_IN_PX;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    IMAGE_DIMENSION_IN_PX,
    IMAGE_DIMENSION_IN_PX
  );

  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(file);
    }, "image/png");
  });
};

const createImage = (url) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });
};

const handleFileChange = async (files, dispatch) => {
  if (files.length > 0) {
    const imgFile = files[0];
    const imageDataUrl = await readFile(imgFile);
    dispatch({ type: SET_IMAGE_SRC, payload: imageDataUrl });
  }
};

const readFile = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => resolve(reader.result),
      false
    );
    reader.readAsDataURL(file);
  });
};

export { ProfilePicChangeContainer, store };
