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
import { createStoredSignal } from "@/hooks/localStorage";

export const BackgroundSelector: Component = () => {
  const [background, setBackground] = createStoredSignal("background", "image");
  return (
    <>
      <span class="text-sm">{chrome.i18n.getMessage("background")}</span>
      <Select
        options={["image", "solid_color", "gradient", "blank"]}
        placeholder={chrome.i18n.getMessage("background")}
        defaultValue={background().replaceAll("-", "_")}
        onChange={(value: string | null) => {
          if (value == "image") {
            setBackground("image");
            return;
          }
          if (value == "solid_color") {
            setBackground("solid-color");
            return;
          }
          if (value == "gradient") {
            setBackground("gradient");
            return;
          }
          if (value == "blank") {
            setBackground("blank");
            return;
          }
        }}
        itemComponent={(props: SelectItemProps) => (
          <SelectItem item={props.item}>
            {chrome.i18n.getMessage(props.item.rawValue)}
          </SelectItem>
        )}
      >
        <SelectTrigger class="w-[180px] bg-[#DFDEDC] dark:bg-[#111113]">
          <SelectValue<string>>
            {(state: any) => chrome.i18n.getMessage(state.selectedOption())}
          </SelectValue>
        </SelectTrigger>
        <SelectContent class="bg-[#DFDEDC] dark:bg-[#111113]" />
      </Select>
    </>
  );
};
