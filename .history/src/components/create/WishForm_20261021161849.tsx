"use client";

import { useState } from "react";
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

function generateSlug(name: string) {
  const cleanName =
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "wish";

  const random = Math.random()
    .toString(36)
    .substring(2, 9);

  return `${cleanName}-${random}`;
}

export default function WishForm() {
  const router = useRouter();

  const [recipientName, setRecipientName] = useState("");
  const [creatorName, setCreatorName] = useState("");

  const [gender, setGender] =
    useState<RecipientGender>("boy");

  const [theme, setTheme] =
    useState<WishTheme>("birthday");

  const [birthdayMessage, setBirthdayMessage] =
    useState("");

  const [cakeType, setCakeType] =
    useState<CakeType>("chocolate");

  const [royalNotes, setRoyalNotes] = useState<string[]>([
    "",
    "",
    "",
  ]);

  const [memories, setMemories] = useState<Memory[]>([]);

  const [secretLetter, setSecretLetter] = useState("");

  const [loading, setLoading] = useState(false);

  const updateRoyalNote = (
    index: number,
    value: string
  ) => {
    setRoyalNotes((current) => {
      const copy = [...current];
      copy[index] = value;
      return copy;
    });
  };

  const addRoyalNote = () => {
    if (royalNotes.length >= 5) return;

    setRoyalNotes((current) => [
      ...current,
      "",
    ]);
  };

  const removeRoyalNote = (index: number) => {
    if (royalNotes.length <= 1) return;

    setRoyalNotes((current) =>
      current.filter((_, i) => i !== index)
    );
  };

  const addMemory = () => {
    if (memories.length >= 8) return;

    setMemories((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        imageUrl:
          "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200",
        caption: "",
      },
    ]);
  };

  const updateMemory = (
    id: string,
    field: "imageUrl" | "caption",
    value: string
  ) => {
    setMemories((current) =>
      current.map((memory) =>
        memory.id === id
          ? {
              ...memory,
              [field]: value,
            }
          : memory
      )
    );
  };

  const removeMemory = (id: string) => {
    setMemories((current) =>
      current.filter(
        (memory) => memory.id !== id
      )
    );
  };

  const submitWish = async () => {
    if (!recipientName.trim()) {
      alert(
        "Please enter the recipient's name."
      );
      return;
    }

    if (!creatorName.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!birthdayMessage.trim()) {
      alert("Please write a birthday message.");
      return;
    }

    if (!secretLetter.trim()) {
      alert("Please write the secret letter.");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      const supabase = createClient();

      const slug = generateSlug(recipientName);

      /*
       * Keep only actual written notes.
       */
      const cleanedNotes = royalNotes
        .map((note) => note.trim())
        .filter(Boolean);

      /*
       * Store only the data that WishExperience needs.
       *
       * Do NOT send React state objects, File objects,
       * preview URLs, or other client-only properties.
       */
      const cleanedMemories = memories.map(
        (memory) => ({
          id: memory.id,
          imageUrl: memory.imageUrl,
          caption: memory.caption.trim(),
        })
      );

      /*
       * Build a plain JSON-safe object.
       */
      const insertPayload = {
        slug,
        recipient_name: recipientName.trim(),
        creator_name: creatorName.trim(),
        recipient_gender: gender,
        theme,
        birthday_message:
          birthdayMessage.trim(),
        cake_type: cakeType,
        royal_notes: cleanedNotes,
        memories: cleanedMemories,
        secret_letter: secretLetter.trim(),
      };

      console.log(
        "🚀 WishVerse payload:",
        insertPayload
      );

      /*
       * Supabase insert.
       *
       * We intentionally do not request the inserted
       * row back. This keeps the operation simple and
       * avoids unnecessary SELECT/RLS requirements.
       */
      const { error } = await supabase
        .from("wishes")
        .insert(insertPayload);

      if (error) {
        /*
         * Supabase/PostgREST errors can sometimes appear
         * as {} when logged directly.
         *
         * Extract every useful property explicitly.
         */
        const errorMessage =
          typeof error.message === "string" &&
          error.message.trim()
            ? error.message
            : "Supabase could not create this wish.";

        const errorDetails =
          typeof error.details === "string"
            ? error.details
            : "";

        const errorHint =
          typeof error.hint === "string"
            ? error.hint
            : "";

        const errorCode =
          typeof error.code === "string"
            ? error.code
            : "";

        console.error(
          "❌ WishVerse database insert failed"
        );

        console.error(
          "Message:",
          errorMessage
        );

        console.error(
          "Code:",
          errorCode || "N/A"
        );

        console.error(
          "Details:",
          errorDetails || "N/A"
        );

        console.error(
          "Hint:",
          errorHint || "N/A"
        );

        const fullError = [
          errorMessage,
          errorCode
            ? `Code: ${errorCode}`
            : "",
          errorDetails
            ? `Details: ${errorDetails}`
            : "",
          errorHint
            ? `Hint: ${errorHint}`
            : "",
        ]
          .filter(Boolean)
          .join("\n\n");

        alert(fullError);

        return;
      }

      console.log(
        "✅ WishVerse wish created successfully:",
        slug
      );

      /*
       * Navigate only after the database confirms
       * the insert succeeded.
       */
      router.push(`/wish/${slug}`);
    } catch (error) {
      console.error(
        "❌ Unexpected WishVerse error:",
        error
      );

      let message =
        "Something went wrong while creating your wish.";

      if (error instanceof Error) {
        message = error.message;
      }

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* BASIC INFORMATION */}

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
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
            Recipient
          </label>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <Choice
              active={gender === "boy"}
              onClick={() => setGender("boy")}
            >
              🧸 Boy — Bubu
            </Choice>

            <Choice
              active={gender === "girl"}
              onClick={() => setGender("girl")}
            >
              🐰 Girl — Dudu
            </Choice>
          </div>
        </div>
      </section>

      {/* THEME */}

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <SectionTitle
          number="02"
          title="Choose the mood"
        />

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.values(themes).map((item) => (
            <Choice
              key={item.id}
              active={theme === item.id}
              onClick={() =>
                setTheme(item.id as WishTheme)
              }
            >
              <span className="text-xl">
                {item.emoji}
              </span>

              <span>
                <strong className="block">
                  {item.name}
                </strong>

                <small className="mt-1 block text-white/40">
                  {item.description}
                </small>
              </span>
            </Choice>
          ))}
        </div>
      </section>

      {/* MESSAGE */}

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <SectionTitle
          number="03"
          title="Write the birthday message"
        />

        <textarea
          value={birthdayMessage}
          onChange={(event) =>
            setBirthdayMessage(event.target.value)
          }
          placeholder="Happy birthday! I hope today reminds you how special you are..."
          rows={6}
          className="mt-7 w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-5 text-white outline-none placeholder:text-white/20 focus:border-white/30"
        />
      </section>

      {/* CAKE */}

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <SectionTitle
          number="04"
          title="Choose their cake"
        />

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cakes.map((cake) => (
            <Choice
              key={cake.id}
              active={cakeType === cake.id}
              onClick={() =>
                setCakeType(cake.id)
              }
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

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <SectionTitle
          number="05"
          title="Hide some royal notes"
        />

        <p className="mt-3 text-sm text-white/40">
          These will appear one by one for them
          to open.
        </p>

        <div className="mt-7 space-y-4">
          {royalNotes.map((note, index) => (
            <div
              key={index}
              className="flex gap-3"
            >
              <textarea
                value={note}
                onChange={(event) =>
                  updateRoyalNote(
                    index,
                    event.target.value
                  )
                }
                placeholder={`Secret note ${
                  index + 1
                }`}
                rows={3}
                className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-4 outline-none placeholder:text-white/20 focus:border-white/30"
              />

              {royalNotes.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    removeRoyalNote(index)
                  }
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
            + ADD ANOTHER NOTE
          </button>
        )}
      </section>

      {/* MEMORIES */}

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <SectionTitle
          number="06"
          title="Add your memories"
        />

        <p className="mt-3 text-sm text-white/40">
          For now, paste an image URL. We'll add
          direct photo uploading next.
        </p>

        <div className="mt-7 space-y-5">
          {memories.map((memory, index) => (
            <div
              key={memory.id}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-white/40">
                  Memory {index + 1}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    removeMemory(memory.id)
                  }
                  className="text-sm text-white/30 hover:text-white"
                >
                  Remove
                </button>
              </div>

              <input
                value={memory.imageUrl}
                onChange={(event) =>
                  updateMemory(
                    memory.id,
                    "imageUrl",
                    event.target.value
                  )
                }
                placeholder="Image URL"
                className="w-full rounded-xl border border-white/10 bg-black/30 p-4 outline-none placeholder:text-white/20"
              />

              <input
                value={memory.caption}
                onChange={(event) =>
                  updateMemory(
                    memory.id,
                    "caption",
                    event.target.value
                  )
                }
                placeholder="One line about this memory..."
                className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 p-4 outline-none placeholder:text-white/20"
              />
            </div>
          ))}
        </div>

        {memories.length < 8 && (
          <button
            type="button"
            onClick={addMemory}
            className="mt-5 rounded-full border border-white/10 px-5 py-3 text-sm text-white/60 hover:bg-white/5"
          >
            + ADD MEMORY
          </button>
        )}
      </section>

      {/* LETTER */}

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <SectionTitle
          number="07"
          title="Write the secret letter"
        />

        <textarea
          value={secretLetter}
          onChange={(event) =>
            setSecretLetter(event.target.value)
          }
          placeholder="There is something I've wanted to tell you..."
          rows={10}
          className="mt-7 w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-5 leading-7 outline-none placeholder:text-white/20 focus:border-white/30"
        />
      </section>

      {/* CREATE */}

      <div className="sticky bottom-5 z-20">
        <button
          type="button"
          disabled={loading}
          onClick={submitWish}
          className="w-full rounded-2xl bg-white px-8 py-5 text-sm font-bold text-black shadow-2xl transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "CREATING YOUR EXPERIENCE..."
            : "CREATE MY WISH →"}
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
        className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 p-4 outline-none placeholder:text-white/20 focus:border-white/30"
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
      className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
        active
          ? "border-white bg-white/10"
          : "border-white/10 bg-black/20 hover:bg-white/5"
      }`}
    >
      {children}
    </button>
  );
        {royalNotes.length < 5 && (
          <button
            type="button"
            onClick={addRoyalNote}
            className="mt-5 rounded-full border border-white/10 px-5 py-3 text-sm text-white/60 hover:bg-white/5"
          >
            + ADD ANOTHER NOTE
          </button>
        )}
        
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
