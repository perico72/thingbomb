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

type Category =
  | "water"
  | "nature"
  | "sleep"
  | "chill"
  | "ambience"
  | "focus"
  | "relax"
  | "appliance"
  | "favorites"
  | "natural";

interface Soundscape {
  name: string;
  emoji: string;
  url: string;
  volume: number;
  attribution: string[];
  image: string;
  index: number;
  categories: Category[];
}

let soundscapes = [
  {
    name: "Ocean",
    emoji: "🌊",
    url: "https://cdn.noisefill.com/Ocean.flac",
    volume: 1,
    attribution: [
      "Seawash (calm)  by craiggroshek -- https://freesound.org/s/176617/ -- License: Creative Commons 0",
    ],
    image: "https://cdn.noisefill.com/ocean.png",
    index: 0,
    categories: ["water", "chill", "focus", "relax"],
  },
  {
    name: "Forest",
    emoji: "🌴",
    url: "https://cdn.noisefill.com/Forest.wav",
    volume: 1,
    attribution: [
      "Birds In Spring (Scotland) by BurghRecords -- https://freesound.org/s/463903/ -- License: Creative Commons 0",
    ],
    image: "https://cdn.noisefill.com/forest.png",
    index: 1,
    categories: ["nature", "ambience"],
  },
  {
    name: "Rain",
    emoji: "💦",
    url: "https://cdn.noisefill.com/Rain.wav",
    volume: 1,
    attribution: [
      "Rain.wav by idomusics -- https://freesound.org/s/518863/ -- License: Creative Commons 0",
    ],
    image: "https://cdn.noisefill.com/rain.png",
    index: 2,
    categories: ["favorites", "nature", "ambience", "sleep", "chill", "relax"],
  },
  {
    name: "River",
    emoji: "🪨",
    url: "https://cdn.noisefill.com/River.flac",
    volume: 0.8,
    attribution: [
      "Relaxing, Mountains, Rivers, Streams, Running Water by INNORECORDS -- https://freesound.org/s/469009/ -- License: Creative Commons 0",
    ],
    image: "https://cdn.noisefill.com/river.png",
    index: 3,
    categories: ["favorites", "nature", "ambience", "sleep", "chill", "relax"],
  },
  {
    name: "Wind",
    emoji: "💨",
    url: "https://cdn.noisefill.com/Wind.wav",
    volume: 1,
    attribution: [
      "wind.ogg by sleepCircle -- https://freesound.org/s/22331/ -- License: Creative Commons 0",
    ],
    image: "https://cdn.noisefill.com/wind.png",
    index: 4,
    categories: ["nature", "ambience"],
  },
  {
    name: "Fire",
    emoji: "🔥",
    url: "https://cdn.noisefill.com/Fire.wav",
    volume: 1,
    attribution: [
      "Bonfire by forfie -- https://freesound.org/s/364992/ -- License: Creative Commons 0",
    ],
    image: "https://cdn.noisefill.com/fire.png",
    index: 5,
    categories: ["natural", "ambience"],
  },
  {
    name: "Desert",
    emoji: "🌵",
    url: "https://cdn.noisefill.com/Desert.wav",
    volume: 1,
    attribution: [
      "Desert Simple.wav by Proxima4 -- https://freesound.org/s/104320/ -- License: Creative Commons 0",
    ],
    image: "https://cdn.noisefill.com/Desert.png",
    index: 6,
    categories: ["chill", "natural", "ambience"],
  },
  {
    name: "Arctic",
    emoji: "❄️",
    url: "https://cdn.noisefill.com/Arctic.mp3",
    volume: 0.6,
    image: "https://cdn.noisefill.com/Snowflake.png",
    attribution: [
      "Wind__Artic__Cold.wav by cobratronik -- https://freesound.org/s/117136/ -- License: Creative Commons 0",
    ],
    index: 7,
    categories: ["sleep", "chill", "nature", "ambience"],
  },
  {
    name: "Kettle",
    emoji: "☕️",
    url: "https://cdn.noisefill.com/Kettle.wav",
    volume: 1,
    image: "https://cdn.noisefill.com/Kettle.png",
    attribution: [
      "water boil.wav by fryzu82 -- https://freesound.org/s/142333/ -- License: Creative Commons 0",
    ],
    index: 8,
    categories: ["chill", "appliance", "relax"],
  },
  {
    name: "Crickets",
    emoji: "🦗",
    url: "https://cdn.noisefill.com/Crickets.mp3",
    volume: 0.2,
    image: "https://cdn.noisefill.com/Crickets.png",
    attribution: [
      "crickets by FreethinkerAnon -- https://freesound.org/s/129678/ -- License: Creative Commons 0",
    ],
    index: 9,
    categories: ["natural", "nature"],
  },
  {
    name: "Underwater",
    emoji: "🐠",
    url: "https://cdn.noisefill.com/Underwater.mp3",
    volume: 0.6,
    image: "https://cdn.noisefill.com/Fish.png",
    attribution: [
      "Underwater Ambience by Fission9 -- https://freesound.org/s/504641/ -- License: Creative Commons 0",
    ],
    index: 10,
    categories: ["sleep", "chill", "ambience", "relax"],
  },
  {
    name: "Groovy lofi",
    emoji: "🎸",
    url: "https://cdn.noisefill.com/655615__seth_makes_sounds__happy-hip-hop-beat.flac",
    volume: 1,
    image: "https://cdn.noisefill.com/GroovyLofi.png",
    attribution: [
      "Happy Hip Hop Beat by Seth_Makes_Sounds -- https://freesound.org/s/655615/ -- License: Creative Commons 0",
    ],
    index: 11,
    categories: ["focus"],
  },
  {
    name: "Upbeat lofi",
    emoji: "〰︎",
    url: "https://cdn.noisefill.com/upbeat-lofi.mp3",
    volume: 1,
    image: "https://cdn.noisefill.com/UpbeatLofi.jpg",
    attribution: [
      "Lofi Guitar Beat 70bpm by Seth_Makes_Sounds -- https://freesound.org/s/659278/ -- License: Creative Commons 0",
    ],
    index: 12,
    categories: ["focus", "chill", "relax"],
  },
  {
    name: "Chill lofi",
    emoji: "🌌",
    url: "https://cdn.noisefill.com/Chill Lofi.mp3",
    volume: 1,
    image: "https://cdn.noisefill.com/Chill Lofi.jpg",
    attribution: [
      "Chill Lofi - lost stars.wav by noel0319 -- https://freesound.org/s/680400/ -- License: Creative Commons 0",
    ],
    index: 13,
    categories: ["focus", "chill", "relax"],
  },
  {
    name: "Retro lofi",
    emoji: "🕹️",
    url: "https://cdn.noisefill.com/655516__seth_makes_sounds__lofi-fusion-background-music.flac",
    volume: 1,
    image: "https://cdn.noisefill.com/Retro_lofi.png",
    attribution: [
      "Lofi Fusion Background Music by Seth_Makes_Sounds -- https://freesound.org/s/655516/ -- License: Creative Commons 0",
    ],
    index: 14,
    categories: ["focus", "chill", "relax"],
  },
  {
    name: "Classic lofi",
    emoji: "🎩",
    url: "https://cdn.noisefill.com/660390__seth_makes_sounds__cute-lofi-instrumental.flac",
    volume: 1,
    image: "https://cdn.noisefill.com/Classic_lofi.png",
    attribution: [
      "Cute Lofi Instrumental by Seth_Makes_Sounds -- https://freesound.org/s/660390/ -- License: Creative Commons 0",
    ],
    index: 15,
    categories: ["upbeat", "focus"],
  },
  {
    name: "Piano lofi",
    emoji: "🎹",
    url: "https://cdn.noisefill.com/Piano.flac",
    volume: 1,
    image: "https://cdn.noisefill.com/Piano_lofi.png",
    attribution: [
      "Chill Lofi Piano Beat by Seth_Makes_Sounds -- https://freesound.org/s/709779/ -- License: Creative Commons 0",
    ],
    index: 16,
    categories: ["upbeat", "focus", "relax"],
  },
  {
    name: "Rising lofi",
    emoji: "🎶",
    url: "https://cdn.noisefill.com/Rising.flac",
    volume: 1,
    image: "https://cdn.noisefill.com/Rising_lofi.png",
    attribution: [
      "Tranquil Lofi Beat by Seth_Makes_Sounds -- https://freesound.org/s/688285/ -- License: Creative Commons 0",
    ],
    index: 17,
    categories: ["upbeat", "focus", "relax"],
  },
  {
    name: "Deep lofi",
    emoji: "🕳️",
    url: "https://cdn.noisefill.com/Deep.flac",
    volume: 1,
    image: "https://cdn.noisefill.com/Deep_lofi.png",
    attribution: [
      "Vanilla Lofi Beat by Seth_Makes_Sounds -- https://freesound.org/s/691510/ -- License: Creative Commons 0",
    ],
    index: 18,
    categories: ["upbeat", "focus"],
  },
  {
    name: "Vibe lofi",
    emoji: "✌️",
    url: "https://cdn.noisefill.com/Vibe.flac",
    volume: 1,
    image: "https://cdn.noisefill.com/Vibe_lofi.png",
    attribution: [
      "Good Vibe Background Music by Seth_Makes_Sounds -- https://freesound.org/s/661782/ -- License: Creative Commons 0",
    ],
    index: 19,
    categories: ["upbeat", "focus"],
  },
];

export default soundscapes;
export type { Soundscape, Category };
