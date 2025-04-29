import { Show } from "solid-js";
import { Mantra } from "../../types";

interface MantraDisplayProps {
  mantrasContained: boolean;
}

const mantras: Mantra[] = [
  "mantra_1",
  "mantra_2",
  "mantra_3",
  "mantra_4",
  "mantra_5",
  "mantra_6",
  "mantra_7",
  "mantra_8",
  "mantra_9",
  "mantra_10",
  "mantra_11",
  "mantra_12",
  "mantra_13",
  "mantra_14",
  "mantra_15",
];

export const MantraDisplay = (props: MantraDisplayProps) => {
  const randomMantra = mantras[
    Math.floor(Math.random() * mantras.length)
  ] as Mantra;

  return (
    <Show when={props.mantrasContained}>
      <p class="text-white text-sm">{chrome.i18n.getMessage(randomMantra)}</p>
    </Show>
  );
};
