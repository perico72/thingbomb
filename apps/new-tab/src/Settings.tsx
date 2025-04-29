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

import { Bookmark, Settings } from "lucide-solid";
import "prism-code-editor/prism/languages/css";
import { basicEditor } from "prism-code-editor/setups";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import SettingItem from "./components/SettingItem";
import SettingsFooter from "./components/settings/SettingsFooter";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { createStoredSignal } from "./hooks/localStorage";
import { actuallyBoolean } from "./libs/boolean";
import { cn } from "./libs/cn";
import { settingsNavigation } from "./libs/settings";

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
          {settingsNavigation.map((item) => (
            <button
              class={cn(
                `flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-black
                outline-none hover:bg-black/5 active:opacity-80 data-[selected]:bg-black/10
                data-[selected]:backdrop-blur-2xl dark:text-white dark:hover:bg-white/5
                dark:data-[selected]:bg-white/10`,
                {
                  "mb-4": item.id == "advanced",
                }
              )}
              {...(settingsMenu() == item.id
                ? { "data-selected": "true" }
                : "")}
              id={item.id + "Button"}
              onmousedown={() => {
                setSettingsMenu(item.id);
              }}
              onclick={() => {
                setSettingsMenu(item.id);
              }}
            >
              <item.icon
                height={20}
                class={cn(
                  "size-6 rounded-lg bg-purple-700 p-0.5 text-white",
                  item.iconBackground,
                  item.iconTextColor
                )}
              />
              {chrome.i18n.getMessage(item.title as any)}
            </button>
          ))}
        </div>
        <div class="h-fit w-full p-10 pt-6 pr-10">
          {settingsMenu() === "general" && (
            <>
              <SettingItem id="layout" />
              <br />
              <br />
              <SettingItem id="greeting" />
              <br />
              <br />
              <SettingItem id="pageIcon" />
              <br />
              <SettingItem id="pageTitle" />
            </>
          )}
          {settingsMenu() === "appearance" && (
            <>
              <SettingItem id="font" />
              <br />
              <br />
              <SettingItem id="textStyle" />
              <br />
              <br />
              <SettingItem id="hideSettings" />
            </>
          )}
          {settingsMenu() === "background" && (
            <>
              <SettingItem id="backgroundType" />
              {background() === "custom-url" && <SettingItem id="customUrl" />}
              {background() === "solid-color" && <SettingItem id="color" />}
              {background() === "local-file" && <SettingItem id="localFile" />}
              <br />
              <br />
              <SettingItem id="wallpaperChangeTime" />
              <br />
              <br />
              <SettingItem id="opacity" />
              <br />
              <br />
              <SettingItem id="wallpaperBlur" />
            </>
          )}
          {settingsMenu() === "advanced" && (
            <>
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("custom_css")}
              </h3>
              <div id="editor" class="w-full !h-fit bg-transparent"></div>
              <br />
              <SettingItem id="clearData" />
              <br />
            </>
          )}
          {settingsMenu() === "date" && <SettingItem id="date" />}
          {settingsMenu() === "todos" && <SettingItem id="todos" />}
          {settingsMenu() === "bookmarks" && <SettingItem id="bookmarks" />}
          {settingsMenu() === "pomodoro" && <SettingItem id="pomodoro" />}
          {settingsMenu() === "soundscapes" && (
            <>
              <h3 class="text-lg font-[600]">
                {chrome.i18n.getMessage("soundscapes")}
              </h3>
              <p class="text-sm mb-4">
                {chrome.i18n.getMessage("soundscapes_desc")}
              </p>
              <SettingItem id="focusSounds" />
              <SettingItem id="natureSounds" />
              <SettingItem id="ambienceSounds" />
            </>
          )}
          {settingsMenu() === "mantras" && <SettingItem id="mantras" />}
          {settingsMenu() === "stopwatch" && <SettingItem id="stopwatch" />}
          {settingsMenu() === "clock" && <SettingItem id="clock" />}
          {settingsMenu() === "counter" && <SettingItem id="counter" />}
          {settingsMenu() === "notepad" && <SettingItem id="notepad" />}
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
              <a href="https://feedback.blooft.com">
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
          <SettingsFooter />
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
        class={cn("max-w-3xl overflow-hidden bg-white dark:bg-[#2c2c2c]")}
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
