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

import { Component, createSignal, onMount } from "solid-js";
import { createStoredSignal } from "@/hooks/localStorage";
import { Button } from "@/components/ui/button";
import { X } from "lucide-solid";

// Simplified props as we'll use createStoredSignal internally
interface ClockWidgetProps {}

export const ClockWidget: Component<ClockWidgetProps> = () => {
  // Use createStoredSignal directly
  const [clock, setClock] = createSignal({ time: "", date: "" });
  const [clockContained, setClockContained] = createStoredSignal(
    "clockContained",
    true
  );
  const [textStyle] = createStoredSignal("textStyle", "normal");

  // Update the clock each second
  onMount(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setClock({
        time: `${hours}:${minutes}`,
        date: now.toLocaleDateString(),
      });
    };

    // Initial update
    updateClock();

    // Set up interval
    const interval = setInterval(updateClock, 1000);

    // Clean up on unmount
    return () => clearInterval(interval);
  });

  return (
    <div
      class="backdrop-blur-md rounded-lg border p-4 mb-2 border-[rgba(47,47,47,0.2)]
        dark:border-[rgba(239,239,239,0.2)] flex flex-col"
      draggable
      onDragStart={(e) => {
        const img = new Image();
        e.dataTransfer?.setDragImage(img, 0, 0);
        document.body.style.cursor = "grabbing";
      }}
      onDragEnd={() => {
        document.body.style.cursor = "default";
      }}
    >
      <div class="flex justify-between items-center mb-1">
        <span class="text-sm font-medium">
          {chrome.i18n.getMessage("clock")}
        </span>
        <Button
          variant="ghost"
          class="p-0 w-5 h-5"
          onclick={() => setClockContained(false)}
        >
          <X class="size-3" />
        </Button>
      </div>
      <div class={"font-bold text-4xl"}>{clock().time}</div>
    </div>
  );
};
