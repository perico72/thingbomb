import { Show } from "solid-js";
import { BookmarksWidget } from "../widgets/BookmarksWidget";
import { SoundscapesWidget } from "../widgets/SoundscapesWidget";
import { CounterWidget } from "../widgets/CounterWidget";
import { StopwatchWidgetControl } from "../widgets/StopwatchWidgetControl";
import { createStoredSignal } from "@/hooks/localStorage";

export const TopWidgetsContainer = () => {
  const [itemsHidden, setItemsHidden] = createStoredSignal<boolean>(
    "itemsHidden",
    false
  );
  const [bookmarksContained, setBookmarksContained] = createStoredSignal(
    "bookmarksContained",
    true
  );
  const [natureSounds, setNatureSounds] = createStoredSignal(
    "natureSounds",
    false
  );
  const [focusSounds, setFocusSounds] = createStoredSignal(
    "focusSounds",
    false
  );
  const [ambienceSounds, setAmbienceSounds] = createStoredSignal(
    "ambienceSounds",
    false
  );
  const [counterContained, setCounterContained] = createStoredSignal(
    "counterContained",
    false
  );
  const [stopwatchContained, setStopwatchContained] = createStoredSignal(
    "stopwatchContained",
    false
  );
  return (
    <div
      id="top-widgets-container"
      class="fixed left-0 right-0 top-0 z-20 flex justify-between gap-4 p-2"
      style={{
        display: itemsHidden() ? "none" : "",
      }}
    >
      <div id="top-left-widgets-container" class="flex">
        <Show when={bookmarksContained()}>
          <BookmarksWidget />
        </Show>
        <Show when={natureSounds() || focusSounds() || ambienceSounds()}>
          <SoundscapesWidget
            natureSounds={natureSounds()}
            focusSounds={focusSounds()}
            ambienceSounds={ambienceSounds()}
          />
        </Show>
      </div>
      <div id="top-right-widgets-container" class="flex">
        <Show when={counterContained()}>
          <CounterWidget />
        </Show>
        <Show when={stopwatchContained()}>
          <StopwatchWidgetControl />
        </Show>
      </div>
    </div>
  );
};
