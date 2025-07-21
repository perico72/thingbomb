import { Show } from "solid-js";
import { formattedClock } from "@/hooks/clockFormatter";
import { formatTime } from "../../utils/helpers";
import { Pomodoro } from "../../types";
import { PauseIcon, PlayIcon } from "lucide-solid";
import { createStoredSignal } from "@/hooks/localStorage";
import { PinnedBookmarks } from "../widgets/PinnedBookmarks";
import { Greeting } from "../widgets/Greeting";
import { DateWidget } from "../widgets/Date";

export const CenterWidgetsContainer = () => {
  const clock = formattedClock();
  const [itemsHidden] = createStoredSignal<boolean>("itemsHidden", false);
  const [layout] = createStoredSignal("layout", "center");
  const [pomodoroContained] = createStoredSignal("pomodoroContained", false);
  const [clockContained] = createStoredSignal("clockContained", true);
  const [pomodoro, setPomodoro] = createStoredSignal<Pomodoro>("pomodoro", {
    time: 0,
    session: "Work",
    playing: false,
  });
  return (
    <div
      class="flex items-center justify-center"
      id="center-widgets-container"
      style={{
        "justify-content": !layout().includes("-")
          ? "center"
          : layout().endsWith("-left")
            ? "flex-start"
            : "flex-end",
      }}
    >
      <div
        class="w-fit max-w-lg select-none text-center"
        style={{
          display: itemsHidden() ? "none" : "",
          "text-align": layout().startsWith("bottom") ? "left" : "center",
        }}
      >
        <Show
          when={pomodoroContained()}
          fallback={
            <Show when={clockContained()}>
              <h1
                class="m-0 p-0 text-[170px] font-semibold text-white [line-height:1.2]
                  tracking-[-0.06em]"
                id="nightstandClock"
              >
                {clock().time}
              </h1>
            </Show>
          }
        >
          <div class="flex flex-col items-center justify-center">
            <h1
              class="m-0 p-0 text-[170px] font-semibold text-white [line-height:1.2]
                tracking-[-0.06em]"
              id="pomodoroClock"
            >
              {formatTime(pomodoro().time)}
            </h1>
            <p class="m-0 flex items-center gap-2 p-0 text-3xl font-medium text-white tracking-tight">
              <span>
                {pomodoro().session == "Work"
                  ? chrome.i18n.getMessage("work")
                  : chrome.i18n.getMessage("break")}
              </span>
              <button
                onmousedown={() =>
                  setPomodoro({
                    ...pomodoro(),
                    playing: !pomodoro().playing,
                  })
                }
                onclick={() =>
                  setPomodoro({
                    ...pomodoro(),
                    playing: !pomodoro().playing,
                  })
                }
              >
                {pomodoro().playing ? (
                  <span class="flex h-5 w-5 items-center justify-center">
                    <PauseIcon fill="white" />
                  </span>
                ) : (
                  <span class="flex h-5 w-5 items-center justify-center">
                    <PlayIcon fill="white" />
                  </span>
                )}
              </button>
            </p>
          </div>
        </Show>
        <DateWidget />
        <Greeting />
        <PinnedBookmarks />
      </div>
    </div>
  );
};
