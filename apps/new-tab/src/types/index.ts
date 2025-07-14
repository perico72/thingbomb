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

export type Bookmark = {
  name: string;
  url?: string;
};

export interface BookmarkTreeNode {
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

export type Mantra =
  | "mantra_1"
  | "mantra_2"
  | "mantra_3"
  | "mantra_4"
  | "mantra_5"
  | "mantra_6"
  | "mantra_7"
  | "mantra_8"
  | "mantra_9"
  | "mantra_10"
  | "mantra_11"
  | "mantra_12"
  | "mantra_13"
  | "mantra_14"
  | "mantra_15";

export interface Pomodoro {
  time: number;
  session: string;
  playing: boolean;
}

export interface PomodoroConfig {
  workMinutes: number;
  breakMinutes: number;
}

export type MessageKeys = any; // Update this with the actual type from messages.json if needed
