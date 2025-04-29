import { createStoredSignal } from "@/hooks/localStorage";
import { cn } from "@/libs/cn";
import { Show } from "solid-js";
import { SettingsTrigger } from "../../Settings";
import { Eye, EyeOff, Pause, Play } from "lucide-solid";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverTriggerProps } from "@kobalte/core/popover";
import { Button } from "../ui/button";
import { Check } from "lucide-solid";
import { TodoPopover } from "../../Widgets";
import { MantraDisplay } from "../widgets/MantraDisplay";
import images from "@/libs/images";
import { mantras } from "@/libs/mantras";

export const BottomWidgetsContainer = () => {
  const [wallpaperChangeTime] = createStoredSignal<number>(
    "wallpaperChangeTime",
    1000 * 60 * 60 * 24 * 7
  );
  const [backgroundPaused, setBackgroundPaused] = createStoredSignal<boolean>(
    "backgroundPaused",
    false
  );
  const [itemsHidden, setItemsHidden] = createStoredSignal<boolean>(
    "itemsHidden",
    false
  );
  const [hideSettings, setHideSettings] = createStoredSignal<boolean>(
    "hideSettings",
    false
  );
  const [todosContained, setTodosContained] = createStoredSignal(
    "todosContained",
    true
  );
  const [mantrasContained, setMantrasContained] = createStoredSignal(
    "mantrasContained",
    true
  );
  const [background, setBackground] = createStoredSignal<string>(
    "background",
    "image"
  );
  function getInitialSelectedImage() {
    try {
      const storedItem = localStorage.getItem("selectedImage");
      if (storedItem) {
        const parsedItem = JSON.parse(storedItem);

        // ensure the parsed value is a valid object
        if (typeof parsedItem === "object" && parsedItem !== null) {
          return parsedItem;
        }
      }
    } catch (error) {
      localStorage.removeItem("selectedImage");
      const randomImage = images[Math.floor(Math.random() * images.length)];
      return JSON.stringify({
        url: randomImage.url,
        author: randomImage.author,
        expiry: Date.now() + Number(wallpaperChangeTime()),
        location: randomImage.location,
        directLink: randomImage.directLink,
      });
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];

    return {
      url: randomImage.url,
      author: randomImage.author,
      expiry: Date.now() + Number(wallpaperChangeTime()),
      directLink: randomImage.directLink,
    };
  }
  const [selectedImage, setSelectedImage] = createStoredSignal<any>(
    "selectedImage",
    getInitialSelectedImage()
  );

  return (
    <div
      id="bottom-widgets-container"
      class="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-between gap-3 p-2.5"
    >
      <div
        id="bottom-left-widgets-container"
        class="relative flex items-center gap-4"
      >
        <div
          class={cn(
            `group absolute flex flex-col-reverse gap-1 rounded-full p-1.5 *:text-white
            focus-within:bg-white/20 focus-within:backdrop-blur-3xl hover:bg-white/20
            hover:backdrop-blur-3xl dark:focus-within:bg-black/20 dark:hover:bg-black/20`,
            {
              "opacity-0 hover:opacity-100": hideSettings(),
              "bottom-0": background() != "image" || !selectedImage().location,
              "bottom-[8px]":
                background() == "image" && selectedImage().location,
            }
          )}
        >
          <SettingsTrigger triggerClass="text-gray-300 hover:rotate-45 group-hover:rotate-45 transition-transform" />
          <button
            class="hidden group-focus-within:flex group-hover:flex peer-hover:!flex"
            title={
              itemsHidden()
                ? chrome.i18n.getMessage("show_items")
                : chrome.i18n.getMessage("hide_items")
            }
            onmousedown={() => {
              setItemsHidden(!itemsHidden());
            }}
            onclick={() => {
              setItemsHidden(!itemsHidden());
            }}
          >
            {itemsHidden() ? <EyeOff /> : <Eye />}
          </button>
          <Show when={background() == "image"}>
            <button
              class="hidden group-focus-within:flex group-hover:flex peer-hover:!flex
                peer-focus:!flex"
              title={
                backgroundPaused()
                  ? chrome.i18n.getMessage("start_background_changes")
                  : chrome.i18n.getMessage("pause_background_changes")
              }
              onmousedown={() => {
                if (backgroundPaused()) {
                  setBackgroundPaused(false);
                } else {
                  setSelectedImage({
                    url: (
                      document.getElementById("wallpaper") as HTMLImageElement
                    ).src,
                    expiry: Infinity,
                    author: document
                      .getElementById("wallpaper")!
                      .getAttribute("data-author")
                      ? JSON.parse(
                          document
                            .getElementById("wallpaper")!
                            .getAttribute("data-author") as string | "{}"
                        )
                      : undefined,
                    location: document
                      .getElementById("wallpaper")!
                      .getAttribute("data-location")
                      ? document
                          .getElementById("wallpaper")!
                          .getAttribute("data-location")
                      : undefined,
                    directLink: document
                      .getElementById("wallpaper")!
                      .getAttribute("data-direct-link")
                      ? document
                          .getElementById("wallpaper")!
                          .getAttribute("data-direct-link")
                      : undefined,
                  });
                  setBackgroundPaused(true);
                }
              }}
              onclick={() => {
                if (backgroundPaused()) {
                  setBackgroundPaused(true);
                } else {
                  setSelectedImage({
                    url: (
                      document.getElementById("wallpaper") as HTMLImageElement
                    ).src,
                    expiry: Infinity,
                    author: document
                      .getElementById("wallpaper")!
                      .getAttribute("data-author")
                      ? JSON.parse(
                          document
                            .getElementById("wallpaper")!
                            .getAttribute("data-author") as string | "{}"
                        )
                      : undefined,
                    location: document
                      .getElementById("wallpaper")!
                      .getAttribute("data-location")
                      ? document
                          .getElementById("wallpaper")!
                          .getAttribute("data-location")
                      : undefined,
                    directLink: document
                      .getElementById("wallpaper")!
                      .getAttribute("data-direct-link")
                      ? document
                          .getElementById("wallpaper")!
                          .getAttribute("data-direct-link")
                      : undefined,
                  });
                  setBackgroundPaused(true);
                }
              }}
            >
              {backgroundPaused() ? (
                <Play fill="currentColor" />
              ) : (
                <Pause fill="currentColor" />
              )}
            </button>
          </Show>
        </div>
        {selectedImage().author && background() == "image" ? (
          <span
            class={cn(
              `ml-10 flex h-fit select-none items-start p-1.5 text-sm font-medium flex-col
                text-white justify-center`,
              {
                "h-[36px]": !selectedImage().location,
                "h-[52px]": selectedImage().location,
              }
            )}
          >
            {selectedImage().location ? (
              <span class="text-white">{selectedImage().location}</span>
            ) : (
              <span></span>
            )}
            <span
              class={cn(
                selectedImage().location ? "text-gray-300" : "text-white"
              )}
            >
              <a href={selectedImage().author.url}>
                {selectedImage().author.name}
              </a>{" "}
              /{" "}
              <a
                href={
                  selectedImage().directLink
                    ? selectedImage().directLink
                    : "https://unsplash.com/"
                }
              >
                Unsplash
              </a>
            </span>
          </span>
        ) : (
          <span
            class="ml-10 flex h-9 select-none items-center gap-1 p-1.5 text-sm font-medium
              text-white"
          ></span>
        )}
      </div>
      <Show when={itemsHidden() == false}>
        <div
          id="bottom-center-widgets-container"
          class={cn(
            `text-md fixed bottom-0 left-0 right-0 -z-50 m-2.5 flex !h-[36px] items-center
            justify-center gap-2 text-center font-medium`,
            {
              "bottom-[8px]":
                background() == "image" && selectedImage().location,
            }
          )}
        >
          <MantraDisplay mantrasContained={mantrasContained()} />
        </div>
      </Show>
      <div
        id="bottom-right-widgets-container"
        style={{
          display: itemsHidden() ? "none" : "",
        }}
      >
        <Show when={todosContained()}>
          <Popover placement="top-end">
            <PopoverTrigger
              as={(triggerProps: PopoverTriggerProps) => (
                <Button variant="ghost" class="!text-white" {...triggerProps}>
                  <Check class="h-4 w-4 text-gray-300" />
                  <span>{chrome.i18n.getMessage("tasks")}</span>
                </Button>
              )}
            />
            <PopoverContent class="max-h-96 w-56 overflow-y-auto">
              <TodoPopover />
            </PopoverContent>
          </Popover>
        </Show>
      </div>
    </div>
  );
};
