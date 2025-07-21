import { createStoredSignal } from "@/hooks/localStorage";
import { Show } from "solid-js";

const Greeting = () => {
  const [name] = createStoredSignal("name", "");
  return (
    <Show when={name() != ""}>
      <p class="mt-3 text-3xl font-medium text-white">
        <span class="block">
          {new Date().getHours() < 12
            ? new Date().getHours() >= 5
              ? chrome.i18n.getMessage("good_morning")
              : chrome.i18n.getMessage("good_night")
            : new Date().getHours() < 18
              ? chrome.i18n.getMessage("good_afternoon")
              : chrome.i18n.getMessage("good_evening")}
          , {name()}.
        </span>
      </p>
    </Show>
  );
};

export { Greeting };
