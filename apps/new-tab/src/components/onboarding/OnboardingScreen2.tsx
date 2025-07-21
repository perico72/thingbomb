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

import { Component, createEffect, createSignal } from "solid-js";
import { createStoredSignal } from "@/hooks/localStorage";
import { cn } from "@/libs/cn";

// Import color data with type definition
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

import colorData from "@/data/colorPreferences.json";
const typedColorData = colorData as ColorData;

export const OnboardingScreen2: Component = () => {
  const [accentColor, setAccentColor] = createStoredSignal(
    "accentColor",
    "teal"
  );
  const [isDarkTheme, setIsDarkTheme] = createSignal(
    document.documentElement.getAttribute("data-kb-theme") === "dark"
  );

  createEffect(() => {
    const callback = (mutations: MutationRecord[]) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "data-kb-theme") {
          setIsDarkTheme(
            document.documentElement.getAttribute("data-kb-theme") === "dark"
          );
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  });

  const colors = Object.keys(typedColorData);

  return (
    <div>
      <h1 class="text-[26px] font-semibold m-0 p-0">
        {chrome.i18n.getMessage("choose_color")}
      </h1>
      <p class="text-[#4D4842] dark:text-[#B2B7BD] text-[15px]">
        {chrome.i18n.getMessage("choose_color_desc")}
      </p>
      <br />

      <div class="flex gap-2 flex-wrap rounded-2xl w-fit bg-white/5 border border-white/10 p-2">
        {colors.map((color) => {
          const colorValue = isDarkTheme()
            ? typedColorData[color].dark.normal
            : typedColorData[color].light.normal;

          return (
            <button
              class="color-option w-fit h-fit"
              onMouseDown={() => setAccentColor(color)}
              onClick={() => setAccentColor(color)}
            >
              <div
                class={cn(
                  `w-8 h-8 border-2 border-black/20 dark:border-white/20
                  rounded-[calc(var(--radius-2xl)-0.5rem)] transhadow-md transition-all`,
                  {
                    "border-black dark:border-white": accentColor() === color,
                  }
                )}
                style={{ "background-color": colorValue }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
