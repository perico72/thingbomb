import { createEffect, createSignal } from "solid-js";

interface WallpaperProps {
  backgroundType: string;
  selectedImage: any;
  customUrl: string;
  localFileImage: string;
  opacity: string;
  wallpaperBlur: number;
  setImageLoaded: (loaded: boolean) => void;
}

export const Wallpaper = (props: WallpaperProps) => {
  const getImageUrl = () => {
    if (props.backgroundType === "image") {
      return typeof props.selectedImage === "object"
        ? props.selectedImage.url
        : JSON.parse(props.selectedImage).url;
    } else if (props.backgroundType === "local-file") {
      return props.localFileImage;
    } else if (props.backgroundType === "custom-url") {
      return props.customUrl;
    }
    return "";
  };

  createEffect(() => {
    if (Number(props.wallpaperBlur) > 0) {
      if (document.getElementById("wallpaper") !== null) {
        document.getElementById("wallpaper")!.style.filter =
          `blur(${Number(props.wallpaperBlur)}px)`;
      }
    }
  });

  createEffect(() => {
    if (Number(props.opacity) > 0) {
      if (document.getElementById("wallpaper") !== null) {
        document.getElementById("wallpaper")!.style.opacity = props.opacity;
      }
    }
  });

  return (
    <>
      <img
        src={getImageUrl()}
        alt=""
        id="wallpaper"
        class="absolute inset-0 h-full w-full object-cover transition-all"
        data-author={JSON.stringify(props.selectedImage.author)}
        data-location={props.selectedImage.location}
        data-direct-link={props.selectedImage.directLink}
        style={{ opacity: 0, filter: "brightness(0)" }}
        onLoad={(e: any) => {
          if (document.documentElement.style.colorScheme === "dark") {
            e.target.style.opacity = props.opacity;
            e.target.style.filter = `brightness(100%)`;
          } else {
            e.target.style.opacity = 1;
            e.target.style.filter = `brightness(${props.opacity})`;
          }
          if (props.wallpaperBlur > 0) {
            e.target.style.filter = `blur(${Number(props.wallpaperBlur)}px)`;
          }
          props.setImageLoaded(true);
        }}
      />
    </>
  );
};
