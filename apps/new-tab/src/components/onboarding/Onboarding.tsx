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

import { Component, createSignal, JSX, Show } from "solid-js";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/libs/cn";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-solid";
import { createStoredSignal } from "@/hooks/localStorage";
import { OnboardingScreen1 } from "./OnboardingScreen1";
import { OnboardingScreen2 } from "./OnboardingScreen2";
import { OnboardingScreen3 } from "./OnboardingScreen3";
import { OnboardingScreen4 } from "./OnboardingScreen4";

export const Onboarding: Component = () => {
  const [onboardingScreen, setOnboardingScreen] = createSignal<number>(1);
  const [currentFont] = createStoredSignal("currentFont", "sans");
  const [textStyle] = createStoredSignal("textStyle", "normal");
  const [needsOnboarding, setNeedsOnboarding] = createStoredSignal(
    "needsOnboarding",
    true
  );
  const [name, setName] = createStoredSignal("name", "");

  // Footer buttons configuration based on current screen
  const getFooterConfig = () => {
    switch (onboardingScreen()) {
      case 1:
        return {
          backDisabled: true,
          nextAction: () => setOnboardingScreen(2),
          nextText: () => {
            return name()
              ? chrome.i18n.getMessage("next")
              : chrome.i18n.getMessage("skip");
          },
          nextIcon: (
            <ArrowRight class="transition-transform group-hover:translate-x-1 size-[13.3px]" />
          ),
        };
      case 2:
        return {
          backDisabled: false,
          backAction: () => setOnboardingScreen(1),
          nextAction: () => setOnboardingScreen(3),
          nextText: () => chrome.i18n.getMessage("next"),
          nextIcon: (
            <ArrowRight class="transition-transform group-hover:translate-x-1 size-[13.3px]" />
          ),
        };
      case 3:
        return {
          backDisabled: false,
          backAction: () => setOnboardingScreen(2),
          nextAction: () => setOnboardingScreen(4),
          nextText: () => chrome.i18n.getMessage("next"),
          nextIcon: (
            <ArrowRight class="transition-transform group-hover:translate-x-1 size-[13.3px]" />
          ),
        };
      case 4:
        return {
          backDisabled: false,
          backAction: () => setOnboardingScreen(3),
          nextAction: () => setNeedsOnboarding(false),
          nextText: () => chrome.i18n.getMessage("finish"),
          nextIcon: <Check class="size-[13.3px]" />,
        };
      default:
        return {
          backDisabled: true,
          nextAction: () => {},
          nextText: () => "",
          nextIcon: null,
        };
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent
        class={cn("max-h-[550px] max-w-[800px]", {
          "**:!font-sans": currentFont() === "sans",
          "**:!font-serif": currentFont() === "serif",
          "**:!font-mono": currentFont() === "mono",
          "**:!font-comic-sans": currentFont() === "comic-sans",
        })}
        overlayClass="!backdrop-blur-xl"
      >
        <div
          class={cn(
            `absolute inset-0 z-50 bg-white dark:bg-[#18191B] backdrop-blur-3xl p-7.5
            overflow-y-auto grid grid-rows-[calc(100%-65px)_65px]`,
            {
              "font-sans": currentFont() === "sans",
              "font-serif": currentFont() === "serif",
              "font-mono": currentFont() === "mono",
              "font-comic-sans": currentFont() === "comic-sans",
            }
          )}
          id="onboarding"
        >
          <div class="overflow-y-auto pl-[2px]">
            <Show when={onboardingScreen() === 1}>
              <OnboardingScreen1 />
            </Show>
            <Show when={onboardingScreen() === 2}>
              <OnboardingScreen2 />
            </Show>
            <Show when={onboardingScreen() === 3}>
              <OnboardingScreen3 />
            </Show>
            <Show when={onboardingScreen() === 4}>
              <OnboardingScreen4 />
            </Show>
          </div>

          <div
            class={cn(
              "flex flex-col items-start gap-2 bg-white dark:bg-[#18191B] h-fit",
              {
                "pt-[29px]": onboardingScreen() !== 1,
              }
            )}
          >
            {onboardingScreen() === 1 && (
              <a
                href="https://www.blooft.com/privacy"
                class="text-[14px] text-muted-foreground"
                target="_blank"
              >
                {chrome.i18n.getMessage("privacy_policy")}
              </a>
            )}
            <div class="flex gap-2">
              <Button
                variant={"outline"}
                class="px-2.5"
                disabled={getFooterConfig().backDisabled}
                onClick={getFooterConfig().backAction}
                title={chrome.i18n.getMessage("go_back")}
              >
                <ArrowLeft class="transition-transform group-hover:translate-x-1 size-[13.3px]" />
              </Button>
              <Button
                class="group flex items-center gap-1"
                onClick={getFooterConfig().nextAction}
              >
                {getFooterConfig().nextText()}
                {getFooterConfig().nextIcon}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Onboarding;
