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
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-solid";

export const OnboardingScreen4: Component = () => {
  const [needsOnboarding, setNeedsOnboarding] = createStoredSignal(
    "needsOnboarding",
    true
  );
  return (
    <div>
      <h1 class="text-[26px] font-semibold m-0 p-0">
        {chrome.i18n.getMessage("join_the_community")}
      </h1>
      <p class="text-[#4D4842] dark:text-[#B2B7BD] text-[15px]">
        {chrome.i18n.getMessage("community_desc")}
      </p>
      <br />
      <a href="https://discord.gg/hhPuurkvua" target="_blank">
        <Button
          variant={"outline"}
          class="px-2.5"
          title={chrome.i18n.getMessage("discord")}
        >
          {chrome.i18n.getMessage("discord")}
        </Button>
      </a>
      <br />
    </div>
  );
};
