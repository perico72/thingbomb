import { createSignal, onMount, Show } from "solid-js";
import { Button } from "../../components/ui/button";
import { Star } from "lucide-solid";
import { BookmarkTreeNode, Bookmark } from "../../types";
import { flattenBookmarks } from "../../utils/helpers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuSubTriggerProps } from "@kobalte/core/dropdown-menu";

export const BookmarksWidget = () => {
  const [bookmarks, setBookmarks] = createSignal<Bookmark[]>([
    {
      name: "No Bookmarks",
    },
  ]);

  onMount(() => {
    if (chrome.bookmarks !== undefined) {
      chrome.bookmarks.getTree((bookmarkTreeNodes: BookmarkTreeNode[]) => {
        const allBookmarks = flattenBookmarks(bookmarkTreeNodes);
        setBookmarks(allBookmarks);
      });
    }
  });

  return (
    <DropdownMenu placement="bottom">
      <DropdownMenuTrigger
        as={(props: DropdownMenuSubTriggerProps) => (
          <Button variant="ghost" class="!text-white" {...props}>
            <Star class="h-4 w-4 text-gray-300" />
            <span>{chrome.i18n.getMessage("bookmarks")}</span>
          </Button>
        )}
      />
      <DropdownMenuContent class="max-h-96 w-56 overflow-y-auto">
        {bookmarks().length > 0 ? (
          <>
            {bookmarks().map((bookmark: Bookmark, index: number) => (
              <DropdownMenuItem>
                <a href={bookmark.url!}>{bookmark.name}</a>
              </DropdownMenuItem>
            ))}
          </>
        ) : (
          <span class="p-4 text-sm font-medium">
            {chrome.i18n.getMessage("no_bookmarks")}
          </span>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
