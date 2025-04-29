import { createSignal, onMount } from "solid-js";
import { Pause, Play } from "lucide-solid";
import { formatTime } from "../../utils/helpers";

export const StopwatchWidgetControl = () => {
  const [stopwatchTime, setStopwatchTime] = createSignal(0);
  const [stopwatchRunning, setStopwatchRunning] = createSignal(false);
  
  onMount(() => {
    setInterval(() => {
      if (stopwatchRunning()) {
        setStopwatchTime(stopwatchTime() + 1);
      }
    }, 1000);
  });

  return (
    <div
      id="stopwatch-widget"
      class="flex items-center gap-2 px-4 py-2 !text-white"
    >
      <p class="select-none text-sm font-semibold">
        {formatTime(stopwatchTime())}
      </p>
      <button
        onmousedown={() => setStopwatchRunning(!stopwatchRunning())}
        onclick={() => setStopwatchRunning(!stopwatchRunning())}
      >
        {stopwatchRunning() ? (
          <Pause class="h-5 w-5" fill="currentColor" />
        ) : (
          <Play class="h-5 w-5" fill="currentColor" />
        )}
      </button>
    </div>
  );
};
