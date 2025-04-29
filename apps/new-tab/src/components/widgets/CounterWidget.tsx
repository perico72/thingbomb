import { createStoredSignal } from "@/hooks/localStorage";
import { Minus, Plus } from "lucide-solid";

export const CounterWidget = () => {
  const [counter, setCounter] = createStoredSignal("counter", 0);

  return (
    <div
      id="counter-widget"
      class="flex items-center gap-2 px-4 py-2 !text-white"
    >
      <button
        onmousedown={(e) => {
          setCounter(Number(counter()) - 1);
          e.preventDefault();
        }}
        onclick={(e) => {
          if (e.detail === 0) {
            setCounter(Number(counter()) - 1);
          }
        }}
        class="text-sm font-semibold"
      >
        <Minus class="h-5 w-5" fill="currentColor" />
      </button>
      <p class="select-none text-sm font-semibold">{counter()}</p>
      <button
        onmousedown={(e) => {
          setCounter(Number(counter()) + 1);
          e.preventDefault();
        }}
        onclick={(e) => {
          if (e.detail === 0) {
            setCounter(Number(counter()) + 1);
          }
        }}
        class="text-sm font-semibold"
      >
        <Plus class="h-5 w-5" fill="currentColor" />
      </button>
    </div>
  );
};
