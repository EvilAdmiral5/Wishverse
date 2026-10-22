"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Clipboard,
  Copy,
  Edit3,
  Eye,
  ExternalLink,
  Loader2,
  RefreshCw,
  Share2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type WishSummary = {
  slug: string;
  recipient_name: string;
  theme: string;
};

const occasionForTheme = (theme: string) => {
  const value = theme.toLowerCase().replace(/\s+/g, "");

  if (value === "anniversary") return "Anniversary";

  if (
    value === "romantic" ||
    value === "romanticbirthday"
  ) {
    return "Romantic Birthday";
  }

  if (
    value === "bestfriend" ||
    value === "best-friend"
  ) {
    return "Best Friend";
  }

  if (value === "cinematic") {
    return "Cinematic";
  }

  return "Birthday";
};

const themeVisuals = (theme: string) => {
  const value = theme.toLowerCase().replace(/\s+/g, "");

  if (value === "anniversary") {
    return {
      primary: "#4A1026",
      secondary: "#9B4D68",
      accent: "#D6A6B8",
    };
  }

  if (
    value === "romantic" ||
    value === "romanticbirthday"
  ) {
    return {
      primary: "#7A1735",
      secondary: "#D05A7A",
      accent: "#F2B5C5",
    };
  }

  if (
    value === "bestfriend" ||
    value === "best-friend"
  ) {
    return {
      primary: "#A65335",
      secondary: "#E58B61",
      accent: "#F3C677",
    };
  }

  if (value === "cinematic") {
    return {
      primary: "#25204A",
      secondary: "#5D4FA3",
      accent: "#D7B56D",
    };
  }

  return {
    primary: "#6A0C1F",
    secondary: "#B56B78",
    accent: "#C8A24A",
  };
};

export default function CreateSuccessPage() {
  const [wish, setWish] = useState<WishSummary | null>(null);
  const [copied, setCopied] = useState(false);
  const [previewOpened, setPreviewOpened] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string | null>(null);

  const wishUrl = useMemo(() => {
    if (!slug || typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}/wish/${encodeURIComponent(slug)}`;
  }, [slug]);

  const occasion = occasionForTheme(wish?.theme ?? "birthday");

  const visuals = themeVisuals(wish?.theme ?? "birthday");

  const shareMessage = useMemo(() => {
    if (!wish || !wishUrl) {
      return "";
    }

    return `Happy ${occasion} ${wish.recipient_name}! I made something special for you on WishVerse 💖 Open your surprise: ${wishUrl}`;
  }, [wish, wishUrl, occasion]);

  useEffect(() => {
    const querySlug = new URLSearchParams(
      window.location.search
    ).get("slug");

    if (!querySlug) {
      setError("No wish was provided.");
      setLoading(false);
      return;
    }

    setSlug(querySlug);

    const loadWish = async () => {
      try {
        setLoading(true);
        setError("");

        const supabase = createClient();

        const { data, error: fetchError } = await supabase
          .from("wishes")
          .select("slug, recipient_name, theme")
          .eq("slug", querySlug)
          .single();

        if (fetchError || !data) {
          setError(
            "We couldn't find the wish you just created."
          );
          return;
        }

        setWish(data as WishSummary);
      } catch {
        setError(
          "Something went wrong while preparing your WishVerse."
        );
      } finally {
        setLoading(false);
      }
    };

    void loadWish();
  }, []);

  /**
   * Opens the actual recipient experience in a NEW browser tab.
   *
   * Important:
   * We intentionally do NOT use Next.js <Link> here because
   * the creator success page should remain open.
   */
  const openPreview = () => {
    if (!wishUrl) return;

    const previewWindow = window.open(
      wishUrl,
      "_blank",
      "noopener,noreferrer"
    );

    if (previewWindow) {
      setPreviewOpened(true);

      window.setTimeout(() => {
        setPreviewOpened(false);
      }, 2200);
    } else {
      setError(
        "Your browser blocked the preview tab. Please allow pop-ups for WishVerse."
      );
    }
  };

  /**
   * Copy the complete ready-to-send message.
   *
   * Primary method:
   * navigator.clipboard.writeText()
   *
   * Fallback:
   * hidden textarea + document.execCommand("copy")
   */
  const copyWishLink = async () => {
    if (!wishUrl || !shareMessage) {
      return;
    }

    try {
      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {
        await navigator.clipboard.writeText(
          shareMessage
        );
      } else {
        const textarea =
          document.createElement("textarea");

        textarea.value = shareMessage;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "0";
        textarea.setAttribute("readonly", "");

        document.body.appendChild(textarea);

        textarea.focus();
        textarea.select();

        const successful =
          document.execCommand("copy");

        document.body.removeChild(textarea);

        if (!successful) {
          throw new Error("Fallback copy failed");
        }
      }

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2400);
    } catch {
      setError(
        "Copy failed. Please copy the message manually."
      );
    }
  };

  /**
   * Retry loading the wish if something temporarily failed.
   */
  const retryLoading = () => {
    window.location.reload();
  };

  /**
   * Error state
   */
  if (error) {
    return (
      <main className="relative grid min-h-screen overflow-hidden bg-[#070609] px-6 text-white">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(
                circle at 20% 20%,
                ${visuals.primary}55,
                transparent 32%
              ),
              radial-gradient(
                circle at 80% 75%,
                ${visuals.secondary}30,
                transparent 35%
              )
            `,
          }}
        />

        <div className="pointer-events-none absolute inset-0 bg-black/45 backdrop-blur-[20px]" />

        <div className="relative z-10 m-auto w-full max-w-md">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="rounded-[2rem] border border-white/10 bg-[#0B0A10]/90 p-7 text-center shadow-[0_40px_120px_rgba(0,0,0,.55)] backdrop-blur-2xl"
          >
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-white/10 bg-white/[0.04]">
              <Sparkles
                size={21}
                className="text-white/55"
              />
            </div>

            <p className="mt-5 text-[9px] uppercase tracking-[0.4em] text-white/25">
              WishVerse
            </p>

            <h1 className="mt-3 text-2xl font-light tracking-[-0.04em]">
              Something went wrong
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/45">
              {error}
            </p>

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={retryLoading}
                className="flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-white/90"
              >
                <RefreshCw size={16} />
                Try again
              </button>

              <Link
                href="/create"
                className="flex min-h-13 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm text-white/65 transition hover:-translate-y-0.5 hover:bg-white/[0.07] hover:text-white"
              >
                Create another wish
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070609] text-white">
      {/* =========================================================
          BACKGROUND — BLURRED WISHVERSE ATMOSPHERE
         ========================================================= */}

      <div
        className="pointer-events-none absolute inset-0 scale-110 blur-3xl"
        style={{
          background: `
            radial-gradient(
              circle at 18% 15%,
              ${visuals.primary}55,
              transparent 30%
            ),
            radial-gradient(
              circle at 82% 25%,
              ${visuals.secondary}35,
              transparent 30%
            ),
            radial-gradient(
              circle at 50% 90%,
              ${visuals.accent}20,
              transparent 34%
            )
          `,
        }}
      />

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-[8%] top-[12%] h-72 w-72 rounded-full border border-white/[0.04]"
          style={{
            boxShadow: `0 0 100px ${visuals.primary}15`,
          }}
        />

        <div
          className="absolute right-[7%] bottom-[10%] h-96 w-96 rounded-full border border-white/[0.035]"
          style={{
            boxShadow: `0 0 120px ${visuals.secondary}12`,
          }}
        />

        <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 shadow-[0_0_50px_20px_rgba(255,255,255,.08)]" />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-black/50 backdrop-blur-[18px]" />

      {/* =========================================================
          CONTENT
         ========================================================= */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <AnimatePresence mode="wait">
          {/* =====================================================
              LOADING
             ===================================================== */}

          {loading ? (
            <motion.div
              key="loading"
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -8,
              }}
              className="flex flex-col items-center text-center"
            >
              <div
                className="grid h-16 w-16 place-items-center rounded-full border"
                style={{
                  borderColor: `${visuals.accent}35`,
                  backgroundColor: `${visuals.accent}0D`,
                  boxShadow: `0 0 50px ${visuals.accent}12`,
                }}
              >
                <Loader2
                  size={21}
                  className="animate-spin"
                  style={{
                    color: visuals.accent,
                  }}
                />
              </div>

              <p className="mt-6 text-[9px] uppercase tracking-[0.4em] text-white/30">
                WishVerse
              </p>

              <p className="mt-3 text-sm text-white/45">
                Preparing your wish...
              </p>
            </motion.div>
          ) : (
            /* =====================================================
               SUCCESS CARD
               ===================================================== */

            <motion.div
              key="ready"
              initial={{
                opacity: 0,
                y: 28,
                scale: 0.96,
                filter: "blur(12px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
              }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full max-w-xl"
            >
              <div
                className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0B0A10]/90 shadow-[0_40px_120px_rgba(0,0,0,.6)] backdrop-blur-2xl"
              >
                {/* Card glow */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-70"
                  style={{
                    background: `
                      radial-gradient(
                        circle at 50% 0%,
                        ${visuals.primary}35,
                        transparent 38%
                      ),
                      radial-gradient(
                        circle at 0% 100%,
                        ${visuals.secondary}16,
                        transparent 35%
                      )
                    `,
                  }}
                />

                <div className="relative p-5 sm:p-8">
                  {/* =================================================
                      SUCCESS HEADER
                     ================================================= */}

                  <div className="text-center">
                    <motion.div
                      initial={{
                        opacity: 0,
                        scale: 0.7,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      transition={{
                        delay: 0.15,
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="mx-auto grid h-16 w-16 place-items-center rounded-full border"
                      style={{
                        borderColor: `${visuals.accent}45`,
                        backgroundColor: `${visuals.accent}12`,
                        color: visuals.accent,
                        boxShadow: `0 0 55px ${visuals.accent}16`,
                      }}
                    >
                      <Check size={24} />
                    </motion.div>

                    <p className="mt-5 text-[9px] uppercase tracking-[0.4em] text-white/30">
                      WishVerse created
                    </p>

                    <h1 className="mt-3 text-3xl font-light tracking-[-0.045em] sm:text-4xl">
                      Happy {occasion}
                    </h1>

                    <p className="mt-2 text-sm text-white/50">
                      {wish?.recipient_name}
                      &apos;s experience is ready.
                    </p>
                  </div>

                  {/* =================================================
                      STATUS LINE
                     ================================================= */}

                  <div className="mt-7 flex items-center justify-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full animate-pulse"
                      style={{
                        backgroundColor: visuals.accent,
                        boxShadow: `0 0 14px ${visuals.accent}`,
                      }}
                    />

                    <span className="text-[9px] uppercase tracking-[0.3em] text-white/25">
                      Your private wish is live
                    </span>
                  </div>

                  {/* =================================================
                      WISH URL
                     ================================================= */}

                  <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-3">
                    <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3.5">
                      <div className="min-w-0 flex-1">
                        <p className="mb-1 text-[8px] uppercase tracking-[0.25em] text-white/20">
                          Wish link
                        </p>

                        <p className="truncate text-xs text-white/45">
                          {wishUrl}
                        </p>
                      </div>

                      <div className="shrink-0 rounded-full border border-white/10 px-2.5 py-1 text-[8px] uppercase tracking-[0.18em] text-white/20">
                        Private
                      </div>
                    </div>
                  </div>

                  {/* =================================================
                      PRIMARY ACTIONS
                     ================================================= */}

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {/* NEW TAB PREVIEW */}
                    <button
                      type="button"
                      onClick={openPreview}
                      disabled={!wishUrl}
                      className="group relative flex min-h-14 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-white px-5 text-sm font-semibold text-black transition duration-300 hover:-translate-y-1 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/[0.05] to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                      <span className="relative flex items-center gap-2">
                        {previewOpened ? (
                          <>
                            <Check size={16} />
                            Preview opened
                          </>
                        ) : (
                          <>
                            <Eye size={16} />
                            Preview
                            <ExternalLink
                              size={13}
                              className="opacity-50"
                            />
                          </>
                        )}
                      </span>
                    </button>

                    {/* SAME TAB EDIT */}
                    <Link
                      href={
                        wish
                          ? `/create?edit=${encodeURIComponent(
                              wish.slug
                            )}`
                          : "/create"
                      }
                      className="group flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm text-white/75 transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.07] hover:text-white"
                    >
                      <Edit3
                        size={16}
                        className="transition-transform duration-300 group-hover:-rotate-6"
                      />

                      Edit again
                    </Link>
                  </div>

                  {/* =================================================
                      COPY BUTTON
                     ================================================= */}

                  <button
                    type="button"
                    onClick={copyWishLink}
                    disabled={!wishUrl}
                    className="group mt-3 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm text-white/75 transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {copied ? (
                      <>
                        <Check size={16} />
                        Copied with message
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy link + ready-to-send message
                      </>
                    )}
                  </button>

                  {/* =================================================
                      READY TO SEND MESSAGE
                     ================================================= */}

                  <div className="mt-5 rounded-2xl border border-white/[0.07] bg-black/20 p-4">
                    <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-white/25">
                      <Share2 size={12} />
                      Ready to send
                    </div>

                    <p className="mt-3 text-xs leading-6 text-white/45">
                      {shareMessage}
                    </p>
                  </div>

                  {/* =================================================
                      QUICK INSTRUCTION
                     ================================================= */}

                  <div className="mt-5 flex items-center justify-center gap-2 text-center">
                    <ArrowUpRight
                      size={12}
                      className="text-white/20"
                    />

                    <p className="text-[9px] uppercase tracking-[0.22em] text-white/20">
                      Preview in another tab · edit anytime · send when ready
                    </p>
                  </div>
                </div>

                {/* ===================================================
                    FOOTER
                   =================================================== */}

                <div className="border-t border-white/[0.06] bg-black/10 px-5 py-4 sm:px-8">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Clipboard
                        size={12}
                        className="text-white/20"
                      />

                      <span className="text-[8px] uppercase tracking-[0.22em] text-white/20">
                        One link
                      </span>
                    </div>

                    <span className="text-[8px] uppercase tracking-[0.22em] text-white/15">
                      WishVerse
                    </span>
                  </div>
                </div>
              </div>

              {/* =====================================================
                  BOTTOM BRANDING
                 ===================================================== */}

              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 0.8,
                  duration: 0.5,
                }}
                className="mt-6 text-center text-[8px] uppercase tracking-[0.35em] text-white/15"
              >
                A little moment made to be remembered
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}