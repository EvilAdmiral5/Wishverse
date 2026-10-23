import type { WishTheme } from "@/types/wish";

export type WishThemeConfig = {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  muted: string;
};

export const themes: Record<WishTheme, WishThemeConfig> = {
  birthday: {
    name: "Velvet Celebration",
    primary: "#6A0C1F",
    secondary: "#B56B78",
    accent: "#C8A24A",
    background: "#0F0D0E",
    text: "#FFFFFF",
    muted: "#FFFFFF66",
  },

  anniversary: {
    name: "Midnight Romance",
    primary: "#4A1026",
    secondary: "#9B4D68",
    accent: "#D6A6B8",
    background: "#100A0D",
    text: "#FFFFFF",
    muted: "#FFFFFF66",
  },

  romantic: {
    name: "Rose Noir",
    primary: "#7A1735",
    secondary: "#D05A7A",
    accent: "#F2B5C5",
    background: "#12090D",
    text: "#FFFFFF",
    muted: "#FFFFFF66",
  },

  "best-friend": {
    name: "Sunset Bloom",
    primary: "#A65335",
    secondary: "#E58B61",
    accent: "#F3C677",
    background: "#15100D",
    text: "#FFFFFF",
    muted: "#FFFFFF66",
  },

  cinematic: {
    name: "Royal Eclipse",
    primary: "#25204A",
    secondary: "#5D4FA3",
    accent: "#D7B56D",
    background: "#090914",
    text: "#FFFFFF",
    muted: "#FFFFFF66",
  },

  bestFriend: {
    name: "Sunset Bloom",
    primary: "#A65335",
    secondary: "#E58B61",
    accent: "#F3C677",
    background: "#15100D",
    text: "#FFFFFF",
    muted: "#FFFFFF66",
  },

  romanticBirthday: {
    name: "Rose Noir",
    primary: "#7A1735",
    secondary: "#D05A7A",
    accent: "#F2B5C5",
    background: "#12090D",
    text: "#FFFFFF",
    muted: "#FFFFFF66",
  },
};