import { createSignal, Show } from "solid-js";
import { Button } from "../../components/ui/button";
import { Volume2 } from "lucide-solid";
import soundscapes from "@/libs/soundscapes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuSubTriggerProps } from "@kobalte/core/dropdown-menu";

interface SoundscapesWidgetProps {
  natureSounds: boolean;
  focusSounds: boolean;
  ambienceSounds: boolean;
}

export const SoundscapesWidget = (props: SoundscapesWidgetProps) => {
  const [currentlyPlaying, setCurrentlyPlaying] = createSignal<string | null>(
    null
  );

  return (
    <Show
      when={props.natureSounds || props.focusSounds || props.ambienceSounds}
    >
      <DropdownMenu placement="bottom">
        <DropdownMenuTrigger
          as={(dropdownProps: DropdownMenuSubTriggerProps) => (
            <Button variant="ghost" class="!text-white" {...dropdownProps}>
              <Volume2 class="h-4 w-4 text-gray-300" />
              <span>{chrome.i18n.getMessage("soundscapes")}</span>
            </Button>
          )}
        />
        <DropdownMenuContent class="max-h-96 w-56 overflow-y-auto">
          <DropdownMenuItem
            onSelect={() => {
              window.open("https://noisefill.com/credits", "_blank");
            }}
          >
            {chrome.i18n.getMessage("view_sound_credits")}
          </DropdownMenuItem>
          <br />
          <Show when={props.natureSounds}>
            <span class="select-none p-2 pb-5 pt-5 text-sm font-semibold">
              {chrome.i18n.getMessage("nature_sounds")}
            </span>
            {soundscapes
              .filter((soundscape) => soundscape.categories.includes("nature"))
              .map((soundscape, index: number) => (
                <DropdownMenuItem
                  onSelect={() => {
                    if (currentlyPlaying() == `nature-${index}`) {
                      setCurrentlyPlaying(null);
                      (
                        document.getElementById("audio") as HTMLAudioElement
                      )?.load();
                    } else {
                      setCurrentlyPlaying(`nature-${index}`);
                      (
                        document.getElementById("audio") as HTMLAudioElement
                      )?.load();
                    }
                  }}
                >
                  {soundscape.name}
                </DropdownMenuItem>
              ))}
          </Show>
          <Show when={props.focusSounds}>
            {props.natureSounds && <br />}
            <span class="select-none p-2 pb-5 pt-5 text-sm font-semibold">
              {chrome.i18n.getMessage("focus_sounds")}
            </span>
            {soundscapes
              .filter((soundscape) => {
                if (
                  props.natureSounds &&
                  soundscape.categories.includes("nature")
                ) {
                  return false;
                }
                return soundscape.categories.includes("focus");
              })
              .map((soundscape, index: number) => (
                <DropdownMenuItem
                  onSelect={() => {
                    if (currentlyPlaying() == `focus-${index}`) {
                      setCurrentlyPlaying(null);
                      (
                        document.getElementById("audio") as HTMLAudioElement
                      )?.load();
                    } else {
                      setCurrentlyPlaying(`focus-${index}`);
                      (
                        document.getElementById("audio") as HTMLAudioElement
                      )?.load();
                    }
                  }}
                >
                  {soundscape.name}
                </DropdownMenuItem>
              ))}
          </Show>
          <Show when={props.ambienceSounds}>
            {(props.focusSounds || props.natureSounds) && <br />}
            <span class="select-none p-2 pb-5 pt-5 text-sm font-medium">
              {chrome.i18n.getMessage("ambience_sounds")}
            </span>
            {soundscapes
              .filter((soundscape) => {
                if (
                  props.natureSounds &&
                  soundscape.categories.includes("nature")
                ) {
                  return false;
                }
                if (
                  props.focusSounds &&
                  soundscape.categories.includes("focus")
                ) {
                  return false;
                }
                return soundscape.categories.includes("ambience");
              })
              .map((soundscape, index: number) => (
                <DropdownMenuItem
                  onSelect={() => {
                    if (currentlyPlaying() == `ambience-${index}`) {
                      setCurrentlyPlaying(null);
                      (
                        document.getElementById("audio") as HTMLAudioElement
                      )?.load();
                    } else {
                      setCurrentlyPlaying(`ambience-${index}`);
                      (
                        document.getElementById("audio") as HTMLAudioElement
                      )?.load();
                    }
                  }}
                >
                  {soundscape.name}
                </DropdownMenuItem>
              ))}
          </Show>
        </DropdownMenuContent>
      </DropdownMenu>
    </Show>
  );
};
