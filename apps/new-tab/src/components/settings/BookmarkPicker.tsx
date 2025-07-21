import { Component, createEffect, createSignal } from "solid-js";
import { Check, Plus } from "lucide-solid";
import { Bookmark } from "../../libs/settings";
import { safeParse } from "../../utils/helpers";

interface BookmarkPickerProps {
  value: string;
  onChange: (value: string) => void;
  bookmarks: Bookmark[];
}

const BookmarkPicker: Component<BookmarkPickerProps> = (props) => {
  const [selectedBookmarks, setSelectedBookmarks] = createSignal<Bookmark[]>(
    []
  );

  // Initialize the selected bookmarks from props.value
  createEffect(() => {
    const parsed = safeParse(props.value, []);
    // Handle both string and array cases
    if (typeof parsed === "string") {
      try {
        setSelectedBookmarks(JSON.parse(parsed) as Array<Bookmark>);
      } catch (e) {
        console.error(e);
        setSelectedBookmarks([]);
      }
    } else {
      setSelectedBookmarks(parsed as Array<Bookmark>);
    }
  });

  const toggleBookmark = (bookmark: Bookmark) => {
    const currentSelected = selectedBookmarks();
    const isAlreadySelected = currentSelected.some(
      (selected: Bookmark) => selected.url === bookmark.url
    );

    if (isAlreadySelected) {
      // Remove bookmark
      const newSelected = currentSelected.filter(
        (selected: Bookmark) => selected.url !== bookmark.url
      );
      setSelectedBookmarks(newSelected);
      props.onChange(JSON.stringify(newSelected));
    } else {
      // Add bookmark
      const newSelected = [...currentSelected, bookmark];
      setSelectedBookmarks(newSelected);
      props.onChange(JSON.stringify(newSelected));
    }
  };

  const isBookmarkSelected = (bookmark: Bookmark) => {
    return selectedBookmarks().some(
      (selected: Bookmark) => selected.url === bookmark.url
    );
  };

  return (
    <div>
      <span class="text-sm font-medium text-muted-foreground">
        {chrome.i18n.getMessage("pinned_bookmarks")}
      </span>
      <div class="flex gap-2 flex-wrap mb-4">
        {selectedBookmarks().map((bookmark) => (
          <button
            onClick={() => toggleBookmark(bookmark)}
            class="font-medium text-black rounded-lg dark:text-white text-sm p-4 bg-[#EDECEB]
              border-1 border-[#C0C0B8] h-[30px] flex justify-center items-center gap-2
              dark:bg-[#121314] dark:border-[#3F3F47]"
          >
            <span>{bookmark.name}</span>
            <Check class="h-4 w-4" />
          </button>
        ))}
      </div>

      <span class="text-sm font-medium text-muted-foreground">
        {chrome.i18n.getMessage("available_bookmarks")}
      </span>
      <div class="flex gap-2 flex-wrap">
        {props.bookmarks
          .filter((bookmark: Bookmark) => !isBookmarkSelected(bookmark))
          .map((bookmark) => (
            <button
              onClick={() => toggleBookmark(bookmark)}
              class="font-medium text-black rounded-lg dark:text-white text-sm p-4 bg-[#EDECEB]
                border-1 border-[#C0C0B8] h-[30px] flex justify-center items-center gap-2
                dark:bg-[#121314] dark:border-[#3F3F47]"
            >
              <span>{bookmark.name}</span>
              <Plus class="h-4 w-4" />
            </button>
          ))}
      </div>
    </div>
  );
};

export default BookmarkPicker;
