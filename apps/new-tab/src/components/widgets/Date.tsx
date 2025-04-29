import { createStoredSignal } from "@/hooks/localStorage";
import { days, months } from "@/libs/constants";
import { createSignal, onCleanup, onMount, Show } from "solid-js";

const DateWidget = () => {
  const [dateContained, setDateContained] = createStoredSignal(
    "dateContained",
    false
  );
  const [dateFormat, setDateFormat] = createStoredSignal(
    "dateFormat",
    "normal"
  );
  // @ts-ignore
  const initialDate = new Date();
  const [date, setDate] = createSignal(initialDate);

  onMount(() => {
    const intervalId = setInterval(() => {
      // @ts-ignore
      setDate(new Date());
    }, 300);
    onCleanup(() => clearInterval(intervalId));
  });
  return (
    <Show when={dateContained()}>
      <p class="mt-3 text-3xl font-medium text-white">
        {dateFormat() == "normal" ? (
          <span id="nightstandDay">
            {days[date().getDay()]}, {months[date().getMonth()]}{" "}
            {date().getDate()}
          </span>
        ) : (
          <span id="nightstandDay">{date().toISOString().split("T")[0]}</span>
        )}
      </p>
    </Show>
  );
};

export { DateWidget };
