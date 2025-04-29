import { Component, Show, onCleanup, onMount, createEffect } from "solid-js";
import { createStoredSignal } from "@/hooks/localStorage";
import { Button } from "@/components/ui/button";
import { Pause, Play, X } from "lucide-solid";
import { formatTime } from "@/utils/helpers";

interface StopwatchWidgetProps {}

export const StopwatchWidget: Component<StopwatchWidgetProps> = () => {
  const [stopwatchTime, setStopwatchTime] = createStoredSignal(
    "stopwatchTime",
    0
  );
  const [stopwatchRunning, setStopwatchRunning] = createStoredSignal(
    "stopwatchRunning",
    false
  );
  const [stopwatchContained, setStopwatchContained] = createStoredSignal(
    "stopwatchContained",
    true
  );

  onMount(() => {
    let interval: ReturnType<typeof setInterval>;

    if (stopwatchRunning()) {
      interval = setInterval(() => {
        setStopwatchTime(stopwatchTime() + 1);
      }, 1000);
    }

    createEffect(() => {
      const running = stopwatchRunning();

      if (running) {
        if (interval) clearInterval(interval);

        interval = setInterval(() => {
          setStopwatchTime(stopwatchTime() + 1);
        }, 1000);
      } else {
        clearInterval(interval);
      }
    });

    onCleanup(() => {
      clearInterval(interval);
    });
  });
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
          {chrome.i18n.getMessage("stopwatch")}
        </span>
        <Button
          variant="ghost"
          class="p-0 w-5 h-5"
          onclick={() => setStopwatchContained(false)}
        >
          <X class="size-3" />
        </Button>
      </div>
      <div class="font-bold text-4xl">{formatTime(stopwatchTime())}</div>

      <div class="flex justify-center items-center gap-2 mt-2">
        <Button
          variant="outline"
          class="h-8 px-3 rounded-md border border-[rgba(47,47,47,0.2)]
            dark:border-[rgba(239,239,239,0.2)]"
          onclick={() => {
            setStopwatchRunning(!stopwatchRunning());
          }}
        >
          <Show when={!stopwatchRunning()} fallback={<Pause class="size-3" />}>
            <Play class="size-3" />
          </Show>
        </Button>
        <Button
          variant="outline"
          class="h-8 px-3 rounded-md border border-[rgba(47,47,47,0.2)]
            dark:border-[rgba(239,239,239,0.2)]"
          onclick={() => {
            setStopwatchTime(0);
            setStopwatchRunning(false);
          }}
        >
          {chrome.i18n.getMessage("reset")}
        </Button>
      </div>
    </div>
  );
};
