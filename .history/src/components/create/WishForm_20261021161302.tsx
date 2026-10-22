"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { themes } from "@/data/themes";
import { cakes } from "@/data/cakes";

import type {
  RecipientGender,
  WishTheme,
  CakeType,
  Memory,
} from "@/types/wish";

type Occasion =
  | "birthday"
  | "anniversary"
  | "romanticBirthday"
  | "bestFriend"
  | "justBecause";

const occasionNames: Record<Occasion, string> = {
  birthday: "Birthday",
  anniversary: "Anniversary",
  romanticBirthday: "Romantic Birthday",
  bestFriend: "Best Friend",
  justBecause: "Just Because",
};

// A single occasion can offer more than one visual mood.
// We reuse the existing theme IDs so the current Supabase schema stays unchanged.
const occasionMoods: Record<Occasion, WishTheme[]> = {
  birthday: ["birthday", "bestFriend"],
  anniversary: ["anniversary"],
  romanticBirthday: ["romanticBirthday"],
  bestFriend: ["romanticBirthday"],
  // Keep the existing theme ID so current Supabase rows remain valid.
  justBecause: ["cinematic"],
};

const moodLabels: Partial<Record<WishTheme, string>> = {
  birthday: "Velvet Celebration",
  bestFriend: "Sunset Bloom",
  anniversary: "Midnight Romance",
  romanticBirthday: "Rose Noir",
  cinematic: "Soft Bloom",
};

const moodDescriptions: Partial<Record<WishTheme, string>> = {
  birthday: "A rich, celebratory velvet mood.",
  bestFriend: "Warm, joyful color with a soft sunset glow.",
  anniversary: "Deep romantic tones for a timeless evening feel.",
  romanticBirthday: "A soft, intimate rose mood made for romance.",
  cinematic: "A gentle floral atmosphere for a wish made for no reason at all.",
};

const moodEmojis: Partial<Record<WishTheme, string>> = {
  birthday: "🎂",
  bestFriend: "🌅",
  anniversary: "💍",
  romanticBirthday: "🌹",
  cinematic: "🌸",
};

const buttonThemeStyles: Record<WishTheme, { primary: string; secondary: string; accent: string }> = {
  birthday: { primary: "#6A0C1F", secondary: "#B56B78", accent: "#C8A24A" },
  anniversary: { primary: "#4A1026", secondary: "#9B4D68", accent: "#D6A6B8" },
  romanticBirthday: { primary: "#7A1735", secondary: "#D05A7A", accent: "#F2B5C5" },
  bestFriend: { primary: "#A65335", secondary: "#E58B61", accent: "#F3C677" },
  cinematic: { primary: "#6B3A5B", secondary: "#B982A4", accent: "#E8C7D8" },
};

const occasionCopy: Record<Occasion, {
  messageTitle: string;
  messagePlaceholder: string;
  cakeTitle: string;
  notesTitle: string;
  notesDescription: string;
  notePlaceholder: string;
  addNoteLabel: string;
  memoriesTitle: string;
  memoriesDescription: string;
  memoryCaptionPlaceholder: string;
  memoryNoun: string;
  letterTitle: string;
  letterPlaceholder: string;
}> = {
  birthday: {
    messageTitle: "Write the birthday message",
    messagePlaceholder:
      "Happy birthday! I hope today reminds you how special you are...",
    cakeTitle: "Choose their birthday cake",
    notesTitle: "Hide some birthday notes",
    notesDescription:
      "Leave little birthday surprises for them to open one by one.",
    notePlaceholder: "Birthday note",
    addNoteLabel: "+ ADD ANOTHER BIRTHDAY NOTE",
    memoriesTitle: "Add your birthday memories",
    memoriesDescription:
      "Upload the moments that made their birthday story special. Your photos are uploaded to Supabase Storage when the wish is created, and the recipient will see them inside the cinematic Memories stage.",
    memoryCaptionPlaceholder: "One line about this birthday memory...",
    memoryNoun: "memory",
    letterTitle: "Write the secret birthday letter",
    letterPlaceholder:
      "There is something special I've wanted to tell you on your birthday...",
  },
  anniversary: {
    messageTitle: "Write the anniversary message",
    messagePlaceholder:
      "Happy anniversary! Every moment with you is a chapter worth remembering...",
    cakeTitle: "Choose their anniversary cake",
    notesTitle: "Hide some love notes",
    notesDescription:
      "Leave intimate little messages for them to discover one by one.",
    notePlaceholder: "Love note",
    addNoteLabel: "+ ADD ANOTHER LOVE NOTE",
    memoriesTitle: "Add your anniversary memories",
    memoriesDescription:
      "Upload the moments that tell your story together. Your photos are uploaded to Supabase Storage when the wish is created, and the recipient will see them inside the cinematic Memories stage.",
    memoryCaptionPlaceholder: "One line about this moment together...",
    memoryNoun: "memory",
    letterTitle: "Write the secret anniversary letter",
    letterPlaceholder:
      "There is something I've wanted to tell you about us...",
  },
  romanticBirthday: {
    messageTitle: "Write the romantic birthday message",
    messagePlaceholder:
      "Happy birthday, my love. Today is all about celebrating you and everything you mean to me...",
    cakeTitle: "Choose their romantic birthday cake",
    notesTitle: "Hide some love notes",
    notesDescription:
      "Leave romantic little surprises for them to open one by one.",
    notePlaceholder: "A little love note",
    addNoteLabel: "+ ADD ANOTHER LOVE NOTE",
    memoriesTitle: "Add your romantic memories",
    memoriesDescription:
      "Upload the moments you never want to forget together. Your photos are uploaded to Supabase Storage when the wish is created, and the recipient will see them inside the cinematic Memories stage.",
    memoryCaptionPlaceholder: "One line about this moment...",
    memoryNoun: "memory",
    letterTitle: "Write the secret romantic birthday letter",
    letterPlaceholder:
      "There is something I've wanted to tell you from my heart...",
  },
  bestFriend: {
    messageTitle: "Write the best-friend message",
    messagePlaceholder:
      "Happy birthday to my best friend! Here is to every crazy memory, every laugh, and everything still ahead of us...",
    cakeTitle: "Choose their celebration cake",
    notesTitle: "Hide some friendship notes",
    notesDescription:
      "Leave funny, wholesome, or heartfelt surprises for your best friend to open one by one.",
    notePlaceholder: "Best-friend note",
    addNoteLabel: "+ ADD ANOTHER FRIENDSHIP NOTE",
    memoriesTitle: "Add your best-friend memories",
    memoriesDescription:
      "Upload the moments that made your friendship unforgettable. Your photos are uploaded to Supabase Storage when the wish is created, and the recipient will see them inside the cinematic Memories stage.",
    memoryCaptionPlaceholder: "One line about this crazy memory...",
    memoryNoun: "memory",
    letterTitle: "Write the secret letter for your best friend",
    letterPlaceholder:
      "There is something I've always wanted to say to my best friend...",
  },
  justBecause: {
    messageTitle: "Write your message",
    messagePlaceholder:
      "I don't need a reason to remind you how special you are...",
    cakeTitle: "Choose a little celebration",
    notesTitle: "Leave them little surprises",
    notesDescription:
      "Add sweet, funny, grateful, or heartfelt notes for them to discover one by one.",
    notePlaceholder: "A little surprise",
    addNoteLabel: "+ ADD ANOTHER SURPRISE NOTE",
    memoriesTitle: "Add moments worth remembering",
    memoriesDescription:
      "Upload the moments you want them to keep close. Your photos are uploaded to Supabase Storage when the wish is created, and the recipient will see them inside the cinematic Memories stage.",
    memoryCaptionPlaceholder: "One line about this moment...",
    memoryNoun: "memory",
    letterTitle: "Write something from the heart",
    letterPlaceholder:
      "No occasion, no perfect reason — I just wanted you to know...",
  },
};

function generateSlug(name: string) {
  const cleanName = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const random = Math.random().toString(36).substring(2, 8);

  return `${cleanName}-${random}`;
}

export default function WishForm() {
  const router = useRouter();

  const [recipientName, setRecipientName] = useState("");
  const [creatorName, setCreatorName] = useState("");

  const [gender, setGender] = useState<RecipientGender>("boy");

  const [occasion, setOccasion] = useState<Occasion>("birthday");
  const [theme, setTheme] = useState<WishTheme>("birthday");

  const [birthdayMessage, setBirthdayMessage] = useState("");

  const [cakeType, setCakeType] =
    useState<CakeType>("chocolate");

  const [royalNotes, setRoyalNotes] = useState<string[]>([
    "",
    "",
    "",
  ]);

  type MemoryDraft = Memory & {
    file: File;
    previewUrl: string;
  };

  const [memories, setMemories] = useState<MemoryDraft[]>([]);

  const [secretLetter, setSecretLetter] = useState("");

  const [loading, setLoading] = useState(false);

  const copy = occasionCopy[occasion] ?? occasionCopy.birthday;
  const memoryInputRef = useRef<HTMLInputElement>(null);
  const previewUrlsRef = useRef(new Set<string>());

  const MAX_MEMORY_SIZE = 10 * 1024 * 1024;

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".wv-3d-form");
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>(".wv-3d-card"));
    const cleanups: Array<() => void> = [];

    cards.forEach((card) => {
      const onMove = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 5.5;
        const rotateX = (0.5 - y) * 5.5;
        card.style.setProperty("--wv-rotate-x", `${rotateX.toFixed(2)}deg`);
        card.style.setProperty("--wv-rotate-y", `${rotateY.toFixed(2)}deg`);
        card.style.setProperty("--wv-glow-x", `${(x * 100).toFixed(1)}%`);
        card.style.setProperty("--wv-glow-y", `${(y * 100).toFixed(1)}%`);
      };

      const reset = () => {
        card.style.setProperty("--wv-rotate-x", "0deg");
        card.style.setProperty("--wv-rotate-y", "0deg");
        card.style.setProperty("--wv-glow-x", "50%");
        card.style.setProperty("--wv-glow-y", "50%");
      };

      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", reset);
      cleanups.push(() => {
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", reset);
      });
    });

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("wv-in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    cards.forEach((card) => revealObserver.observe(card));

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      revealObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) =>
        URL.revokeObjectURL(url)
      );
      previewUrlsRef.current.clear();
    };
  }, []);


  const updateRoyalNote = (index: number, value: string) => {
    setRoyalNotes((current) => {
      const copy = [...current];
      copy[index] = value;
      return copy;
    });
  };

  const addRoyalNote = () => {
    if (royalNotes.length >= 5) return;

    setRoyalNotes((current) => [...current, ""]);
  };

  const removeRoyalNote = (index: number) => {
    if (royalNotes.length <= 1) return;

    setRoyalNotes((current) =>
      current.filter((_, i) => i !== index)
    );
  };

  const addMemoryFiles = (files: FileList | null) => {
    if (!files?.length) return;

    const nextFiles = Array.from(files);
    const invalidFile = nextFiles.find(
      (file) =>
        !file.type.startsWith("image/") ||
        file.size > MAX_MEMORY_SIZE
    );

    if (invalidFile) {
      alert(
        `\"${invalidFile.name}\" is not a supported image or is larger than 10 MB.`
      );
      return;
    }

    const drafts = nextFiles.map((file) => {
      const id = crypto.randomUUID();
      const previewUrl = URL.createObjectURL(file);
      previewUrlsRef.current.add(previewUrl);

      return {
        id,
        file,
        previewUrl,
        imageUrl: previewUrl,
        caption: "",
      };
    });

    setMemories((current) => [...current, ...drafts]);

    if (memoryInputRef.current) {
      memoryInputRef.current.value = "";
    }
  };

  const replaceMemory = (id: string, file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }

    if (file.size > MAX_MEMORY_SIZE) {
      alert("Each memory photo must be 10 MB or smaller.");
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(file);

    setMemories((current) =>
      current.map((memory) => {
        if (memory.id !== id) return memory;

        URL.revokeObjectURL(memory.previewUrl);
        previewUrlsRef.current.delete(memory.previewUrl);
        previewUrlsRef.current.add(nextPreviewUrl);

        return {
          ...memory,
          file,
          previewUrl: nextPreviewUrl,
          imageUrl: nextPreviewUrl,
        };
      })
    );
  };

  const updateMemoryCaption = (id: string, caption: string) => {
    setMemories((current) =>
      current.map((memory) =>
        memory.id === id ? { ...memory, caption } : memory
      )
    );
  };

  const removeMemory = (id: string) => {
    setMemories((current) => {
      const target = current.find((memory) => memory.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
        previewUrlsRef.current.delete(target.previewUrl);
      }
      return current.filter((memory) => memory.id !== id);
    });
  };

  const submitWish = async () => {
    if (!recipientName.trim()) {
      alert("Please enter the recipient's name.");
      return;
    }

    if (!creatorName.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!birthdayMessage.trim()) {
      alert(`Please write ${occasionNames[occasion].toLowerCase()} message.`);
      return;
    }

    if (!secretLetter.trim()) {
      alert("Please write the secret letter.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const slug = generateSlug(recipientName);

      const cleanedNotes = royalNotes.filter(
        (note) => note.trim().length > 0
      );

      const uploadedPaths: string[] = [];

      const uploadedMemories = await Promise.all(
        memories.map(async (memory) => {
          const extension =
            memory.file.name.split(".").pop()?.toLowerCase() ||
            "jpg";
          const path = `${slug}/${memory.id}-${Date.now()}.${extension}`;

          const { error: uploadError } = await supabase.storage
            .from("wish-memories")
            .upload(path, memory.file, {
              cacheControl: "31536000",
              contentType: memory.file.type,
              upsert: false,
            });

          if (uploadError) throw uploadError;

          uploadedPaths.push(path);

          const { data } = supabase.storage
            .from("wish-memories")
            .getPublicUrl(path);

          return {
            id: memory.id,
            imageUrl: data.publicUrl,
            caption: memory.caption.trim(),
          };
        })
      );

      const insertPayload = {
  slug,
  recipient_name: recipientName.trim(),
  creator_name: creatorName.trim(),
  recipient_gender: gender,
  theme,
  birthday_message: birthdayMessage.trim(),
  cake_type: cakeType,
  royal_notes: cleanedNotes,
  memories: uploadedMemories,
  secret_letter: secretLetter.trim(),
};

console.log("🚀 INSERT PAYLOAD:", insertPayload);

const result = await supabase
  .from("wishes")
  .insert(insertPayload);

console.log("🚀 SUPABASE INSERT RESULT:", result);
console.log("🚀 SUPABASE INSERT ERROR:", result.error);
console.log("🚀 SUPABASE INSERT DATA:", result.data);

if (result.error) {
  alert(
    "Supabase insert failed.\n\n" +
    JSON.stringify(result.error, null, 2)
  );

  console.error("❌ FULL SUPABASE ERROR:", result.error);
  console.error(
    "❌ ERROR STRING:",
    String(result.error)
  );
  console.error(
    "❌ ERROR JSON:",
    JSON.stringify(result.error, null, 2)
  );

  if (uploadedPaths.length) {
    await supabase.storage
      .from("wish-memories")
      .remove(uploadedPaths);
  }

  return;
}

      router.push(`/wish/${slug}`);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong while creating your wish."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="wv-button-surface wv-3d-form relative space-y-8 overflow-hidden rounded-[1.75rem] border border-white/[0.07] bg-[#0B0A10]/80 p-2 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-3"
      style={
        {
          "--wv-primary": buttonThemeStyles[theme].primary,
          "--wv-secondary": buttonThemeStyles[theme].secondary,
          "--wv-accent": buttonThemeStyles[theme].accent,
        } as React.CSSProperties
      }
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-80"
        style={{
          background: `
            radial-gradient(circle at 8% 8%, color-mix(in srgb, var(--wv-primary) 13%, transparent), transparent 28%),
            radial-gradient(circle at 92% 18%, color-mix(in srgb, var(--wv-secondary) 9%, transparent), transparent 30%),
            radial-gradient(circle at 50% 100%, color-mix(in srgb, var(--wv-accent) 5%, transparent), transparent 34%)
          `,
        }}
      />

      {/* CREATIVE COMMAND BAR */}

      <div className="wv-command-bar rounded-[1.5rem] border border-white/[0.08] bg-white/[0.035] px-5 py-4 backdrop-blur-xl sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.28em] text-white/35">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--wv-accent)] shadow-[0_0_12px_var(--wv-accent)]" />
              WishVerse Studio
            </div>
            <p className="mt-2 text-sm text-white/55">Craft a little world they will remember.</p>
          </div>

          <button
            type="button"
            onClick={() => document.getElementById("wish-form-start")?.scrollIntoView({ behavior: "smooth", block: "center" })}
            className="wv-mini-cta shrink-0 rounded-full px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white"
          >
            Begin creating <span className="ml-1">↓</span>
          </button>
        </div>
      </div>

      {/* BASIC INFORMATION */}

      <section id="wish-form-start" className="wv-3d-card rounded-3xl border border-white/[0.075] bg-white/[0.028] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-8">
        <SectionTitle
          number="01"
          title="Who is this for?"
        />

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <Input
            label="Recipient name"
            placeholder="e.g. Ananya"
            value={recipientName}
            onChange={setRecipientName}
          />

          <Input
            label="Your name"
            placeholder="e.g. Gagan"
            value={creatorName}
            onChange={setCreatorName}
          />
        </div>

        <div className="mt-7">
          <label className="text-sm text-white/50">
            Recipient gender
          </label>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <Choice
              active={gender === "boy"}
              onClick={() => setGender("boy")}
            >
              🧸 Male
            </Choice>

            <Choice
              active={gender === "girl"}
              onClick={() => setGender("girl")}
            >
              🐰 Female
            </Choice>
          </div>
        </div>
      </section>

      {/* OCCASION + MOOD */}

      <section className="wv-3d-card rounded-3xl border border-white/[0.075] bg-white/[0.028] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-8">
        <SectionTitle
          number="02"
          title="Choose the occasion"
        />

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(occasionNames) as Occasion[]).map((occasionId) => (
            <Choice
              key={occasionId}
              active={occasion === occasionId}
              onClick={() => {
                setOccasion(occasionId);
                setTheme(occasionMoods[occasionId][0]);
              }}
            >
              <span className="text-xl">
                {moodEmojis[occasionMoods[occasionId][0]] ?? themes[occasionMoods[occasionId][0]]?.emoji ?? "✨"}
              </span>

              <span>
                <strong className="block">
                  {occasionNames[occasionId]}
                </strong>

                <small className="mt-1 block text-white/40">
                  {occasionMoods[occasionId].length > 1
                    ? `${occasionMoods[occasionId].length} moods available`
                    : "1 mood available"}
                </small>
              </span>
            </Choice>
          ))}
        </div>

        <div className="mt-8 border-t border-white/10 pt-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-white/50">Choose the mood</p>
              <p className="mt-1 text-xs text-white/25">
                Pick the visual style for this occasion.
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/25">
              {occasionNames[occasion]}
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {occasionMoods[occasion].map((themeId) => {
              const item = themes[themeId];

              return (
                <Choice
                  key={themeId}
                  active={theme === themeId}
                  onClick={() => setTheme(themeId)}
                >
                  <span className="text-xl">{moodEmojis[themeId] ?? item?.emoji ?? "✨"}</span>

                  <span>
                    <strong className="block">
                      {moodLabels[themeId] ?? item?.name}
                    </strong>

                    <small className="mt-1 block text-white/40">
                      {moodDescriptions[themeId] ?? item?.description}
                    </small>
                  </span>
                </Choice>
              );
            })}
          </div>
        </div>
      </section>

      {/* MESSAGE */}

      <section className="wv-3d-card rounded-3xl border border-white/[0.075] bg-white/[0.028] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-8">
        <SectionTitle
          number="03"
          title={copy.messageTitle}
        />

        <textarea
          value={birthdayMessage}
          onChange={(event) =>
            setBirthdayMessage(event.target.value)
          }
          placeholder={copy.messagePlaceholder}
          rows={6}
          className="mt-7 w-full resize-none rounded-2xl border border-white/[0.08] bg-black/25 p-5 text-white outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] placeholder:text-white/20 transition focus:border-white/25 focus:bg-black/30"
        />
      </section>

      {/* CAKE */}

      <section className="wv-3d-card rounded-3xl border border-white/[0.075] bg-white/[0.028] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-8">
        <SectionTitle
          number="04"
          title={copy.cakeTitle}
        />

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cakes.map((cake) => (
            <Choice
              key={cake.id}
              active={cakeType === cake.id}
              onClick={() => setCakeType(cake.id)}
            >
              <span className="text-2xl">
                {cake.emoji}
              </span>

              <span>
                <strong className="block">
                  {cake.name}
                </strong>

                <small className="mt-1 block text-white/40">
                  {cake.description}
                </small>
              </span>
            </Choice>
          ))}
        </div>
      </section>

      {/* ROYAL NOTES */}

      <section className="wv-3d-card rounded-3xl border border-white/[0.075] bg-white/[0.028] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-8">
        <SectionTitle
          number="05"
          title={copy.notesTitle}
        />

        <p className="mt-3 text-sm text-white/40">
          {copy.notesDescription}
        </p>

        <div className="mt-7 space-y-4">
          {royalNotes.map((note, index) => (
            <div key={index} className="flex gap-3">
              <textarea
                value={note}
                onChange={(event) =>
                  updateRoyalNote(
                    index,
                    event.target.value
                  )
                }
                placeholder={`${copy.notePlaceholder} ${index + 1}`}
                rows={3}
                className="w-full resize-none rounded-2xl border border-white/[0.08] bg-black/25 p-4 outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] placeholder:text-white/20 transition focus:border-white/25 focus:bg-black/30"
              />

              {royalNotes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRoyalNote(index)}
                  className="self-start rounded-xl border border-white/10 px-3 py-2 text-white/40 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {royalNotes.length < 5 && (
          <button
            type="button"
            onClick={addRoyalNote}
            className="mt-5 rounded-full border border-white/10 px-5 py-3 text-sm text-white/60 hover:bg-white/5"
          >
            {copy.addNoteLabel}
          </button>
        )}
      </section>

      {/* MEMORIES */}

      <section className="wv-3d-card rounded-3xl border border-white/[0.075] bg-white/[0.028] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-8">
        <SectionTitle
          number="06"
          title={copy.memoriesTitle}
        />

        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
          {copy.memoriesDescription}
        </p>

        <input
          ref={memoryInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => addMemoryFiles(event.target.files)}
        />

        {memories.length > 0 ? (
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {memories.map((memory, index) => (
              <div
                key={memory.id}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-black/25"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.03]">
                  <img
                    src={memory.previewUrl}
                    alt={`Memory ${index + 1}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />

                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                    <span className="rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[9px] uppercase tracking-[0.22em] text-white/60 backdrop-blur-md">
                      Memory {String(index + 1).padStart(2, "0")}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeMemory(memory.id)}
                      className="rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[10px] text-white/55 backdrop-blur-md transition hover:border-red-300/30 hover:text-white"
                    >
                      Delete
                    </button>
                  </div>

                  <label className="absolute bottom-3 right-3 cursor-pointer rounded-full border border-white/10 bg-black/60 px-3 py-2 text-[10px] uppercase tracking-[0.15em] text-white/70 backdrop-blur-md transition hover:bg-black/80 hover:text-white">
                    Re-upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        replaceMemory(
                          memory.id,
                          event.target.files?.[0]
                        );
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>
                </div>

                <div className="p-4">
                  <p className="truncate text-[10px] text-white/30">
                    {memory.file.name}
                  </p>

                  <input
                    value={memory.caption}
                    onChange={(event) =>
                      updateMemoryCaption(
                        memory.id,
                        event.target.value
                      )
                    }
                    placeholder={copy.memoryCaptionPlaceholder}
                    maxLength={160}
                    className="mt-3 w-full rounded-xl border border-white/[0.08] bg-black/25 p-3 text-sm outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] placeholder:text-white/20 transition focus:border-white/25 focus:bg-black/30"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => memoryInputRef.current?.click()}
            className="mt-7 flex min-h-[220px] w-full flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-black/20 px-6 text-center transition hover:border-white/20 hover:bg-white/[0.03]"
          >
            <span className="text-4xl">✦</span>
            <strong className="mt-4 text-sm font-medium text-white/75">
              Upload your memories
            </strong>
            <span className="mt-2 max-w-sm text-xs leading-5 text-white/30">
              Select one or many photos at once. There is no memory-count limit.
              Each image can be up to 10 MB.
            </span>
            <span className="mt-5 rounded-full border border-white/10 px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] text-white/55">
              Choose photos
            </span>
          </button>
        )}

        {memories.length > 0 && (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-white/30">
              {memories.length} {memories.length === 1 ? copy.memoryNoun : `${copy.memoryNoun}s`} selected · ready to be stored
            </p>

            <button
              type="button"
              onClick={() => memoryInputRef.current?.click()}
              className="rounded-full border border-white/10 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              + Add more photos
            </button>
          </div>
        )}
      </section>

      {/* LETTER */}

      <section className="wv-3d-card rounded-3xl border border-white/[0.075] bg-white/[0.028] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-8">
        <SectionTitle
          number="07"
          title={copy.letterTitle}
        />

        <textarea
          value={secretLetter}
          onChange={(event) =>
            setSecretLetter(event.target.value)
          }
          placeholder={copy.letterPlaceholder}
          rows={10}
          className="mt-7 w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-5 leading-7 outline-none placeholder:text-white/20 focus:border-white/30"
        />
      </section>

      {/* CREATE */}

      <div className="wv-finish-cta rounded-[1.5rem] border border-white/[0.08] bg-white/[0.035] p-4 backdrop-blur-xl sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/30">Your experience is almost ready</p>
            <p className="mt-1 text-sm text-white/55">Seven little steps. One unforgettable surprise.</p>
          </div>
          <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--wv-accent)] sm:block">07 / 07</span>
        </div>
      </div>

      <div className="sticky bottom-5 z-20">
        <button
          type="button"
          disabled={loading}
          onClick={submitWish}
          className="wv-create-cta w-full rounded-2xl px-8 py-5 text-sm font-bold text-white shadow-2xl transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            <span>{loading ? "CREATING YOUR EXPERIENCE..." : "CREATE MY WISH"}</span>
            {!loading && <span className="text-base">→</span>}
          </span>
        </button>
      </div>
    </div>
  );
}

function SectionTitle({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div>
      <span className="text-xs tracking-[0.3em] text-white/30">
        {number}
      </span>

      <h2 className="mt-2 text-2xl font-semibold">
        {title}
      </h2>
    </div>
  );
}

function Input({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm text-white/50">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-3 w-full rounded-2xl border border-white/[0.08] bg-black/25 p-4 outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] placeholder:text-white/20 transition focus:border-white/25 focus:bg-black/30"
      />
    </div>
  );
}

function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active}
      className={`wv-premium-button flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
        active
          ? "border-[var(--wv-accent)]/70 bg-white/10"
          : "border-white/10 bg-black/20 hover:bg-white/5"
      }`}
    >
      {children}
    </button>
  );
}

/* ===================================================== */
/* WISHVERSE PREMIUM BUTTON SYSTEM */
/* Inspired by the supplied SaaS CTA: layered gradient, */
/* animated sheen, soft depth and mood-aware colors. */
/* ===================================================== */

<style jsx>{`
  .wv-button-surface {
    --wv-primary: #6A0C1F;
    --wv-secondary: #B56B78;
    --wv-accent: #C8A24A;
  }

  .wv-button-surface button,
  .wv-button-surface label.wv-premium-button {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    border-color: color-mix(in srgb, var(--wv-accent) 28%, rgba(255,255,255,0.1));
    box-shadow:
      0 12px 32px color-mix(in srgb, var(--wv-primary) 22%, transparent),
      inset 0 1px 0 rgba(255,255,255,0.10),
      inset 0 -1px 0 rgba(0,0,0,0.18);
    transition:
      transform 260ms cubic-bezier(.22,1,.36,1),
      border-color 260ms ease,
      box-shadow 260ms ease,
      background-color 260ms ease;
  }

  .wv-button-surface button::before,
  .wv-button-surface label.wv-premium-button::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -2;
    background:
      linear-gradient(135deg,
        color-mix(in srgb, var(--wv-primary) 92%, black),
        color-mix(in srgb, var(--wv-secondary) 58%, var(--wv-primary)) 54%,
        color-mix(in srgb, var(--wv-accent) 45%, var(--wv-secondary)));
    opacity: 0.18;
    transition: opacity 260ms ease;
  }

  .wv-button-surface button::after,
  .wv-button-surface label.wv-premium-button::after {
    content: "";
    position: absolute;
    top: -80%;
    left: -35%;
    width: 38%;
    height: 260%;
    z-index: -1;
    pointer-events: none;
    transform: rotate(24deg) translateX(-260%);
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent);
    transition: transform 720ms cubic-bezier(.22,1,.36,1);
  }

  .wv-button-surface button:hover,
  .wv-button-surface label.wv-premium-button:hover {
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--wv-accent) 62%, rgba(255,255,255,0.2));
    box-shadow:
      0 18px 46px color-mix(in srgb, var(--wv-primary) 32%, transparent),
      0 0 28px color-mix(in srgb, var(--wv-accent) 10%, transparent),
      inset 0 1px 0 rgba(255,255,255,0.16);
  }

  .wv-button-surface button:hover::before,
  .wv-button-surface label.wv-premium-button:hover::before {
    opacity: 0.34;
  }

  .wv-button-surface button:hover::after,
  .wv-button-surface label.wv-premium-button:hover::after {
    transform: rotate(24deg) translateX(610%);
  }

  .wv-button-surface button:active,
  .wv-button-surface label.wv-premium-button:active {
    transform: translateY(0) scale(0.985);
  }

  .wv-button-surface button[data-active="true"] {
    border-color: color-mix(in srgb, var(--wv-accent) 82%, white 8%);
    box-shadow:
      0 16px 42px color-mix(in srgb, var(--wv-primary) 30%, transparent),
      0 0 26px color-mix(in srgb, var(--wv-accent) 14%, transparent),
      inset 0 1px 0 rgba(255,255,255,0.18);
  }

  .wv-button-surface button[data-active="true"]::before {
    opacity: 0.38;
  }


  .wv-button-surface .wv-create-cta {
    background:
      linear-gradient(
        135deg,
        color-mix(in srgb, var(--wv-primary) 94%, black),
        color-mix(in srgb, var(--wv-secondary) 68%, var(--wv-primary)) 55%,
        color-mix(in srgb, var(--wv-accent) 58%, var(--wv-secondary))
      );
    border: 1px solid color-mix(in srgb, var(--wv-accent) 48%, rgba(255,255,255,0.12));
    box-shadow:
      0 18px 48px color-mix(in srgb, var(--wv-primary) 30%, transparent),
      0 0 34px color-mix(in srgb, var(--wv-accent) 8%, transparent),
      inset 0 1px 0 rgba(255,255,255,0.18);
  }

  .wv-button-surface .wv-create-cta:hover {
    box-shadow:
      0 24px 58px color-mix(in srgb, var(--wv-primary) 38%, transparent),
      0 0 42px color-mix(in srgb, var(--wv-accent) 12%, transparent),
      inset 0 1px 0 rgba(255,255,255,0.22);
  }

  .wv-button-surface .wv-create-cta:disabled {
    box-shadow: none;
  }

  .wv-button-surface button:disabled {
    transform: none;
    cursor: not-allowed;
    opacity: 0.55;
  }

  .wv-button-surface button:disabled::after {
    display: none;
  }

  .wv-3d-form {
    --wv-rotate-x: 0deg;
    --wv-rotate-y: 0deg;
    --wv-glow-x: 50%;
    --wv-glow-y: 50%;
    perspective: 1400px;
  }

  .wv-3d-card {
    position: relative;
    transform: perspective(1400px) rotateX(var(--wv-rotate-x)) rotateY(var(--wv-rotate-y)) translateZ(0);
    transform-style: preserve-3d;
    transition: transform 520ms cubic-bezier(.16,1,.3,1), border-color 300ms ease, box-shadow 300ms ease, opacity 700ms ease, translate 700ms cubic-bezier(.16,1,.3,1);
    will-change: transform;
    opacity: 0;
    translate: 0 18px;
  }

  .wv-3d-card::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: inherit;
    background: radial-gradient(circle at var(--wv-glow-x) var(--wv-glow-y), color-mix(in srgb, var(--wv-accent) 12%, transparent), transparent 34%);
    opacity: 0;
    transition: opacity 300ms ease;
  }

  .wv-3d-card.wv-in-view {
    opacity: 1;
    translate: 0 0;
  }

  .wv-3d-card:hover {
    border-color: color-mix(in srgb, var(--wv-accent) 24%, rgba(255,255,255,0.08));
    box-shadow: 0 24px 70px color-mix(in srgb, var(--wv-primary) 18%, rgba(0,0,0,0.2));
  }

  .wv-3d-card:hover::before { opacity: 1; }

  .wv-command-bar,
  .wv-finish-cta {
    position: relative;
    overflow: hidden;
    box-shadow: 0 18px 55px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.07);
  }

  .wv-command-bar::after,
  .wv-finish-cta::after {
    content: "";
    position: absolute;
    inset: -80% 55% auto -10%;
    height: 180%;
    pointer-events: none;
    transform: rotate(18deg);
    background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--wv-accent) 8%, transparent), transparent);
    animation: wv-command-sheen 8s ease-in-out infinite;
  }

  .wv-mini-cta {
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, color-mix(in srgb, var(--wv-primary) 92%, black), color-mix(in srgb, var(--wv-secondary) 72%, var(--wv-primary)));
    border: 1px solid color-mix(in srgb, var(--wv-accent) 45%, rgba(255,255,255,0.1));
    box-shadow: 0 10px 28px color-mix(in srgb, var(--wv-primary) 26%, transparent), inset 0 1px 0 rgba(255,255,255,0.14);
    transition: transform 260ms cubic-bezier(.22,1,.36,1), box-shadow 260ms ease;
  }

  .wv-mini-cta::after {
    content: "";
    position: absolute;
    inset: 0;
    transform: translateX(-120%) skewX(-18deg);
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
    transition: transform 650ms cubic-bezier(.22,1,.36,1);
  }

  .wv-mini-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 36px color-mix(in srgb, var(--wv-primary) 34%, transparent), 0 0 22px color-mix(in srgb, var(--wv-accent) 10%, transparent);
  }

  .wv-mini-cta:hover::after { transform: translateX(120%) skewX(-18deg); }

  .wv-create-cta {
    min-height: 64px;
    position: relative;
    overflow: hidden;
  }

  .wv-create-cta::before {
    content: "";
    position: absolute;
    inset: 1px;
    border-radius: inherit;
    background: linear-gradient(110deg, transparent 15%, rgba(255,255,255,0.14) 48%, transparent 65%);
    transform: translateX(-120%);
    animation: wv-cta-sheen 4.8s ease-in-out infinite;
    pointer-events: none;
  }

  .wv-create-cta:hover { transform: translateY(-3px) scale(1.008); }

  .wv-button-surface input:focus,
  .wv-button-surface textarea:focus {
    transform: translateY(-1px);
    border-color: color-mix(in srgb, var(--wv-accent) 38%, rgba(255,255,255,0.18));
    box-shadow: 0 12px 30px color-mix(in srgb, var(--wv-primary) 10%, transparent), inset 0 1px 0 rgba(255,255,255,0.04);
  }

  .wv-button-surface input,
  .wv-button-surface textarea {
    transition: transform 240ms ease, border-color 240ms ease, box-shadow 240ms ease, background-color 240ms ease;
  }

  @keyframes wv-command-sheen {
    0%, 68% { transform: translateX(-80%) rotate(18deg); opacity: 0; }
    76% { opacity: 1; }
    100% { transform: translateX(170%) rotate(18deg); opacity: 0; }
  }

  @keyframes wv-cta-sheen {
    0%, 55% { transform: translateX(-120%); }
    75%, 100% { transform: translateX(120%); }
  }

  @media (max-width: 640px) {
    .wv-3d-card {
      transform: translateZ(0);
      translate: 0 12px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .wv-3d-card {
      opacity: 1;
      translate: 0 0;
      transform: none;
      transition: none;
    }

    .wv-command-bar::after,
    .wv-finish-cta::after,
    .wv-create-cta::before {
      display: none;
    }

    .wv-button-surface button,
    .wv-button-surface label.wv-premium-button {
      transition: none;
    }

    .wv-button-surface button::after,
    .wv-button-surface label.wv-premium-button::after {
      display: none;
    }
  }
`}</style>
