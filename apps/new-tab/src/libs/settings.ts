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
  Heart,
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
  Share,
  Square,
  Sun,
  Sunrise,
  Timer,
  Volume2,
} from "lucide-solid";

export interface SettingItem {
  id: string;
  title: string;
  group: string;
  icon: any;
  iconBackground?: string;
  storedValue?: string;
  defaultValue?: any;
  type:
    | "page"
    | "toggle"
    | "button"
    | "select"
    | "input"
    | "range"
    | "color"
    | "file"
    | "bookmark-picker";
  component?: string;
  options?: any[];
}

export interface BookmarkPickerSetting extends SettingItem {
  type: "bookmark-picker";
  storedValue: string;
  defaultValue: Bookmark[] | string;
}

export interface PomodoroConfig {
  workMinutes: number;
  breakMinutes: number;
}

export interface Bookmark {
  name: string;
  url: string;
}

/**
 * Main navigation menu in the settings sidebar
 */
export const settingsNavigation = [
  // Main settings
  {
    id: "general",
    title: "general",
    icon: Settings,
    iconBackground: "bg-purple-700",
    group: "main",
  },
  {
    id: "appearance",
    title: "appearance",
    icon: Palette,
    iconBackground: "bg-pink-700",
    group: "main",
  },
  {
    id: "background",
    title: "background",
    icon: Image,
    iconBackground: "bg-teal-700",
    group: "main",
  },
  {
    id: "advanced",
    title: "advanced",
    icon: Hammer,
    iconBackground: "bg-gray-700",
    group: "main",
  },

  // Widgets
  {
    id: "bookmarks",
    title: "bookmarks",
    icon: Bookmark,
    iconBackground: "bg-purple-700",
    group: "widgets",
  },
  {
    id: "clock",
    title: "clock",
    icon: Clock,
    iconBackground: "bg-teal-700",
    group: "widgets",
  },
  {
    id: "counter",
    title: "counter",
    icon: Plus,
    iconBackground: "bg-cyan-700",
    group: "widgets",
  },
  {
    id: "date",
    title: "date",
    icon: Calendar,
    iconBackground: "bg-amber-700",
    group: "widgets",
  },
  {
    id: "mantras",
    title: "mantras",
    icon: Quote,
    iconBackground: "bg-orange-900",
    group: "widgets",
  },
  {
    id: "notepad",
    title: "notepad",
    icon: Notebook,
    iconBackground: "bg-white",
    iconTextColor: "text-black",
    group: "widgets",
  },
  {
    id: "pomodoro",
    title: "pomodoro",
    icon: Clock,
    iconBackground: "bg-blue-700",
    group: "widgets",
  },
  {
    id: "soundscapes",
    title: "soundscapes",
    icon: Volume2,
    iconBackground: "bg-zinc-700",
    group: "widgets",
  },
  {
    id: "stopwatch",
    title: "stopwatch",
    icon: Timer,
    iconBackground: "bg-orange-500",
    group: "widgets",
  },
  {
    id: "todos",
    title: "tasks",
    icon: Check,
    iconBackground: "bg-teal-700",
    group: "widgets",
  },
];

export const generalSettings = {
  layout: {
    id: "layout",
    title: "layout",
    type: "select",
    storedValue: "layout",
    defaultValue: "top",
    options: [
      {
        id: "top-left",
        title: "top_left",
        icon: ArrowUpLeft,
        value: "top-left",
      },
      {
        id: "top",
        title: "top",
        icon: ArrowUp,
        value: "top",
      },
      {
        id: "top-right",
        title: "top_right",
        icon: ArrowUpRight,
        value: "top-right",
      },
      {
        id: "bottom-left",
        title: "bottom_left",
        icon: ArrowDownLeft,
        value: "bottom-left",
      },
      {
        id: "center",
        title: "center",
        icon: Dot,
        value: "center",
      },
      {
        id: "bottom-right",
        title: "bottom_right",
        icon: ArrowDownRight,
        value: "bottom-right",
      },
    ],
  },
  greeting: {
    id: "greeting",
    title: "greeting",
    type: "input",
    storedValue: "name",
    defaultValue: "",
    placeholder: "enter_greeting",
  },
  pageIcon: {
    id: "pageIcon",
    title: "page_icon",
    type: "input",
    storedValue: "iconUrl",
    defaultValue: "",
  },
  pageTitle: {
    id: "pageTitle",
    title: "page_title",
    type: "input",
    storedValue: "pageTitle",
    defaultValue: "New Tab",
  },
};

export const appearanceSettings = {
  font: {
    id: "font",
    title: "font",
    type: "select",
    storedValue: "font",
    defaultValue: "sans",
    options: [
      {
        id: "sans",
        title: "sans",
        value: "sans",
        preview: "Aa",
      },
      {
        id: "serif",
        title: "serif",
        value: "serif",
        preview: "Aa",
      },
      {
        id: "mono",
        title: "mono",
        value: "mono",
        preview: "Aa",
      },
      {
        id: "comic-sans",
        title: "comic_sans",
        value: "comic-sans",
        preview: "Aa",
      },
    ],
  },
  textStyle: {
    id: "textStyle",
    title: "text_style",
    type: "select",
    storedValue: "textStyle",
    defaultValue: "normal",
    options: [
      {
        id: "uppercase",
        title: "uppercase",
        value: "uppercase",
        preview: "AA",
      },
      {
        id: "normal",
        title: "normal",
        value: "normal",
        preview: "Aa",
      },
      {
        id: "lowercase",
        title: "lowercase",
        value: "lowercase",
        preview: "aa",
      },
    ],
  },
  hideSettings: {
    id: "hideSettings",
    title: "hide_settings",
    description: "hide_settings_description",
    type: "toggle",
    storedValue: "hideSettings",
    defaultValue: false,
  },
  commandPaletteEnabled: {
    id: "commandPaletteEnabled",
    title: "command_palette",
    description: "command_palette_description",
    type: "toggle",
    storedValue: "commandPaletteEnabled",
    defaultValue: true,
  },
};

export const backgroundSettings = {
  backgroundType: {
    id: "background",
    title: "background",
    type: "select",
    storedValue: "background",
    defaultValue: "image",
    options: [
      {
        id: "image",
        title: "image",
        icon: Image,
        value: "image",
      },
      {
        id: "solid-color",
        title: "solid_color",
        icon: PaintBucket,
        value: "solid-color",
      },
      {
        id: "gradient",
        title: "gradient",
        icon: Sunrise,
        value: "gradient",
      },
      {
        id: "blank",
        title: "blank",
        icon: Square,
        value: "blank",
      },
      {
        id: "custom-url",
        title: "custom_url",
        icon: Link,
        value: "custom-url",
      },
      {
        id: "local-file",
        title: "local_file",
        icon: File,
        value: "local-file",
      },
    ],
  },
  customUrl: {
    id: "customUrl",
    title: "custom_url",
    type: "input",
    storedValue: "customUrl",
    defaultValue: "",
    dependsOn: {
      setting: "background",
      value: "custom-url",
    },
  },
  color: {
    id: "color",
    title: "custom_color",
    type: "color",
    storedValue: "color",
    defaultValue: "unset",
    dependsOn: {
      setting: "background",
      value: "solid-color",
    },
  },
  localFile: {
    id: "localFile",
    title: "local_file",
    type: "file",
    accept: "image/*",
    storedValue: "localFile",
    defaultValue: "",
    dependsOn: {
      setting: "background",
      value: "local-file",
    },
  },
  wallpaperChangeTime: {
    id: "wallpaperChangeTime",
    title: "new_wallpaper",
    type: "select",
    storedValue: "wallpaperChangeTime",
    defaultValue: 1000 * 60 * 60 * 24, // 24 hours
    options: [
      {
        id: "every-reload",
        title: "every_reload",
        icon: RefreshCcw,
        value: 1,
      },
      {
        id: "every-hour",
        title: "every_hour",
        icon: Hourglass,
        value: 1000 * 60 * 60,
      },
      {
        id: "every-day",
        title: "every_day",
        icon: Calendar1,
        value: 1000 * 60 * 60 * 24,
      },
      {
        id: "every-week",
        title: "every_week",
        icon: Calendar,
        value: 1000 * 60 * 60 * 24 * 7,
      },
    ],
  },
  opacity: {
    id: "opacity",
    title: "opacity",
    type: "range",
    storedValue: "opacity",
    defaultValue: 0.8,
    min: 0,
    max: 100,
    step: 1,
    displayMultiplier: 100,
  },
  wallpaperBlur: {
    id: "wallpaperBlur",
    title: "wallpaper_blur",
    type: "range",
    storedValue: "wallpaperBlur",
    defaultValue: 0,
    min: 0,
    max: 50,
    step: 1,
    displayMultiplier: 1,
  },
};

export const advancedSettings = {
  clearData: {
    id: "clearData",
    title: "clear_data",
    description: "clear_data_description",
    type: "button",
    action: "clearData",
    dangerous: true,
  },
};

export const widgetSettings = {
  date: {
    id: "date",
    title: "date",
    type: "toggle",
    storedValue: "dateContained",
    defaultValue: false,
    children: {
      dateFormat: {
        id: "dateFormat",
        title: "date_format",
        type: "toggle",
        storedValue: "dateFormat",
        defaultValue: "normal",
        valueWhenOn: "iso-8601",
        valueWhenOff: "normal",
        label: "ISO-8601",
      },
    },
  },
  todos: {
    id: "todos",
    title: "tasks",
    type: "toggle",
    storedValue: "todosContained",
    defaultValue: true,
  },
  bookmarks: {
    id: "bookmarks",
    title: "bookmarks",
    type: "toggle",
    storedValue: "bookmarksContained",
    defaultValue: true,
    children: {
      bookmarksShown: {
        id: "bookmarksShown",
        title: "pinned_bookmarks",
        type: "bookmark-picker",
        storedValue: "bookmarksShown",
        defaultValue: [],
      },
    },
  },
  pomodoro: {
    id: "pomodoro",
    title: "pomodoro",
    type: "toggle",
    storedValue: "pomodoroContained",
    defaultValue: false,
    children: {
      workMinutes: {
        id: "workMinutes",
        title: "work_minutes",
        type: "input",
        inputType: "number",
        storedValue: "pomodoroConfig.workMinutes",
        defaultValue: 25,
      },
      breakMinutes: {
        id: "breakMinutes",
        title: "break_minutes",
        type: "input",
        inputType: "number",
        storedValue: "pomodoroConfig.breakMinutes",
        defaultValue: 5,
      },
    },
  },
  natureSounds: {
    id: "natureSounds",
    title: "nature_sounds",
    type: "toggle",
    storedValue: "natureSounds",
    defaultValue: false,
  },
  focusSounds: {
    id: "focusSounds",
    title: "focus_sounds",
    type: "toggle",
    storedValue: "focusSounds",
    defaultValue: false,
  },
  ambienceSounds: {
    id: "ambienceSounds",
    title: "ambience_sounds",
    type: "toggle",
    storedValue: "ambienceSounds",
    defaultValue: false,
  },
  mantras: {
    id: "mantras",
    title: "mantras",
    type: "toggle",
    storedValue: "mantrasContained",
    defaultValue: true,
  },
  stopwatch: {
    id: "stopwatch",
    title: "stopwatch",
    type: "toggle",
    storedValue: "stopwatchContained",
    defaultValue: false,
  },
  clock: {
    id: "clock",
    title: "clock",
    type: "toggle",
    storedValue: "clockContained",
    defaultValue: true,
    children: {
      clockFormat: {
        id: "clockFormat",
        title: "clock_format",
        type: "radio",
        storedValue: "clockFormat",
        defaultValue: "12h",
        options: [
          {
            id: "12h",
            title: "12h",
            value: "12h",
          },
          {
            id: "24h",
            title: "24h",
            value: "24h",
          },
        ],
      },
    },
  },
  counter: {
    id: "counter",
    title: "counter",
    type: "toggle",
    storedValue: "counterContained",
    defaultValue: false,
  },
  notepad: {
    id: "notepad",
    title: "notepad",
    type: "toggle",
    storedValue: "notepadContained",
    defaultValue: false,
  },
};

export const settingsData = {
  navigation: settingsNavigation,
  sections: {
    general: generalSettings,
    appearance: appearanceSettings,
    background: backgroundSettings,
    advanced: advancedSettings,
    widgets: widgetSettings,
  },
};

export default settingsData;
