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
import { createStoredSignal } from "@/hooks/localStorage";
import { TextField, TextFieldRoot } from "@/components/ui/textfield";
import { ArrowLeft, ArrowRight } from "lucide-solid";

export const OnboardingScreen1: Component = () => {
  const [name, setName] = createStoredSignal("name", "");
  return (
    <div>
      <h1 class="text-[26px] font-semibold m-0 p-0">
        {chrome.i18n.getMessage("first")}
      </h1>
      <p class="text-[#4D4842] dark:text-[#B2B7BD] text-[15px]">
        {chrome.i18n.getMessage("greeting_description_1")}
      </p>
      <br />
      <TextFieldRoot class="flex-1">
        <TextField
          placeholder={chrome.i18n.getMessage("display_name")}
          value={name()}
          onInput={(e: InputEvent) =>
            setName((e.currentTarget as HTMLInputElement)?.value)
          }
          autofocus={true}
        />
      </TextFieldRoot>
      <br />
    </div>
  );
};
