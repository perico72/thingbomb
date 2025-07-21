import { createEffect, createSignal, onCleanup } from "solid-js";
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import Mexp from "math-expression-evaluator";

interface Bookmark {
  name: string;
  url: string;
  title?: string;
}

interface BookmarkFolder {
  name: string;
  children: Bookmark[];
}

interface BookmarkTreeNode {
  children?: BookmarkTreeNode[];
  dateAdded?: number;
  dateGroupModified?: number;
  id: string;
  index?: number;
  parentId?: string;
  title: string;
  unmodifiable?: "managed";
  url?: string;
}

interface MathResult {
  result: number | string | null;
  expression: string | null;
  copied: boolean;
}

export function CommandPalette() {
  const [open, setOpen] = createSignal(false);
  const [inputValue, setInputValue] = createSignal("");
  const [result, setResult] = createSignal<MathResult>({
    result: null,
    expression: null,
    copied: false,
  });

  const [bookmarks, setBookmarks] = createSignal<Bookmark[]>([]);
  const [loadedBookmarks, setLoadedBookmarks] = createSignal(false);
  const [bookmarkFolders, setBookmarkFolders] = createSignal<BookmarkFolder[]>(
    []
  );

  const down = (e: KeyboardEvent) => {
    const enabled = localStorage.getItem("commandPaletteEnabled");
    if (enabled === null || enabled === "true") {
      if (
        ((e.ctrlKey || e.metaKey) && e.key === "k") ||
        (e.key === "/" && (e.target as HTMLElement).tagName !== "INPUT")
      ) {
        e.preventDefault();
        setOpen(!open());
      }
    }

    if (e.key == "Enter") {
      document
        .querySelectorAll('[data-type="command-item"]')
        .forEach((item) => {
          if (item.getAttribute("aria-selected") == "true") {
            (item as HTMLDivElement).click();
          }
        });
    }
  };

  onCleanup(() => {
    document.removeEventListener("keydown", down);
  });

  createEffect(() => {
    document.addEventListener("keydown", down);
  });

  createEffect(() => {
    if (open()) {
      document.body.classList.add("dialogOpen");
    } else {
      document.body.classList.remove("dialogOpen");
    }
  });

  createEffect(() => {
    const fetchBookmarks = () => {
      if (!chrome.bookmarks) return;
      chrome.bookmarks.getTree((bookmarks: BookmarkTreeNode[]) => {
        const newBookmarks: Bookmark[] = [];
        const newFolders: BookmarkFolder[] = [];
        const displayBookmarks = (bookmarks: any[]) => {
          bookmarks.forEach((bookmark) => {
            if (bookmark.children) {
              newFolders.push({
                name: bookmark.title,
                children: bookmark.children,
              });
              displayBookmarks(bookmark.children);
            } else {
              newBookmarks.push({
                name: bookmark.title,
                url: bookmark.url,
              });
            }
          });
        };
        displayBookmarks(bookmarks);
        setBookmarks(newBookmarks);
        setLoadedBookmarks(true);
        setBookmarkFolders(newFolders);
      });
    };
    fetchBookmarks();
  });

  const handleCommand = (action: Bookmark) => {
    setOpen(false);
    window.location.href = action.url;
  };

  const handleFolderOpen = (folder: BookmarkFolder) => {
    setOpen(false);
    folder.children.forEach((child) => {
      if (child.url && !child.url.startsWith("javascript")) {
        window.open(child.url);
      }
    });
  };

  const settingsHandler = (setting: string) => {
    setOpen(false);
    if (!document.getElementById("sidebar")) {
      const settingsButton = document.getElementById("settingsButton");
      if (!settingsButton) {
        console.error("Settings button not found");
        return;
      }
      settingsButton.click();
    }
    setInputValue("");
    if (setting === "general") {
      document.getElementById("generalButton")?.click();
    } else if (setting === "appearance") {
      console.log("appearance");
      document.getElementById("appearanceButton")?.click();
    } else if (setting === "background") {
      document.getElementById("backgroundButton")?.click();
    } else if (setting === "advanced") {
      document.getElementById("advancedButton")?.click();
    } else if (setting === "todos") {
      document.getElementById("todosButton")?.click();
    } else if (setting === "notepad") {
      document.getElementById("notepadButton")?.click();
    } else if (setting === "date") {
      document.getElementById("dateButton")?.click();
    } else if (setting === "bookmarks") {
      document.getElementById("bookmarksButton")?.click();
    } else if (setting === "counter") {
      document.getElementById("counterButton")?.click();
    } else if (setting === "stopwatch") {
      document.getElementById("stopwatchButton")?.click();
    } else if (setting === "pomodoro") {
      document.getElementById("pomodoroButton")?.click();
    } else if (setting === "soundscapes") {
      document.getElementById("soundscapesButton")?.click();
    } else if (setting === "mantras") {
      document.getElementById("mantrasButton")?.click();
    } else if (setting === "weather") {
      document.getElementById("weatherButton")?.click();
    }
  };

  const handleMathInput = (value: string) => {
    setInputValue(value);
    try {
      const mexp = new Mexp();
      const mathResult = mexp.eval(value.replaceAll("sqrt(", "root("));
      if (typeof mathResult === "number") {
        setResult({
          expression: value,
          result: mathResult,
          copied: false,
        });
      } else {
        setResult({
          result: null,
          expression: value,
          copied: false,
        });
      }
    } catch (error) {
      console.error(error);
      setResult({
        result: null,
        expression: value,
        copied: false,
      });
    }
  };

  return (
    <CommandDialog open={open()} onOpenChange={setOpen}>
      <CommandInput
        placeholder={chrome.i18n.getMessage("type_command")}
        class="border-none pl-0 outline-none ring-0"
        value={inputValue()}
        onValueChange={(value) => handleMathInput(value)}
      />
      <CommandList class="scrollbar">
        {result().result != null && (
          <>
            <CommandItem
              class="flex m-2 items-center"
              onSelect={() => {
                navigator.clipboard.writeText(
                  String(Number(result().result).toFixed(11))
                );
                setOpen(false);
              }}
              keywords={[`${result().expression}`]}
            >
              <span class="text-primary">
                {Number(Number(result().result).toFixed(11))}
              </span>
            </CommandItem>
            <span class="text-gray-600 dark:text-gray-300 text-sm select-none font-medium px-2 block">
              {chrome.i18n.getMessage("mathDisclaimer")}{" "}
              <a
                href="https://help.blooft.com/articles/9906936-math"
                class="text-gray-800 dark:text-gray-100 hover:underline"
              >
                {chrome.i18n.getMessage("learn_more")}
              </a>
            </span>
            <br />
          </>
        )}
        <CommandGroup heading={chrome.i18n.getMessage("bookmarks")}>
          {loadedBookmarks() ? (
            <div>
              {bookmarks().map((bookmark) => (
                <CommandItem
                  onSelect={() => handleCommand(bookmark)}
                  class="flex items-center"
                >
                  <span class="text-primary">{bookmark.name}</span>
                </CommandItem>
              ))}
            </div>
          ) : null}
        </CommandGroup>
        <CommandGroup heading={chrome.i18n.getMessage("bookmark_folders")}>
          {bookmarkFolders().map((folder) => (
            <CommandItem
              onSelect={() => handleFolderOpen(folder)}
              class="flex items-center"
            >
              <span class="text-primary">{folder.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading={chrome.i18n.getMessage("settings")}>
          <CommandItem
            onSelect={() => settingsHandler("general")}
            class="flex items-center"
          >
            <span class="text-primary">
              {chrome.i18n.getMessage("general")}
            </span>
          </CommandItem>
          <CommandItem
            onSelect={() => settingsHandler("appearance")}
            class="flex items-center"
          >
            <span class="text-primary">
              {chrome.i18n.getMessage("appearance")}
            </span>
          </CommandItem>
          <CommandItem
            onSelect={() => settingsHandler("background")}
            class="flex items-center"
          >
            <span class="text-primary">
              {chrome.i18n.getMessage("background")}
            </span>
          </CommandItem>
          <CommandItem onSelect={() => settingsHandler("advanced")}>
            <span class="text-primary">
              {chrome.i18n.getMessage("advanced")}
            </span>
          </CommandItem>
          <CommandItem onSelect={() => settingsHandler("bookmarks")}>
            <span class="text-primary">
              {chrome.i18n.getMessage("bookmarks")}
            </span>
          </CommandItem>
          <CommandItem onSelect={() => settingsHandler("counter")}>
            <span class="text-primary">
              {chrome.i18n.getMessage("counter")}
            </span>
          </CommandItem>
          <CommandItem onSelect={() => settingsHandler("date")}>
            <span class="text-primary">{chrome.i18n.getMessage("date")}</span>
          </CommandItem>
          <CommandItem onSelect={() => settingsHandler("mantras")}>
            <span class="text-primary">
              {chrome.i18n.getMessage("mantras")}
            </span>
          </CommandItem>
          <CommandItem onSelect={() => settingsHandler("notepad")}>
            <span class="text-primary">
              {chrome.i18n.getMessage("notepad")}
            </span>
          </CommandItem>
          <CommandItem onSelect={() => settingsHandler("pomodoro")}>
            <span class="text-primary">
              {chrome.i18n.getMessage("pomodoro")}
            </span>
          </CommandItem>
          <CommandItem onSelect={() => settingsHandler("soundscapes")}>
            <span class="text-primary">
              {chrome.i18n.getMessage("soundscapes")}
            </span>
          </CommandItem>
          <CommandItem onSelect={() => settingsHandler("stopwatch")}>
            <span class="text-primary">
              {chrome.i18n.getMessage("stopwatch")}
            </span>
          </CommandItem>
          <CommandItem onSelect={() => settingsHandler("todos")}>
            <span class="text-primary">{chrome.i18n.getMessage("tasks")}</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setOpen(false);
              setInputValue("");
              const currentTheme =
                document.documentElement.getAttribute("data-kb-theme");
              if (currentTheme === "dark") {
                document.documentElement.setAttribute("data-kb-theme", "light");
              } else if (currentTheme === "light") {
                document.documentElement.setAttribute("data-kb-theme", "dark");
              } else if (currentTheme === "system") {
                document.documentElement.setAttribute(
                  "data-kb-theme",
                  "system"
                );
              }
            }}
            class="flex items-center"
          >
            <span class="text-primary">
              {chrome.i18n.getMessage("toggle_theme")}
            </span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
