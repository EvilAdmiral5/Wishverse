"use client";

const themeStyles = {
  birthday: {
    name: "Velvet Celebration",
    primary: "#6A0C1F",
    secondary: "#B56B78",
    accent: "#C8A24A",
    background: "#0F0D0E",
  },

  anniversary: {
    name: "Midnight Romance",
    primary: "#4A1026",
    secondary: "#9B4D68",
    accent: "#D6A6B8",
    background: "#100A0D",
  },

  romantic: {
    name: "Rose Noir",
    primary: "#7A1735",
    secondary: "#D05A7A",
    accent: "#F2B5C5",
    background: "#12090D",
  },

  "best-friend": {
    name: "Sunset Bloom",
    primary: "#A65335",
    secondary: "#E58B61",
    accent: "#F3C677",
    background: "#15100D",
  },

  // Current WishForm theme IDs. Keep the legacy IDs above for compatibility
  // with older wishes already stored in Supabase.
  bestFriend: {
    name: "Sunset Bloom",
    primary: "#A65335",
    secondary: "#E58B61",
    accent: "#F3C677",
    background: "#15100D",
  },

  romanticBirthday: {
    name: "Rose Noir",
    primary: "#7A1735",
    secondary: "#D05A7A",
    accent: "#F2B5C5",
    background: "#12090D",
  },

  cinematic: {
    name: "Royal Eclipse",
    primary: "#25204A",
    secondary: "#5D4FA3",
    accent: "#D7B56D",
    background: "#090914",
  },
} as const;

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Flame,
  Heart,
  Music2,
  PartyPopper,
  RotateCcw,
  Sparkles,
  Wind,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

import { cakes } from "@/data/cakes";
import { characters } from "@/data/characters";
import type { Wish } from "@/types/wish";

type WishExperienceProps = {
  wish: Wish;
};

type Stage = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const stageVariants = {
  initial: {
    opacity: 0,
    scale: 0.97,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -20,
    transition: {
      duration: 0.45,
      ease: [0.4, 0, 1, 1],
    },
  },
};

/* ===================================================== */
/* WISHVERSE INTRO */
/* ===================================================== */

type WishThemeStyle = {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
};

function WishVerseIntro({
  onComplete,
  theme,
}: {
  onComplete: () => void;
  theme: WishThemeStyle;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2400;
    const start = performance.now();

    let frameId: number;
    let completeTimer: ReturnType<typeof setTimeout>;

    const animate = (time: number) => {
      const elapsed = time - start;
      const linearProgress = Math.min(elapsed / duration, 1);

      // Smooth cinematic easing.
      const easedProgress =
        1 - Math.pow(1 - linearProgress, 3);

      const nextProgress = Math.min(
        Math.round(easedProgress * 100),
        100
      );

      setProgress(nextProgress);

      if (linearProgress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        completeTimer = setTimeout(() => {
          onComplete();
        }, 650);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 1.04,
        filter: "blur(12px)",
      }}
      transition={{
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden text-white"
      style={{ backgroundColor: theme.background }}
    >
      {/* Ambient glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.08, 0.18, 0.08],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
        style={{ backgroundColor: theme.primary }}
      />

      <div className="relative z-10 w-[min(420px,80vw)]">
        <motion.div
          initial={{
            opacity: 0,
            y: 15,
            letterSpacing: "0.8em",
          }}
          animate={{
            opacity: 1,
            y: 0,
            letterSpacing: "0.45em",
          }}
          transition={{
            duration: 1.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-center"
        >
          <h1 className="text-3xl font-light sm:text-4xl">
            WISHVERSE
          </h1>

          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.7,
              duration: 1,
            }}
            className="mt-4 text-[10px] uppercase tracking-[0.35em] text-white/35"
          >
            Preparing something special
          </motion.p>
        </motion.div>

        <div className="mt-14">
          <div className="relative h-px w-full overflow-visible bg-white/10">
            <motion.div
              className="relative h-full"
              style={{
                width: `${progress}%`,
                backgroundColor: theme.accent,
                boxShadow: `0 0 12px ${theme.accent}88`,
              }}
            >
              <motion.span
                animate={{
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
                className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full"
                style={{
                  backgroundColor: theme.accent,
                  boxShadow: `0 0 12px ${theme.accent}`,
                }}
              />
            </motion.div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/35">
            <span>
              {progress < 100
                ? "Loading experience"
                : "Ready"}
            </span>

            <span>{progress}%</span>
          </div>
        </div>

        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.9,
            duration: 1,
          }}
          className="mt-10 text-center text-xs text-white/25"
        >
          A little surprise is waiting for you.
        </motion.p>
      </div>
    </motion.div>
  );
}

type StageOnePullHeartProps = {
  theme: WishThemeStyle;
  heartPulled: boolean;
  onPulled: () => void;
};

function StageOnePullHeart({
  theme,
  heartPulled,
  onPulled,
}: StageOnePullHeartProps) {
  const heartRef = useRef<HTMLDivElement>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

  const maxPull = 190;
  const threshold = maxPull * 0.8;
  const pullRatio = pullDistance / maxPull;
  const tension = Math.min(pullDistance / threshold, 1);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (heartPulled) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || heartPulled) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const localY = event.clientY - rect.top;
    const nextPull = Math.max(0, Math.min(localY - 92, maxPull));

    setPullDistance(nextPull);
  };

  const releaseHeart = () => {
    if (!isDragging || heartPulled) return;

    setIsDragging(false);

    if (pullDistance >= threshold) {
      setPullDistance(maxPull);
      setBurstKey((key) => key + 1);
      onPulled();
      return;
    }

    setIsReturning(true);
    setPullDistance(0);
  };

  return (
    <div
      ref={heartRef}
      className="relative mt-10 h-[300px] w-full max-w-[330px] select-none touch-none sm:mt-12"
      onPointerMove={handlePointerMove}
      onPointerUp={releaseHeart}
      onPointerCancel={releaseHeart}
      onPointerLeave={(event) => {
        if (isDragging && event.currentTarget.hasPointerCapture(event.pointerId)) {
          // Keep tracking while the pointer is captured; this makes desktop dragging
          // forgiving even when the cursor moves outside the visible heart.
          return;
        }
      }}
    >
      {/* Anchor */}
      <motion.div
        animate={{
          scale: isDragging ? 1.04 + tension * 0.06 : 1,
          boxShadow: `0 0 ${10 + tension * 25}px ${theme.accent}${
            Math.round(18 + tension * 35)
              .toString(16)
              .padStart(2, "0")
          }`,
        }}
        className="absolute left-1/2 top-1 h-8 w-8 -translate-x-1/2 rounded-full border"
        style={{
          borderColor: `${theme.accent}45`,
          backgroundColor: `${theme.background}dd`,
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: theme.accent }}
        />
      </motion.div>

      {/* Rope + tension glow. SVG keeps the rope visually connected to the heart. */}
      <svg
        className="pointer-events-none absolute left-1/2 top-0 h-[230px] w-16 -translate-x-1/2 overflow-visible"
        viewBox="0 0 64 230"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="wishverse-rope" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={theme.accent} stopOpacity="0.45" />
            <stop offset={`${35 + tension * 45}%`} stopColor={theme.secondary} stopOpacity={0.9} />
            <stop offset="100%" stopColor={theme.accent} stopOpacity="0.65" />
          </linearGradient>
          <filter id="wishverse-rope-glow" x="-200%" y="-20%" width="400%" height="140%">
            <feGaussianBlur stdDeviation={2 + tension * 3} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.path
          d={`M 32 25 C ${32 - pullRatio * 5} 72, ${32 + pullRatio * 5} 108, 32 ${92 + pullDistance}` }
          fill="none"
          stroke={theme.accent}
          strokeOpacity={0.1 + tension * 0.18}
          strokeWidth={5 + tension * 4}
          filter="url(#wishverse-rope-glow)"
        />

        <motion.path
          animate={{ strokeWidth: 1.5 + tension * 1.8 }}
          transition={{ duration: 0.15 }}
          d={`M 32 25 C ${32 - pullRatio * 5} 72, ${32 + pullRatio * 5} 108, 32 ${92 + pullDistance}` }
          fill="none"
          stroke="url(#wishverse-rope)"
          strokeLinecap="round"
        />

        <circle
          cx="32"
          cy="25"
          r="3"
          fill={theme.accent}
          opacity="0.75"
        />
      </svg>

      {/* Pull instruction */}
      <AnimatePresence mode="wait">
        {!heartPulled && (
          <motion.div
            key={isDragging ? (tension >= 0.82 ? "almost" : "pulling") : "idle"}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute left-1/2 top-[58px] -translate-x-1/2 whitespace-nowrap"
          >
            <p
              className="text-[10px] uppercase tracking-[0.38em]"
              style={{ color: `${theme.accent}${isDragging ? "cc" : "70"}` }}
            >
              {isDragging
                ? tension >= 0.82
                  ? "Almost there…"
                  : "Keep pulling…"
                : "Pull the heart"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Draggable heart */}
      <motion.div
        role="button"
        tabIndex={heartPulled ? -1 : 0}
        aria-label="Pull the heart downward"
        aria-disabled={heartPulled}
        onPointerDown={handlePointerDown}
        onKeyDown={(event) => {
          if (heartPulled) return;

          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setPullDistance(maxPull);
            setBurstKey((key) => key + 1);
            onPulled();
          }
        }}
        animate={
          heartPulled
            ? { y: maxPull, scale: 0.85, opacity: 0 }
            : isReturning
              ? { y: 0, scale: 1, opacity: 1 }
              : {
                  y: pullDistance,
                  scale: isDragging ? 1.08 + tension * 0.06 : [1, 1.035, 1],
                }
        }
        transition={
          heartPulled
            ? { duration: 0.42, ease: [0.4, 0, 1, 1] }
            : isReturning
              ? { type: "spring", stiffness: 420, damping: 24, mass: 0.65 }
              : isDragging
                ? { duration: 0.08, ease: "linear" }
                : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
        }
        onAnimationComplete={() => {
          if (isReturning) setIsReturning(false);
        }}
        whileHover={!heartPulled && !isDragging ? { scale: 1.06 } : undefined}
        className="absolute left-1/2 top-[92px] z-20 flex h-[76px] w-[76px] -translate-x-1/2 cursor-grab items-center justify-center rounded-full border outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-offset-4"
        style={{
          borderColor: `${theme.secondary}${isDragging ? "90" : "55"}`,
          backgroundColor: `${theme.primary}c9`,
          color: theme.secondary,
          boxShadow: `0 ${10 + pullDistance * 0.08}px ${28 + tension * 42}px ${theme.primary}66, inset 0 0 ${10 + tension * 18}px ${theme.secondary}18`,
          // Tailwind's ring-offset cannot know the dynamic theme, so the actual
          // focus treatment is intentionally subtle and theme-independent.
        }}
      >
        <Heart
          size={34 + tension * 4}
          fill="currentColor"
          strokeWidth={1.5}
          style={{
            filter: `drop-shadow(0 0 ${5 + tension * 10}px ${theme.secondary}${
              Math.round(55 + tension * 55)
                .toString(16)
                .padStart(2, "0")
            })`,
          }}
        />

        <motion.span
          animate={{ opacity: isDragging ? 0.8 : 0.3 }}
          className="absolute inset-[-13px] rounded-full border"
          style={{ borderColor: `${theme.secondary}35` }}
        />
      </motion.div>

      {/* Progress / tension indicator */}
      {!heartPulled && (
        <div className="absolute bottom-0 left-1/2 w-[150px] -translate-x-1/2">
          <div className="h-px overflow-hidden rounded-full bg-white/10">
            <motion.div
              animate={{ width: `${Math.min(pullRatio, 1) * 100}%` }}
              transition={{ duration: 0.08, ease: "linear" }}
              className="h-full rounded-full"
              style={{
                backgroundColor: theme.accent,
                boxShadow: `0 0 ${5 + tension * 10}px ${theme.accent}99`,
              }}
            />
          </div>
          <p className="mt-2 text-[8px] uppercase tracking-[0.3em] text-white/20">
            {isDragging ? `${Math.round(pullRatio * 100)}% tension` : "Hold and pull"}
          </p>
        </div>
      )}

      {/* Heart burst */}
      <AnimatePresence>
        {heartPulled && burstKey > 0 && (
          <>
            <motion.div
              key={`halo-${burstKey}`}
              initial={{ opacity: 0.65, scale: 0.25 }}
              animate={{ opacity: 0, scale: 2.4 }}
              transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute left-1/2 top-[130px] z-10 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border"
              style={{ borderColor: `${theme.accent}88` }}
            />

            {Array.from({ length: 26 }).map((_, index) => {
              const angle = (index / 26) * Math.PI * 2;
              const distance = 75 + (index % 5) * 22;

              return (
                <motion.span
                  key={`${burstKey}-${index}`}
                  initial={{
                    opacity: 1,
                    scale: 0.4,
                    x: 0,
                    y: 0,
                    rotate: 0,
                  }}
                  animate={{
                    opacity: 0,
                    scale: index % 3 === 0 ? 1.4 : 0.8,
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    rotate: 180 + index * 12,
                  }}
                  transition={{
                    duration: 0.85 + (index % 4) * 0.08,
                    delay: (index % 5) * 0.012,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="pointer-events-none absolute left-1/2 top-[130px] z-30 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    backgroundColor: index % 3 === 0 ? theme.secondary : theme.accent,
                    boxShadow: `0 0 10px ${theme.accent}99`,
                  }}
                />
              );
            })}

            {Array.from({ length: 8 }).map((_, index) => (
              <motion.span
                key={`heart-particle-${burstKey}-${index}`}
                initial={{ opacity: 1, scale: 0.4, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: 1,
                  x: Math.cos((index / 8) * Math.PI * 2) * (105 + index * 7),
                  y: Math.sin((index / 8) * Math.PI * 2) * (105 + index * 7),
                }}
                transition={{ duration: 1.05, delay: 0.04, ease: "easeOut" }}
                className="pointer-events-none absolute left-1/2 top-[130px] z-30 -translate-x-1/2 -translate-y-1/2 text-sm"
                style={{ color: theme.secondary }}
              >
                ♥
              </motion.span>
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ===================================================== */
/* MAIN EXPERIENCE */
/* ===================================================== */

export default function WishExperience({
  wish,
}: WishExperienceProps) {
  const [stage, setStage] = useState<Stage>(1);

  const [showIntro, setShowIntro] = useState(true);

  const [heartPulled, setHeartPulled] = useState(false);

  const [cakeLit, setCakeLit] = useState(false);
  const [cakeBlown, setCakeBlown] = useState(false);

  const [activeNote, setActiveNote] = useState<number | null>(
    null
  );

  const [kissCount, setKissCount] = useState(0);

  const [memoryIndex, setMemoryIndex] = useState(0);

  const [letterOpen, setLetterOpen] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);

  /* ===================================================== */
  /* THEME */
  /* ===================================================== */

  const theme =
    themeStyles[wish.theme as keyof typeof themeStyles] ?? themeStyles.birthday;

  const selectedCake = useMemo(() => {
    return (
      cakes.find((cake) => cake.id === wish.cake_type) ??
      cakes[0]
    );
  }, [wish.cake_type]);

  const selectedCharacter =
    characters[wish.recipient_gender];

  const memories = wish.memories ?? [];
  const royalNotes = wish.royal_notes ?? [];

  // Warm the browser cache before the recipient reaches Stage 6 so the
  // first memory is ready immediately instead of waiting for the image request.
  useEffect(() => {
    memories.forEach((memory) => {
      const image = new Image();
      image.decoding = "async";
      image.src = memory.imageUrl;
    });
  }, [memories]);

  useEffect(() => {
    if (stage !== 6 || memories.length <= 1) return;

    const timer = window.setInterval(() => {
      setMemoryIndex((current) =>
        current >= memories.length - 1 ? 0 : current + 1
      );
    }, 6000);

    return () => window.clearInterval(timer);
  }, [stage, memories.length]);

  /* ===================================================== */
  /* INTRO */
  /* ===================================================== */

  const completeIntro = useCallback(() => {
    setShowIntro(false);
  }, []);

  /* ===================================================== */
  /* NAVIGATION */
  /* ===================================================== */

  const nextStage = useCallback(() => {
    setStage((current) => {
      if (current >= 7) {
        return 7;
      }

      return (current + 1) as Stage;
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const previousStage = useCallback(() => {
    setStage((current) => {
      if (current <= 1) {
        return 1;
      }

      return (current - 1) as Stage;
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  /* ===================================================== */
  /* RESET */
  /* ===================================================== */

  const restartExperience = useCallback(() => {
    setStage(1);
    setHeartPulled(false);
    setCakeLit(false);
    setCakeBlown(false);
    setActiveNote(null);
    setKissCount(0);
    setMemoryIndex(0);
    setLetterOpen(false);

    // Intro deliberately runs again.
    setShowIntro(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  /* ===================================================== */
  /* CAKE */
  /* ===================================================== */

  const lightCake = () => {
    setCakeLit(true);
    setCakeBlown(false);
  };

  const blowCake = () => {
    if (!cakeLit) return;

    setCakeBlown(true);
  };

  /* ===================================================== */
  /* KISS */
  /* ===================================================== */

  const handleKiss = () => {
    setKissCount((count) => count + 1);
  };

  /* ===================================================== */
  /* MEMORIES */
  /* ===================================================== */

  const nextMemory = () => {
    if (memories.length === 0) return;

    setMemoryIndex((current) =>
      current >= memories.length - 1
        ? 0
        : current + 1
    );
  };

  const previousMemory = () => {
    if (memories.length === 0) return;

    setMemoryIndex((current) =>
      current <= 0
        ? memories.length - 1
        : current - 1
    );
  };

  /* ===================================================== */
  /* KEYBOARD NAVIGATION */
  /* ===================================================== */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showIntro) return;

      if (event.key === "ArrowRight") {
        nextStage();
      }

      if (event.key === "ArrowLeft") {
        previousStage();
      }

      if (
        event.key === "Escape" &&
        stage === 7 &&
        letterOpen
      ) {
        setLetterOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    showIntro,
    stage,
    letterOpen,
    nextStage,
    previousStage,
  ]);

  return (
    <div
      className="wv-button-surface relative min-h-screen overflow-hidden text-white transition-colors duration-1000"
      data-theme={wish.theme}
      style={
        {
          backgroundColor: theme.background,
          "--wish-primary": theme.primary,
          "--wish-secondary": theme.secondary,
          "--wish-accent": theme.accent,
          "--wish-background": theme.background,
          "--wv-primary": theme.primary,
          "--wv-secondary": theme.secondary,
          "--wv-accent": theme.accent,
        } as React.CSSProperties
      }
    >
      {/* ================================================= */}
      {/* INTRO */}
      {/* ================================================= */}

      <AnimatePresence>
        {showIntro && (
          <WishVerseIntro
            onComplete={completeIntro}
            theme={theme}
          />
        )}
      </AnimatePresence>

      {/* ================================================= */}
      {/* GLOBAL TOP BAR */}
      {/* ================================================= */}

      {!showIntro && (
        <div className="fixed left-0 right-0 top-0 z-[100] flex items-center justify-between px-5 py-5 sm:px-8">
          {/* Back */}
          {stage > 1 ? (
            <motion.button
              type="button"
              onClick={previousStage}
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white/50 backdrop-blur-md transition hover:border-white/20 hover:text-white"
              aria-label="Previous stage"
            >
              <ArrowLeft size={15} />
            </motion.button>
          ) : (
            <div className="h-9 w-9" />
          )}

          {/* Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <span className="text-[9px] font-medium uppercase tracking-[0.45em] text-white/30">
              WishVerse
            </span>
          </div>

          {/* Music / stage */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setIsPlaying((playing) => !playing)
              }
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white/40 backdrop-blur-md transition hover:border-white/20 hover:text-white"
              aria-label="Toggle music"
            >
              <Music2
                size={14}
                className={
                  isPlaying ? "animate-pulse" : ""
                }
              />
            </button>

            <span className="hidden text-[9px] uppercase tracking-[0.25em] text-white/25 sm:block">
              {stage} / 07
            </span>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* PROGRESS */}
      {/* ================================================= */}

      {!showIntro && (
        <div className="fixed left-1/2 top-[70px] z-[90] h-px w-[100px] -translate-x-1/2 overflow-hidden bg-white/10 sm:w-[160px]">
          <motion.div
            animate={{
              width: `${(stage / 7) * 100}%`,
            }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="h-full rounded-full"
            style={{
              backgroundColor: theme.accent,
            }}
          />
        </div>
      )}

      {/* ================================================= */}
      {/* STAGES */}
      {/* ================================================= */}

      <AnimatePresence mode="wait">

        {/* ================================================= */}
        {/* STAGE 1 — THE HEART */}
        {/* ================================================= */}

        {stage === 1 && (
          <motion.section
            key="stage-1"
            variants={stageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-10 pt-24 text-center"
          >
            {/* Cinematic ambient background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <motion.div
                animate={{
                  scale: heartPulled
                    ? [1, 1.8, 4.5]
                    : [1, 1.12, 1],
                  opacity: heartPulled
                    ? [0.16, 0.28, 0]
                    : [0.1, 0.18, 0.1],
                }}
                transition={{
                  duration: heartPulled ? 1.15 : 5.5,
                  repeat: heartPulled ? 0 : Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-1/2 top-[52%] h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[135px] sm:h-[520px] sm:w-[520px]"
                style={{ backgroundColor: theme.primary }}
              />

              <motion.div
                animate={{
                  opacity: [0.02, 0.1, 0.02],
                  scale: [0.9, 1.15, 0.9],
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-[5%] top-[22%] h-[230px] w-[230px] rounded-full blur-[110px]"
                style={{ backgroundColor: theme.secondary }}
              />

              {Array.from({ length: 28 }).map((_, index) => (
                <motion.span
                  key={index}
                  initial={{
                    opacity: 0,
                    y: "105vh",
                    x: `${(index * 37) % 100}%`,
                  }}
                  animate={{
                    opacity: [0, 0.28, 0],
                    y: "-12vh",
                    x: `${((index * 37 + 12) % 100)}%`,
                  }}
                  transition={{
                    duration: 7 + (index % 5),
                    delay: index * 0.16,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute h-1 w-1 rounded-full"
                  style={{ backgroundColor: theme.accent }}
                />
              ))}
            </div>

            <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-4 text-[10px] uppercase tracking-[0.5em]"
                style={{ color: `${theme.accent}99` }}
              >
                Something special awaits
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.85 }}
                className="max-w-2xl text-4xl font-light leading-tight tracking-tight sm:text-6xl"
              >
                Hey {" "}
                <span className="italic" style={{ color: theme.secondary }}>
                  {wish.recipient_name}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="mt-4 max-w-md text-sm leading-6 text-white/35"
              >
                Someone made something just for you.
              </motion.p>

              {/* ================================================= */}
              {/* PREMIUM PULL-ROPE INTERACTION */}
              {/* ================================================= */}

              <StageOnePullHeart
                theme={theme}
                heartPulled={heartPulled}
                onPulled={() => setHeartPulled(true)}
              />

              <AnimatePresence>
                {heartPulled && (
                  <motion.div
                    initial={{ opacity: 0, y: 18, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: 0.38,
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mt-4 flex flex-col items-center"
                  >
                    <p
                      className="text-lg font-light sm:text-xl"
                      style={{ color: theme.secondary }}
                    >
                      Happy Birthday ❤️
                    </p>

                    <button
                      type="button"
                      onClick={nextStage}
                      className="mt-5 rounded-full border px-7 py-3 text-sm transition duration-300 hover:scale-[1.03] active:scale-[0.98]"
                      style={{
                        borderColor: `${theme.accent}40`,
                        backgroundColor: `${theme.accent}10`,
                        color: theme.accent,
                        boxShadow: `0 0 35px ${theme.accent}10`,
                      }}
                    >
                      Enter your surprise →
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-[0.35em] text-white/20">
              An experience by WishVerse
            </p>
          </motion.section>
        )}

        {/* ================================================= */}
        {/* STAGE 2 — BIRTHDAY MESSAGE */}
        {/* ================================================= */}

        {stage === 2 && (
          <motion.section
            key="stage-2"
            variants={stageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
          >
            {/* Cinematic atmosphere */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <motion.div
                animate={{
                  scale: [1, 1.18, 1],
                  opacity: [0.08, 0.2, 0.08],
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px]"
                style={{ backgroundColor: theme.primary }}
              />

              <motion.div
                animate={{
                  x: ["-8%", "8%", "-8%"],
                  y: ["4%", "-5%", "4%"],
                  opacity: [0.02, 0.08, 0.02],
                }}
                transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px]"
                style={{ backgroundColor: theme.secondary }}
              />

              {Array.from({ length: 30 }).map((_, index) => (
                <motion.span
                  key={index}
                  initial={{
                    opacity: 0,
                    y: "105vh",
                    x: `${(index * 31) % 100}%`,
                    rotate: 0,
                  }}
                  animate={{
                    opacity: [0, index % 4 === 0 ? 0.7 : 0.3, 0],
                    y: "-12vh",
                    x: `${((index * 31 + 10) % 100)}%`,
                    rotate: index % 2 === 0 ? 180 : -180,
                  }}
                  transition={{
                    duration: 7 + (index % 5),
                    delay: index * 0.12,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute h-1 w-1 rounded-full"
                  style={{
                    backgroundColor:
                      index % 3 === 0 ? theme.accent : theme.secondary,
                    boxShadow: `0 0 10px ${theme.accent}55`,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 w-full max-w-3xl">
              {/* Small creator signature */}
              <motion.div
                initial={{ opacity: 0, y: 12, letterSpacing: "0.65em" }}
                animate={{ opacity: 1, y: 0, letterSpacing: "0.42em" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="text-[9px] uppercase"
                style={{ color: `${theme.accent}99` }}
              >
                A message from {wish.creator_name}
              </motion.div>

              {/* Hero heading */}
              <motion.h2
                initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.18, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 text-4xl font-light leading-[1.05] tracking-tight sm:text-6xl"
              >
                Happy Birthday,
                <span
                  className="mt-2 block italic"
                  style={{ color: theme.secondary }}
                >
                  {wish.recipient_name}
                </span>
              </motion.h2>

              {/* Message card */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className="relative mx-auto mt-10 max-w-2xl"
              >
                <div
                  className="absolute -inset-5 rounded-[32px] blur-2xl"
                  style={{ backgroundColor: `${theme.primary}35` }}
                />

                <div
                  className="relative overflow-hidden rounded-[28px] border px-7 py-9 backdrop-blur-xl sm:px-12 sm:py-12"
                  style={{
                    borderColor: `${theme.accent}22`,
                    backgroundColor: `${theme.background}cc`,
                    boxShadow: `0 30px 100px ${theme.primary}35, inset 0 1px 0 ${theme.accent}12`,
                  }}
                >
                  <div
                    className="absolute left-1/2 top-0 h-px w-28 -translate-x-1/2"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${theme.accent}80, transparent)`,
                    }}
                  />

                  <div className="mb-7 flex items-center justify-center gap-3">
                    <span
                      className="h-px w-10"
                      style={{ backgroundColor: `${theme.accent}35` }}
                    />
                    <Heart
                      size={13}
                      fill="currentColor"
                      strokeWidth={1.5}
                      style={{ color: theme.accent }}
                    />
                    <span
                      className="h-px w-10"
                      style={{ backgroundColor: `${theme.accent}35` }}
                    />
                  </div>

                  <p className="whitespace-pre-line text-base leading-8 text-white/65 sm:text-lg sm:leading-9">
                    {wish.birthday_message}
                  </p>

                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="mx-auto mt-8 h-px w-16 origin-center"
                    style={{ backgroundColor: `${theme.accent}45` }}
                  />

                  <p
                    className="mt-5 text-[9px] uppercase tracking-[0.35em]"
                    style={{ color: `${theme.secondary}88` }}
                  >
                    Made especially for you
                  </p>
                </div>
              </motion.div>

              {/* Continue */}
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.15, duration: 0.7 }}
                onClick={nextStage}
                whileHover={{ scale: 1.035, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="relative z-20 mt-9 inline-flex items-center gap-2 rounded-full border px-7 py-3 text-sm transition"
                style={{
                  borderColor: `${theme.accent}40`,
                  backgroundColor: `${theme.accent}0d`,
                  color: theme.accent,
                  boxShadow: `0 12px 35px ${theme.primary}25`,
                }}
              >
                There's a cake waiting
                <ArrowRight size={15} />
              </motion.button>
            </div>

            <p className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-[0.35em] text-white/20">
              A moment written just for you · WishVerse
            </p>
          </motion.section>
        )}

        {/* ================================================= */}
        {/* STAGE 3 — CAKE */}
        {/* ================================================= */}

        {stage === 3 && (
          <motion.section
            key="stage-3"
            variants={stageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-20 text-center sm:px-6"
          >
            {/* Cinematic cake-room atmosphere */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <motion.div
                animate={{
                  scale: cakeLit ? [1, 1.28, 1] : [1, 1.08, 1],
                  opacity: cakeLit ? [0.14, 0.3, 0.14] : [0.05, 0.11, 0.05],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-1/2 top-[48%] h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[170px]"
                style={{ backgroundColor: cakeLit ? theme.accent : theme.primary }}
              />

              <motion.div
                animate={{
                  x: ["-10%", "10%", "-10%"],
                  y: ["5%", "-5%", "5%"],
                  opacity: [0.02, 0.07, 0.02],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-1/2 top-[45%] h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
                style={{ backgroundColor: theme.secondary }}
              />

              <div
                className="absolute bottom-[11%] left-1/2 h-28 w-[520px] -translate-x-1/2 rounded-[50%] blur-3xl"
                style={{ backgroundColor: `${theme.primary}55` }}
              />

              {Array.from({ length: 34 }).map((_, index) => (
                <motion.span
                  key={`cake-particle-${index}`}
                  initial={{
                    opacity: 0,
                    y: "105vh",
                    x: `${(index * 29) % 100}%`,
                    scale: 0.5 + (index % 3) * 0.25,
                  }}
                  animate={{
                    opacity: [0, index % 5 === 0 ? 0.75 : 0.28, 0],
                    y: "-12vh",
                    x: `${((index * 29 + 11) % 100)}%`,
                    rotate: index % 2 ? 180 : -180,
                  }}
                  transition={{
                    duration: 7 + (index % 5),
                    delay: index * 0.11,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute h-1 w-1 rounded-full"
                  style={{
                    backgroundColor:
                      index % 3 === 0 ? theme.accent : theme.secondary,
                    boxShadow: `0 0 9px ${theme.accent}66`,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 w-full max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 15, letterSpacing: "0.7em" }}
                animate={{ opacity: 1, y: 0, letterSpacing: "0.5em" }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className="text-[9px] uppercase"
                style={{ color: `${theme.accent}aa` }}
              >
                A little celebration
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.12, duration: 0.8 }}
                className="mt-4 text-3xl font-light tracking-tight sm:text-5xl"
              >
                Make a wish,
                <span
                  className="block italic"
                  style={{ color: theme.secondary }}
                >
                  {wish.recipient_name}.
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/35"
              >
                {selectedCake.description}
              </motion.p>

              {/* Cake scene */}
              <motion.div
                initial={{ opacity: 0, y: 35, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: 0.35,
                  duration: 1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative mx-auto mt-8 h-[340px] w-[350px] sm:mt-10 sm:h-[365px] sm:w-[440px]"
              >
                {/* Warm candle halo */}
                <motion.div
                  animate={{
                    opacity:
                      cakeLit && !cakeBlown ? [0.08, 0.3, 0.08] : 0,
                    scale:
                      cakeLit && !cakeBlown ? [0.9, 1.15, 0.9] : 0.8,
                  }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="absolute left-1/2 top-0 h-52 w-52 -translate-x-1/2 rounded-full blur-[80px]"
                  style={{ backgroundColor: theme.accent }}
                />

                {/* Floating glass-like cake pedestal */}
                <div
                  className="absolute bottom-8 left-1/2 h-9 w-[330px] -translate-x-1/2 rounded-[50%] border backdrop-blur-md sm:w-[370px]"
                  style={{
                    borderColor: `${theme.accent}38`,
                    backgroundColor: `${theme.background}aa`,
                    boxShadow: `0 22px 55px ${theme.primary}66, inset 0 1px 0 ${theme.accent}18`,
                  }}
                />
                <div
                  className="absolute bottom-0 left-1/2 h-10 w-[120px] -translate-x-1/2 rounded-b-[28px] border-x border-b"
                  style={{
                    borderColor: `${theme.accent}20`,
                    background: `linear-gradient(180deg, ${theme.accent}12, ${theme.background})`,
                  }}
                />

                {/* Cake shadow */}
                <div
                  className="absolute bottom-16 left-1/2 h-10 w-[315px] -translate-x-1/2 rounded-[50%] blur-2xl"
                  style={{ backgroundColor: `${theme.primary}cc` }}
                />

                {/* Lower cake tier */}
                <div
                  className="absolute bottom-[62px] left-1/2 h-[102px] w-[285px] -translate-x-1/2 overflow-hidden rounded-[26px] border shadow-[0_24px_45px_rgba(0,0,0,0.4)] sm:w-[320px]"
                  style={{
                    borderColor: `${theme.accent}38`,
                    background: `linear-gradient(180deg, ${theme.secondary}, ${theme.primary} 72%, ${theme.background})`,
                  }}
                >
                  {/* glossy top edge */}
                  <div
                    className="absolute inset-x-0 top-0 h-7"
                    style={{
                      background: `linear-gradient(180deg, ${theme.accent}b8, ${theme.accent}28)`,
                    }}
                  />
                  <div className="absolute inset-x-0 top-6 h-3 bg-black/15" />

                  {/* pearl border */}
                  <div className="absolute inset-x-5 top-[33px] flex justify-between">
                    {Array.from({ length: 9 }).map((_, index) => (
                      <span
                        key={`lower-pearl-${index}`}
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor:
                            index % 2 ? `${theme.accent}cc` : `${theme.secondary}cc`,
                          boxShadow: `0 0 8px ${theme.accent}35`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Lower-tier vertical detailing */}
                  {[14, 29, 50, 71, 86].map((left, index) => (
                    <span
                      key={`lower-ribbon-${index}`}
                      className="absolute bottom-0 h-12 w-px"
                      style={{
                        left: `${left}%`,
                        backgroundColor: `${theme.accent}20`,
                      }}
                    />
                  ))}

                  {/* Frosting drips */}
                  {[7, 20, 35, 52, 69, 84, 95].map((left, index) => (
                    <motion.span
                      key={`lower-drip-${index}`}
                      animate={{ height: [12, 18, 12] }}
                      transition={{
                        duration: 2.2 + index * 0.13,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute top-5 w-5 rounded-b-full"
                      style={{
                        left: `${left}%`,
                        backgroundColor: theme.accent,
                        boxShadow: `0 3px 7px ${theme.accent}35`,
                      }}
                    />
                  ))}
                </div>

                {/* Upper cake tier */}
                <div
                  className="absolute bottom-[150px] left-1/2 h-[80px] w-[225px] -translate-x-1/2 overflow-hidden rounded-[23px] border shadow-[0_18px_35px_rgba(0,0,0,0.35)] sm:w-[255px]"
                  style={{
                    borderColor: `${theme.accent}45`,
                    background: `linear-gradient(180deg, ${theme.primary}, ${theme.background})`,
                  }}
                >
                  <div
                    className="absolute inset-x-0 top-0 h-6"
                    style={{
                      background: `linear-gradient(180deg, ${theme.secondary}, ${theme.secondary}66)`,
                    }}
                  />

                  {/* Decorative piping */}
                  <div className="absolute left-4 right-4 top-7 flex justify-between">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <span
                        key={`upper-pearl-${index}`}
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: theme.accent,
                          boxShadow: `0 0 8px ${theme.accent}55`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Upper frosting */}
                  {[12, 30, 50, 70, 88].map((left, index) => (
                    <span
                      key={`upper-drip-${index}`}
                      className="absolute top-5 w-3 rounded-b-full"
                      style={{
                        left: `${left}%`,
                        height: index % 2 ? 15 : 11,
                        backgroundColor: theme.accent,
                      }}
                    />
                  ))}
                </div>

                {/* Cake topper */}
                <motion.div
                  animate={{
                    y: cakeBlown ? [0, 2, 0] : [0, -3, 0],
                    rotate: cakeBlown ? [0, -2, 2, 0] : [0, 1, -1, 0],
                  }}
                  transition={{ duration: 2.8, repeat: Infinity }}
                  className="absolute bottom-[212px] left-1/2 z-20 -translate-x-1/2"
                >
                  <div className="relative flex flex-col items-center">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-full border backdrop-blur-md"
                      style={{
                        borderColor: `${theme.accent}65`,
                        backgroundColor: `${theme.background}dd`,
                        boxShadow: `0 0 28px ${theme.accent}25, inset 0 1px 0 ${theme.accent}20`,
                      }}
                    >
                      <span
                        className="text-2xl"
                        style={{
                          color: theme.accent,
                          filter: `drop-shadow(0 0 8px ${theme.accent}66)`,
                        }}
                      >
                        {selectedCake.emoji}
                      </span>
                    </div>
                    <span
                      className="mt-2 text-[7px] uppercase tracking-[0.35em]"
                      style={{ color: `${theme.accent}70` }}
                    >
                      for you
                    </span>
                  </div>
                </motion.div>

                {/* Candles */}
                <div className="absolute left-1/2 top-0 z-30 flex -translate-x-1/2 items-end gap-5 sm:gap-7">
                  {[0, 1, 2, 3, 4].map((candle) => (
                    <motion.div
                      key={`candle-${candle}`}
                      initial={{ opacity: 0, y: -18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.55 + candle * 0.06,
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="relative h-[62px] w-[13px] overflow-visible rounded-t-full rounded-b-md border"
                      style={{
                        borderColor: `${theme.accent}45`,
                        background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary}, ${theme.primary})`,
                        boxShadow: `inset 1px 0 ${theme.accent}18, 0 8px 15px ${theme.primary}25`,
                      }}
                    >
                      <span
                        className="absolute inset-x-0 top-3 h-px"
                        style={{ backgroundColor: `${theme.accent}55` }}
                      />
                      <span
                        className="absolute inset-x-0 top-8 h-px"
                        style={{ backgroundColor: `${theme.accent}35` }}
                      />

                      {/* Wick */}
                      <span
                        className="absolute left-1/2 -top-2 h-3 w-px -translate-x-1/2"
                        style={{ backgroundColor: `${theme.accent}aa` }}
                      />

                      {cakeLit && !cakeBlown && (
                        <>
                          <motion.span
                            animate={{
                              scale: [0.82, 1.16, 0.88, 1],
                              y: [0, -3, 1, 0],
                              x: [0, 1, -1, 0],
                              rotate: [-2, 3, -1, 0],
                            }}
                            transition={{
                              duration: 0.62 + candle * 0.08,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="absolute -top-8 left-1/2 h-7 w-4 -translate-x-1/2 rounded-[55%_45%_55%_45%]"
                            style={{
                              background: `radial-gradient(circle at 50% 70%, #fff7cf 0 15%, ${theme.accent} 42%, ${theme.secondary} 100%)`,
                              boxShadow: `0 0 10px ${theme.accent}, 0 0 28px ${theme.accent}88`,
                            }}
                          />
                          <motion.span
                            animate={{ opacity: [0.15, 0.45, 0.15] }}
                            transition={{
                              duration: 1.1 + candle * 0.07,
                              repeat: Infinity,
                            }}
                            className="absolute -top-12 left-1/2 h-8 w-8 -translate-x-1/2 rounded-full blur-lg"
                            style={{ backgroundColor: theme.accent }}
                          />
                        </>
                      )}

                      {cakeBlown && (
                        <>
                          <motion.span
                            initial={{ opacity: 0, y: 0, scale: 0.4 }}
                            animate={{
                              opacity: [0, 0.5, 0],
                              y: -34,
                              x: candle % 2 ? 10 : -8,
                              scale: [0.4, 1.5, 1.9],
                            }}
                            transition={{
                              duration: 1.45,
                              delay: candle * 0.07,
                              ease: "easeOut",
                            }}
                            className="absolute -top-5 left-1/2 h-5 w-3 -translate-x-1/2 rounded-full bg-white/30 blur-sm"
                          />
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.22, 0], x: [0, 18, 30] }}
                            transition={{
                              duration: 1.5,
                              delay: candle * 0.05,
                            }}
                            className="absolute -top-1 left-1/2 h-px w-12 -translate-x-1/2 bg-white/40 blur-[1px]"
                          />
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Celebration sparkles while candles are glowing */}
                <AnimatePresence>
                  {cakeLit &&
                    !cakeBlown &&
                    Array.from({ length: 14 }).map((_, index) => (
                      <motion.span
                        key={`cake-spark-${index}`}
                        initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0.3, 1, 0.4],
                          x:
                            Math.cos((index / 14) * Math.PI * 2) *
                            (135 + index * 4),
                          y:
                            Math.sin((index / 14) * Math.PI * 2) *
                            (82 + index * 3),
                          rotate: 180,
                        }}
                        transition={{
                          duration: 1.7 + (index % 4) * 0.2,
                          delay: index * 0.07,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                        className="absolute left-1/2 top-[100px] text-sm"
                        style={{
                          color:
                            index % 2 ? theme.secondary : theme.accent,
                          textShadow: `0 0 10px ${theme.accent}88`,
                        }}
                      >
                        {index % 3 === 0 ? "✦" : "·"}
                      </motion.span>
                    ))}
                </AnimatePresence>
              </motion.div>

              {/* Selected cake label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mx-auto -mt-2 flex items-center justify-center gap-3"
              >
                <span
                  className="h-px w-8"
                  style={{ backgroundColor: `${theme.accent}30` }}
                />
                <span
                  className="text-[8px] uppercase tracking-[0.32em]"
                  style={{ color: `${theme.accent}70` }}
                >
                  {selectedCake.name}
                </span>
                <span
                  className="h-px w-8"
                  style={{ backgroundColor: `${theme.accent}30` }}
                />
              </motion.div>

              {/* Controls */}
              <div className="mx-auto mt-5 min-h-[106px]">
                <AnimatePresence mode="wait">
                  {!cakeLit && (
                    <motion.button
                      key="light"
                      type="button"
                      initial={{ opacity: 0, y: 15, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -15, scale: 0.96 }}
                      whileHover={{ scale: 1.045, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={lightCake}
                      className="rounded-full border px-7 py-3.5 text-sm shadow-[0_15px_45px_rgba(0,0,0,0.22)] backdrop-blur-md transition"
                      style={{
                        borderColor: `${theme.accent}50`,
                        backgroundColor: `${theme.accent}12`,
                        color: theme.accent,
                        boxShadow: `0 12px 40px ${theme.primary}25, inset 0 1px 0 ${theme.accent}18`,
                      }}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Flame size={15} />
                        Light the candles
                      </span>
                    </motion.button>
                  )}

                  {cakeLit && !cakeBlown && (
                    <motion.button
                      key="blow"
                      type="button"
                      initial={{ opacity: 0, y: 15, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      whileHover={{ scale: 1.045, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={blowCake}
                      className="rounded-full border px-7 py-3.5 text-sm shadow-[0_15px_45px_rgba(0,0,0,0.22)] backdrop-blur-md transition"
                      style={{
                        borderColor: `${theme.secondary}60`,
                        backgroundColor: `${theme.secondary}12`,
                        color: theme.secondary,
                        boxShadow: `0 12px 40px ${theme.primary}25`,
                      }}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Wind size={15} />
                        Make your wish & blow
                      </span>
                    </motion.button>
                  )}

                  {cakeBlown && (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center"
                    >
                      <motion.div
                        initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
                        animate={{
                          scale: [0.7, 1.08, 1],
                          opacity: 1,
                          rotate: 0,
                        }}
                        transition={{ duration: 0.7 }}
                        className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border"
                        style={{
                          borderColor: `${theme.accent}40`,
                          color: theme.accent,
                          backgroundColor: `${theme.accent}0c`,
                          boxShadow: `0 0 30px ${theme.accent}18`,
                        }}
                      >
                        ✓
                      </motion.div>

                      <p
                        className="text-sm"
                        style={{ color: theme.accent }}
                      >
                        Wish made. May it come true. ✨
                      </p>

                      <p className="mt-1 text-[9px] uppercase tracking-[0.28em] text-white/25">
                        The celebration continues
                      </p>

                      <motion.button
                        type="button"
                        onClick={nextStage}
                        whileHover={{ scale: 1.035, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        className="mt-5 rounded-full border px-7 py-3 text-sm backdrop-blur-md transition"
                        style={{
                          borderColor: `${theme.accent}40`,
                          backgroundColor: `${theme.accent}10`,
                          color: theme.accent,
                        }}
                      >
                        There's another surprise →
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-[0.35em] text-white/20">
              Make a wish · WishVerse
            </p>
          </motion.section>
        )}

        {/* STAGE 4 — ROYAL NOTES */}
        {/* ================================================= */}

        {stage === 4 && (
          <motion.section
            key="stage-4"
            variants={stageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-20 text-center sm:px-6"
          >
            {/* ================================================= */}
            {/* ROYAL NOTE ATMOSPHERE */}
            {/* ================================================= */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <motion.div
                animate={{
                  scale: [1, 1.16, 1],
                  opacity: [0.08, 0.2, 0.08],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-1/2 top-[28%] h-[620px] w-[620px] -translate-x-1/2 rounded-full blur-[170px]"
                style={{ backgroundColor: theme.primary }}
              />

              <motion.div
                animate={{
                  x: ["-8%", "8%", "-8%"],
                  y: ["4%", "-4%", "4%"],
                  opacity: [0.02, 0.07, 0.02],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-1/2 top-[55%] h-[360px] w-[360px] -translate-x-1/2 rounded-full blur-[130px]"
                style={{ backgroundColor: theme.secondary }}
              />

              {/* Fine floating dust */}
              {Array.from({ length: 28 }).map((_, index) => (
                <motion.span
                  key={`note-dust-${index}`}
                  initial={{
                    opacity: 0,
                    y: "108vh",
                    x: `${(index * 29) % 100}%`,
                    scale: 0.5 + (index % 3) * 0.25,
                  }}
                  animate={{
                    opacity: [0, index % 5 === 0 ? 0.7 : 0.25, 0],
                    y: "-12vh",
                    x: `${((index * 29 + 13) % 100)}%`,
                    rotate: index % 2 ? 180 : -180,
                  }}
                  transition={{
                    duration: 8 + (index % 5),
                    delay: index * 0.18,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute h-1 w-1 rounded-full"
                  style={{
                    backgroundColor: index % 3 === 0 ? theme.accent : theme.secondary,
                    boxShadow: `0 0 10px ${theme.accent}55`,
                  }}
                />
              ))}

              {/* Slow drifting petals */}
              {Array.from({ length: 9 }).map((_, index) => (
                <motion.span
                  key={`note-petal-${index}`}
                  initial={{
                    opacity: 0,
                    x: `${8 + index * 11}%`,
                    y: "-8vh",
                    rotate: index * 24,
                  }}
                  animate={{
                    opacity: [0, 0.38, 0],
                    x: `${4 + ((index * 13) % 92)}%`,
                    y: "112vh",
                    rotate: index * 24 + 240,
                  }}
                  transition={{
                    duration: 13 + (index % 4),
                    delay: index * 1.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute h-3 w-2 rounded-full"
                  style={{
                    backgroundColor: `${theme.secondary}70`,
                    boxShadow: `0 0 14px ${theme.secondary}25`,
                  }}
                />
              ))}
            </div>

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 mb-10 sm:mb-12"
            >
              <div
                className="mb-4 flex items-center justify-center gap-3 text-[9px] uppercase tracking-[0.5em]"
                style={{ color: `${theme.accent}a0` }}
              >
                <span
                  className="h-px w-10"
                  style={{ backgroundColor: `${theme.accent}45` }}
                />
                Sealed with love
                <span
                  className="h-px w-10"
                  style={{ backgroundColor: `${theme.accent}45` }}
                />
              </div>

              <h2 className="text-4xl font-light tracking-tight sm:text-5xl">
                A few words,
                <span
                  className="block italic"
                  style={{ color: theme.secondary }}
                >
                  kept just for you.
                </span>
              </h2>

              <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/35">
                Each little envelope holds something someone wanted you to know.
                Open them slowly.
              </p>
            </motion.div>

            {/* ================================================= */}
            {/* SEALED NOTES */}
            {/* ================================================= */}
            <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {royalNotes.length > 0 ? (
                royalNotes.map((note, index) => {
                  const isActive = activeNote === index;
                  const rotations = [-2.5, 1.8, -1.2, 2.2, -1.7];
                  const rotation = rotations[index % rotations.length];

                  return (
                    <motion.button
                      key={`${index}-${note}`}
                      type="button"
                      aria-label={
                        isActive
                          ? `Close note ${index + 1}`
                          : `Open note ${index + 1}`
                      }
                      onClick={() =>
                        setActiveNote(isActive ? null : index)
                      }
                      initial={{
                        opacity: 0,
                        y: 50,
                        rotate: rotation,
                        scale: 0.96,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        rotate: isActive ? 0 : rotation,
                        scale: isActive ? 1.025 : 1,
                      }}
                      whileHover={{
                        y: -8,
                        rotate: 0,
                        scale: isActive ? 1.025 : 1.02,
                      }}
                      whileTap={{ scale: 0.985 }}
                      transition={{
                        delay: 0.12 + index * 0.1,
                        duration: 0.72,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="group relative mx-auto h-[275px] w-full max-w-[330px] text-left outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
                      style={{
                        perspective: "1400px",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {/* Outer shadow / halo */}
                      <motion.div
                        animate={{
                          opacity: isActive ? 0.9 : 0.35,
                          scale: isActive ? 1.03 : 1,
                        }}
                        className="absolute -inset-3 rounded-[28px] blur-2xl"
                        style={{ backgroundColor: `${theme.primary}55` }}
                      />

                      {/* Paper body */}
                      <div
                        className="relative h-full overflow-hidden rounded-[24px] border backdrop-blur-xl"
                        style={{
                          borderColor: `${theme.accent}${isActive ? "55" : "25"}`,
                          background: `linear-gradient(145deg, ${theme.primary}55, ${theme.background}ee 72%)`,
                          boxShadow: isActive
                            ? `0 35px 100px ${theme.primary}65, inset 0 1px 0 ${theme.accent}25`
                            : `0 24px 70px ${theme.primary}40, inset 0 1px 0 ${theme.accent}15`,
                        }}
                      >
                        {/* Paper grain */}
                        <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
                          <div
                            className="absolute inset-0"
                            style={{
                              backgroundImage: `radial-gradient(${theme.accent} 0.65px, transparent 0.65px)`,
                              backgroundSize: "8px 8px",
                            }}
                          />
                        </div>

                        {/* Decorative frame */}
                        <div
                          className="absolute inset-3 rounded-[19px] border"
                          style={{ borderColor: `${theme.accent}12` }}
                        />
                        <div
                          className="absolute left-5 top-5 h-7 w-7 border-l border-t"
                          style={{ borderColor: `${theme.accent}45` }}
                        />
                        <div
                          className="absolute bottom-5 right-5 h-7 w-7 border-b border-r"
                          style={{ borderColor: `${theme.accent}45` }}
                        />

                        {/* Wax seal */}
                        <motion.div
                          animate={{
                            scale: isActive ? 0.88 : [1, 1.04, 1],
                            rotate: isActive ? -4 : [0, 2, -2, 0],
                          }}
                          transition={{
                            duration: isActive ? 0.35 : 3.5,
                            repeat: isActive ? 0 : Infinity,
                            ease: "easeInOut",
                          }}
                          className="absolute left-1/2 top-[50px] flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full border shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
                          style={{
                            borderColor: `${theme.accent}55`,
                            background: `radial-gradient(circle at 35% 30%, ${theme.secondary}, ${theme.primary} 68%, ${theme.background})`,
                            color: theme.accent,
                            boxShadow: `0 0 28px ${theme.primary}45, inset 0 1px 0 ${theme.accent}35`,
                          }}
                        >
                          <Heart size={21} fill="currentColor" strokeWidth={1.2} />
                        </motion.div>

                        {/* Note number */}
                        <div className="absolute left-0 right-0 top-[132px] text-center">
                          <span
                            className="text-[9px] uppercase tracking-[0.42em]"
                            style={{ color: `${theme.accent}95` }}
                          >
                            Note {String(index + 1).padStart(2, "0")}
                          </span>

                          <p className="mt-3 text-sm text-white/55">
                            {isActive ? "Sealed open" : "Tap to reveal"}
                          </p>
                        </div>

                        {/* Bottom signature */}
                        <div className="absolute bottom-7 left-0 right-0 flex items-center justify-center gap-3">
                          <span
                            className="h-px w-8"
                            style={{ backgroundColor: `${theme.accent}30` }}
                          />
                          <span
                            className="text-[8px] uppercase tracking-[0.3em]"
                            style={{ color: `${theme.secondary}75` }}
                          >
                            With love
                          </span>
                          <span
                            className="h-px w-8"
                            style={{ backgroundColor: `${theme.accent}30` }}
                          />
                        </div>

                        {/* Active sheen */}
                        <motion.div
                          animate={{
                            x: isActive ? ["-120%", "120%"] : "-120%",
                          }}
                          transition={{
                            duration: 1.1,
                            ease: "easeInOut",
                          }}
                          className="pointer-events-none absolute inset-y-0 w-1/3 skew-x-[-18deg] bg-white/[0.05] blur-md"
                        />
                      </div>
                    </motion.button>
                  );
                })
              ) : (
                <div className="col-span-full mx-auto rounded-[24px] border px-10 py-14 text-sm text-white/40 backdrop-blur-xl"
                  style={{
                    borderColor: `${theme.accent}20`,
                    backgroundColor: `${theme.primary}20`,
                  }}
                >
                  Some beautiful words are waiting for you.
                </div>
              )}
            </div>

            {/* ================================================= */}
            {/* NOTE STATUS */}
            {/* ================================================= */}
            {royalNotes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="relative z-10 mt-8 flex flex-col items-center"
              >
                <div className="flex items-center justify-center gap-2">
                  {royalNotes.map((_, index) => (
                    <motion.span
                      key={`note-progress-${index}`}
                      animate={{
                        width: activeNote === index ? 28 : 5,
                        opacity: activeNote === index ? 1 : 0.3,
                      }}
                      transition={{ duration: 0.35 }}
                      className="h-1 rounded-full"
                      style={{ backgroundColor: theme.accent }}
                    />
                  ))}
                </div>

                <p className="mt-3 text-[9px] uppercase tracking-[0.32em] text-white/25">
                  {activeNote !== null
                    ? `Note ${activeNote + 1} of ${royalNotes.length}`
                    : "Choose a sealed note"}
                </p>
              </motion.div>
            )}

            {/* ================================================= */}
            {/* REVEALED MESSAGE */}
            {/* ================================================= */}
            <AnimatePresence mode="wait">
              {activeNote !== null && royalNotes[activeNote] && (
                <motion.div
                  key={activeNote}
                  initial={{ opacity: 0, y: 24, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -18, scale: 0.98 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10 mt-8 w-full max-w-2xl"
                >
                  <div
                    className="relative overflow-hidden rounded-[24px] border px-7 py-7 text-left backdrop-blur-xl sm:px-10 sm:py-8"
                    style={{
                      borderColor: `${theme.accent}25`,
                      background: `linear-gradient(135deg, ${theme.primary}38, ${theme.background}d9)`,
                      boxShadow: `0 25px 80px ${theme.primary}35, inset 0 1px 0 ${theme.accent}15`,
                    }}
                  >
                    <div
                      className="absolute left-1/2 top-0 h-px w-28 -translate-x-1/2"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${theme.accent}80, transparent)`,
                      }}
                    />

                    <div className="flex items-center gap-3">
                      <Heart
                        size={14}
                        fill="currentColor"
                        strokeWidth={1.4}
                        style={{ color: theme.accent }}
                      />
                      <span
                        className="text-[9px] uppercase tracking-[0.35em]"
                        style={{ color: `${theme.accent}90` }}
                      >
                        For {wish.recipient_name}
                      </span>
                    </div>

                    <p className="mt-5 text-[15px] leading-8 text-white/75 sm:text-base">
                      {royalNotes[activeNote]}
                    </p>

                    <div className="mt-6 flex items-center gap-2">
                      <span
                        className="h-px w-8"
                        style={{ backgroundColor: `${theme.accent}45` }}
                      />
                      <span className="text-[9px] uppercase tracking-[0.3em] text-white/25">
                        A little piece of love
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Continue */}
            <AnimatePresence>
              {activeNote !== null && (
                <motion.button
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 18 }}
                  transition={{ delay: 0.12, duration: 0.55 }}
                  type="button"
                  onClick={nextStage}
                  whileHover={{ scale: 1.035, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative z-10 mt-8 inline-flex items-center gap-2 rounded-full border px-7 py-3 text-sm transition"
                  style={{
                    borderColor: `${theme.accent}40`,
                    backgroundColor: `${theme.accent}10`,
                    color: theme.accent,
                    boxShadow: `0 12px 35px ${theme.primary}25`,
                  }}
                >
                  There's someone waiting for you
                  <ArrowRight size={15} />
                </motion.button>
              )}
            </AnimatePresence>

            <p className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-[0.35em] text-white/20">
              A little love, sealed in words · WishVerse
            </p>
          </motion.section>
        )}

{/* ========================================================= */}
{/* STAGE 5 — BUBU / DUDU KISS                               */}
{/* ========================================================= */}

{stage === 5 && (
  <motion.section
    key="stage-5"
    variants={stageVariants}
    initial={false}
    animate="animate"
    exit="exit"
    className="relative flex min-h-screen flex-col items-center overflow-hidden px-5 pb-20 pt-28 text-center sm:px-8"
  >
    {/* ===================================================== */}
    {/* DREAMY BACKGROUND                                      */}
    {/* ===================================================== */}

    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Main glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.12, 0.2, 0.12],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-[42%] h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px]"
        style={{
          backgroundColor: theme.primary,
        }}
      />

      {/* Secondary glow */}
      <motion.div
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
          opacity: [0.04, 0.1, 0.04],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[-150px] top-[10%] h-[350px] w-[350px] rounded-full blur-[130px]"
        style={{
          backgroundColor: theme.secondary,
        }}
      />

      {/* Floating stars */}
      {Array.from({ length: 35 }).map((_, index) => (
        <motion.span
          key={index}
          initial={{
            opacity: 0,
            y: "110vh",
            x: `${(index * 29) % 100}%`,
          }}
          animate={{
            opacity: [0, 0.3, 0],
            y: "-10vh",
            x: `${((index * 29 + 17) % 100)}%`,
          }}
          transition={{
            duration: 7 + (index % 5),
            delay: index * 0.12,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute h-1 w-1 rounded-full"
          style={{
            backgroundColor: theme.accent,
          }}
        />
      ))}

      {/* Orbit rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-1/2 top-[48%] h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full border"
        style={{
          borderColor: `${theme.secondary}12`,
        }}
      />

      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          duration: 38,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-1/2 top-[48%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border"
        style={{
          borderColor: `${theme.accent}08`,
        }}
      />
    </div>

    {/* ===================================================== */}
    {/* CONTENT                                                */}
    {/* ===================================================== */}

    <div className="relative z-10 flex w-full max-w-xl flex-col items-center">

      {/* Small heading */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-4"
      >
        <div
          className="text-[10px] uppercase tracking-[0.5em]"
          style={{
            color: `${theme.accent}aa`,
          }}
        >
          A tiny surprise
        </div>
      </motion.div>

      {/* Main heading */}
      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.08,
        }}
        className="text-3xl font-light leading-tight sm:text-5xl"
      >
        {selectedCharacter.name}

        <span
          className="mt-2 block italic"
          style={{
            color: theme.secondary,
          }}
        >
          has a kiss for you.
        </span>
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.2,
        }}
        className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/40"
      >
        {selectedCharacter.description}
      </motion.p>

      {/* =================================================== */}
      {/* CHARACTER AREA                                      */}
      {/* =================================================== */}

      <div className="relative mt-12 flex h-[390px] w-full items-center justify-center">

        {/* Character glow */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.12, 0.2, 0.12],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute h-64 w-64 rounded-full blur-[80px]"
          style={{
            backgroundColor: theme.secondary,
          }}
        />

        {/* Kiss burst whenever kissCount changes */}
        <AnimatePresence>
          {kissCount > 0 && (
            <motion.div
              key={`kiss-burst-${kissCount}`}
              initial={{
                scale: 0.4,
                opacity: 0,
              }}
              animate={{
                scale: [0.4, 1.2, 1],
                opacity: [0, 1, 0],
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="pointer-events-none absolute z-30"
            >
              <div
                className="flex h-24 w-24 items-center justify-center rounded-full border"
                style={{
                  borderColor: `${theme.secondary}55`,
                  backgroundColor: `${theme.secondary}12`,
                  boxShadow: `0 0 70px ${theme.secondary}35`,
                }}
              >
                <span className="text-5xl">💋</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Heart explosion */}
        <AnimatePresence>
          {kissCount > 0 && (
            <motion.div
              key={`hearts-${kissCount}`}
              className="pointer-events-none absolute inset-0 z-20"
            >
              {[
                { x: -110, y: -80, delay: 0 },
                { x: 100, y: -100, delay: 0.08 },
                { x: -130, y: 10, delay: 0.15 },
                { x: 130, y: 20, delay: 0.22 },
                { x: -70, y: 100, delay: 0.12 },
                { x: 80, y: 110, delay: 0.2 },
              ].map((heart, index) => (
                <motion.span
                  key={index}
                  initial={{
                    opacity: 0,
                    scale: 0.3,
                    x: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.3, 1, 0.8],
                    x: heart.x,
                    y: heart.y,
                  }}
                  transition={{
                    duration: 1.1,
                    delay: heart.delay,
                    ease: "easeOut",
                  }}
                  className="absolute left-1/2 top-1/2 text-xl"
                  style={{
                    color: theme.secondary,
                  }}
                >
                  ♥
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================================================= */}
        {/* CHARACTER BUTTON                                  */}
        {/* ================================================= */}

        <motion.button
          type="button"
          onClick={handleKiss}
          aria-label={`Give ${selectedCharacter.name} a kiss`}
          whileHover={{
            scale: 1.025,
          }}
          whileTap={{
            scale: 0.96,
          }}
          className="group relative z-10 flex h-[300px] w-[280px] items-center justify-center rounded-[40px] border outline-none backdrop-blur-xl"
          style={{
            borderColor: `${theme.secondary}20`,
            backgroundColor: `${theme.secondary}08`,
            boxShadow: `0 30px 100px ${theme.primary}25`,
          }}
        >
          {/* Character idle animation */}
          <motion.div
            key={kissCount}
            initial={
              kissCount > 0
                ? {
                    scale: 1,
                    y: 0,
                    rotate: 0,
                  }
                : false
            }
            animate={
              kissCount > 0
                ? {
                    scale: [1, 1.04, 1.09, 1.03, 1],
                    y: [0, -5, -12, -5, 0],
                    rotate: [0, -1.5, 1.5, -0.8, 0],
                  }
                : {
                    y: [0, -7, 0],
                    rotate: [-0.5, 0.5, -0.5],
                  }
            }
            transition={
              kissCount > 0
                ? {
                    duration: 0.9,
                    ease: [0.22, 1, 0.36, 1],
                  }
                : {
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
            className="relative flex h-full w-full items-center justify-center"
          >
            {/* Character image */}
            <img
              src={
                wish.recipient_gender === "female"
                  ? "/characters/dudu-real.png"
                  : "/characters/bubu-real.png"
              }
              alt={selectedCharacter.name}
              className="max-h-[260px] max-w-[235px] select-none object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.45)]"
              draggable={false}
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />

            {/* Emoji fallback */}
            <span className="absolute text-7xl opacity-0">
              {wish.recipient_gender === "female" ? "🤎" : "🤍"}
            </span>

            {/* Kiss emoji directly above character */}
            <AnimatePresence>
              {kissCount > 0 && (
                <motion.div
                  key={`lip-${kissCount}`}
                  initial={{
                    opacity: 0,
                    scale: 0.3,
                    y: 20,
                  }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0.3, 1.25, 1, 0.8],
                    y: [20, -20, -45, -75],
                    x: [0, 4, -4, 8],
                  }}
                  transition={{
                    duration: 1.15,
                    ease: "easeOut",
                  }}
                  className="pointer-events-none absolute left-1/2 top-[20%] -translate-x-1/2 text-4xl"
                >
                  💋
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Tap indicator */}
          <motion.div
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [0.95, 1, 0.95],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border px-4 py-1.5 text-[9px] uppercase tracking-[0.25em]"
            style={{
              borderColor: `${theme.secondary}25`,
              backgroundColor: `${theme.secondary}0c`,
              color: `${theme.secondary}cc`,
            }}
          >
            Tap for a kiss
          </motion.div>
        </motion.button>
      </div>

      {/* =================================================== */}
      {/* CHARACTER NAME                                      */}
      {/* =================================================== */}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.35,
        }}
        className="mt-1"
      >
        <div
          className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs"
          style={{
            borderColor: `${theme.secondary}25`,
            backgroundColor: `${theme.secondary}08`,
            color: theme.secondary,
          }}
        >
          <span>
            {wish.recipient_gender === "female" ? "🤎" : "🤍"}
          </span>

          <span>
            {selectedCharacter.name}
          </span>

          <span>♥</span>
        </div>
      </motion.div>

      {/* =================================================== */}
      {/* KISS COUNTER                                        */}
      {/* =================================================== */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 0.5,
        }}
        className="mt-5 text-xs text-white/30"
      >
        {kissCount === 0
          ? "Someone is waiting for a little kiss..."
          : kissCount < 3
            ? `${3 - kissCount} more tiny kiss${3 - kissCount === 1 ? "" : "es"} ♥`
            : "All the kisses have arrived ♥"}
      </motion.div>

      {/* Kiss progress */}
      <div className="mt-4 flex items-center gap-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            animate={{
              scale:
                kissCount > index
                  ? [1, 1.25, 1]
                  : 1,
            }}
            transition={{
              duration: 0.35,
            }}
            className="h-1.5 w-7 rounded-full"
            style={{
              backgroundColor:
                kissCount > index
                  ? theme.secondary
                  : `${theme.secondary}18`,
            }}
          />
        ))}
      </div>

      {/* =================================================== */}
      {/* COMPLETION                                          */}
      {/* =================================================== */}

      <AnimatePresence>
        {kissCount >= 3 && (
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-8 w-full max-w-md"
          >
            {/* Celebration icon */}
            <motion.div
              initial={{
                scale: 0.6,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                delay: 0.1,
              }}
              className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border"
              style={{
                borderColor: `${theme.secondary}30`,
                backgroundColor: `${theme.secondary}10`,
              }}
            >
              <Heart
                size={17}
                fill="currentColor"
                style={{
                  color: theme.secondary,
                }}
              />
            </motion.div>

            <p className="mb-4 text-xs text-white/40">
              Three tiny kisses delivered with extra love. ♥
            </p>

            <motion.button
              type="button"
              onClick={nextStage}
              whileHover={{
                scale: 1.035,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="rounded-full border px-7 py-3 text-sm transition"
              style={{
                borderColor: `${theme.secondary}40`,
                backgroundColor: `${theme.secondary}10`,
                color: theme.secondary,
              }}
            >
              One last memory awaits →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {/* Footer */}
    <p className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-[0.35em] text-white/20">
      Real Bubu & Dudu · WishVerse
    </p>
  </motion.section>
)}

        {/* STAGE 6 — MEMORIES */}
        {/* ================================================= */}

        {stage === 6 && (
          <motion.section
            key="stage-6"
            variants={stageVariants}
            initial={false}
            animate="animate"
            exit="exit"
            className="relative flex min-h-screen flex-col items-center overflow-hidden px-5 pb-20 pt-32 text-center sm:px-8"
          >
            {/* Cinematic atmosphere */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <motion.div
                animate={{
                  scale: [1, 1.18, 1],
                  opacity: [0.08, 0.18, 0.08],
                }}
                transition={{
                  duration: 9,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-1/2 top-[42%] h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[170px]"
                style={{ backgroundColor: theme.primary }}
              />

              <motion.div
                animate={{
                  x: [0, 50, 0],
                  y: [0, -30, 0],
                  opacity: [0.03, 0.08, 0.03],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute right-[-120px] top-[15%] h-[300px] w-[300px] rounded-full blur-[130px]"
                style={{ backgroundColor: theme.secondary }}
              />

              {Array.from({ length: 30 }).map((_, index) => (
                <motion.span
                  key={index}
                  initial={{
                    opacity: 0,
                    y: "105vh",
                    x: `${(index * 31) % 100}%`,
                  }}
                  animate={{
                    opacity: [0, 0.25, 0],
                    y: "-10vh",
                    x: `${((index * 31 + 13) % 100)}%`,
                  }}
                  transition={{
                    duration: 8 + (index % 5),
                    delay: index * 0.13,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute h-1 w-1 rounded-full"
                  style={{ backgroundColor: theme.accent }}
                />
              ))}
            </div>

            <div className="relative z-10 w-full max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75 }}
                className="mx-auto max-w-2xl text-center"
              >
                <div
                  className="mb-4 text-[10px] uppercase tracking-[0.48em]"
                  style={{ color: `${theme.accent}99` }}
                >
                  Little pieces of time
                </div>

                <h2 className="text-3xl font-light leading-tight sm:text-5xl">
                  Moments that
                  <span
                    className="block italic"
                    style={{ color: theme.secondary }}
                  >
                    stayed with us.
                  </span>
                </h2>

                <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/35">
                  Every photo holds a little piece of a story.
                  These are the moments {wish.creator_name} chose to keep for you.
                </p>
              </motion.div>

              {memories.length > 0 ? (
                <div className="mt-10">
                  <div className="relative mx-auto flex w-full max-w-6xl items-center justify-center">
                    {memories.length > 1 && (
                      <motion.button
                        type="button"
                        onClick={previousMemory}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        className="absolute left-0 z-30 hidden h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white/60 backdrop-blur-xl transition hover:border-white/20 hover:text-white sm:flex"
                        aria-label="Previous memory"
                      >
                        <ChevronLeft size={18} />
                      </motion.button>
                    )}

                    <AnimatePresence mode="wait" initial={false}>
                      <motion.article
                        key={memories[memoryIndex].id}
                        initial={{
                          opacity: 1,
                          scale: 1,
                          y: 0,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.985,
                          y: -12,
                        }}
                        transition={{
                          duration: 0.62,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="w-full"
                      >
                        <div
                          className="mx-auto inline-block max-w-[92vw] overflow-hidden rounded-[30px] p-2 text-left shadow-[0_40px_120px_rgba(0,0,0,0.55)]"
                          style={{
                            border: `1px solid ${theme.accent}25`,
                            backgroundColor: `${theme.background}e8`,
                          }}
                        >
                          {/*
                            The image itself defines the panel dimensions.
                            No fixed aspect ratio and no object-cover are used,
                            so portrait, landscape, square, and tall images
                            remain completely visible without edge cropping.
                          */}
                          <div className="relative max-w-[90vw] overflow-hidden rounded-[24px] bg-black/20">
                            <img
                              src={memories[memoryIndex].imageUrl}
                              alt={
                                memories[memoryIndex].caption ||
                                `Memory ${memoryIndex + 1}`
                              }
                              className="block h-auto max-h-[68vh] w-auto max-w-[88vw] object-contain"
                              loading={memoryIndex === 0 ? "eager" : "lazy"}
                              fetchPriority={memoryIndex === 0 ? "high" : "auto"}
                              decoding="async"
                              draggable={false}
                            />

                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-black/10" />

                            <div
                              className="absolute left-5 top-5 rounded-full border px-3 py-1.5 text-[9px] uppercase tracking-[0.24em] backdrop-blur-xl"
                              style={{
                                borderColor: `${theme.accent}30`,
                                backgroundColor: `${theme.background}85`,
                                color: `${theme.accent}cc`,
                              }}
                            >
                              Memory {String(memoryIndex + 1).padStart(2, "0")} /{" "}
                              {String(memories.length).padStart(2, "0")}
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-6 text-left sm:p-8">
                              <div className="mb-3 flex items-center gap-2">
                                <Sparkles
                                  size={13}
                                  style={{ color: theme.accent }}
                                />
                                <span className="text-[9px] uppercase tracking-[0.32em] text-white/35">
                                  A moment worth keeping
                                </span>
                              </div>

                              {memories[memoryIndex].caption ? (
                                <motion.p
                                  key={memories[memoryIndex].caption}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="max-w-2xl text-base leading-7 text-white/90 sm:text-xl"
                                >
                                  {memories[memoryIndex].caption}
                                </motion.p>
                              ) : (
                                <p className="text-sm text-white/45">
                                  A memory from {wish.creator_name}.
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between px-3 pb-2 pt-4 sm:px-5">
                            <span className="text-[9px] uppercase tracking-[0.3em] text-white/20">
                              Kept forever · WishVerse
                            </span>

                            <span
                              className="text-sm"
                              style={{ color: `${theme.accent}99` }}
                            >
                              ♡
                            </span>
                          </div>
                        </div>
                      </motion.article>
                    </AnimatePresence>

                    {memories.length > 1 && (
                      <motion.button
                        type="button"
                        onClick={nextMemory}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        className="absolute right-0 z-30 hidden h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white/60 backdrop-blur-xl transition hover:border-white/20 hover:text-white sm:flex"
                        aria-label="Next memory"
                      >
                        <ChevronRight size={18} />
                      </motion.button>
                    )}
                  </div>

                  {/* 6-second slideshow progress */}
                  {memories.length > 1 && (
                    <div className="mx-auto mt-5 w-full max-w-2xl">
                      <div className="h-px overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          key={memoryIndex}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{
                            duration: 6,
                            ease: "linear",
                          }}
                          className="h-full origin-left"
                          style={{
                            backgroundColor: theme.accent,
                          }}
                        />
                      </div>

                      <div className="mt-2 flex items-center justify-between px-1">
                        <span className="text-[8px] uppercase tracking-[0.28em] text-white/20">
                          Auto slideshow
                        </span>
                        <span className="text-[8px] uppercase tracking-[0.22em] text-white/20">
                          Next memory in 6s
                        </span>
                      </div>
                    </div>
                  )}

                  {memories.length > 1 && (
                    <div className="mx-auto mt-6 w-full max-w-5xl">
                      <div className="flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {memories.map((memory, index) => (
                          <button
                            key={memory.id}
                            type="button"
                            onClick={() => setMemoryIndex(index)}
                            aria-label={`Open memory ${index + 1}`}
                            className="group relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border transition sm:h-20 sm:w-28"
                            style={{
                              borderColor:
                                memoryIndex === index
                                  ? `${theme.accent}cc`
                                  : `${theme.accent}18`,
                              opacity: memoryIndex === index ? 1 : 0.52,
                              boxShadow:
                                memoryIndex === index
                                  ? `0 0 24px ${theme.accent}22`
                                  : "none",
                            }}
                          >
                            <img
                              src={memory.imageUrl}
                              alt=""
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                            <span className="absolute inset-0 bg-black/20" />
                            <span className="absolute bottom-1.5 left-2 text-[8px] uppercase tracking-[0.15em] text-white/75">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {memories.length > 1 && (
                    <div className="mt-4 flex items-center justify-center gap-2 sm:hidden">
                      <button
                        type="button"
                        onClick={previousMemory}
                        className="rounded-full border border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-white/50"
                      >
                        Previous
                      </button>
                      <span className="text-[10px] text-white/25">
                        {memoryIndex + 1} / {memories.length}
                      </span>
                      <button
                        type="button"
                        onClick={nextMemory}
                        className="rounded-full border border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-white/50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative z-10 mx-auto mt-12 max-w-md rounded-3xl border border-white/10 bg-white/[0.03] px-10 py-14"
                >
                  <div
                    className="text-5xl"
                    style={{ color: theme.secondary }}
                  >
                    ♡
                  </div>

                  <p className="mt-5 text-sm leading-6 text-white/45">
                    Some memories are worth keeping forever.
                  </p>
                </motion.div>
              )}

              {memories.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-8 text-[9px] uppercase tracking-[0.35em] text-white/20"
                >
                  {memories.length === 1
                    ? "One memory, kept forever"
                    : `${memories.length} memories · on repeat`}
                </motion.div>
              )}

              <motion.button
                type="button"
                onClick={nextStage}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mx-auto mt-9 flex items-center gap-2 rounded-full border px-6 py-3 text-xs uppercase tracking-[0.18em] transition"
                style={{
                  borderColor: `${theme.accent}35`,
                  backgroundColor: `${theme.accent}0c`,
                  color: `${theme.accent}cc`,
                }}
              >
                Read something I never said <ArrowRight size={14} />
              </motion.button>
            </div>

            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-[0.35em] text-white/20">
              Memories become stories · WishVerse
            </p>
          </motion.section>
        )}

        {/* STAGE 7 — SECRET LETTER */}
        {/* ================================================= */}

        {stage === 7 && (
          <motion.section
            key="stage-7"
            variants={stageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-16 text-center"
          >
            {/* Deep cinematic atmosphere */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <motion.div
                animate={{
                  scale: [1, 1.22, 1],
                  opacity: [0.08, 0.18, 0.08],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[190px]"
                style={{ backgroundColor: theme.primary }}
              />

              <motion.div
                animate={{
                  x: [0, 45, 0],
                  y: [0, -35, 0],
                  opacity: [0.02, 0.08, 0.02],
                }}
                transition={{
                  duration: 13,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-[-120px] top-[18%] h-[320px] w-[320px] rounded-full blur-[140px]"
                style={{ backgroundColor: theme.secondary }}
              />

              {Array.from({ length: 42 }).map((_, index) => (
                <motion.span
                  key={index}
                  initial={{
                    opacity: 0,
                    y: `${85 + (index % 15)}vh`,
                    x: `${(index * 37) % 100}%`,
                  }}
                  animate={{
                    opacity: [0, 0.55, 0],
                    y: "-8vh",
                    x: `${((index * 37 + 17) % 100)}%`,
                  }}
                  transition={{
                    duration: 10 + (index % 6),
                    delay: index * 0.16,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute h-[2px] w-[2px] rounded-full"
                  style={{ backgroundColor: theme.accent }}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {!letterOpen ? (
                <motion.div
                  key="letter-intro"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.7 }}
                  className="relative z-10 mb-9"
                >
                  <div
                    className="mb-4 text-[10px] uppercase tracking-[0.48em]"
                    style={{ color: `${theme.accent}99` }}
                  >
                    One final thing
                  </div>

                  <h2 className="text-3xl font-light leading-tight sm:text-5xl">
                    Some words
                    <span
                      className="block italic"
                      style={{ color: theme.secondary }}
                    >
                      were meant for you.
                    </span>
                  </h2>

                  <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/35">
                    Take a breath. There is one last message waiting behind
                    this seal.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="letter-opened-heading"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative z-10 mb-7"
                >
                  <div
                    className="text-[9px] uppercase tracking-[0.45em]"
                    style={{ color: `${theme.accent}88` }}
                  >
                    The final page
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              className="relative z-10 w-full max-w-2xl"
              style={{ perspective: "1600px" }}
            >
              <AnimatePresence mode="wait">
                {!letterOpen ? (
                  <motion.button
                    key="sealed-letter"
                    type="button"
                    onClick={() => setLetterOpen(true)}
                    initial={{
                      opacity: 0,
                      scale: 0.88,
                      y: 28,
                      rotateX: 7,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      rotateX: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      y: -18,
                      rotateX: -8,
                    }}
                    transition={{
                      duration: 0.9,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{
                      y: -7,
                      scale: 1.015,
                    }}
                    whileTap={{ scale: 0.975 }}
                    className="group relative mx-auto block h-[285px] w-[min(500px,88vw)] overflow-hidden rounded-[26px] text-left shadow-[0_45px_140px_rgba(0,0,0,0.62)] sm:h-[315px]"
                    style={{
                      border: `1px solid ${theme.accent}30`,
                      background: `linear-gradient(145deg, ${theme.primary}, ${theme.background} 70%)`,
                    }}
                  >
                    {/* Inner frame */}
                    <div
                      className="absolute inset-4 rounded-[20px] border"
                      style={{ borderColor: `${theme.accent}15` }}
                    />

                    {/* Envelope flap */}
                    <motion.div
                      animate={{
                        rotateX: [0, -3, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute left-0 right-0 top-0 h-[57%] origin-top"
                      style={{
                        clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                        background: `linear-gradient(145deg, ${theme.primary}, ${theme.background})`,
                        borderBottom: `1px solid ${theme.accent}20`,
                      }}
                    />

                    {/* Letter glow behind seal */}
                    <motion.div
                      animate={{
                        opacity: [0.15, 0.38, 0.15],
                        scale: [0.94, 1.06, 0.94],
                      }}
                      transition={{
                        duration: 3.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute left-1/2 top-[53%] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
                      style={{ backgroundColor: theme.accent }}
                    />

                    {/* Wax seal */}
                    <motion.div
                      animate={{
                        scale: [1, 1.045, 1],
                        boxShadow: [
                          `0 0 0 ${theme.accent}00`,
                          `0 0 38px ${theme.accent}35`,
                          `0 0 0 ${theme.accent}00`,
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute left-1/2 top-[53%] flex h-[76px] w-[76px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-2xl"
                      style={{
                        borderColor: `${theme.accent}65`,
                        background: `radial-gradient(circle at 35% 30%, ${theme.secondary}, ${theme.primary} 65%)`,
                        color: theme.accent,
                      }}
                    >
                      ♡
                    </motion.div>

                    <div className="absolute bottom-7 left-0 right-0 text-center">
                      <p
                        className="text-[9px] uppercase tracking-[0.42em]"
                        style={{ color: `${theme.accent}88` }}
                      >
                        Open the sealed letter
                      </p>
                      <p className="mt-2 text-[10px] text-white/25">
                        Tap gently
                      </p>
                    </div>
                  </motion.button>
                ) : (
                  <motion.div
                    key="opened-letter"
                    initial={{
                      opacity: 0,
                      y: 42,
                      scale: 0.95,
                      rotateX: -9,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      rotateX: 0,
                    }}
                    transition={{
                      duration: 1.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mx-auto w-[min(650px,94vw)]"
                  >
                    {/* Paper */}
                    <div
                      className="relative overflow-hidden rounded-[28px] px-7 py-10 text-left shadow-[0_45px_140px_rgba(0,0,0,0.62)] sm:px-14 sm:py-14"
                      style={{
                        background:
                          "linear-gradient(135deg, #f4ead9 0%, #ecddc2 52%, #d9c29f 100%)",
                      }}
                    >
                      {/* Paper grain */}
                      <div className="pointer-events-none absolute inset-0 opacity-[0.055]">
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage:
                              "radial-gradient(#000 0.7px, transparent 0.7px)",
                            backgroundSize: "7px 7px",
                          }}
                        />
                      </div>

                      {/* Warm paper glow */}
                      <div
                        className="pointer-events-none absolute left-1/2 top-0 h-32 w-[75%] -translate-x-1/2 rounded-full blur-3xl"
                        style={{
                          backgroundColor: `${theme.accent}20`,
                        }}
                      />

                      {/* Decorative corners */}
                      <div
                        className="absolute left-5 top-5 h-9 w-9 border-l border-t"
                        style={{ borderColor: `${theme.primary}35` }}
                      />
                      <div
                        className="absolute right-5 top-5 h-9 w-9 border-r border-t"
                        style={{ borderColor: `${theme.primary}35` }}
                      />
                      <div
                        className="absolute bottom-5 left-5 h-9 w-9 border-b border-l"
                        style={{ borderColor: `${theme.primary}35` }}
                      />
                      <div
                        className="absolute bottom-5 right-5 h-9 w-9 border-b border-r"
                        style={{ borderColor: `${theme.primary}35` }}
                      />

                      <div className="relative z-10">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25, duration: 0.65 }}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <p
                              className="text-[9px] uppercase tracking-[0.42em]"
                              style={{ color: `${theme.primary}70` }}
                            >
                              A secret letter
                            </p>

                            <span
                              className="text-[9px] uppercase tracking-[0.28em]"
                              style={{ color: `${theme.primary}45` }}
                            >
                              WishVerse · 07
                            </span>
                          </div>

                          <h3
                            className="mt-7 font-serif text-3xl sm:text-4xl"
                            style={{ color: theme.primary }}
                          >
                            Dear {wish.recipient_name},
                          </h3>
                        </motion.div>

                        <motion.div
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: 64, opacity: 1 }}
                          transition={{
                            delay: 0.55,
                            duration: 0.7,
                          }}
                          className="mt-6 h-px"
                          style={{ backgroundColor: `${theme.primary}55` }}
                        />

                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            delay: 0.75,
                            duration: 0.8,
                          }}
                          className="mt-8"
                        >
                          <p className="whitespace-pre-line font-serif text-[15px] leading-8 text-[#3b2930]/80 sm:text-base sm:leading-9">
                            {wish.secret_letter}
                          </p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 1.15,
                            duration: 0.7,
                          }}
                          className="mt-12 border-t pt-7"
                          style={{ borderColor: `${theme.primary}18` }}
                        >
                          <p className="text-xs italic text-[#3b2930]/50">
                            With all the love in the world,
                          </p>

                          <p
                            className="mt-2 font-serif text-2xl"
                            style={{ color: theme.primary }}
                          >
                            {wish.creator_name}
                          </p>

                          <div
                            className="mt-6 text-right text-2xl"
                            style={{ color: `${theme.primary}40` }}
                          >
                            ♡
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Final ending */}
            <AnimatePresence>
              {letterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 1.35,
                    duration: 0.8,
                  }}
                  className="relative z-10 mt-10"
                >
                  <p className="text-lg font-light text-white/70 sm:text-xl">
                    Happy Birthday,{" "}
                    <span style={{ color: theme.secondary }}>
                      {wish.recipient_name}
                    </span>
                    .
                  </p>

                  <p className="mt-2 text-[9px] uppercase tracking-[0.34em] text-white/25">
                    Some feelings are better written than spoken.
                  </p>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 1.75,
                      duration: 0.6,
                    }}
                    className="mx-auto mt-6 h-px w-12"
                    style={{ backgroundColor: `${theme.accent}55` }}
                  />

                  <motion.button
                    type="button"
                    onClick={restartExperience}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-7 inline-flex items-center gap-2 rounded-full border px-7 py-3 text-sm backdrop-blur-md transition"
                    style={{
                      borderColor: `${theme.accent}30`,
                      backgroundColor: `${theme.accent}08`,
                      color: `${theme.accent}cc`,
                    }}
                  >
                    <RotateCcw size={14} />
                    Experience it again
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-[0.35em] text-white/20">
              Made with love · WishVerse
            </p>
          </motion.section>
        )}

      </AnimatePresence>


      {/* ================================================= */}
      {/* GLOBAL RIGHT NAV */}
      {/* ================================================= */}

      {!showIntro && stage < 7 && (
        <motion.button
          type="button"
          onClick={nextStage}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className="fixed bottom-5 right-5 z-[80] hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white/30 backdrop-blur-md transition hover:text-white sm:flex"
          aria-label="Next stage"
        >
          <ArrowRight size={15} />
        </motion.button>
      )}

      {/* Theme name */}
      {!showIntro && (
        <div className="pointer-events-none fixed bottom-5 left-5 z-[80] hidden sm:block">
          <span className="text-[8px] uppercase tracking-[0.3em] text-white/15">
            {theme.name}
          </span>
        </div>
      )}
    </div>
  );
}

/* ===================================================== */
/* WISHVERSE PREMIUM BUTTON SYSTEM */
/* The supplied CTA treatment is translated into a */
/* cinematic, mood-aware control language. */
/* ===================================================== */

<style jsx global>{`
  .wv-button-surface {
    --wv-primary: #6A0C1F;
    --wv-secondary: #B56B78;
    --wv-accent: #C8A24A;
  }

  .wv-button-surface button,
  .wv-button-surface [role="button"] {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    border-color: color-mix(in srgb, var(--wv-accent) 28%, rgba(255,255,255,0.1));
    box-shadow:
      0 12px 34px color-mix(in srgb, var(--wv-primary) 20%, transparent),
      inset 0 1px 0 rgba(255,255,255,0.10),
      inset 0 -1px 0 rgba(0,0,0,0.18);
    transition:
      transform 260ms cubic-bezier(.22,1,.36,1),
      border-color 260ms ease,
      box-shadow 260ms ease,
      background-color 260ms ease;
  }

  .wv-button-surface button::before,
  .wv-button-surface [role="button"]::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -2;
    pointer-events: none;
    background:
      linear-gradient(135deg,
        color-mix(in srgb, var(--wv-primary) 92%, black),
        color-mix(in srgb, var(--wv-secondary) 58%, var(--wv-primary)) 54%,
        color-mix(in srgb, var(--wv-accent) 45%, var(--wv-secondary)));
    opacity: 0.16;
    transition: opacity 260ms ease;
  }

  .wv-button-surface button::after,
  .wv-button-surface [role="button"]::after {
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
  .wv-button-surface [role="button"]:hover {
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--wv-accent) 64%, rgba(255,255,255,0.2));
    box-shadow:
      0 18px 48px color-mix(in srgb, var(--wv-primary) 30%, transparent),
      0 0 28px color-mix(in srgb, var(--wv-accent) 11%, transparent),
      inset 0 1px 0 rgba(255,255,255,0.16);
  }

  .wv-button-surface button:hover::before,
  .wv-button-surface [role="button"]:hover::before {
    opacity: 0.32;
  }

  .wv-button-surface button:hover::after,
  .wv-button-surface [role="button"]:hover::after {
    transform: rotate(24deg) translateX(610%);
  }

  .wv-button-surface button:active,
  .wv-button-surface [role="button"]:active {
    transform: translateY(0) scale(0.985);
  }

  .wv-button-surface button:focus-visible,
  .wv-button-surface [role="button"]:focus-visible {
    outline: 1px solid color-mix(in srgb, var(--wv-accent) 80%, white);
    outline-offset: 3px;
  }

  .wv-button-surface button:disabled {
    transform: none;
    cursor: not-allowed;
  }

  .wv-button-surface button:disabled::after {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .wv-button-surface button,
    .wv-button-surface [role="button"] {
      transition: none;
    }

    .wv-button-surface button::after,
    .wv-button-surface [role="button"]::after {
      display: none;
    }
  }
`}</style>
