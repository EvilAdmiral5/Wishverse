"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Edit3, Eye, Loader2, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type WishSummary = {
  slug: string;
  recipient_name: string;
  theme: string;
};

const occasionForTheme = (theme: string) => {
  const value = theme.toLowerCase();
  if (value === "anniversary") return "Anniversary";
  if (value === "romantic" || value === "romanticbirthday") return "Romantic Birthday";
  if (value === "bestfriend" || value === "best-friend") return "Best Friend";
  if (value === "cinematic") return "Just Because";
  return "Birthday";
};

export default function CreateSuccessPage() {
  const [wish, setWish] = useState<WishSummary | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [slug, setSlug] = useState<string | null>(null);

  const wishUrl = slug && typeof window !== "undefined" ? `${window.location.origin}/wish/${slug}` : "";
  const occasion = occasionForTheme(wish?.theme ?? "birthday");

  useEffect(() => {
    const querySlug = new URLSearchParams(window.location.search).get("slug");
    setSlug(querySlug);
    if (!querySlug) {
      setError("No wish was provided.");
      return;
    }

    const load = async () => {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("wishes")
        .select("slug, recipient_name, theme")
        .eq("slug", querySlug)
        .single();

      if (fetchError || !data) {
        setError("We couldn't find the wish you just created.");
        return;
      }
      setWish(data as WishSummary);
    };

    void load();
  }, []);

  const shareMessage = wish
    ? `Happy ${occasion} ${wish.recipient_name}! I made something special for you on WishVerse 💖 Open your surprise: ${wishUrl}`
    : "";

  const copyWishLink = async () => {
    if (!wishUrl || !shareMessage) return;
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setError("Copy failed. Please copy the link manually.");
    }
  };

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#070609] px-6 text-white">
        <div className="rounded-[2rem] border border-white/10 bg-white/[.04] p-8 text-center backdrop-blur-2xl">
          <p className="text-sm text-white/50">{error}</p>
          <Link href="/create" className="mt-5 inline-flex rounded-full border border-white/10 px-5 py-3 text-xs uppercase tracking-[.2em] text-white/65">Create again</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070609] text-white">
      {/* Blurred continuation of the WishVerse world behind the action card. */}
      <div className="pointer-events-none absolute inset-0 scale-110 blur-3xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(122,23,53,.28),transparent_30%),radial-gradient(circle_at_80%_25%,rgba(93,79,163,.22),transparent_28%),radial-gradient(circle_at_50%_90%,rgba(200,162,74,.12),transparent_32%)]" />
        <div className="absolute left-[12%] top-[18%] h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute right-[12%] bottom-[15%] h-80 w-80 rounded-full border border-white/10" />
      </div>
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[18px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <AnimatePresence mode="wait">
          {!wish ? (
            <motion.div key="loading" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3 text-sm text-white/45"><Loader2 size={17} className="animate-spin" /> Preparing your WishVerse...</motion.div>
          ) : (
            <motion.div key="ready" initial={{ opacity: 0, y: 24, scale: .96, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }} transition={{ duration: .65, ease: [0.22,1,.36,1] }} className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#0B0A10]/88 p-5 shadow-[0_40px_120px_rgba(0,0,0,.55)] backdrop-blur-2xl sm:p-7">
              <div className="text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-[#C8A24A]/30 bg-[#C8A24A]/10 text-[#C8A24A]"><Check size={22} /></div>
                <p className="mt-5 text-[9px] uppercase tracking-[.4em] text-white/30">WishVerse created</p>
                <h1 className="mt-3 text-3xl font-light tracking-[-.04em] sm:text-4xl">Happy {occasion}</h1>
                <p className="mt-2 text-white/55">{wish.recipient_name}'s experience is ready.</p>
              </div>

              <div className="mt-7 rounded-3xl border border-white/10 bg-white/[.025] p-3">
                <div className="flex items-center justify-between rounded-2xl border border-white/[.06] bg-black/20 px-4 py-3">
                  <span className="truncate text-xs text-white/40">{wishUrl}</span>
                  <span className="ml-3 shrink-0 text-[8px] uppercase tracking-[.2em] text-white/20">Private link</span>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Link href={`/wish/${encodeURIComponent(wish.slug)}`} className="group flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-black transition hover:-translate-y-1"><Eye size={16} /> Preview</Link>
                <Link href={`/create?edit=${encodeURIComponent(wish.slug)}`} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[.04] px-5 text-sm text-white/75 transition hover:-translate-y-1 hover:bg-white/[.07]"><Edit3 size={16} /> Edit again</Link>
              </div>

              <button type="button" onClick={copyWishLink} className="mt-3 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[.04] px-5 text-sm text-white/75 transition hover:-translate-y-1 hover:bg-white/[.07]">
                {copied ? <><Check size={16} /> Copied with message</> : <><Copy size={16} /> Copy link + ready-to-send message</>}
              </button>

              <div className="mt-5 rounded-2xl border border-white/[.07] bg-black/20 p-4">
                <div className="flex items-center gap-2 text-[9px] uppercase tracking-[.25em] text-white/25"><Share2 size={12} /> Ready to send</div>
                <p className="mt-3 text-xs leading-6 text-white/45">{shareMessage}</p>
              </div>

              <p className="mt-5 text-center text-[9px] uppercase tracking-[.25em] text-white/20">Preview first · edit anytime · then send one beautiful link</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
