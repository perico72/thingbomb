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

import { Component } from "solid-js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectItemProps } from "@kobalte/core/select";
import { cn } from "@/libs/cn";
import { createStoredSignal } from "@/hooks/localStorage";

export const FontSelector: Component = () => {
  const [currentFont, setFont] = createStoredSignal("currentFont", "sans");
  return (
    <>
      <span class="text-sm">{chrome.i18n.getMessage("font")}</span>
      <Select
        options={["sans", "serif", "mono", "comic_sans"]}
        placeholder={chrome.i18n.getMessage("select_font")}
        defaultValue={currentFont()}
        onChange={(value: string | null) => {
          if (value == "sans") {
            setFont("sans");
            return;
          }
          if (value == "serif") {
            setFont("serif");
            return;
          }
          if (value == "mono") {
            setFont("mono");
            return;
          }
          if (value == "comic_sans") {
            setFont("comic-sans");
            return;
          }
        }}
        itemComponent={(props: SelectItemProps) => (
          <SelectItem
            item={props.item}
            class={cn({
              "!font-sans": props.item.rawValue == "sans",
              "!font-serif": props.item.rawValue == "serif",
              "!font-mono": props.item.rawValue == "mono",
              "!font-comic-sans": props.item.rawValue == "comic_sans",
            })}
          >
            {chrome.i18n.getMessage(
              props.item.rawValue as "sans" | "serif" | "mono" | "comic_sans"
            )}
          </SelectItem>
        )}
      >
        <SelectTrigger class="w-[180px]">
          <SelectValue<string>>
            {(state: any) =>
              chrome.i18n.getMessage(
                state.selectedOption() as
                  | "sans"
                  | "serif"
                  | "mono"
                  | "comic_sans"
              )
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent class="bg-[#DFDEDC] dark:bg-[#111113]" />
      </Select>
    </>
  );
};
