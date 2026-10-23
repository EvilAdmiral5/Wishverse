export type RecipientGender = "boy" | "girl";

export type WishOccasion = "birthday" | "anniversary";

export type WishTheme =
  | "birthday"
  | "anniversary"
  | "romantic"
  | "best-friend"
  | "cinematic"
  | "bestFriend"
  | "romanticBirthday";

export type WishSongId =
  | "a-thousand-years"
  | "blue"
  | "dandelions"
  | "euphoria"
  | "golden-hour"
  | "i-wanna-be-yours"
  | "love-story"
  | "my-universe"
  | "perfect"
  | "until-i-found-you";

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
  id?: string;
  slug: string;
  recipient_name: string;
  creator_name: string;
  recipient_gender: RecipientGender;
  occasion?: WishOccasion | null;
  theme: WishTheme;
  song?: WishSongId | null;
  birthday_message: string;
  cake_type: CakeType;
  royal_notes: string[];
  memories: Memory[];
  secret_letter: string;
  created_at?: string;
};
