"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles, Upload, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cakes } from "@/data/cakes";
import type { RecipientGender, WishTheme, CakeType, Memory } from "@/types/wish";

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
  "best-friend": "Golden Midnight",
  cinematic: "Royal Eclipse",
};

const BUTTON_THEME_STYLES: Record<WishTheme, { primary: string; secondary: string; accent: string }> = {
  birthday: { primary: "#6A0C1F", secondary: "#B56B78", accent: "#C8A24A" },
  anniversary: { primary: "#4A1026", secondary: "#9B4D68", accent: "#D6A6B8" },
  romantic: { primary: "#7A1735", secondary: "#D05A7A", accent: "#F2B5C5" },
  "best-friend": { primary: "#3A2630", secondary: "#A66A78", accent: "#D7B56D" },
  cinematic: { primary: "#25204A", secondary: "#5D4FA3", accent: "#D7B56D" },
};

const MOOD_DESCRIPTIONS: Record<WishTheme, string> = {
  birthday: "Rich velvet tones with a warm celebratory glow.",
  anniversary: "Deep romantic tones for a timeless evening feel.",
  romantic: "Soft rose tones with an intimate romantic atmosphere.",
  "best-friend": "Warm golden tones with a joyful midnight atmosphere.",
  cinematic: "A dramatic cinematic atmosphere that feels like a scene.",
};

const STAGES = [
  { title: "Who is it for?", short: "Basics", emoji: "01" },
  { title: "Choose the occasion", short: "Occasion", emoji: "02" },
  { title: "Write the message", short: "Message", emoji: "03" },
  { title: "Pick their cake", short: "Cake", emoji: "04" },
  { title: "Hide little surprises", short: "Notes", emoji: "05" },
  { title: "Add the memories", short: "Memories", emoji: "06" },
  { title: "Seal the letter", short: "Letter", emoji: "07" },
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
  const [birthdayMessage, setBirthdayMessage] = useState("");
  const [cakeType, setCakeType] = useState<CakeType>("chocolate");
  const [royalNotes, setRoyalNotes] = useState<string[]>(["", "", ""]);
  const [memories, setMemories] = useState<MemoryDraft[]>([]);
  const [existingMemories, setExistingMemories] = useState<Memory[]>([]);
  const [secretLetter, setSecretLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const currentOccasion = OCCASIONS.find((item) => item.id === occasion) ?? OCCASIONS[0];
  const progress = (formStage / 7) * 100;
  const selectedMood = BUTTON_THEME_STYLES[theme];

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

  useEffect(() => () => {
    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrlsRef.current.clear();
  }, []);

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
    if (stage === 3 && !birthdayMessage.trim()) {
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
    if (formStage < 7) {
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
            <Choice active={gender === "boy"} onClick={() => setGender("boy")}>🧸 <span><strong className="block">Male</strong><small className="text-white/35"></small></span></Choice>
            <Choice active={gender === "girl"} onClick={() => setGender("girl")}>🤎 <span><strong className="block">Female</strong><small className="text-white/35"></small></span></Choice>
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
                <span className="text-2xl">{themeId === "birthday" ? "🍷" : themeId === "anniversary" ? "🌙" : themeId === "romantic" ? "🌹" : themeId === "best-friend" ? "✨" : "🎬"}</span>
                <span><strong className="block">{MOOD_LABELS[themeId]}</strong><small className="text-white/35">{MOOD_DESCRIPTIONS[themeId]}</small></span>
              </Choice>
            ))}
          </div>
        </div>
      </FormCard>
    );

    if (formStage === 3) return (
      <FormCard number="03" title={`${currentOccasion.label} message`} subtitle="These are the words they will carry through the experience.">
        <textarea value={birthdayMessage} onChange={(e) => setBirthdayMessage(e.target.value)} placeholder={`Write something unforgettable for ${recipientName || "them"}...`} rows={10} className="wv-field min-h-[250px] w-full resize-none rounded-3xl border border-white/10 bg-black/25 p-5 leading-7 outline-none placeholder:text-white/20" />
      </FormCard>
    );

    if (formStage === 4) return (
      <FormCard number="04" title="Choose their cake" subtitle="This cake becomes part of the candle moment inside the wish.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cakes.map((cake) => <Choice key={cake.id} active={cakeType === cake.id} onClick={() => setCakeType(cake.id)}><span className="text-3xl">{cake.emoji}</span><span><strong className="block">{cake.name}</strong><small className="text-white/35">{cake.description}</small></span></Choice>)}
        </div>
      </FormCard>
    );

    if (formStage === 5) return (
      <FormCard number="05" title="Hide little surprises" subtitle="Leave up to five notes for them to discover one by one. This stage is optional.">
        <div className="space-y-4">
          {royalNotes.map((note, index) => <div key={index} className="flex gap-3"><textarea value={note} onChange={(e) => updateRoyalNote(index, e.target.value)} placeholder={`Little surprise ${index + 1}`} rows={3} className="wv-field w-full resize-none rounded-2xl border border-white/10 bg-black/25 p-4 outline-none placeholder:text-white/20" />{royalNotes.length > 1 && <button type="button" onClick={() => removeRoyalNote(index)} className="h-11 w-11 shrink-0 rounded-xl border border-white/10 text-white/40 hover:text-white"><X size={15} /></button>}</div>)}
        </div>
        {royalNotes.length < 5 && <button type="button" onClick={addRoyalNote} className="mt-5 rounded-full border border-white/10 px-5 py-3 text-xs uppercase tracking-[.18em] text-white/55 hover:bg-white/5">+ Add another note</button>}
      </FormCard>
    );

    if (formStage === 6) return (
      <FormCard number="06" title="Add the memories" subtitle="Upload the photos that deserve their own moment. Each image can be up to 10 MB.">
        <input ref={memoryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addMemoryFiles(e.target.files)} />
        {existingMemories.length > 0 && <div className="mb-6 rounded-2xl border border-white/10 bg-white/[.03] p-4 text-sm text-white/50">{existingMemories.length} existing {existingMemories.length === 1 ? "memory is" : "memories are"} already saved and will stay in this wish.</div>}
        {memories.length > 0 ? <div className="grid gap-4 sm:grid-cols-2">{memories.map((memory, index) => <div key={memory.id} className="overflow-hidden rounded-2xl border border-white/10 bg-black/20"><div className="relative aspect-[4/3]"><img src={memory.previewUrl} alt={`New memory ${index + 1}`} className="h-full w-full object-cover" /><button type="button" onClick={() => removeMemory(memory.id)} className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white/70"><X size={14} /></button></div><input value={memory.caption} onChange={(e) => updateMemoryCaption(memory.id, e.target.value)} placeholder="One line about this memory..." maxLength={160} className="wv-field w-full border-0 bg-black/30 p-3 text-sm outline-none" /></div>)}</div> : <button type="button" onClick={() => memoryInputRef.current?.click()} className="flex min-h-[240px] w-full flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-black/20 text-center hover:bg-white/[.03]"><Upload size={28} className="text-white/35" /><strong className="mt-4 text-sm text-white/70">Upload your memories</strong><span className="mt-2 text-xs text-white/30">Choose one or many photos.</span></button>}
        <button type="button" onClick={() => memoryInputRef.current?.click()} className="mt-5 rounded-full border border-white/10 px-5 py-3 text-xs uppercase tracking-[.18em] text-white/55 hover:bg-white/5">+ Add photos</button>
      </FormCard>
    );

    return (
      <FormCard number="07" title="Seal the secret letter" subtitle={`Write the final words you want ${recipientName || "them"} to discover. This is the only required field on the final stage.`}>
        <textarea value={secretLetter} onChange={(e) => setSecretLetter(e.target.value)} placeholder="There is something I've always wanted to tell you..." rows={12} className="wv-field min-h-[300px] w-full resize-none rounded-3xl border border-white/10 bg-black/25 p-5 leading-7 outline-none placeholder:text-white/20" />
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[.025] p-4 text-xs text-white/35"><Sparkles size={14} className="mb-2 text-white/50" />Everything is ready. On Create, your WishVerse will be saved and you'll get a separate page with Preview, Edit and Copy Link.</div>
      </FormCard>
    );
  }, [formStage, recipientName, creatorName, gender, occasion, theme, birthdayMessage, cakeType, royalNotes, memories, existingMemories, secretLetter, currentOccasion]);

  if (loadingEdit) {
    return <div className="flex min-h-[500px] items-center justify-center rounded-[2rem] border border-white/10 bg-white/[.03]"><Loader2 className="animate-spin text-white/50" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 24, scale: .985 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .65, ease: [0.22, 1, .36, 1] }} className="wv-app-shell relative mx-auto w-full max-w-3xl">
      <div className="mb-5 rounded-[2rem] border border-white/10 bg-white/[.035] p-4 backdrop-blur-xl sm:p-5">
        <div className="flex items-end justify-between gap-4">
          <div><p className="text-[9px] uppercase tracking-[.35em] text-white/30">WishVerse Studio {editingSlug ? "· Editing" : ""}</p><h2 className="mt-2 text-xl font-medium tracking-tight sm:text-2xl">{STAGES[formStage - 1].title}</h2></div><span className="text-[10px] uppercase tracking-[.25em] text-white/30">{String(formStage).padStart(2, "0")} / 07</span></div>
        <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/[.07]"><motion.div animate={{ width: `${progress}%` }} transition={{ duration: .45, ease: "easeOut" }} className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${selectedMood?.primary ?? "#6A0C1F"}, ${selectedMood?.secondary ?? "#B56B78"}, ${selectedMood?.accent ?? "#C8A24A"})` }} /></div>
        <div className="mt-3 grid grid-cols-7 gap-1.5">{STAGES.map((stage, index) => <div key={stage.emoji} className="text-center"><div className={`mx-auto h-1.5 rounded-full transition ${index + 1 <= formStage ? "bg-white/75" : "bg-white/10"}`} /><span className={`mt-2 hidden text-[8px] uppercase tracking-[.15em] sm:block ${index + 1 === formStage ? "text-white/65" : "text-white/20"}`}>{stage.short}</span></div>)}</div>
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
        <button type="button" onClick={goNext} disabled={loading} className="wv-next flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl px-5 text-xs font-semibold uppercase tracking-[.18em] text-white disabled:opacity-50">{loading ? <><Loader2 size={15} className="animate-spin" /> Creating...</> : formStage === 7 ? <>Create my WishVerse <Check size={15} /></> : <>Continue <ArrowRight size={15} /></>}</button>
      </div>

      <style jsx>{`
        .wv-field { transition: border-color .25s ease, transform .25s ease, box-shadow .25s ease, background .25s ease; }
        .wv-field:focus { transform: translateY(-1px); border-color: rgba(255,255,255,.28); box-shadow: 0 14px 35px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.04); background: rgba(0,0,0,.34); }
        .wv-choice { position: relative; overflow: hidden; isolation: isolate; transition: transform .25s cubic-bezier(.22,1,.36,1), border-color .25s ease, background .25s ease, box-shadow .25s ease; }
        .wv-choice::after { content: ""; position: absolute; inset: -80% -20%; z-index: -1; transform: translateX(-65%) rotate(18deg); background: linear-gradient(90deg, transparent, rgba(255,255,255,.12), transparent); transition: transform .65s cubic-bezier(.22,1,.36,1); pointer-events:none; }
        .wv-choice:hover { transform: translateY(-2px); box-shadow: 0 15px 38px rgba(0,0,0,.2); }
        .wv-choice:hover::after { transform: translateX(65%) rotate(18deg); }
        .wv-choice[data-active="true"] { box-shadow: 0 15px 45px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,.1); }
        .wv-next { background: linear-gradient(135deg, #6A0C1F, #B56B78 58%, #C8A24A); border: 1px solid rgba(255,255,255,.14); box-shadow: 0 15px 45px rgba(106,12,31,.25), inset 0 1px 0 rgba(255,255,255,.16); transition: transform .25s ease, box-shadow .25s ease; }
        .wv-next:hover { transform: translateY(-2px); box-shadow: 0 20px 55px rgba(106,12,31,.34), inset 0 1px 0 rgba(255,255,255,.2); }
        @media (prefers-reduced-motion: reduce) { .wv-field, .wv-choice, .wv-next { transition: none; } }
      `}</style>
    </motion.div>
  );
}

function FormCard({ number, title, subtitle, children }: { number: string; title: string; subtitle: string; children: ReactNode }) {
  return <section><div className="mb-7"><span className="text-[9px] uppercase tracking-[.35em] text-white/25">Stage {number}</span><h3 className="mt-2 text-2xl font-medium tracking-tight sm:text-3xl">{title}</h3><p className="mt-3 max-w-2xl text-sm leading-6 text-white/35">{subtitle}</p></div>{children}</section>;
}

function Input({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="text-sm text-white/50">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="wv-field mt-3 w-full rounded-2xl border border-white/10 bg-black/25 p-4 outline-none placeholder:text-white/20" /></label>;
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return <button type="button" onClick={onClick} data-active={active} className={`wv-choice flex min-h-[72px] items-center gap-3 rounded-2xl border p-4 text-left ${active ? "border-white/30 bg-white/[.09]" : "border-white/10 bg-black/20 hover:bg-white/[.04]"}`}>{children}</button>;
}
