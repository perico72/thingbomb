/*
    Flowtide
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

    https://github.com/thingbomb/flowtide
*/

import {
  AlignVerticalJustifyStart,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUp,
  ArrowUpLeft,
  ArrowUpRight,
  Bookmark,
  Calendar,
  Calendar1,
  Check,
  Clock,
  Dot,
  File,
  Grid,
  Hammer,
  Home,
  Hourglass,
  Image,
  Link,
  Notebook,
  PaintBucket,
  Palette,
  Plus,
  Quote,
  RefreshCcw,
  Settings,
  Square,
  Sun,
  Sunrise,
  Timer,
  Volume2,
} from "lucide-solid";
import {
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  Show,
  untrack,
} from "solid-js";
import { createStoredSignal } from "./hooks/localStorage";
import { cn } from "./libs/cn";
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "./components/ui/textfield";
import { Button } from "./components/ui/button";
import "prism-code-editor/prism/languages/css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { actuallyBoolean } from "./libs/boolean";
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemLabel,
} from "./components/ui/radio-group";
import {
  Switch,
  SwitchControl,
  SwitchLabel,
  SwitchThumb,
} from "./components/ui/switch";
import { updateWeatherManually } from "./hooks/weather";
import { basicEditor } from "prism-code-editor/setups";

interface PomodoroConfig {
  workMinutes: number;
  breakMinutes: number;
}

function BigButton(props: any) {
  return (
    <button class="card-style" {...props}>
      <div class="icon">{props.icon}</div>
      <span class="text-xl">{props.title}</span>
    </button>
  );
}

interface BookmarkTreeNode {
  children?: BookmarkTreeNode[];
  dateAdded?: number;
  dateGroupModified?: number;
  id: string;
  index?: number;
  parentId?: string;
  title: string;
  unmodifiable?: "managed";
  url?: string;
}

type Bookmark = {
  name: string;
  url: string;
};

function injectUserCSS(css: string) {
  document.getElementById("user-css")?.remove();
  const style = document.createElement("style");
  style.setAttribute("id", "user-css");
  style.innerHTML = `${css}`;
  document.head.appendChild(style);
}

function safeParse<T>(data: any, fallback: T): T {
  try {
    const parsed = JSON.parse(data);
    console.log(parsed);
    return parsed;
  } catch {
    return fallback;
  }
}

function SettingsTrigger({
  className,
  triggerClass,
}: {
  className?: string;
  triggerClass?: string;
}) {
  function textToImage(text: string) {
    const canvas = document.createElement("canvas");
    const ctx: any = canvas.getContext("2d");

    canvas.width = 128;
    canvas.height = 128;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let fontSize = 128;
    ctx.font = `bold ${fontSize}px system-ui`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    while (ctx.measureText(text).width > canvas.width - 10 && fontSize > 10) {
      fontSize -= 2;
      ctx.font = `bold ${fontSize}px system-ui`;
    }

    if (document.documentElement.style.colorScheme === "dark") {
      ctx.fillStyle = "white";
    } else {
      ctx.fillStyle = "black";
    }

    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL();
  }

  const [open, setOpen] = createSignal(false);
  const [font, setFont] = createStoredSignal("font", "sans");
  const [theme, setTheme] = createStoredSignal("kb-color-mode", "system");
  const [background, setBackground] = createStoredSignal("background", "image");
  const [feedbackCalloutHidden, setFeedbackCalloutHidden] = createStoredSignal(
    "feedbackCalloutHidden",
    false
  );
  const [layout, setLayout] = createStoredSignal("layout", "top");
  const [clockFormat, setClockFormat] = createStoredSignal(
    "clockFormat",
    "12h"
  );
  const [name, setName] = createStoredSignal("name", "");
  const [greetingNameValue, setGreetingNameValue] = createSignal(name());
  const [pageTitle, setPageTitle] = createStoredSignal("pageTitle", "");
  const [pageTitleValue, setPageTitleValue] = createSignal(pageTitle());
  const [pageIcon, setPageIcon] = createStoredSignal("pageIcon", "");
  const [color, setColor] = createStoredSignal("color", "unset");
  const [pageIconValue, setPageIconValue] = createSignal(pageIcon());
  const [opacity, setOpacity] = createStoredSignal<number>("opacity", 0.8);
  const [settingsMenu, setSettingsMenu] = createSignal<string>("general");
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [imperial, setImperial] = createStoredSignal("imperial", false);
  const [city, setCity] = createStoredSignal("locationCity", "");
  const [bookmarksShown, setBookmarksShown] = createStoredSignal<
    Array<Bookmark> | string
  >("bookmarksShown", []);
  const [clearDataDialogOpen, setClearDataDialogOpen] = createSignal(false);
  const [pomodoroConfig, setPomodoroConfig] = createStoredSignal<
    Function | PomodoroConfig | string
  >("pomodoroConfig", {
    workMinutes: 25,
    breakMinutes: 5,
  });
  const [location, setLocation] = createStoredSignal<Array<any>>("location", [
    null,
    null,
  ]);
  const [latitudeInput, setLatitudeInput] = createSignal("");
  const [longitudeInput, setLongitudeInput] = createSignal("");
  const [locationCityValue, setLocationCityValue] = createSignal(city());
  const [hideSettings, setHideSettings] = createStoredSignal(
    "hideSettings",
    false
  );
  const [weatherEnabled, setWeatherEnabled] = createStoredSignal(
    "weatherEnabled",
    false
  );
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
  const [bookmarks, setBookmarks] = createSignal<Bookmark[]>([]);
  const [natureSounds, setNatureSounds] = createStoredSignal(
    "natureSounds",
    false
  );
  const [focusSounds, setFocusSounds] = createStoredSignal(
    "focusSounds",
    false
  );
  const [todosContained, setTodosContained] = createStoredSignal(
    "todosContained",
    true
  );
  const [ambienceSounds, setAmbienceSounds] = createStoredSignal(
    "ambienceSounds",
    false
  );
  const [pomodoroContained, setPomodoroContained] = createStoredSignal(
    "pomodoroContained",
    false
  );
  const [userCSS, setUserCSS] = createStoredSignal("userCSS", "");
  const [wallpaperBlur, setWallpaperBlur] = createStoredSignal<number>(
    "wallpaperBlur",
    0
  );
  const [localFileImage, setLocalFileImage] = createStoredSignal(
    "localFile",
    ""
  );
  const [dateFormat, setDateFormat] = createStoredSignal(
    "dateFormat",
    "normal"
  );
  const [customUrl, setCustomUrl] = createStoredSignal("customUrl", "");
  const [wallpaperChangeTime, setWallpaperChangeTime] =
    createStoredSignal<number>("wallpaperChangeTime", 1000 * 60 * 60 * 24);
  const [pageIconURL, setPageIconURL] = createStoredSignal(
    "iconUrl",
    "assets/icon-256.png"
  );
  const [textStyle, setTextStyle] = createStoredSignal("textStyle", "normal");
  onMount(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      } else if ((e.ctrlKey || e.metaKey) && e.key === ",") {
        e.preventDefault();
        setOpen(true);
      }
    });
  });
  let editor: any;

  createEffect(() => {
    const editorElement = document.getElementById("editor");

    const isDarkMode = document.documentElement.style.colorScheme === "dark";

    if (settingsMenu() === "advanced" && !editor) {
      editor = basicEditor("#editor", {
        language: "css",
        theme: isDarkMode ? "github-dark" : "github-light",
        value: userCSS(),
        onUpdate: (value: string) => {
          setUserCSS(value);
          injectUserCSS(value);
        },
      });
    }

    onCleanup(() => {
      if (editor && settingsMenu() != "advanced") {
        editor.remove();
        editor = null;
      }
    });
  });

  function SettingsPage() {
    return (
      <div
        class={cn(
          "text-foreground flex flex-col sm:flex-row absolute inset-0 overflow-auto p-0",
          {
            "**:font-sans": font() == "sans",
            "**:font-serif": font() == "serif",
            "**:font-mono": font() == "mono",
            "**:font-comic-sans": font() == "comic-sans",
          }
        )}
      >
        <div
          id="sidebar"
          class="sm:max-w-50 p-6 sticky top-0 flex h-[140px] w-full max-w-full flex-col gap-2
            sm:h-full overflow-y-auto scrollbar-track-transparent pr-3"
        >
          <h2 class="text-lg font-[600] mb-2 pl-4">
            {chrome.i18n.getMessage("settings")}
          </h2>
          <button
            class="flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10"
            {...(settingsMenu() == "general"
              ? { "data-selected": "true" }
              : "")}
            id="generalButton"
            onmousedown={() => {
              setSettingsMenu("general");
            }}
            onclick={() => {
              setSettingsMenu("general");
            }}
          >
            <Settings
              height={20}
              class="size-6 justify-start rounded-lg bg-purple-700 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("general")}
          </button>
          <button
            {...(settingsMenu() == "appearance"
              ? { "data-selected": "true" }
              : "")}
            onmousedown={() => {
              setSettingsMenu("appearance");
            }}
            id="appearanceButton"
            class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10`}
            onclick={() => {
              setSettingsMenu("appearance");
            }}
          >
            <Palette
              height={20}
              class="size-6 rounded-lg bg-pink-700 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("appearance")}
          </button>
          <button
            {...(settingsMenu() == "background"
              ? { "data-selected": "true" }
              : "")}
            onmousedown={() => {
              setSettingsMenu("background");
            }}
            id="backgroundButton"
            class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10`}
            onclick={() => {
              setSettingsMenu("background");
            }}
          >
            <Image
              height={20}
              class="size-6 rounded-lg bg-teal-700 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("background")}
          </button>

          <button
            {...(settingsMenu() == "advanced"
              ? { "data-selected": "true" }
              : "")}
            onmousedown={() => {
              setSettingsMenu("advanced");
            }}
            id="advancedButton"
            class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10`}
            onclick={() => {
              setSettingsMenu("advanced");
            }}
          >
            <Hammer
              height={20}
              class="size-6 rounded-lg bg-gray-700 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("advanced")}
          </button>
          <br />
          <button
            {...(settingsMenu() == "bookmarks"
              ? { "data-selected": "true" }
              : "")}
            onmousedown={() => {
              setSettingsMenu("bookmarks");
            }}
            onclick={() => {
              setSettingsMenu("bookmarks");
            }}
            id="bookmarksButton"
            class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10`}
          >
            <Bookmark
              height={20}
              class="size-6 rounded-lg bg-purple-700 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("bookmarks")}
          </button>
          <button
            {...(settingsMenu() == "clock" ? { "data-selected": "true" } : "")}
            onmousedown={() => {
              setSettingsMenu("clock");
            }}
            onclick={() => {
              setSettingsMenu("clock");
            }}
            id="clockButton"
            class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10`}
          >
            <Clock
              height={20}
              class="size-6 rounded-lg bg-teal-700 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("clock")}
          </button>
          <button
            {...(settingsMenu() == "counter"
              ? { "data-selected": "true" }
              : "")}
            onmousedown={() => {
              setSettingsMenu("counter");
            }}
            onclick={() => {
              setSettingsMenu("counter");
            }}
            id="counterButton"
            class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10`}
          >
            <Plus
              height={20}
              class="size-6 rounded-lg bg-cyan-700 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("counter")}
          </button>
          <button
            {...(settingsMenu() == "date" ? { "data-selected": "true" } : "")}
            onmousedown={() => {
              setSettingsMenu("date");
            }}
            onclick={() => {
              setSettingsMenu("date");
            }}
            id="dateButton"
            class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10`}
          >
            <Calendar
              height={20}
              class="size-6 rounded-lg bg-amber-700 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("date")}
          </button>
          <button
            {...(settingsMenu() == "mantras"
              ? { "data-selected": "true" }
              : "")}
            onmousedown={() => {
              setSettingsMenu("mantras");
            }}
            onclick={() => {
              setSettingsMenu("mantras");
            }}
            id="mantrasButton"
            class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10`}
          >
            <Quote
              height={20}
              class="size-6 rounded-lg bg-orange-900 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("mantras")}
          </button>
          <button
            {...(settingsMenu() == "notepad"
              ? { "data-selected": "true" }
              : "")}
            onmousedown={() => {
              setSettingsMenu("notepad");
            }}
            onclick={() => {
              setSettingsMenu("notepad");
            }}
            id="notepadButton"
            class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10`}
          >
            <Notebook
              height={20}
              class="size-6 rounded-lg bg-white p-0.5 text-black"
            />
            {chrome.i18n.getMessage("notepad")}
          </button>
          <button
            {...(settingsMenu() == "pomodoro"
              ? { "data-selected": "true" }
              : "")}
            onmousedown={() => {
              setSettingsMenu("pomodoro");
            }}
            onclick={() => {
              setSettingsMenu("pomodoro");
            }}
            id="pomodoroButton"
            class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10`}
          >
            <Clock
              height={20}
              class="size-6 rounded-lg bg-blue-700 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("pomodoro")}
          </button>
          <button
            {...(settingsMenu() == "soundscapes"
              ? { "data-selected": "true" }
              : "")}
            onmousedown={() => {
              setSettingsMenu("soundscapes");
            }}
            onclick={() => {
              setSettingsMenu("soundscapes");
            }}
            id="soundscapesButton"
            class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10`}
          >
            <Volume2
              height={20}
              class="size-6 rounded-lg bg-zinc-700 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("soundscapes")}
          </button>
          <button
            {...(settingsMenu() == "stopwatch"
              ? { "data-selected": "true" }
              : "")}
            onmousedown={() => {
              setSettingsMenu("stopwatch");
            }}
            onclick={() => {
              setSettingsMenu("stopwatch");
            }}
            id="stopwatchButton"
            class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10`}
          >
            <Timer
              height={20}
              class="size-6 rounded-lg bg-orange-500 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("stopwatch")}
          </button>
          <button
            {...(settingsMenu() == "todos" ? { "data-selected": "true" } : "")}
            onmousedown={() => {
              setSettingsMenu("todos");
            }}
            onclick={() => {
              setSettingsMenu("todos");
            }}
            id="todosButton"
            class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10`}
          >
            <Check
              height={20}
              class="size-6 rounded-lg bg-teal-700 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("tasks")}
          </button>
          <button
            {...(settingsMenu() == "weather"
              ? { "data-selected": "true" }
              : "")}
            onmousedown={() => {
              setSettingsMenu("weather");
            }}
            onclick={() => setSettingsMenu("weather")}
            id="weatherButton"
            class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
              outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
              data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
              dark:data-[selected]:bg-white/10`}
          >
            <Sun
              height={20}
              class="size-6 rounded-lg bg-orange-700 p-0.5 text-white"
            />
            {chrome.i18n.getMessage("weather")}
          </button>
        </div>
        <div class="h-full w-full overflow-y-auto p-10 pt-6 pr-10">
          {settingsMenu() === "general" && (
            <>
              <div>
                <h3 class="text-lg font-[600]">
                  {chrome.i18n.getMessage("layout")}
                </h3>
                <div class="card-group grid-cols-3 grid-rows-2">
                  <BigButton
                    {...(layout() === "top-left"
                      ? { "data-selected": true }
                      : {})}
                    onmousedown={() => {
                      setLayout("top-left");
                    }}
                    onclick={() => setLayout("top-left")}
                    title={chrome.i18n.getMessage("top_left")}
                    icon={
                      <ArrowUpLeft class="size-[64px]" fill="currentColor" />
                    }
                  />
                  <BigButton
                    {...(layout() === "top" ? { "data-selected": true } : {})}
                    onmousedown={() => {
                      setLayout("top");
                    }}
                    onclick={() => setLayout("top")}
                    title={chrome.i18n.getMessage("top")}
                    icon={<ArrowUp class="size-[64px]" fill="currentColor" />}
                  />
                  <BigButton
                    {...(layout() === "top-right"
                      ? { "data-selected": true }
                      : {})}
                    onmousedown={() => {
                      setLayout("top-right");
                    }}
                    onclick={() => setLayout("top-right")}
                    title={chrome.i18n.getMessage("top_right")}
                    icon={
                      <ArrowUpRight class="size-[64px]" fill="currentColor" />
                    }
                  />
                  <BigButton
                    {...(layout() === "bottom-left"
                      ? { "data-selected": true }
                      : {})}
                    onmousedown={() => {
                      setLayout("bottom-left");
                    }}
                    onclick={() => setLayout("bottom-left")}
                    title={chrome.i18n.getMessage("bottom_left")}
                    icon={
                      <ArrowDownLeft class="size-[64px]" fill="currentColor" />
                    }
                  />
                  <BigButton
                    {...(layout() === "center"
                      ? { "data-selected": true }
                      : {})}
                    onmousedown={() => {
                      setLayout("center");
                    }}
                    onclick={() => setLayout("center")}
                    title={chrome.i18n.getMessage("center")}
                    icon={<Dot class="size-[64px]" fill="currentColor" />}
                  />
                  <BigButton
                    {...(layout() === "bottom-right"
                      ? { "data-selected": true }
                      : {})}
                    onmousedown={() => {
                      setLayout("bottom-right");
                    }}
                    onclick={() => setLayout("bottom-right")}
                    title={chrome.i18n.getMessage("bottom_right")}
                    icon={
                      <ArrowDownRight class="size-[64px]" fill="currentColor" />
                    }
                  />
                </div>
              </div>
              <br />
              <br />
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("greeting")}
              </h3>
              <div class="flex max-w-full items-start gap-2">
                <TextFieldRoot class="flex-1 w-full">
                  <TextField
                    placeholder={chrome.i18n.getMessage("enter_greeting")}
                    value={greetingNameValue()}
                    class="w-full h-[30.6px] text-sm"
                    onInput={(e: InputEvent) =>
                      setGreetingNameValue(
                        (e.currentTarget as HTMLInputElement)?.value
                      )
                    }
                    onkeydown={(e: KeyboardEvent) => {
                      if (e.key == "Enter") {
                        setName(greetingNameValue());
                      }
                    }}
                  />
                  <br />
                  <span class="text-muted-foreground text-sm">
                    {chrome.i18n.getMessage("leave_blank_to_disable")}
                  </span>
                </TextFieldRoot>
                <Button
                  onmousedown={() => setName(greetingNameValue())}
                  onclick={() => setName(greetingNameValue())}
                  disabled={name() == greetingNameValue()}
                >
                  {name() == greetingNameValue()
                    ? chrome.i18n.getMessage("saved")
                    : chrome.i18n.getMessage("set_greeting")}
                </Button>
              </div>
              <br />
              <br />
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("page")}
              </h3>
              <div class="flex items-start gap-2">
                <TextFieldRoot class="flex flex-1 gap-2 w-full">
                  <TextField
                    placeholder={chrome.i18n.getMessage("icon")}
                    class="w-10 h-[30.6px] text-sm"
                    value={pageIconValue()}
                    onInput={(e: InputEvent) =>
                      setPageIconValue(
                        (e.currentTarget as HTMLInputElement)?.value
                      )
                    }
                    onkeydown={(e: KeyboardEvent) => {
                      if (e.key == "Enter") {
                        setPageIcon(pageIconValue());
                        setPageIconURL(
                          pageIconValue() == ""
                            ? "assets/icon-256.png"
                            : textToImage(pageIconValue())
                        );
                      }
                    }}
                  />
                  <TextField
                    placeholder={chrome.i18n.getMessage("new_tab")}
                    class="flex-1 h-[30.6px] text-sm"
                    value={pageTitleValue()}
                    onInput={(e: InputEvent) =>
                      setPageTitleValue(
                        (e.currentTarget as HTMLInputElement)?.value
                      )
                    }
                    onkeydown={(e: KeyboardEvent) => {
                      if (e.key == "Enter") {
                        setPageTitle(pageTitleValue());
                      }
                    }}
                  />
                </TextFieldRoot>
                <Button
                  onmousedown={() => {
                    setPageTitle(pageTitleValue());
                    setPageIcon(pageIconValue());
                    setPageIconURL(
                      pageIconValue() == ""
                        ? "assets/icon-256.png"
                        : textToImage(pageIconValue())
                    );
                  }}
                  onclick={() => {
                    setPageTitle(pageTitleValue());
                    setPageIcon(pageIconValue());
                    setPageIconURL(
                      pageIconValue() == ""
                        ? "assets/icon-256.png"
                        : textToImage(pageIconValue())
                    );
                  }}
                  disabled={
                    pageTitle() == pageTitleValue() &&
                    pageIcon() == pageIconValue()
                  }
                >
                  {pageTitle() == pageTitleValue() &&
                  pageIcon() == pageIconValue()
                    ? chrome.i18n.getMessage("saved")
                    : chrome.i18n.getMessage("save")}
                </Button>
              </div>
            </>
          )}
          {settingsMenu() === "appearance" && (
            <>
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("font")}
              </h3>
              <div class="card-group grid-cols-2 grid-rows-2">
                <BigButton
                  {...(font() === "sans" ? { "data-selected": true } : {})}
                  onmousedown={() => {
                    setFont("sans");
                  }}
                  onclick={() => setFont("sans")}
                  title={chrome.i18n.getMessage("sans")}
                  icon={<span class="!font-sans !text-5xl font-bold">Aa</span>}
                />
                <BigButton
                  {...(font() === "serif" ? { "data-selected": true } : {})}
                  onmousedown={() => {
                    setFont("serif");
                  }}
                  onclick={() => setFont("serif")}
                  title={chrome.i18n.getMessage("serif")}
                  icon={<span class="!font-serif !text-5xl font-bold">Aa</span>}
                />
                <BigButton
                  {...(font() === "mono" ? { "data-selected": true } : {})}
                  onmousedown={() => {
                    setFont("mono");
                  }}
                  onclick={() => setFont("mono")}
                  title={chrome.i18n.getMessage("mono")}
                  icon={<span class="!font-mono !text-5xl font-bold">Aa</span>}
                />
                <BigButton
                  {...(font() === "comic-sans"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setFont("comic-sans");
                  }}
                  onclick={() => setFont("comic-sans")}
                  title={chrome.i18n.getMessage("comic_sans")}
                  icon={
                    <span class="!font-comic-sans !text-5xl font-bold">Aa</span>
                  }
                />
              </div>
              <br />
              <br />
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("text_style")}
              </h3>
              <div class="card-group grid-cols-3 grid-rows-1">
                <BigButton
                  {...(textStyle() === "uppercase"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setTextStyle("uppercase");
                  }}
                  onclick={() => setTextStyle("uppercase")}
                  title={chrome.i18n.getMessage("uppercase")}
                  icon={<span class="!text-5xl font-bold !uppercase">AA</span>}
                />
                <BigButton
                  {...(textStyle() === "normal"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setTextStyle("normal");
                  }}
                  onclick={() => setTextStyle("normal")}
                  title={chrome.i18n.getMessage("normal")}
                  icon={
                    <span class="!text-5xl font-bold !normal-case">Aa</span>
                  }
                />
                <BigButton
                  {...(textStyle() === "lowercase"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setTextStyle("lowercase");
                  }}
                  onclick={() => setTextStyle("lowercase")}
                  title={chrome.i18n.getMessage("lowercase")}
                  icon={<span class="!text-5xl font-bold !lowercase">aa</span>}
                />
              </div>
              <br />
              <br />
              <h3 class="mb-2 text-lg font-[600]">
                {chrome.i18n.getMessage("hide_settings")}
              </h3>
              <div class="flex">
                <input
                  type="checkbox"
                  class="mt-0.5 shrink-0 rounded border-gray-200 text-blue-600 focus:ring-blue-500
                    disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700
                    dark:bg-neutral-800 dark:checked:border-blue-500 dark:checked:bg-blue-500
                    dark:focus:ring-offset-gray-800"
                  id="hs-checked-checkbox"
                  onChange={(e) => setHideSettings(e.currentTarget.checked)}
                  checked={hideSettings()}
                />
                <label
                  for="hs-checked-checkbox"
                  class="ms-3 text-sm text-gray-800 dark:text-neutral-400"
                >
                  {chrome.i18n.getMessage("hide_settings_description")}
                </label>
              </div>
            </>
          )}
          {settingsMenu() === "background" && (
            <>
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("background")}
              </h3>
              <div class="card-group grid-cols-2 grid-rows-1">
                <BigButton
                  {...(background() === "image"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setBackground("image");
                  }}
                  onclick={() => setBackground("image")}
                  title={chrome.i18n.getMessage("image")}
                  icon={<Image class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(background() === "solid-color"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setBackground("solid-color");
                  }}
                  onclick={() => setBackground("solid-color")}
                  title={chrome.i18n.getMessage("solid_color")}
                  icon={<PaintBucket class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(background() === "gradient"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setBackground("gradient");
                  }}
                  onclick={() => setBackground("gradient")}
                  title={chrome.i18n.getMessage("gradient")}
                  icon={<Sunrise class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(background() === "blank"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setBackground("blank");
                  }}
                  onclick={() => setBackground("blank")}
                  title={chrome.i18n.getMessage("blank")}
                  icon={<Square class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(background() === "custom-url"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setBackground("custom-url");
                  }}
                  onclick={() => setBackground("custom-url")}
                  title={chrome.i18n.getMessage("custom_url")}
                  icon={<Link class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(background() === "local-file"
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    setBackground("local-file");
                  }}
                  onclick={() => setBackground("local-file")}
                  title={chrome.i18n.getMessage("local_file")}
                  icon={<File class="size-[64px]" fill="none" />}
                />
              </div>
              {background() === "custom-url" && (
                <>
                  <br />
                  <br />
                  <h3 class="text-lg font-[600]">
                    {chrome.i18n.getMessage("custom_url")}
                  </h3>
                  <TextFieldRoot class="flex-1">
                    <TextField
                      placeholder={chrome.i18n.getMessage("custom_url")}
                      value={customUrl()}
                      onInput={(e: InputEvent) =>
                        setCustomUrl(
                          (e.currentTarget as HTMLInputElement)?.value.trim()
                        )
                      }
                    />
                  </TextFieldRoot>
                </>
              )}
              {background() === "solid-color" && (
                <>
                  <br />
                  <br />
                  <h3 class="text-lg font-[600]">
                    {chrome.i18n.getMessage("custom_color")}
                  </h3>
                  <input
                    type="color"
                    class="block h-10 w-14 cursor-pointer rounded-lg border border-gray-200 bg-white p-1
                      disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700
                      dark:bg-neutral-900"
                    id="hs-color-input"
                    value={color()}
                    onInput={(e) => setColor(e.currentTarget.value)}
                    title="Choose your color"
                  />
                </>
              )}
              {background() === "local-file" && (
                <>
                  <br />
                  <br />
                  <h3 class="text-lg font-[600]">
                    {chrome.i18n.getMessage("local_file")}
                  </h3>
                  <form class="max-w-sm">
                    <label for="file-input" class="sr-only">
                      {chrome.i18n.getMessage("choose_file")}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      name="file-input"
                      id="file-input"
                      onChange={(e) => {
                        const files: FileList | null = e.target?.files;
                        if (files && files[0]) {
                          if (!files[0].type.startsWith("image/")) {
                            alert(chrome.i18n.getMessage("invalid_file_type"));
                            return;
                          }
                          const reader = new FileReader();

                          reader.onload = (e) => {
                            if (e.target && e.target.result) {
                              if (
                                e.target.result.toString().length >
                                2.5 * 1024 * 1024
                              ) {
                                alert(chrome.i18n.getMessage("file_too_large"));
                                return;
                              }
                              setLocalFileImage(e.target.result.toString());
                            }
                          };

                          reader.onerror = () => {
                            alert(chrome.i18n.getMessage("file_read_error"));
                          };

                          reader.readAsDataURL(files[0]);
                        }
                      }}
                      class="block w-full rounded-lg border-none bg-neutral-500 text-sm text-white
                        backdrop-blur-3xl file:me-4 file:border-0 file:bg-neutral-600 file:px-4
                        file:py-3 file:text-white focus:z-10 focus:border-blue-500 focus:ring-blue-500
                        disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700
                        dark:bg-black/5 dark:text-neutral-400 dark:file:bg-white/10
                        dark:file:text-neutral-400"
                    />
                  </form>
                </>
              )}
              <br />
              <br />
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("new_wallpaper")}
              </h3>
              <div class="card-group grid-cols-2 grid-rows-1">
                <BigButton
                  {...(Number(wallpaperChangeTime()) === 1
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    localStorage.removeItem("selectedImage");
                    setWallpaperChangeTime(1);
                  }}
                  onclick={() => {
                    localStorage.removeItem("selectedImage");
                    setWallpaperChangeTime(1);
                  }}
                  title={chrome.i18n.getMessage("every_reload")}
                  icon={<RefreshCcw class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(Number(wallpaperChangeTime()) === 1000 * 60 * 60
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    localStorage.removeItem("selectedImage");
                    setWallpaperChangeTime(1000 * 60 * 60);
                  }}
                  onclick={() => {
                    localStorage.removeItem("selectedImage");
                    setWallpaperChangeTime(1000 * 60 * 60);
                  }}
                  title={chrome.i18n.getMessage("every_hour")}
                  icon={<Hourglass class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(Number(wallpaperChangeTime()) === 1000 * 60 * 60 * 24
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    localStorage.removeItem("selectedImage");
                    setWallpaperChangeTime(1000 * 60 * 60 * 24);
                  }}
                  onclick={() => {
                    localStorage.removeItem("selectedImage");
                    setWallpaperChangeTime(1000 * 60 * 60 * 24);
                  }}
                  title={chrome.i18n.getMessage("every_day")}
                  icon={<Calendar1 class="size-[64px]" fill="none" />}
                />
                <BigButton
                  {...(Number(wallpaperChangeTime()) === 1000 * 60 * 60 * 24 * 7
                    ? { "data-selected": true }
                    : {})}
                  onmousedown={() => {
                    localStorage.removeItem("selectedImage");
                    setWallpaperChangeTime(1000 * 60 * 60 * 24 * 7);
                  }}
                  onclick={() => {
                    localStorage.removeItem("selectedImage");
                    setWallpaperChangeTime(1000 * 60 * 60 * 24 * 7);
                  }}
                  title={chrome.i18n.getMessage("every_week")}
                  icon={<Calendar class="size-[64px]" fill="none" />}
                />
              </div>
              <br />
              <br />
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("opacity")}
              </h3>
              <div class="flex items-start gap-2">
                <input
                  type="range"
                  class="h-2 w-full appearance-none rounded-lg bg-zinc-100 dark:bg-zinc-600"
                  value={Number(opacity()) * 100}
                  onInput={(e) =>
                    setOpacity(Number(e.currentTarget.value) / 100)
                  }
                />
              </div>
              <br />
              <br />
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("wallpaper_blur")}
              </h3>
              <div class="flex items-start gap-2">
                <input
                  type="range"
                  class="h-2 w-full appearance-none rounded-lg bg-zinc-100 dark:bg-zinc-600"
                  value={Number(wallpaperBlur() * 2.5)}
                  onInput={(e) =>
                    setWallpaperBlur(Number(e.currentTarget.value) / 2.5)
                  }
                />
              </div>
            </>
          )}
          {settingsMenu() === "advanced" && (
            <>
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("custom_css")}
              </h3>
              <div id="editor" class="w-full !h-fit bg-transparent"></div>
              <br />
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("clear_data")}
              </h3>
              <Dialog
                open={clearDataDialogOpen()}
                onOpenChange={setClearDataDialogOpen}
              >
                <DialogTrigger
                  aria-label={chrome.i18n.getMessage("clear_data")}
                >
                  <Button>{chrome.i18n.getMessage("clear_data")}</Button>
                </DialogTrigger>
                <DialogContent class="h-fit w-80 overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {chrome.i18n.getMessage("clear_data")}
                    </DialogTitle>
                    <DialogDescription>
                      {chrome.i18n.getMessage("clear_data_description")}
                    </DialogDescription>
                  </DialogHeader>
                  <br />
                  <DialogFooter class="flex !justify-start mt-4">
                    <Button onClick={() => setClearDataDialogOpen(false)}>
                      {chrome.i18n.getMessage("cancel")}
                    </Button>
                    <Button
                      onClick={() => {
                        localStorage.clear();
                        if (chrome.storage) {
                          chrome.storage.local.clear();
                          chrome.storage.sync.clear();
                        }
                        window.location.reload();
                      }}
                    >
                      {chrome.i18n.getMessage("clear_data")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <br />
            </>
          )}
          {settingsMenu() === "date" && (
            <>
              <h3 class="text-lg font-[600] mb-2">
                {chrome.i18n.getMessage("date")}
              </h3>
              <Switch
                class="flex items-center space-x-2"
                checked={actuallyBoolean(dateContained())}
                onChange={(value: boolean) => {
                  setDateContained(value);
                }}
              >
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel
                  class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed
                    data-[disabled]:opacity-70"
                >
                  {chrome.i18n.getMessage("enabled")}
                </SwitchLabel>
              </Switch>
              {actuallyBoolean(dateContained()) && (
                <div>
                  <br />
                  <span class="text-sm">
                    {chrome.i18n.getMessage("date_format")}
                  </span>
                  <Switch
                    class="flex items-center space-x-2"
                    checked={dateFormat() == "iso-8601"}
                    onChange={(value: boolean) => {
                      if (value) {
                        setDateFormat("iso-8601");
                      } else {
                        setDateFormat("normal");
                      }
                    }}
                  >
                    <SwitchControl>
                      <SwitchThumb />
                    </SwitchControl>
                    <SwitchLabel
                      class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed
                        data-[disabled]:opacity-70"
                    >
                      ISO-8601
                    </SwitchLabel>
                  </Switch>
                </div>
              )}
            </>
          )}
          {settingsMenu() === "todos" && (
            <>
              <h3 class="text-lg font-[600] mb-2">
                {chrome.i18n.getMessage("tasks")}
              </h3>
              <Switch
                class="flex items-center space-x-2"
                checked={actuallyBoolean(todosContained())}
                onChange={(value: boolean) => {
                  setTodosContained(value);
                }}
              >
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel
                  class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed
                    data-[disabled]:opacity-70"
                >
                  {chrome.i18n.getMessage("enabled")}
                </SwitchLabel>
              </Switch>
            </>
          )}
          {settingsMenu() === "weather" && (
            <>
              <h3 class="text-lg font-[600] mb-2">
                {chrome.i18n.getMessage("weather")}
              </h3>
              <Switch
                class="flex items-center space-x-2"
                checked={weatherEnabled()}
                onChange={(value: boolean) => {
                  setWeatherEnabled(value);
                }}
              >
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel
                  class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed
                    data-[disabled]:opacity-70"
                >
                  {chrome.i18n.getMessage("enabled")}
                </SwitchLabel>
              </Switch>
              <Show when={weatherEnabled()}>
                <br />
                <p
                  innerHTML={chrome.i18n.getMessage("weatherDisclaimer", [
                    "https://open-meteo.com/en/docs",
                  ])}
                />
                <br />
                <h3 class="text-lg font-[600] mb-2">
                  {chrome.i18n.getMessage("location")}
                </h3>
                <TextFieldRoot class="flex-1">
                  <TextFieldLabel class="text-sm font-medium text-muted-foreground">
                    {chrome.i18n.getMessage("search")}
                  </TextFieldLabel>
                  <div class="flex items-center gap-2">
                    <TextField
                      placeholder={chrome.i18n.getMessage("location")}
                      value={locationCityValue()}
                      onInput={(e: InputEvent) =>
                        setLocationCityValue(
                          (e.currentTarget as HTMLInputElement)?.value
                        )
                      }
                      onkeydown={(e: KeyboardEvent) => {
                        if (e.key == "Enter") {
                          setLocationCityValue(locationCityValue());
                          fetch(
                            `https://geocoding-api.open-meteo.com/v1/search?name=${locationCityValue()}&count=10&language=en&format=json`
                          )
                            .then((response) => response.json())
                            .then((data) => {
                              if (data.results.length > 0) {
                                setLocationCityValue("");
                                setCity(data.results[0].name);
                                setLatitudeInput(data.results[0].latitude);
                                setLongitudeInput(data.results[0].longitude);
                                (document.getElementById(
                                  "latitude-input"
                                ) as HTMLInputElement)!.value =
                                  data.results[0].latitude;
                                (document.getElementById(
                                  "longitude-input"
                                ) as HTMLInputElement)!.value =
                                  data.results[0].longitude;
                                setLocation([
                                  data.results[0].latitude,
                                  data.results[0].longitude,
                                ]);
                                updateWeatherManually(
                                  data.results[0].latitude,
                                  data.results[0].longitude
                                );
                              }
                            });
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        setLocationCityValue(locationCityValue());
                        fetch(
                          `https://geocoding-api.open-meteo.com/v1/search?name=${locationCityValue()}&count=10&language=en&format=json`
                        )
                          .then((response) => response.json())
                          .then((data) => {
                            if (data.results.length > 0) {
                              setLocationCityValue("");
                              setCity(data.results[0].name);
                              setLatitudeInput(data.results[0].latitude);
                              setLongitudeInput(data.results[0].longitude);
                              (document.getElementById(
                                "latitude-input"
                              ) as HTMLInputElement)!.value =
                                data.results[0].latitude;
                              (document.getElementById(
                                "longitude-input"
                              ) as HTMLInputElement)!.value =
                                data.results[0].longitude;
                              setLocation([
                                data.results[0].latitude,
                                data.results[0].longitude,
                              ]);
                              updateWeatherManually(
                                data.results[0].latitude,
                                data.results[0].longitude
                              );
                            }
                          });
                      }}
                    >
                      {chrome.i18n.getMessage("search")}
                    </Button>
                  </div>
                </TextFieldRoot>
                <br />
                <div class="flex flex-col">
                  <p class="text-sm font-medium text-muted-foreground">
                    {chrome.i18n.getMessage("coordinates")}
                  </p>
                  <div class="flex items-center gap-2">
                    <TextFieldRoot
                      class="flex-1"
                      defaultValue={safeParse(location(), location())[0]}
                    >
                      <TextField
                        placeholder={chrome.i18n.getMessage("latitude")}
                        onInput={(e: InputEvent) =>
                          setLatitudeInput(
                            (e.currentTarget as HTMLInputElement)?.value
                          )
                        }
                        onkeydown={(e: KeyboardEvent) => {
                          if (e.key == "Enter") {
                            setCity("");
                            setLocationCityValue("");
                            setLocation([
                              Number(latitudeInput()),
                              Number(longitudeInput()),
                            ]);
                            updateWeatherManually(
                              Number(latitudeInput()),
                              Number(longitudeInput())
                            );
                          }
                        }}
                        id="latitude-input"
                      />
                    </TextFieldRoot>
                    <TextFieldRoot
                      class="flex-1"
                      defaultValue={safeParse(location(), location())[1]}
                    >
                      <TextField
                        placeholder={chrome.i18n.getMessage("longitude")}
                        onInput={(e: InputEvent) =>
                          setLongitudeInput(
                            (e.currentTarget as HTMLInputElement)?.value
                          )
                        }
                        onkeydown={(e: KeyboardEvent) => {
                          if (e.key == "Enter") {
                            setCity("");
                            setLocationCityValue("");
                            setLocation([
                              Number(latitudeInput()),
                              Number(longitudeInput()),
                            ]);
                            updateWeatherManually(
                              Number(latitudeInput()),
                              Number(longitudeInput())
                            );
                          }
                        }}
                        id="longitude-input"
                      />
                    </TextFieldRoot>
                    <Button
                      onClick={() => {
                        setCity("");
                        setLocationCityValue("");
                        setLocation([
                          Number(latitudeInput()),
                          Number(longitudeInput()),
                        ]);
                        updateWeatherManually(
                          Number(latitudeInput()),
                          Number(longitudeInput())
                        );
                      }}
                    >
                      {chrome.i18n.getMessage("set")}
                    </Button>
                  </div>
                </div>
                <br />
                <h3 class="text-lg font-[600]">
                  {chrome.i18n.getMessage("unit")}
                </h3>
                <RadioGroup
                  defaultValue={imperial() ? "imperical" : "metric"}
                  onChange={(value: string) => {
                    setImperial(value === "imperical");
                  }}
                >
                  <RadioGroupItem
                    value="metric"
                    class="flex items-center gap-2"
                  >
                    <RadioGroupItemControl />
                    <RadioGroupItemLabel class="text-sm">
                      {chrome.i18n.getMessage("metric")}
                    </RadioGroupItemLabel>
                  </RadioGroupItem>
                  <RadioGroupItem
                    value="imperical"
                    class="flex items-center gap-2"
                  >
                    <RadioGroupItemControl />
                    <RadioGroupItemLabel class="text-sm">
                      {chrome.i18n.getMessage("imperial")}
                    </RadioGroupItemLabel>
                  </RadioGroupItem>
                </RadioGroup>
              </Show>
            </>
          )}
          {settingsMenu() === "bookmarks" && (
            <>
              <h3 class="text-lg font-[600] mb-2">
                {chrome.i18n.getMessage("bookmarks")}
              </h3>
              <Switch
                class="flex items-center space-x-2"
                checked={actuallyBoolean(bookmarksContained())}
                onChange={(value: boolean) => {
                  setBookmarksContained(value);
                }}
              >
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel
                  class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed
                    data-[disabled]:opacity-70"
                >
                  {chrome.i18n.getMessage("enabled")}
                </SwitchLabel>
              </Switch>
              <br />
              {bookmarksContained() && (
                <>
                  <span class="text-sm font-medium text-muted-foreground">
                    {chrome.i18n.getMessage("pinned_bookmarks")}
                  </span>
                  <div class="flex gap-2 flex-wrap">
                    {(
                      safeParse(
                        bookmarksShown(),
                        bookmarksShown()
                      ) as Array<Bookmark>
                    ).map((bookmark, index) => (
                      <button
                        onClick={() => {
                          const currentBookmarksShown = safeParse(
                            bookmarksShown(),
                            bookmarksShown()
                          ) as Array<Bookmark>;
                          if (
                            currentBookmarksShown.some(
                              (bookmarkShown: Bookmark) =>
                                bookmarkShown.url == bookmark.url
                            )
                          ) {
                            const newBookmarksShown =
                              currentBookmarksShown.filter(
                                (bookmarkShown: Bookmark) =>
                                  bookmarkShown.url != bookmark.url
                              );
                            setBookmarksShown(newBookmarksShown);
                          } else {
                            setBookmarksShown(
                              JSON.stringify([
                                ...currentBookmarksShown,
                                bookmark,
                              ])
                            );
                          }
                        }}
                        class="font-medium text-black rounded-lg dark:text-white text-sm p-4 bg-[#EDECEB]
                          border-1 border-[#C0C0B8] h-[30px] flex justify-center items-center gap-2
                          dark:bg-[#121314] dark:border-[#3F3F47]"
                      >
                        <span>{bookmark.name}</span>
                        <Check class="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                  <br />
                  <span class="text-sm font-medium text-muted-foreground">
                    {chrome.i18n.getMessage("available_bookmarks")}
                  </span>
                  <div class="flex gap-2 flex-wrap">
                    {bookmarks()
                      .filter((bookmark: Bookmark) => {
                        return !(
                          safeParse(
                            bookmarksShown(),
                            bookmarksShown()
                          ) as Array<Bookmark>
                        ).some(
                          (bookmarkShown: Bookmark) =>
                            bookmarkShown.url == bookmark.url
                        );
                      })
                      .map((bookmark, index) => (
                        <button
                          onClick={() => {
                            const currentBookmarksShown = safeParse(
                              bookmarksShown(),
                              bookmarksShown()
                            ) as Array<Bookmark>;
                            if (
                              currentBookmarksShown.some(
                                (bookmarkShown: Bookmark) =>
                                  bookmarkShown.url == bookmark.url
                              )
                            ) {
                              const newBookmarksShown =
                                currentBookmarksShown.filter(
                                  (bookmarkShown: Bookmark) =>
                                    bookmarkShown.url != bookmark.url
                                );
                              setBookmarksShown(
                                JSON.stringify(newBookmarksShown)
                              );
                            } else {
                              setBookmarksShown(
                                JSON.stringify([
                                  ...currentBookmarksShown,
                                  bookmark,
                                ])
                              );
                            }
                          }}
                          class="font-medium text-black rounded-lg dark:text-white text-sm p-4 bg-[#EDECEB]
                            border-1 border-[#C0C0B8] h-[30px] flex justify-center items-center gap-2
                            dark:bg-[#121314] dark:border-[#3F3F47]"
                        >
                          <span>{bookmark.name}</span>
                          <Plus class="h-4 w-4" />
                        </button>
                      ))}
                  </div>
                </>
              )}
            </>
          )}
          {settingsMenu() === "pomodoro" && (
            <>
              <h3 class="text-lg font-[600] mb-2">
                {chrome.i18n.getMessage("pomodoro")}
              </h3>
              <Switch
                class="flex items-center space-x-2"
                checked={actuallyBoolean(pomodoroContained())}
                onChange={(value: boolean) => {
                  setPomodoroContained(value);
                }}
              >
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel
                  class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed
                    data-[disabled]:opacity-70"
                >
                  {chrome.i18n.getMessage("enabled")}
                </SwitchLabel>
              </Switch>
              {actuallyBoolean(pomodoroContained()) && (
                <div>
                  <br />
                  <TextFieldRoot class="mt-1 flex-1">
                    <span class="text-sm font-medium text-muted-foreground">
                      {chrome.i18n.getMessage("work_minutes")}
                    </span>
                    <br />
                    <TextField
                      placeholder={chrome.i18n.getMessage("work_minutes")}
                      value={
                        (typeof pomodoroConfig() === "object"
                          ? (pomodoroConfig as Function)().workMinutes
                          : pomodoroConfig()) as string
                      }
                      onInput={(e: InputEvent) => {
                        const newPomodoroConfig =
                          typeof pomodoroConfig() === "object"
                            ? JSON.parse(JSON.stringify(pomodoroConfig()))
                            : {};
                        newPomodoroConfig.workMinutes = Number(
                          (e.currentTarget as HTMLInputElement)?.value
                        );
                        setPomodoroConfig(newPomodoroConfig);
                      }}
                    />
                  </TextFieldRoot>
                  <br />
                  <TextFieldRoot class="mt-2 flex-1">
                    <span class="text-sm font-medium text-muted-foreground">
                      {chrome.i18n.getMessage("break_minutes")}
                    </span>
                    <br />
                    <TextField
                      placeholder={chrome.i18n.getMessage("break_minutes")}
                      value={
                        typeof pomodoroConfig() === "object"
                          ? (pomodoroConfig as Function)().breakMinutes
                          : pomodoroConfig()
                      }
                      onInput={(e: InputEvent) => {
                        const newPomodoroConfig =
                          typeof pomodoroConfig() === "object"
                            ? JSON.parse(JSON.stringify(pomodoroConfig()))
                            : {};
                        newPomodoroConfig.breakMinutes = Number(
                          (e.currentTarget as HTMLInputElement)?.value
                        );
                        setPomodoroConfig(newPomodoroConfig);
                      }}
                    />
                  </TextFieldRoot>
                  <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {chrome.i18n.getMessage("you_may_need_to_refresh")}
                  </span>
                </div>
              )}
            </>
          )}
          {settingsMenu() === "soundscapes" && (
            <>
              <h3 class="text-lg font-[600] mb-2">
                {chrome.i18n.getMessage("soundscapes")}
              </h3>
              <Switch
                class="flex items-center space-x-2"
                checked={natureSounds()}
                onChange={(value: boolean) => {
                  setNatureSounds(value);
                }}
              >
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel
                  class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed
                    data-[disabled]:opacity-70"
                >
                  {chrome.i18n.getMessage("nature_sounds")}
                </SwitchLabel>
              </Switch>
              <br />
              <Switch
                class="flex items-center space-x-2"
                checked={focusSounds()}
                onChange={(value: boolean) => {
                  setFocusSounds(value);
                }}
              >
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel
                  class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed
                    data-[disabled]:opacity-70"
                >
                  {chrome.i18n.getMessage("focus_sounds")}
                </SwitchLabel>
              </Switch>
              <br />
              <Switch
                class="flex items-center space-x-2"
                checked={ambienceSounds()}
                onChange={(value: boolean) => {
                  setAmbienceSounds(value);
                }}
              >
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel
                  class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed
                    data-[disabled]:opacity-70"
                >
                  {chrome.i18n.getMessage("ambience_sounds")}
                </SwitchLabel>
              </Switch>
            </>
          )}
          {settingsMenu() === "mantras" && (
            <>
              <h3 class="text-lg font-[600] mb-2">
                {chrome.i18n.getMessage("mantras")}
              </h3>
              <Switch
                class="flex items-center space-x-2"
                checked={actuallyBoolean(mantrasContained())}
                onChange={(value: boolean) => {
                  setMantrasContained(value);
                }}
              >
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel
                  class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed
                    data-[disabled]:opacity-70"
                >
                  {chrome.i18n.getMessage("enabled")}
                </SwitchLabel>
              </Switch>
            </>
          )}
          {settingsMenu() === "stopwatch" && (
            <>
              <h3 class="text-lg font-[600] mb-2">
                {chrome.i18n.getMessage("stopwatch")}
              </h3>
              <Switch
                class="flex items-center space-x-2"
                checked={actuallyBoolean(stopwatchContained())}
                onChange={(value: boolean) => {
                  setStopwatchContained(value);
                }}
              >
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel
                  class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed
                    data-[disabled]:opacity-70"
                >
                  {chrome.i18n.getMessage("enabled")}
                </SwitchLabel>
              </Switch>
            </>
          )}
          {settingsMenu() === "clock" && (
            <>
              <h3 class="text-lg font-[600] mb-2">
                {chrome.i18n.getMessage("clock")}
              </h3>
              <Switch
                class="flex items-center space-x-2"
                checked={actuallyBoolean(clockContained())}
                onChange={(value: boolean) => {
                  setClockContained(value);
                }}
              >
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel
                  class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed
                    data-[disabled]:opacity-70"
                >
                  {chrome.i18n.getMessage("enabled")}
                </SwitchLabel>
              </Switch>
              {actuallyBoolean(clockContained()) && (
                <div>
                  <br />
                  <span class="text-sm">
                    {chrome.i18n.getMessage("clock_format")}
                  </span>
                  <RadioGroup
                    defaultValue={clockFormat()}
                    onChange={(value: string) => {
                      setClockFormat(value);
                    }}
                  >
                    <RadioGroupItem value="12h" class="flex items-center gap-2">
                      <RadioGroupItemControl />
                      <RadioGroupItemLabel class="text-sm">
                        12h
                      </RadioGroupItemLabel>
                    </RadioGroupItem>
                    <RadioGroupItem value="24h" class="flex items-center gap-2">
                      <RadioGroupItemControl />
                      <RadioGroupItemLabel class="text-sm">
                        24h
                      </RadioGroupItemLabel>
                    </RadioGroupItem>
                  </RadioGroup>
                </div>
              )}
            </>
          )}
          {settingsMenu() === "counter" && (
            <>
              <h3 class="text-lg font-[600] mb-2">
                {chrome.i18n.getMessage("counter")}
              </h3>
              <Switch
                class="flex items-center space-x-2"
                checked={actuallyBoolean(counterContained())}
                onChange={(value: boolean) => {
                  setCounterContained(value);
                }}
              >
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel
                  class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed
                    data-[disabled]:opacity-70"
                >
                  {chrome.i18n.getMessage("enabled")}
                </SwitchLabel>
              </Switch>
            </>
          )}
          {settingsMenu() === "notepad" && (
            <>
              <h3 class="text-lg font-[600] mb-2">
                {chrome.i18n.getMessage("notepad")}
              </h3>
              <Switch
                class="flex items-center space-x-2"
                checked={actuallyBoolean(notepadContained())}
                onChange={(value: boolean) => {
                  setNotepadContained(value);
                }}
              >
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchLabel
                  class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed
                    data-[disabled]:opacity-70"
                >
                  {chrome.i18n.getMessage("enabled")}
                </SwitchLabel>
              </Switch>
            </>
          )}
          <br />
          <div
            class={cn(
              `px-4 py-3 bg-[#EDECEB] dark:bg-[#121314] border-1 border-[#C0C0B8]
              dark:border-[#3F3F47] rounded-lg mt-2`,
              {
                hidden: actuallyBoolean(feedbackCalloutHidden()),
              }
            )}
          >
            <h1 class="text-lg font-[600]">
              {chrome.i18n.getMessage("feedback_callout")}
            </h1>
            <p class="text-sm mb-2">
              {chrome.i18n.getMessage("feedback_callout_desc")}
            </p>
            <div class="flex items-center gap-2">
              <a href="https://feedback.flowtide.app">
                <Button>{chrome.i18n.getMessage("give_feedback")}</Button>
              </a>
              <Button
                variant={"outline"}
                onclick={() => {
                  setFeedbackCalloutHidden(true);
                }}
              >
                {chrome.i18n.getMessage("hide_message")}
              </Button>
            </div>
          </div>
          <br />
          <hr />
          <footer class="text-md py-2 flex items-center justify-between gap-2">
            <span class="font-medium flex gap-2 items-center">
              <img src="assets/icon-128.png" height="24px" width="24px" />{" "}
              Flowtide
            </span>
            <div class="socials transition-all flex gap-2 items-center">
              <a
                href="https://github.com/thingbomb/flowtide"
                target="_blank"
                class="text-black dark:text-white"
              >
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  width="20px"
                  height="20px"
                  class="fill-current"
                >
                  {" "}
                  <path
                    fill="currentColor"
                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
                  ></path>{" "}
                </svg>
              </a>
              <a
                href="https://discord.gg/hhPuurkvua"
                target="_blank"
                class="text-black dark:text-white"
              >
                <svg
                  viewBox="0 0 256 199"
                  width="1.5em"
                  height="1.5em"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid"
                >
                  <path
                    d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a
                href="https://bsky.app/profile/flowtide.app"
                target="_blank"
                class="text-black dark:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  preserveAspectRatio="xMidYMid"
                  viewBox="0 0 256 226"
                >
                  <path
                    fill="currentColor"
                    d="M55.491 15.172c29.35 22.035 60.917 66.712 72.509 90.686 11.592-23.974 43.159-68.651 72.509-90.686C221.686-.727 256-13.028 256 26.116c0 7.818-4.482 65.674-7.111 75.068-9.138 32.654-42.436 40.983-72.057 35.942 51.775 8.812 64.946 38 36.501 67.187-54.021 55.433-77.644-13.908-83.696-31.676-1.11-3.257-1.63-4.78-1.637-3.485-.008-1.296-.527.228-1.637 3.485-6.052 17.768-29.675 87.11-83.696 31.676-28.445-29.187-15.274-58.375 36.5-67.187-29.62 5.041-62.918-3.288-72.056-35.942C4.482 91.79 0 33.934 0 26.116 0-13.028 34.314-.727 55.491 15.172Z"
                  />
                </svg>
              </a>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  onMount(() => {
    if (chrome.bookmarks !== undefined) {
      chrome.bookmarks.getTree((bookmarkTreeNodes: BookmarkTreeNode[]) => {
        const flattenBookmarks = (nodes: any[]): Bookmark[] => {
          let bookmarks: Bookmark[] = [];
          for (const node of nodes) {
            if (node.url) {
              bookmarks.push({ name: node.title, url: node.url });
            }
            if (node.children) {
              bookmarks = bookmarks.concat(flattenBookmarks(node.children));
            }
          }
          return bookmarks;
        };
        const allBookmarks = flattenBookmarks(bookmarkTreeNodes);
        setBookmarks(allBookmarks);
      });
    }
  });

  return (
    <Dialog open={dialogOpen()} onOpenChange={setDialogOpen}>
      <DialogTrigger
        id="settingsButton"
        class={triggerClass}
        aria-label={chrome.i18n.getMessage("add_widget")}
      >
        <Settings class="transition-transform" />
      </DialogTrigger>
      <DialogContent
        class={cn(
          "max-w-3xl overflow-hidden",
          textStyle() == "uppercase" ? "**:!uppercase" : "",
          textStyle() == "lowercase" ? "**:lowercase" : ""
        )}
      >
        <DialogHeader>
          <DialogTitle class="mb-4 pl-4 sr-only">
            {chrome.i18n.getMessage("settings")}
          </DialogTitle>
        </DialogHeader>
        <SettingsPage />
      </DialogContent>
    </Dialog>
  );
}

export { SettingsTrigger };
