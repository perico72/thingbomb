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

import { Bookmark, BookmarkTreeNode } from "../types";

/**
 * Injects custom CSS into the document
 */
export function injectUserCSS(css: string) {
  document.getElementById("user-css")?.remove();
  const style = document.createElement("style");
  style.setAttribute("id", "user-css");
  style.innerHTML = `${css}`;
  document.head.appendChild(style);
}

/**
 * Formats time in minutes:seconds format
 */
export function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, "0")}:${Math.floor(
    Number(seconds.toString())
  )
    .toString()
    .padStart(2, "0")}`;
}

/**
 * Helper to safely parse JSON
 */
export function safeParse<T>(data: any, fallback: T): T {
  try {
    const parsed = JSON.parse(data);
    return parsed;
  } catch {
    return fallback;
  }
}

/**
 * Flatten bookmark tree into array of bookmarks
 */
export function flattenBookmarks(nodes: BookmarkTreeNode[]): Bookmark[] {
  let bookmarks: Bookmark[] = [];
  for (const node of nodes) {
    if (node.url) {
      bookmarks.push({ name: node.title, url: node.url });
    }
    if (node.children) {
      bookmarks = bookmarks.concat(flattenBookmarks(node.children));
    }
  }
  return bookmarks;
}
