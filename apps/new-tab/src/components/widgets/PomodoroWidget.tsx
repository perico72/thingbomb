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

import { Component, createSignal, Show } from "solid-js";
import { createStoredSignal } from "@/hooks/localStorage";
import { Pomodoro, PomodoroConfig } from "@/types";
import { Button } from "@/components/ui/button";
import { Pause, Play, X } from "lucide-solid";
import { formatTime } from "@/utils/helpers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TextField, TextFieldRoot } from "@/components/ui/textfield";

// Simplified props as we'll use createStoredSignal internally
interface PomodoroWidgetProps {}

export const PomodoroWidget: Component<PomodoroWidgetProps> = () => {
  // Use createStoredSignal directly
  const [pomodoro, setPomodoro] = createStoredSignal<Pomodoro>("pomodoro", {
    time: 25 * 60,
    session: "Work",
    playing: false,
  });

  const [pomodoroConfig, setPomodoroConfig] =
    createStoredSignal<PomodoroConfig>("pomodoroConfig", {
      workMinutes: 25,
      breakMinutes: 5,
    });

  const [pomodoroContained, setPomodoroContained] = createStoredSignal(
    "pomodoroContained",
    false
  );

  const [pomodoroDialogOpen, setPomodoroDialogOpen] = createSignal(false);
  const [workMinutes, setWorkMinutes] = createSignal("");
  const [breakMinutes, setBreakMinutes] = createSignal("");

  return (
    <div
      class="p-2 backdrop-blur-md min-w-[200px] rounded-lg border mb-2
        border-[rgba(47,47,47,0.2)] dark:border-[rgba(239,239,239,0.2)] flex flex-col"
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
          {pomodoro().session == "Work"
            ? chrome.i18n.getMessage("work")
            : chrome.i18n.getMessage("break")}
        </span>
        <Button
          variant="ghost"
          class="p-0 w-5 h-5"
          onclick={() => setPomodoroContained(false)}
        >
          <X class="size-3" />
        </Button>
      </div>
      <div class="font-bold text-4xl">{formatTime(pomodoro().time)}</div>

      <div class="flex justify-center items-center gap-2 mt-2">
        <Button
          variant="outline"
          class="h-8 px-3 rounded-md border border-[rgba(47,47,47,0.2)]
            dark:border-[rgba(239,239,239,0.2)]"
          onclick={() => {
            setPomodoro({
              ...pomodoro(),
              playing: !pomodoro().playing,
            });
          }}
        >
          <Show when={!pomodoro().playing} fallback={<Pause class="size-3" />}>
            <Play class="size-3" />
          </Show>
        </Button>
        <Dialog
          open={pomodoroDialogOpen()}
          onOpenChange={setPomodoroDialogOpen}
        >
          <DialogTrigger>
            <Button
              variant="outline"
              class="h-8 px-3 rounded-md border border-[rgba(47,47,47,0.2)]
                dark:border-[rgba(239,239,239,0.2)]"
            >
              {chrome.i18n.getMessage("settings")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {chrome.i18n.getMessage("pomodoro_settings")}
              </DialogTitle>
            </DialogHeader>
            <div class="p-4 flex flex-col gap-3">
              <TextFieldRoot>
                <TextField
                  placeholder={chrome.i18n.getMessage("work_minutes")}
                  value={workMinutes()}
                  onInput={(e) =>
                    setWorkMinutes((e.target as HTMLInputElement).value)
                  }
                />
              </TextFieldRoot>
              <TextFieldRoot>
                <TextField
                  placeholder={chrome.i18n.getMessage("break_minutes")}
                  value={breakMinutes()}
                  onInput={(e) =>
                    setBreakMinutes((e.target as HTMLInputElement).value)
                  }
                />
              </TextFieldRoot>
              <Button
                onclick={() => {
                  const newConfig = {
                    workMinutes: parseInt(workMinutes()),
                    breakMinutes: parseInt(breakMinutes()),
                  };

                  setPomodoroConfig(newConfig);
                  setPomodoro({
                    ...pomodoro(),
                    time: newConfig.workMinutes * 60,
                    playing: false,
                  });
                  setPomodoroDialogOpen(false);
                }}
              >
                {chrome.i18n.getMessage("save")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
