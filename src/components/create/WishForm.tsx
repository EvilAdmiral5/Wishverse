"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, Plus, RefreshCw, Sparkles, Upload, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cakes } from "@/data/cakes";
import { songs } from "@/data/songs";
import type {
  RecipientGender,
  WishTheme,
  WishSongId,
  CakeType,
  Memory,
} from "@/types/wish";

type Occasion = "birthday" | "anniversary";
type MemoryDraft = Memory & { file: File; previewUrl: string };

const OCCASIONS: { id: Occasion; label: string; emoji: string }[] = [
  { id: "birthday", label: "Birthday", emoji: "🎂" },
  { id: "anniversary", label: "Anniversary", emoji: "💍" },
];

const ALL_THEMES: WishTheme[] = [
  "birthday",
  "anniversary",
  "romantic",
  "best-friend",
  "cinematic",
];

const MOOD_LABELS: Record<WishTheme, string> = {
  birthday: "Velvet Celebration",
  anniversary: "Midnight Romance",
  romantic: "Rose Noir",
  "best-friend": "Sunset Bloom",
  bestFriend: "Sunset Bloom",
  romanticBirthday: "Rose Noir",
  cinematic: "Royal Eclipse",
};

const BUTTON_THEME_STYLES: Record<
  WishTheme,
  { primary: string; secondary: string; accent: string }
> = {
  birthday: {
    primary: "#6A0C1F",
    secondary: "#B56B78",
    accent: "#C8A24A",
  },
  anniversary: {
    primary: "#4A1026",
    secondary: "#9B4D68",
    accent: "#D6A6B8",
  },
  romantic: {
    primary: "#7A1735",
    secondary: "#D05A7A",
    accent: "#F2B5C5",
  },
  "best-friend": {
    primary: "#A65335",
    secondary: "#E58B61",
    accent: "#F3C677",
  },
  bestFriend: {
    primary: "#A65335",
    secondary: "#E58B61",
    accent: "#F3C677",
  },
  romanticBirthday: {
    primary: "#7A1735",
    secondary: "#D05A7A",
    accent: "#F2B5C5",
  },
  cinematic: {
    primary: "#25204A",
    secondary: "#5D4FA3",
    accent: "#D7B56D",
  },
};

const MOOD_DESCRIPTIONS: Record<WishTheme, string> = {
  birthday: "Rich velvet tones with a warm celebratory glow.",
  anniversary: "Deep romantic tones for a timeless evening feel.",
  romantic: "Soft rose tones with an intimate romantic atmosphere.",
  "best-friend": "Warm golden tones with a joyful midnight atmosphere.",
  bestFriend: "Warm golden tones with a joyful midnight atmosphere.",
  romanticBirthday: "Soft rose tones with an intimate romantic atmosphere.",
  cinematic: "A dramatic cinematic atmosphere that feels like a scene.",
};

const SECRET_NOTE_SUGGESTIONS: Record<Occasion, string[]> = {
  birthday: [
    "I hope you know how genuinely happy I am ❤️ that you were born and became a part of my life.",
    "Seeing you happy 🥹 is honestly one of the little things that makes my heart happiest.",
    "I hope this year 🌸 gives you all the love, peace, and happiness you quietly wish for.",
    "You deserve to feel loved today 🫶 and honestly, you deserve that feeling every single day.",
    "I hope you look back at this birthday ✨ and remember just how loved you were.",
    "Keep that beautiful smile of yours 😊 because it means more to me than you probably realize.",
    "I hope this new chapter 🌷 brings you closer to everything you've been wishing for.",
    "No matter how much life changes 💫 I hope you always know how much you mean to me.",
    "Today is your day 🎂 but I'm the one who feels lucky for having you in my life.",
    "I hope this birthday becomes one of those memories ❤️ that stays with you for a very long time.",
  ],
  anniversary: [
    "Another year with you ❤️ and I still feel lucky that somehow our paths found each other.",
    "When I look back at everything we've shared 🥹 I wouldn't trade a single moment of it.",
    "Thank you for staying, understanding, and listening 🫶 even when I didn't know how to say what I felt.",
    "Some of my favorite memories 🌙 have one thing in common — you were there.",
    "I hope we never stop making the kind of memories 🌹 we'll look back on and smile about years from now.",
    "If I had to choose all over again ✨ I'd still choose you.",
    "You've become such a beautiful part of my life ❤️ that I can't imagine my story without you in it.",
    "Through all the good days and difficult ones 🫂 I'm grateful that we've had each other.",
    "I don't need everything to be perfect 🌸 I just want more moments with you.",
    "Whatever comes next ♾️ I hope we keep choosing each other, one day at a time.",
  ],
};

const STAGES = [
  { title: "Who is it for?", short: "Basics", emoji: "01" },
  { title: "Choose the occasion", short: "Occasion", emoji: "02" },
  { title: "Choose the music", short: "Music", emoji: "03" },
  { title: "Write the message", short: "Message", emoji: "04" },
  { title: "Pick their cake", short: "Cake", emoji: "05" },
  { title: "Hide little surprises", short: "Notes", emoji: "06" },
  { title: "Add the memories", short: "Memories", emoji: "07" },
  { title: "Seal the letter", short: "Letter", emoji: "08" },
];

function generateSlug(name: string) {
  const cleanName = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `${cleanName || "wish"}-${Math.random().toString(36).substring(2, 8)}`;
}

export default function WishForm() {
  const router = useRouter();
  const memoryInputRef = useRef<HTMLInputElement>(null);
  const previewUrlsRef = useRef(new Set<string>());
  const MAX_MEMORY_SIZE = 10 * 1024 * 1024;

  const [formStage, setFormStage] = useState(1);
  const [direction, setDirection] = useState(1);
  const [recipientName, setRecipientName] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [gender, setGender] = useState<RecipientGender>("boy");
  const [occasion, setOccasion] = useState<Occasion>("birthday");
  const [theme, setTheme] = useState<WishTheme>("birthday");
  const [selectedSong, setSelectedSong] = useState<WishSongId | null>(null);
  const [previewSong, setPreviewSong] = useState<WishSongId | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const previewRequestRef = useRef(0);
  const [birthdayMessage, setBirthdayMessage] = useState("");
  const [cakeType, setCakeType] = useState<CakeType>("chocolate");
  const [royalNotes, setRoyalNotes] = useState<string[]>(["", "", ""]);
  const [suggestionIndexes, setSuggestionIndexes] = useState<number[]>([0, 1, 2, 3, 4]);
  const [memories, setMemories] = useState<MemoryDraft[]>([]);
  const [existingMemories, setExistingMemories] = useState<Memory[]>([]);
  const [secretLetter, setSecretLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const currentOccasion = OCCASIONS.find((item) => item.id === occasion) ?? OCCASIONS[0];
  const progress = (formStage / 8) * 100;
  const selectedMood = BUTTON_THEME_STYLES[theme];
  const selectedSongData = songs.find((song) => song.id === selectedSong);

  useEffect(() => {
    const editSlug = new URLSearchParams(window.location.search).get("edit");
    if (!editSlug) return;

    setEditingSlug(editSlug);
    setLoadingEdit(true);

    const loadWish = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("wishes").select("*").eq("slug", editSlug).single();

      if (error || !data) {
        alert("We couldn't load that wish for editing.");
        setLoadingEdit(false);
        router.replace("/create");
        return;
      }

      setRecipientName(data.recipient_name ?? "");
      setCreatorName(data.creator_name ?? "");
      setGender((data.recipient_gender ?? "boy") as RecipientGender);
      setTheme((data.theme ?? "birthday") as WishTheme);
      const savedSong = songs.find((song) => song.id === data.song);
      setSelectedSong(savedSong?.id ?? null);
      setOccasion(data.occasion === "anniversary" ? "anniversary" : "birthday");
      setBirthdayMessage(data.birthday_message ?? "");
      setCakeType((data.cake_type ?? "chocolate") as CakeType);
      setRoyalNotes(Array.isArray(data.royal_notes) && data.royal_notes.length ? data.royal_notes : ["", "", ""]);
      setExistingMemories(Array.isArray(data.memories) ? data.memories : []);
      setSecretLetter(data.secret_letter ?? "");
      setLoadingEdit(false);
    };

    void loadWish();
  }, [router]);

  useEffect(() => {
    setSuggestionIndexes([0, 1, 2, 3, 4]);
  }, [occasion]);

  useEffect(() => () => {
    previewRequestRef.current += 1;
    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrlsRef.current.clear();
    const audio = previewAudioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
  }, []);

  useEffect(() => {
    const audio = previewAudioRef.current;
    if (!audio) return;

    previewRequestRef.current += 1;
    audio.pause();
    audio.currentTime = 0;
    setPreviewSong(null);
  }, [formStage]);

  const toggleSongPreview = (songId: WishSongId) => {
    const song = songs.find((item) => item.id === songId);
    const audio = previewAudioRef.current;
    if (!song || !audio || !song.src) return;

    // Same song = stop.
    if (previewSong === songId && !audio.paused) {
      previewRequestRef.current += 1;
      audio.pause();
      audio.currentTime = 0;
      setPreviewSong(null);
      return;
    }

    // Invalidate the previous play() promise before switching tracks.
    const requestId = ++previewRequestRef.current;

    // Reuse one audio element. Starting another preview therefore stops the
    // previous song first, then loads and plays the newly tapped song.
    audio.pause();
    audio.currentTime = 0;
    audio.src = song.src;
    audio.load();
    setPreviewSong(songId);

    void audio.play().then(() => {
      if (requestId !== previewRequestRef.current) {
        audio.pause();
      }
    }).catch(() => {
      if (requestId === previewRequestRef.current) {
        setPreviewSong(null);
      }
    });
  };

  const updateRoyalNote = (index: number, value: string) => {
    setRoyalNotes((current) => current.map((note, i) => (i === index ? value : note)));
  };

  const addRoyalNote = () => {
    if (royalNotes.length < 5) setRoyalNotes((current) => [...current, ""]);
  };

  const removeRoyalNote = (index: number) => {
    if (royalNotes.length <= 1) return;
    setRoyalNotes((current) => current.filter((_, i) => i !== index));
  };

  const addSuggestedNote = (index: number) => {
    const suggestion = SECRET_NOTE_SUGGESTIONS[occasion][suggestionIndexes[index] ?? 0];
    if (!suggestion) return;

    setRoyalNotes((current) =>
      current.map((note, i) => {
        if (i !== index) return note;
        const trimmed = note.trim();
        return trimmed ? `${trimmed} ${suggestion}` : suggestion;
      }),
    );
  };

  const refreshSuggestedNote = (index: number) => {
    const suggestions = SECRET_NOTE_SUGGESTIONS[occasion];
    setSuggestionIndexes((current) =>
      current.map((value, i) => (i === index ? (value + 1) % suggestions.length : value)),
    );
  };

  const addMemoryFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const nextFiles = Array.from(files);
    const invalid = nextFiles.find((file) => !file.type.startsWith("image/") || file.size > MAX_MEMORY_SIZE);
    if (invalid) {
      alert(`"${invalid.name}" is not a supported image or is larger than 10 MB.`);
      return;
    }

    const drafts: MemoryDraft[] = nextFiles.map((file) => {
      const id = crypto.randomUUID();
      const previewUrl = URL.createObjectURL(file);
      previewUrlsRef.current.add(previewUrl);
      return { id, file, previewUrl, imageUrl: previewUrl, caption: "" };
    });

    setMemories((current) => [...current, ...drafts]);
    if (memoryInputRef.current) memoryInputRef.current.value = "";
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

  const updateMemoryCaption = (id: string, caption: string) => {
    setMemories((current) => current.map((memory) => memory.id === id ? { ...memory, caption } : memory));
  };

  const validateStage = (stage: number) => {
    if (stage === 1) {
      if (!recipientName.trim()) return "Please enter the recipient's name.";
      if (!creatorName.trim()) return "Please enter your name.";
    }
    if (stage === 3 && !selectedSong) {
      return "Please select a song before continuing.";
    }
    if (stage === 4 && !birthdayMessage.trim()) {
      return `Please write the ${currentOccasion.label.toLowerCase()} message.`;
    }
    return null;
  };

  const goNext = () => {
    const error = validateStage(formStage);
    if (error) {
      alert(error);
      return;
    }
    if (formStage < 8) {
      setDirection(1);
      setFormStage((stage) => stage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      void submitWish();
    }
  };

  const goBack = () => {
    if (formStage <= 1 || loading) return;
    setDirection(-1);
    setFormStage((stage) => stage - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitWish = async () => {
    if (!recipientName.trim() || !creatorName.trim() || !birthdayMessage.trim() || !secretLetter.trim()) {
      alert("Please complete the required fields before creating your wish.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const slug = editingSlug ?? generateSlug(recipientName);
      const cleanedNotes = royalNotes.filter((note) => note.trim());
      const uploadedPaths: string[] = [];

      const uploadedMemories = await Promise.all(memories.map(async (memory) => {
        const extension = memory.file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${slug}/${memory.id}-${Date.now()}.${extension}`;
        const { error: uploadError } = await supabase.storage.from("wish-memories").upload(path, memory.file, {
          cacheControl: "31536000",
          contentType: memory.file.type,
          upsert: false,
        });
        if (uploadError) throw uploadError;
        uploadedPaths.push(path);
        const { data } = supabase.storage.from("wish-memories").getPublicUrl(path);
        return { id: memory.id, imageUrl: data.publicUrl, caption: memory.caption.trim() };
      }));

      const finalMemories = [...existingMemories, ...uploadedMemories];
      const payload = {
        slug,
        recipient_name: recipientName.trim(),
        creator_name: creatorName.trim(),
        recipient_gender: gender,
        occasion,
        theme,
        song: selectedSong,
        birthday_message: birthdayMessage.trim(),
        cake_type: cakeType,
        royal_notes: cleanedNotes,
        memories: finalMemories,
        secret_letter: secretLetter.trim(),
      };

      const result = editingSlug
        ? await supabase.from("wishes").update(payload).eq("slug", editingSlug)
        : await supabase.from("wishes").insert(payload);

      if (result.error) {
        if (uploadedPaths.length) await supabase.storage.from("wish-memories").remove(uploadedPaths);
        throw result.error;
      }

      router.push(`/create/success?slug=${encodeURIComponent(slug)}`);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Something went wrong while creating your wish.");
    } finally {
      setLoading(false);
    }
  };

  const stageContent = useMemo(() => {
    if (formStage === 1) return (
      <FormCard number="01" title="Who is this for?" subtitle="Start with the two people at the heart of this WishVerse.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Recipient name" placeholder="e.g. Amisha" value={recipientName} onChange={setRecipientName} />
          <Input label="Your name" placeholder="e.g. Kevin" value={creatorName} onChange={setCreatorName} />
        </div>
        <div className="mt-7">
          <p className="text-sm text-white/50">Recipient gender</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Choice active={gender === "boy"} onClick={() => setGender("boy")}>🧸 <span><strong className="block">Male</strong></span></Choice>
            <Choice active={gender === "girl"} onClick={() => setGender("girl")}>🤎 <span><strong className="block">Female</strong></span></Choice>
          </div>
        </div>
      </FormCard>
    );

    if (formStage === 2) return (
      <FormCard number="02" title="Choose the occasion" subtitle="Choose what you are celebrating, then pick the visual atmosphere that feels right.">
        <p className="text-sm text-white/50">Choose the occasion</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {OCCASIONS.map((item) => (
            <Choice key={item.id} active={occasion === item.id} onClick={() => setOccasion(item.id)}>
              <span className="text-2xl">{item.emoji}</span>
              <span><strong className="block">{item.label}</strong><small className="text-white/35">{item.id === "birthday" ? "Celebrate another beautiful year" : "Celebrate your journey together"}</small></span>
            </Choice>
          ))}
        </div>
        <div className="mt-8 border-t border-white/10 pt-7">
          <p className="text-sm text-white/50">Pick your vibe</p>
          <p className="mt-1 text-xs text-white/25">Every WishVerse visual theme works with either occasion.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {ALL_THEMES.map((themeId) => (
              <Choice key={themeId} active={theme === themeId} onClick={() => setTheme(themeId)}>
                <span className="min-w-0 flex-1 flex items-center gap-3">
                  <span className="text-2xl">{themeId === "birthday" ? "🍷" : themeId === "anniversary" ? "🌙" : themeId === "romantic" ? "🌹" : themeId === "best-friend" ? "✨" : "🎬"}</span>
                  <span className="min-w-0"><strong className="block">{MOOD_LABELS[themeId]}</strong><small className="text-white/35">{MOOD_DESCRIPTIONS[themeId]}</small></span>
                </span>
                <ThemePreview themeId={themeId} active={theme === themeId} />
              </Choice>
            ))}
          </div>
        </div>
      </FormCard>
    );

    if (formStage === 3) return (
      <FormCard number="03" title="Choose the music" subtitle="Preview the soundtrack, then choose the one song they will hear throughout their WishVerse.">
        <audio
          ref={previewAudioRef}
          preload="auto"
          onEnded={() => setPreviewSong(null)}
          onError={() => setPreviewSong(null)}
          aria-hidden="true"
        />
        {selectedSongData ? (
          <div className="mb-5 rounded-2xl border border-white/20 bg-white/[.07] p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[.06] text-white/70">
                <Check size={17} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-white/35">Selected soundtrack</p>
                <p className="mt-1 truncate text-sm font-medium text-white/90">{selectedSongData.name}</p>
                <p className="mt-1 truncate text-xs text-white/35">{selectedSongData.description}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  previewRequestRef.current += 1;
                  const audio = previewAudioRef.current;
                  if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                  }
                  setPreviewSong(null);
                  setSelectedSong(null);
                }}
                className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[.03] px-3 text-xs text-white/55 transition hover:border-white/25 hover:bg-white/[.08] hover:text-white"
                aria-label={`Remove ${selectedSongData.name} from the wish`}
                title="Remove selected song"
              >
                <X size={15} />
                <span className="hidden sm:inline">Remove</span>
              </button>
            </div>
          </div>
        ) : null}

        <div className="space-y-3">
          {songs.map((song) => {
            const selected = selectedSong === song.id;
            const previewing = previewSong === song.id;
            const selectionLocked = selectedSong !== null && !selected;

            return (
              <div
                key={song.id}
                className={`flex items-center gap-3 rounded-2xl border p-3 transition sm:p-4 ${
                  selected
                    ? "border-white/30 bg-white/[.08]"
                    : selectionLocked
                      ? "border-white/[.06] bg-black/10 opacity-45"
                      : "border-white/10 bg-black/20"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleSongPreview(song.id)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[.04] text-white/75 transition hover:border-white/25 hover:bg-white/[.08] hover:text-white"
                  aria-label={previewing ? `Stop preview of ${song.name}` : `Play preview of ${song.name}`}
                  title={previewing ? "Stop preview" : "Play preview"}
                >
                  {previewing ? (
                    <span className="h-3.5 w-3.5 rounded-[3px] bg-white" />
                  ) : (
                    <span className="ml-0.5 h-0 w-0 border-y-[7px] border-l-[10px] border-y-transparent border-l-white" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white/85">{song.name}</p>
                  <p className="mt-1 truncate text-xs text-white/35">{song.description}</p>
                </div>

                <button
                  type="button"
                  disabled={selectionLocked}
                  onClick={() => {
                    previewAudioRef.current?.pause();
                    if (previewAudioRef.current) previewAudioRef.current.currentTime = 0;
                    setPreviewSong(null);
                    setSelectedSong(selected ? null : song.id);
                  }}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition ${
                    selected
                      ? "border-white/35 bg-white/[.10] text-white hover:border-white/50 hover:bg-white/[.15]"
                      : selectionLocked
                        ? "cursor-not-allowed border-white/[.06] bg-white/[.02] text-white/15"
                        : "border-white/10 bg-white/[.025] text-white/45 hover:border-white/25 hover:bg-white/[.07] hover:text-white"
                  }`}
                  aria-label={selected ? `Remove ${song.name}` : `Select ${song.name}`}
                  title={selected ? "Remove selected song" : selectionLocked ? "Another song is already selected" : "Select song"}
                  aria-pressed={selected}
                >
                  {selected ? <X size={16} /> : <Plus size={16} />}
                </button>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-xs leading-5 text-white/30">
          Selected: <span className="text-white/60">{selectedSongData?.name ?? "Choose one song"}</span>
          {selectedSongData?.description ? <span className="text-white/25"> · {selectedSongData.description}</span> : null}
        </p>
      </FormCard>
    );
    if (formStage === 4) return (
      <FormCard number="04" title={`${currentOccasion.label} message`} subtitle="These are the words they will carry through the experience.">
        <textarea value={birthdayMessage} onChange={(e) => setBirthdayMessage(e.target.value)} placeholder={`Write something unforgettable for ${recipientName || "them"}...`} rows={10} className="wv-field min-h-[250px] w-full resize-none rounded-3xl border border-white/10 bg-black/25 p-5 leading-7 outline-none placeholder:text-white/20" />
      </FormCard>
    );
    if (formStage === 5) return (
      <FormCard number="05" title="Choose their cake" subtitle="This cake becomes part of the candle moment inside the wish.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cakes.map((cake) => <Choice key={cake.id} active={cakeType === cake.id} onClick={() => setCakeType(cake.id)}><span className="text-3xl">{cake.emoji}</span><span><strong className="block">{cake.name}</strong><small className="text-white/35">{cake.description}</small></span></Choice>)}
        </div>
      </FormCard>
    );

    if (formStage === 6) return (
      <FormCard number="06" title="Hide little surprises" subtitle="Leave up to five notes for them to discover one by one. This stage is optional.">
        <div className="space-y-5">
          {royalNotes.map((note, index) => {
            const suggestion = SECRET_NOTE_SUGGESTIONS[occasion][suggestionIndexes[index] ?? 0];

            return (
              <div key={index} className="rounded-2xl border border-white/10 bg-black/10 p-3">
                <div className="flex gap-3">
                  <textarea value={note} onChange={(e) => updateRoyalNote(index, e.target.value)} placeholder={`Little surprise ${index + 1}`} rows={3} className="wv-field w-full resize-none rounded-2xl border border-white/10 bg-black/25 p-4 outline-none placeholder:text-white/20" />
                  {royalNotes.length > 1 && <button type="button" onClick={() => removeRoyalNote(index)} className="h-11 w-11 shrink-0 rounded-xl border border-white/10 text-white/40 hover:text-white" aria-label={`Remove secret note ${index + 1}`}><X size={15} /></button>}
                </div>
                <div className="mt-3 rounded-xl border border-white/[.07] bg-white/[.025] p-3">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="mb-1 text-[11px] uppercase tracking-[.2em] text-white/25">{currentOccasion.label} suggestion</p>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.p key={`${occasion}-${suggestionIndexes[index] ?? 0}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }} className="text-xs leading-5 text-white/45">{suggestion}</motion.p>
                      </AnimatePresence>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button type="button" onClick={() => addSuggestedNote(index)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[.035] text-white/45 transition hover:border-white/20 hover:bg-white/[.07] hover:text-white" aria-label={`Add suggestion to secret note ${index + 1}`} title="Add suggestion"><Plus size={15} /></button>
                      <button type="button" onClick={() => refreshSuggestedNote(index)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[.035] text-white/45 transition hover:border-white/20 hover:bg-white/[.07] hover:text-white" aria-label={`Refresh suggestion for secret note ${index + 1}`} title="Another suggestion"><RefreshCw size={14} /></button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {royalNotes.length < 5 && <button type="button" onClick={addRoyalNote} className="mt-5 rounded-full border border-white/10 px-5 py-3 text-xs uppercase tracking-[.18em] text-white/55 hover:bg-white/5">+ Add another note</button>}
      </FormCard>
    );

    if (formStage === 7) return (
      <FormCard number="07" title="Add the memories" subtitle="Upload the photos that deserve their own moment. Each image can be up to 10 MB.">
        <input ref={memoryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addMemoryFiles(e.target.files)} />
        {existingMemories.length > 0 && <div className="mb-6 rounded-2xl border border-white/10 bg-white/[.03] p-4 text-sm text-white/50">{existingMemories.length} existing {existingMemories.length === 1 ? "memory is" : "memories are"} already saved and will stay in this wish.</div>}
        {memories.length > 0 ? <div className="grid gap-4 sm:grid-cols-2">{memories.map((memory, index) => <div key={memory.id} className="overflow-hidden rounded-2xl border border-white/10 bg-black/20"><div className="relative aspect-[4/3]"><img src={memory.previewUrl} alt={`New memory ${index + 1}`} className="h-full w-full object-cover" /><button type="button" onClick={() => removeMemory(memory.id)} className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white/70"><X size={14} /></button></div><input value={memory.caption} onChange={(e) => updateMemoryCaption(memory.id, e.target.value)} placeholder="One line about this memory..." maxLength={160} className="wv-field w-full border-0 bg-black/30 p-3 text-sm outline-none" /></div>)}</div> : <button type="button" onClick={() => memoryInputRef.current?.click()} className="flex min-h-[240px] w-full flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-black/20 text-center hover:bg-white/[.03]"><Upload size={28} className="text-white/35" /><strong className="mt-4 text-sm text-white/70">Upload your memories</strong><span className="mt-2 text-xs text-white/30">Choose one or many photos.</span></button>}
        <button type="button" onClick={() => memoryInputRef.current?.click()} className="mt-5 rounded-full border border-white/10 px-5 py-3 text-xs uppercase tracking-[.18em] text-white/55 hover:bg-white/5">+ Add photos</button>
      </FormCard>
    );

    return (
      <FormCard number="08" title="Seal the secret letter" subtitle={`Write the final words you want ${recipientName || "them"} to discover. This is the only required field on the final stage.`}>
        <textarea value={secretLetter} onChange={(e) => setSecretLetter(e.target.value)} placeholder="There is something I've always wanted to tell you..." rows={12} className="wv-field min-h-[300px] w-full resize-none rounded-3xl border border-white/10 bg-black/25 p-5 leading-7 outline-none placeholder:text-white/20" />
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[.025] p-4 text-xs text-white/35"><Sparkles size={14} className="mb-2 text-white/50" />Everything is ready. On Create, your WishVerse will be saved and you'll get a separate page with Preview, Edit and Copy Link.</div>
      </FormCard>
    );
  }, [formStage, recipientName, creatorName, gender, occasion, theme, selectedSong, birthdayMessage, cakeType, royalNotes, memories, existingMemories, secretLetter, currentOccasion, suggestionIndexes, previewSong]);

  if (loadingEdit) {
    return <div className="flex min-h-[500px] items-center justify-center rounded-[2rem] border border-white/10 bg-white/[.03]"><Loader2 className="animate-spin text-white/50" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 24, scale: .985 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .65, ease: [0.22, 1, .36, 1] }} className="wv-app-shell relative mx-auto w-full max-w-3xl">
      <div className="mb-5 rounded-[2rem] border border-white/10 bg-white/[.035] p-4 backdrop-blur-xl sm:p-5">
        <div className="flex items-end justify-between gap-4">
          <div><p className="text-[11px] uppercase tracking-[.35em] text-white/30">WishVerse Studio {editingSlug ? "· Editing" : ""}</p><h2 className="mt-2 text-xl font-medium tracking-tight sm:text-2xl">{STAGES[formStage - 1].title}</h2></div><span className="text-[12px] uppercase tracking-[.25em] text-white/30">{String(formStage).padStart(2, "0")} / 08</span></div>
        <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/[.07]"><motion.div animate={{ width: `${progress}%` }} transition={{ duration: .45, ease: "easeOut" }} className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${selectedMood?.primary ?? "#6A0C1F"}, ${selectedMood?.secondary ?? "#B56B78"}, ${selectedMood?.accent ?? "#C8A24A"})` }} /></div>
        <div className="mt-3 grid grid-cols-8 gap-1.5">{STAGES.map((stage, index) => <div key={stage.emoji} className="text-center"><div className={`mx-auto h-1.5 rounded-full transition ${index + 1 <= formStage ? "bg-white/75" : "bg-white/10"}`} /><span className={`mt-2 hidden text-[10px] uppercase tracking-[.15em] sm:block ${index + 1 === formStage ? "text-white/65" : "text-white/20"}`}>{stage.short}</span></div>)}</div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0B0A10]/85 p-2 shadow-[0_35px_100px_rgba(0,0,0,.35)] backdrop-blur-2xl sm:p-3">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={formStage} custom={direction} initial={{ opacity: 0, x: direction > 0 ? 40 : -40, filter: "blur(5px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: direction > 0 ? -40 : 40, filter: "blur(5px)" }} transition={{ duration: .42, ease: [0.22, 1, .36, 1] }} className="rounded-[1.7rem] border border-white/[.07] bg-white/[.025] p-5 sm:p-8">
            {stageContent}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="sticky bottom-4 z-30 mt-5 flex gap-3 rounded-2xl border border-white/10 bg-[#0B0A10]/80 p-3 backdrop-blur-2xl">
        <button type="button" onClick={goBack} disabled={formStage === 1 || loading} className="flex min-h-12 items-center gap-2 rounded-xl border border-white/10 px-5 text-xs uppercase tracking-[.18em] text-white/50 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-25"><ArrowLeft size={14} /> Back</button>
        <button type="button" onClick={goNext} disabled={loading} className="wv-next flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl px-5 text-xs font-semibold uppercase tracking-[.18em] text-white disabled:opacity-50">{loading ? <><Loader2 size={15} className="animate-spin" /> Creating...</> : formStage === 8 ? <>Create my WishVerse <Check size={15} /></> : <>Continue <ArrowRight size={15} /></>}</button>
      </div>

      <style jsx>{`
        .wv-field { transition: border-color .25s ease, transform .25s ease, box-shadow .25s ease, background .25s ease; }
        .wv-field:focus { transform: translateY(-1px); border-color: rgba(255,255,255,.28); box-shadow: 0 14px 35px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.04); background: rgba(0,0,0,.34); }
        .wv-choice { position: relative; overflow: hidden; isolation: isolate; transition: transform .25s cubic-bezier(.22,1,.36,1), border-color .25s ease, background .25s ease, box-shadow .25s ease; }
        .wv-choice::after { content: ""; position: absolute; inset: -80% -20%; z-index: -1; transform: translateX(-65%) rotate(18deg); background: linear-gradient(90deg, transparent, rgba(255,255,255,.12), transparent); transition: transform .65s cubic-bezier(.22,1,.36,1); pointer-events:none; }
        .wv-choice:hover { transform: translateY(-2px); box-shadow: 0 15px 38px rgba(0,0,0,.2); }
        .wv-choice:hover::after { transform: translateX(65%) rotate(18deg); }
        .wv-choice[data-active="true"] { box-shadow: 0 15px 45px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,.1); }
        .wv-next {
          --wv-cta-edge: #E8C7D8;
          --wv-cta-glow: rgba(232,199,216,.34);
          --wv-cta-cutout: #0F0D0E;
          position: relative;
          isolation: isolate;
          overflow: visible !important;
          background: linear-gradient(135deg, #6A0C1F, #B56B78 58%, #C8A24A);
          border: 1px solid var(--wv-cta-edge);
          box-shadow: 0 15px 45px rgba(106,12,31,.25), inset 0 1px 0 rgba(255,255,255,.16);
          transition: transform .35s cubic-bezier(.22,1,.36,1), border-color .35s ease, box-shadow .5s ease;
        }
        .wv-next::after,
        .wv-next::before {
          content: "";
          position: absolute;
          left: 3%;
          width: 94%;
          height: 38%;
          background: var(--wv-cta-cutout);
          pointer-events: none;
          z-index: 0;
          transition: transform .5s cubic-bezier(.22,1,.36,1);
        }
        .wv-next::after { top: -10px; transform-origin: center; }
        .wv-next::before { bottom: -10px; transform-origin: center; }
        .wv-next:hover::before,
        .wv-next:hover::after { transform: scale(0); }
        .wv-next:hover {
          transform: translateY(-2px);
          border-color: #F7E6EE;
          box-shadow: inset 0 0 25px var(--wv-cta-glow), 0 0 38px rgba(232,199,216,.14), 0 20px 55px rgba(106,12,31,.34);
        }
        .wv-next > * { position: relative; z-index: 1; }
        .wv-next:focus-visible { outline: 2px solid var(--wv-cta-edge); outline-offset: 4px; }
        .wv-next:disabled { transform: none; cursor: not-allowed; }
        .wv-next:disabled::before,
        .wv-next:disabled::after { display: none; }
        @media (prefers-reduced-motion: reduce) { .wv-field, .wv-choice, .wv-next, .wv-next::before, .wv-next::after { transition: none; } }
      `}</style>
    </motion.div>
  );
}

function FormCard({ number, title, subtitle, children }: { number: string; title: string; subtitle: string; children: ReactNode }) {
  return <section><div className="mb-7"><span className="text-[11px] uppercase tracking-[.35em] text-white/25">Stage {number}</span><h3 className="mt-2 text-2xl font-medium tracking-tight sm:text-3xl">{title}</h3><p className="mt-3 max-w-2xl text-sm leading-6 text-white/35">{subtitle}</p></div>{children}</section>;
}

function Input({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="text-sm text-white/50">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="wv-field mt-3 w-full rounded-2xl border border-white/10 bg-black/25 p-4 outline-none placeholder:text-white/20" /></label>;
}

function ThemePreview({ themeId, active }: { themeId: WishTheme; active: boolean }) {
  const colors = BUTTON_THEME_STYLES[themeId];
  const icon = themeId === "birthday" ? "🎂" : themeId === "anniversary" ? "💍" : themeId === "romantic" ? "🌹" : themeId === "best-friend" ? "✨" : "🎬";

  return (
    <motion.div
      initial={false}
      animate={{ scale: active ? 1.02 : 1, opacity: active ? 1 : 0.82 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="relative hidden h-14 w-24 shrink-0 overflow-hidden rounded-xl border sm:block"
      style={{
        borderColor: active ? `${colors.accent}88` : "rgba(255,255,255,.10)",
        background: `radial-gradient(circle at 75% 20%, ${colors.accent}66, transparent 34%), linear-gradient(135deg, ${colors.primary}, ${colors.secondary} 58%, ${colors.accent})`,
        boxShadow: active ? `0 8px 24px ${colors.primary}55, inset 0 1px 0 rgba(255,255,255,.22)` : "inset 0 1px 0 rgba(255,255,255,.12)",
      }}
      aria-hidden="true"
    >
      <span className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,.16),transparent_42%,rgba(255,255,255,.06))]" />
      <span className="absolute -right-3 -top-4 h-12 w-12 rounded-full border border-white/20 bg-white/10 blur-[1px]" />
      <span className="absolute bottom-2 left-2 text-lg drop-shadow">{icon}</span>
      <span className="absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_10px_rgba(255,255,255,.9)]" />
    </motion.div>
  );
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return <button type="button" onClick={onClick} data-active={active} className={`wv-choice flex min-h-[72px] items-center gap-3 rounded-2xl border p-4 text-left ${active ? "border-white/30 bg-white/[.09]" : "border-white/10 bg-black/20 hover:bg-white/[.04]"}`}>{children}</button>;
}
