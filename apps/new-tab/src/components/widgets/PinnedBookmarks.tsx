import { Show } from "solid-js";
import { Bookmark } from "../../types";
import { createStoredSignal } from "@/hooks/localStorage";

const PinnedBookmarks = () => {
  const [bookmarksShown] = createStoredSignal<Bookmark[]>("bookmarksShown", []);
  const [bookmarksContained] = createStoredSignal<boolean>(
    "bookmarksContained",
    true
  );

  return (
    <Show when={bookmarksContained()}>
      <Show when={bookmarksShown().length > 0}>
        <br />
        <div class="flex gap-2 flex-wrap justify-center">
          {bookmarksShown().map((bookmark: Bookmark) => (
            <a
              href={bookmark.url!}
              onmousedown={(e) => {
                e.preventDefault();
                if (!(e.ctrlKey || e.metaKey)) {
                  window.location.href = bookmark.url!;
                } else {
                  window.open(bookmark.url!);
                }
              }}
              onclick={(e) => {
                e.preventDefault();
                if (!(e.ctrlKey || e.metaKey)) {
                  window.location.href = bookmark.url!;
                } else {
                  window.open(bookmark.url!);
                }
              }}
              class="font-medium text-xl h-[45px] p-4 text-white bg-black/30 backdrop-blur-3xl flex
                items-center justify-center gap-2 rounded-lg hover:bg-black/50 shadow-inner
                shadow-white/20 transition-all border-[0.5px] border-white/20"
            >
              <span>{bookmark.name}</span>
            </a>
          ))}
        </div>
      </Show>
    </Show>
  );
};

export { PinnedBookmarks };
