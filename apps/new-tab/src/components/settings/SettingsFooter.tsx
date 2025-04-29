import { Check, Share } from "lucide-solid";
import { createSignal } from "solid-js";

export default function SettingsFooter() {
  const [copyMessage, setCopyMessage] = createSignal(false);

  return (
    <footer>
      <div class="text-md py-2 flex items-center justify-between gap-2">
        <span class="font-medium flex gap-2 items-center">
          <img src="assets/icon-128.png" height="24px" width="24px" /> Blooft
        </span>
        <div class="socials transition-all flex gap-0 items-center">
          <a
            href="https://github.com/blooft-app/blooft"
            target="_blank"
            class="text-black dark:text-white p-3"
          >
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              width="28px"
              height="28px"
              class="fill-current"
            >
              {" "}
              <path
                fill="currentColor"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
              ></path>{" "}
            </svg>
          </a>
          <a
            href="https://discord.gg/hhPuurkvua"
            target="_blank"
            class="text-black dark:text-white p-3"
          >
            <svg
              viewBox="0 0 256 199"
              width="28px"
              height="28px"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid"
            >
              <path
                d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z"
                fill="currentColor"
              />
            </svg>
          </a>
          <a
            href="https://bsky.app/profile/blooft.com"
            target="_blank"
            class="text-black dark:text-white p-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              preserveAspectRatio="xMidYMid"
              viewBox="0 0 256 226"
            >
              <path
                fill="currentColor"
                d="M55.491 15.172c29.35 22.035 60.917 66.712 72.509 90.686 11.592-23.974 43.159-68.651 72.509-90.686C221.686-.727 256-13.028 256 26.116c0 7.818-4.482 65.674-7.111 75.068-9.138 32.654-42.436 40.983-72.057 35.942 51.775 8.812 64.946 38 36.501 67.187-54.021 55.433-77.644-13.908-83.696-31.676-1.11-3.257-1.63-4.78-1.637-3.485-.008-1.296-.527.228-1.637 3.485-6.052 17.768-29.675 87.11-83.696 31.676-28.445-29.187-15.274-58.375 36.5-67.187-29.62 5.041-62.918-3.288-72.056-35.942C4.482 91.79 0 33.934 0 26.116 0-13.028 34.314-.727 55.491 15.172Z"
              />
            </svg>
          </a>
        </div>
      </div>
      <button
        class="flex gap-2 items-center select-none cursor-pointer"
        onclick={() => {
          navigator.clipboard.writeText("https://blooft.com");
          setCopyMessage(true);
          setTimeout(() => {
            setCopyMessage(false);
          }, 2000);
        }}
      >
        {copyMessage() ? (
          <Check class="h-4 w-4 text-black dark:text-white" />
        ) : (
          <Share class="h-4 w-4 text-black dark:text-white" />
        )}
        <span class="text-sm font-medium text-black dark:text-white">
          {copyMessage()
            ? chrome.i18n.getMessage("copied_to_clipboard")
            : chrome.i18n.getMessage("share_flowtide")}
        </span>
      </button>
    </footer>
  );
}
