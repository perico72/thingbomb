/*
    Blooft
    Copyright (C) 2024-present George Stone

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

    https://github.com/blooft-app/blooft
*/

import { createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";
import type { Component } from "solid-js";
import data from "../public/_locales/en/messages.json";
import images from "./libs/images";
import { cn } from "./libs/cn";
import { createStoredSignal } from "@/hooks/localStorage";
import { CommandPalette } from "@/components/ui/cmd";
import { formattedClock } from "@/hooks/clockFormatter";
import soundscapes, { Soundscape } from "@/libs/soundscapes";
import { Onboarding } from "./components/onboarding/Onboarding";
import { formatTime, injectUserCSS, flattenBookmarks } from "./utils/helpers";
import colorData from "./data/colorPreferences.json";
import { BookmarkTreeNode, Pomodoro, PomodoroConfig } from "./types";
import { TopWidgetsContainer } from "./components/layout/TopWidgetsContainer";
import { CenterWidgetsContainer } from "./components/layout/CenterWidgetsContainer";
import { BottomWidgetsContainer } from "./components/layout/BottomWidgetsContainer";
import { Wallpaper } from "./components/layout/Wallpaper";

type MessageKeys = keyof typeof data;

try {
  chrome.i18n.getMessage("work");
} catch (error) {
  window.chrome = {} as any;
  chrome.i18n = {
    getMessage: (
      message: MessageKeys | string,
      substitutions?: string | string[]
    ) => {
      let msg = data[message as MessageKeys]?.message || message;
      if (substitutions) {
        if (!Array.isArray(substitutions)) substitutions = [substitutions];
        substitutions.forEach((sub, index) => {
          msg = msg.replace(new RegExp(`\\$${index + 1}`, "g"), sub);
        });
      }
      return msg;
    },
  };
}

const colorPalette = [
  "#fb2c36",
  "#c27aff",
  "#0092b8",
  "#e60076",
  "#ff6900",
  "#053345",
  "#1e1a4d",
  "#861043",
  "#00d492",
  "#002c22",
];

const gradients = [
  "linear-gradient(to right, #2e3192, #1bffff)",
  "linear-gradient(to right, #d4145a, #fbb03b)",
  "linear-gradient(to right, #009245, #fcee21)",
  "linear-gradient(to right, #662d8c, #ed1e79)",
  "linear-gradient(to right, #ee9ca7, #ffdde1)",
  "linear-gradient(to right, #614385, #516395)",
  "linear-gradient(to right, #02aabd, #00cdac)",
  "linear-gradient(to right, #ff512f, #dd2476)",
  "linear-gradient(to right, #ff5f6d, #ffc371)",
  "linear-gradient(to right, #11998e, #38ef7d)",
  "linear-gradient(to right, #c6ea8d, #fe90af)",
  "linear-gradient(to right, #ea8d8d, #a890fe)",
  "linear-gradient(to right, #d8b5ff, #1eae98)",
  "linear-gradient(to right, #ff61d2, #fe9090)",
  "linear-gradient(to right, #bff098, #6fd6ff)",
  "linear-gradient(to right, #4e65ff, #92effd)",
  "linear-gradient(to right, #a9f1df, #ffbbbb)",
  "linear-gradient(to right, #c33764, #1d2671)",
  "linear-gradient(to right, #93a5cf, #e4efe9)",
  "linear-gradient(to right, #868f96, #596164)",
  "linear-gradient(to right, #09203f, #537895)",
  "linear-gradient(to right, #ffecd2, #fcb69f)",
  "linear-gradient(to right, #a1c4fd, #c2e9fb)",
  "linear-gradient(to right, #764ba2, #667eea)",
  "linear-gradient(to right, #fdfcfb, #e2d1c3)",
];

// Type definition for color data
type ThemeVariant = {
  normal: string;
  hover: string;
};

type ColorData = {
  [key: string]: {
    light: ThemeVariant;
    dark: ThemeVariant;
  };
};

const typedColorData = colorData as ColorData;

const App: Component = () => {
  const [needsOnboarding, setNeedsOnboarding] = createStoredSignal(
    "needsOnboarding",
    true
  );
  const [accentColor, setAccentColor] = createStoredSignal(
    "accentColor",
    "teal"
  );
  const [onboardingScreen, setOnboardingScreen] = createSignal<number>(0);
  const [greetingNameValue, setGreetingNameValue] = createSignal("");
  const [imageLoaded, setImageLoaded] = createSignal(false);
  const [filteredWidgets, setFilteredWidgets] = createSignal<any[]>([]);
  const [dialogOpen, setDialogOpen] = createSignal<boolean>(false);
  const [weatherContained, setWeatherContained] = createStoredSignal(
    "weatherEnabled",
    false
  );
  const [customUrl, setCustomUrl] = createStoredSignal("customUrl", "");
  const [hideSettings, setHideSettings] = createStoredSignal(
    "hideSettings",
    false
  );
  const [userCSS] = createStoredSignal("userCSS", "");
  const [currentlyPlaying, setCurrentlyPlaying] = createSignal<any>(null);
  const [pageIconURL] = createStoredSignal("iconUrl", "assets/icon-256.png");
  const [dateFormat] = createStoredSignal("dateFormat", "normal");
  const [selectedColor] = createSignal(
    colorPalette[Math.floor(Math.random() * colorPalette.length)]
  );
  const [clockFormat, setClockFormat] = createStoredSignal(
    "clockFormat",
    "12h"
  );
  const [notepad, setNotepad] = createStoredSignal<string>("notepad", "");
  const [layout] = createStoredSignal("layout", "top");
  const [currentFont, setFont] = createStoredSignal("font", "sans");
  const [background, setBackground] = createStoredSignal("background", "image");
  const [name, setName] = createStoredSignal("name", "");
  const [bookmarks, setBookmarks] = createSignal<any[]>([]);
  const [pageTitle, setPageTitle] = createStoredSignal("pageTitle", "");
  const [textStyle, setTextStyle] = createStoredSignal("textStyle", "normal");
  const [color] = createStoredSignal("color", "unset");
  const [opacity] = createStoredSignal("opacity", "0.8");
  const [wallpaperBlur] = createStoredSignal<number>("wallpaperBlur", 0);
  const [pomodoroContained, setPomodoroContained] = createStoredSignal(
    "pomodoroContained",
    false
  );
  const [pomodoroConfig, setPomodoroConfig] = createStoredSignal<
    Function | PomodoroConfig | string
  >("pomodoroConfig", {
    workMinutes: 25,
    breakMinutes: 5,
  });
  const [pomodoro, setPomodoro] = createSignal<Pomodoro>({
    time:
      typeof pomodoroConfig() === "object"
        ? (pomodoroConfig as Function)().workMinutes * 60
        : JSON.parse(pomodoroConfig() as string).workMinutes * 60,
    session: "Work",
    playing: false,
  });
  const [dateContained, setDateContained] = createStoredSignal(
    "dateContained",
    false
  );
  const [clockContained, setClockContained] = createStoredSignal(
    "clockContained",
    true
  );
  const [counterContained, setCounterContained] = createStoredSignal(
    "counterContained",
    false
  );
  const [bookmarksShown, setBookmarksShown] = createStoredSignal(
    "bookmarksShown",
    []
  );
  const [notepadContained, setNotepadContained] = createStoredSignal(
    "notepadContained",
    false
  );
  const [stopwatchContained, setStopwatchContained] = createStoredSignal(
    "stopwatchContained",
    false
  );
  const [mantrasContained, setMantrasContained] = createStoredSignal(
    "mantrasContained",
    true
  );
  const [bookmarksContained, setBookmarksContained] = createStoredSignal(
    "bookmarksContained",
    true
  );
  const [wallpaperChangeTime] = createStoredSignal<number>(
    "wallpaperChangeTime",
    1000 * 60 * 60 * 24 * 7
  );
  const clock = formattedClock();
  const [localFileImage] = createStoredSignal("localFile", "");
  const [pomodoroDialogOpen, setPomodoroDialogOpen] = createSignal(false);
  const [commandPaletteEnabled, setCommandPaletteEnabled] = createStoredSignal(
    "commandPaletteEnabled",
    true
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
      const selectedImage = images[Math.floor(Math.random() * images.length)];
      return JSON.stringify({
        url: selectedImage.url,
        author: selectedImage.author,
        expiry: Date.now() + Number(wallpaperChangeTime()),
        location: selectedImage.location,
        directLink: selectedImage.directLink,
      });
    }

    const selectedImage = images[Math.floor(Math.random() * images.length)];

    return {
      url: selectedImage.url,
      author: selectedImage.author,
      expiry: Date.now() + Number(wallpaperChangeTime()),
      directLink: selectedImage.directLink,
    };
  }

  const [selectedImage, setSelectedImage] = createStoredSignal<any>(
    "selectedImage",
    getInitialSelectedImage()
  );

  const [backgroundPaused, setBackgroundPaused] = createStoredSignal<string>(
    "backgroundPaused",
    "false"
  );
  const [itemsHidden, setItemsHidden] = createStoredSignal<string>(
    "itemsHidden",
    "false"
  );
  const [todosContained, setTodosContained] = createStoredSignal(
    "todosContained",
    true
  );
  const [natureSounds, setNatureSounds] = createStoredSignal(
    "natureSounds",
    false
  );
  const [focusSounds, setFocusSounds] = createStoredSignal(
    "focusSounds",
    false
  );
  const [ambienceSounds, setAmbienceSounds] = createStoredSignal(
    "ambienceSounds",
    false
  );
  let cursorHideTimeout: any;
  const [stopwatchTime, setStopwatchTime] = createSignal(0);
  const [stopwatchRunning, setStopwatchRunning] = createSignal(false);
  const [counter, setCounter] = createStoredSignal("counter", 0);

  onMount(() => {
    if (chrome.bookmarks !== undefined) {
      chrome.bookmarks.getTree((bookmarkTreeNodes: BookmarkTreeNode[]) => {
        const allBookmarks = flattenBookmarks(bookmarkTreeNodes);
        setBookmarks(allBookmarks);
      });
    }

    injectUserCSS(userCSS());

    document.addEventListener("mousemove", () => {
      clearTimeout(cursorHideTimeout);
      document.body.classList.remove("cursor-none");
      cursorHideTimeout = setTimeout(() => {
        document.body.classList.add("cursor-none");
      }, 4000);
    });

    setInterval(() => {
      if (stopwatchContained() && stopwatchRunning()) {
        setStopwatchTime(stopwatchTime() + 1);
      }
    }, 1000);

    setInterval(() => {
      if (pomodoro().playing) {
        if (pomodoro().time - 1 == 0) {
          const config =
            typeof pomodoroConfig() === "object"
              ? pomodoroConfig()
              : JSON.parse(pomodoroConfig() as string);
          setPomodoro({
            ...pomodoro(),
            session: pomodoro().session == "Work" ? "Break" : "Work",
            time:
              pomodoro().session == "Work"
                ? config.breakMinutes * 60
                : config.workMinutes * 60,
          });
        }
        setPomodoro({
          ...pomodoro(),
          time: pomodoro().time - 1,
        });
      }
    }, 1000);
  });

  createEffect(() => {
    if (textStyle() == "uppercase") {
      document.body.className = "**:!uppercase";
    } else if (textStyle() == "lowercase") {
      document.body.className = "**:!lowercase";
    } else {
      document.body.className = "";
    }
  });

  createEffect(() => {
    if (pageTitle()) {
      document.title = pageTitle();
    }
  });

  createEffect(() => {
    if (pomodoro().playing) {
      document.title = `${formatTime(pomodoro().time)} - ${
        pomodoro().session == "Work"
          ? chrome.i18n.getMessage("work")
          : chrome.i18n.getMessage("break")
      } - Blooft`;
    } else {
      document.title = "New Tab";
    }
  }, [pomodoro]);

  createEffect(() => {
    if (Number(wallpaperBlur()) > 0) {
      if (document.getElementById("wallpaper") !== null) {
        document.getElementById("wallpaper")!.style.filter =
          `blur(${Number(wallpaperBlur())}px)`;
      }
    }
  }, [wallpaperBlur]);

  // Apply accent color as inline styles on HTML element
  createEffect(() => {
    const colorChoice = accentColor();
    const isDarkTheme =
      document.documentElement.getAttribute("data-kb-theme") === "dark";
    const theme = isDarkTheme ? "dark" : "light";

    if (colorChoice && typedColorData[colorChoice]) {
      document.documentElement.style.setProperty(
        "--color-preference",
        typedColorData[colorChoice][theme].normal
      );
      document.documentElement.style.setProperty(
        "--color-preference-hover",
        typedColorData[colorChoice][theme].hover
      );
    }
  });

  // Watch for theme changes to update color preferences
  createEffect(() => {
    const callback = (mutations: MutationRecord[]) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "data-kb-theme") {
          const isDarkTheme =
            document.documentElement.getAttribute("data-kb-theme") === "dark";
          const theme = isDarkTheme ? "dark" : "light";
          const colorChoice = accentColor();

          if (colorChoice && typedColorData[colorChoice]) {
            document.documentElement.style.setProperty(
              "--color-preference",
              typedColorData[colorChoice][theme].normal
            );
            document.documentElement.style.setProperty(
              "--color-preference-hover",
              typedColorData[colorChoice][theme].hover
            );
          }
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(document.documentElement, { attributes: true });

    onCleanup(() => observer.disconnect());
  });

  createEffect(() => {
    if (Number(opacity()) > 0) {
      if (document.getElementById("wallpaper") !== null) {
        document.getElementById("wallpaper")!.style.opacity = opacity();
      }
    }
  }, [opacity]);

  createEffect(() => {
    console.log(stopwatchContained());
  }, [stopwatchContained]);

  createEffect(() => {
    (document.getElementById("icon") as any).href = pageIconURL();
  }, [pageIconURL]);

  onMount(() => {
    if (pageTitle()) {
      document.title = pageTitle();
    }
    if (!backgroundPaused()) {
      if (
        Number(
          typeof selectedImage() === "object"
            ? selectedImage().expiry
            : JSON.parse(selectedImage()).expiry
        ) < Date.now()
      ) {
        const selectedImage = images[Math.floor(Math.random() * images.length)];
        const newImage = {
          url: selectedImage.url,
          author: selectedImage.author,
          expiry: Date.now() + Number(wallpaperChangeTime()),
          location: selectedImage.location,
          directLink: selectedImage.directLink,
        };
        fetch(newImage.url, {
          mode: "no-cors",
          headers: {
            "Cache-Control": "public, max-age=315360000, immutable",
          },
        }).then((response) => {
          localStorage.setItem("selectedImage", JSON.stringify(newImage));
        });
      } else {
        setSelectedImage(getInitialSelectedImage());
      }
    } else if (localStorage.getItem("selectedImage") == null) {
      setSelectedImage(getInitialSelectedImage());
    }
  });

  function getKeyForValue(obj: any, value: any) {
    return Object.keys(obj).find((key) => obj[key] === value);
  }

  function getKeyByValue<T extends Record<string, any>>(
    obj: T,
    value: T[keyof T]
  ): string | undefined {
    return Object.keys(obj).find((key) => obj[key] === value);
  }

  return (
    <main
      class={cn(
        {
          "font-mono": currentFont() == "mono",
          "font-serif": currentFont() == "serif",
          "font-sans": currentFont() == "sans",
          "font-comic-sans": currentFont() == "comic-sans",
        },
        "transition-all",
        imageLoaded() ? "bg-black dark:bg-none" : ""
      )}
      id="main-container"
    >
      <Show when={needsOnboarding()}>
        <Onboarding />
      </Show>
      {(background() === "image" ||
        background() === "custom-url" ||
        background() === "local-file") && (
        <Wallpaper
          backgroundType={background()}
          selectedImage={selectedImage()}
          customUrl={customUrl()}
          localFileImage={localFileImage()}
          opacity={opacity()}
          wallpaperBlur={wallpaperBlur()}
          setImageLoaded={setImageLoaded}
        />
      )}
      <div
        class={cn(
          "fixed inset-0 overflow-hidden p-4 !bg-cover",
          imageLoaded() ? "" : "bg-[#1f1f1f]"
        )}
        id="background-container"
        style={{
          background:
            background() === "solid-color"
              ? color() != "unset"
                ? color()
                : selectedColor()
              : background() == "gradient"
                ? gradients[Math.floor(Math.random() * gradients.length)]
                : "",
        }}
      >
        <div
          class="inner-container absolute inset-0 z-30 h-screen flex flex-wrap items-center gap-3
            p-4"
          style={{
            "align-content":
              layout() == "center"
                ? "center"
                : layout().startsWith("top-")
                  ? "flex-start"
                  : layout() == "top"
                    ? "flex-start"
                    : "flex-end",
            "padding-top": layout().startsWith("top") ? "4.5rem" : "0",
            "padding-bottom": layout().startsWith("bottom-") ? "4.5rem" : "0",
            "padding-left": layout().endsWith("-left") ? "4.5rem" : "0",
            "padding-right": layout().endsWith("-right") ? "4.5rem" : "0",
            "justify-content": layout().endsWith("-left")
              ? "flex-start"
              : layout().endsWith("-right")
                ? "flex-end"
                : "center",
          }}
          id="content-container"
        >
          <TopWidgetsContainer />
          <BottomWidgetsContainer />
          <CenterWidgetsContainer />
        </div>
      </div>
      <audio
        src={
          currentlyPlaying()
            ? (soundscapes as Soundscape[]).filter((item: Soundscape) =>
                item.categories.includes(currentlyPlaying().split("-")[0])
              )[currentlyPlaying().split("-")[1]]?.url
            : ""
        }
        id="audio"
        autoplay
        loop
      ></audio>
      <Show when={commandPaletteEnabled()}>
        <CommandPalette />
      </Show>
    </main>
  );
};

export default App;
