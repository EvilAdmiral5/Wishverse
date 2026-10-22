export type WishOccasion = "birthday" | "anniversary";

export type WishTheme =
  | "birthday"
  | "anniversary"
  | "romantic"
  | "best-friend"
  | "cinematic";

export type RecipientGender = "boy" | "girl";

export type CakeType =
  | "chocolate"
  | "vanilla"
  | "strawberry"
  | "red-velvet"
  | "blueberry"
  | "butterscotch"
  | "black-forest";

export type Memory = {
  id: string;
  imageUrl: string;
  caption: string;
};

export type Wish = {
  id: string;
  slug: string;

  recipient_name: string;
  creator_name: string;

  recipient_gender: RecipientGender;
  occasion?: WishOccasion | null;
  theme: WishTheme;

  birthday_message: string;

  cake_type: CakeType;

  royal_notes: string[];

  memories: Memory[];

  secret_letter: string;

  created_at: string;
};