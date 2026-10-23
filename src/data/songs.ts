import type { WishSongId } from "@/types/wish";

export type WishSong = {
  id: WishSongId;
  name: string;
  description: string;
  src: string;
  emoji: string;
};

export const songs: WishSong[] = [
  {
    id: "a-thousand-years",
    name: "A Thousand Years",
    description: "Christina Perri",
    src: "/sounds/a-thousand-years.mp3",
    emoji: "✦",
  },
  {
    id: "blue",
    name: "Blue",
    description: "Yung Kai",
    src: "/sounds/blue.mp3",
    emoji: "✦",
  },
  {
    id: "dandelions",
    name: "Dandelions",
    description: "Ruth B.",
    src: "/sounds/dandelions.mp3",
    emoji: "✦",
  },
  {
    id: "euphoria",
    name: "Euphoria",
    description: "Jungkook (BTS)",
    src: "/sounds/euphoria.mp3",
    emoji: "✦",
  },
  {
    id: "golden-hour",
    name: "Golden hour",
    description: "JVKE",
    src: "/sounds/golden-hour.mp3",
    emoji: "✦",
  },
  {
    id: "i-wanna-be-yours",
    name: "I Wanna Be Yours",
    description: "Arctic Monkeys",
    src: "/sounds/i-wanna-be-yours.mp3",
    emoji: "✦",
  },
  {
    id: "love-story",
    name: "Love Story",
    description: "Taylor Swift",
    src: "/sounds/love-story.mp3",
    emoji: "✦",
  },
  {
    id: "my-universe",
    name: "My Universe",
    description: "Coldplay ft. BTS",
    src: "/sounds/my-universe.mp3",
    emoji: "✦",
  },
  {
    id: "perfect",
    name: "Perfect",
    description: "Ed Sheeran",
    src: "/sounds/perfect.mp3",
    emoji: "✦",
  },
  {
    id: "until-i-found-you",
    name: "Until I Found You",
    description: "Stephen Sanchez",
    src: "/sounds/until-i-found-you.mp3",
    emoji: "✦",
  },
];
