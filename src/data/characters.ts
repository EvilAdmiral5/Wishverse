import type { RecipientGender } from "@/types/wish";

export const characters: Record<
  RecipientGender,
  {
    name: string;
    emoji: string;
    description: string;
  }
> = {
  boy: {
    name: "Bubu",
    emoji: "🧸",
    description: "Your little Bubu has something for you.",
  },

  girl: {
    name: "Dudu",
    emoji: "🐰",
    description: "Your little Dudu has something for you.",
  },
};