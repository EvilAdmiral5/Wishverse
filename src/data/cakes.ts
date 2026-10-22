import type { CakeType } from "@/types/wish";

export const cakes: {
  id: CakeType;
  name: string;
  emoji: string;
  description: string;
}[] = [
  {
    id: "chocolate",
    name: "Chocolate Dream",
    emoji: "🍫",
    description: "Rich chocolate cake",
  },
  {
    id: "vanilla",
    name: "Vanilla Cloud",
    emoji: "🍰",
    description: "Soft vanilla celebration cake",
  },
  {
    id: "strawberry",
    name: "Strawberry Kiss",
    emoji: "🍓",
    description: "Sweet strawberry cake",
  },
  {
    id: "red-velvet",
    name: "Red Velvet",
    emoji: "❤️",
    description: "Velvety red celebration cake",
  },
  {
    id: "blueberry",
    name: "Blueberry Bliss",
    emoji: "🫐",
    description: "Fresh blueberry cake",
  },
  {
    id: "butterscotch",
    name: "Butterscotch",
    emoji: "🍯",
    description: "Caramel butterscotch cake",
  },
  {
    id: "black-forest",
    name: "Black Forest",
    emoji: "🍒",
    description: "Classic chocolate cherry cake",
  },
];