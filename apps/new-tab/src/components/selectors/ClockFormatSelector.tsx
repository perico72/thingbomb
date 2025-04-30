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

export const ClockFormatSelector: Component = () => {
  const [clockFormat, setClockFormat] = createStoredSignal(
    "clockFormat",
    "24h"
  );
  return (
    <>
      <span class="text-sm">{chrome.i18n.getMessage("clock_format")}</span>
      <Select
        options={["12h", "24h"]}
        placeholder={chrome.i18n.getMessage("clock_format")}
        defaultValue={clockFormat()}
        onChange={(value: string | null) => {
          if (value == "12h") {
            setClockFormat("12h");
            return;
          }
          if (value == "24h") {
            setClockFormat("24h");
            return;
          }
        }}
        itemComponent={(props: SelectItemProps) => (
          <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
        )}
      >
        <SelectTrigger class="w-[180px]">
          <SelectValue<string>>
            {(state: any) => state.selectedOption()}
          </SelectValue>
        </SelectTrigger>
        <SelectContent class="bg-[#DFDEDC] dark:bg-[#111113]" />
      </Select>
    </>
  );
};
