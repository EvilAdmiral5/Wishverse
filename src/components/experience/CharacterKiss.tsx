"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart, Sparkles, VolumeX } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type CharacterKissProps = {
  recipientGender?: string | null;
  recipientName?: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  onComplete?: () => void;
};

const CHARACTER_VIDEOS = {
  bubu: {
    name: "Bubu",
    video: "/characters/bubu-kiss.webm",
    fallbackVideo: "/characters/bubu-kiss.mp4",
    description: "Your little Bubu has a kiss for you.",
    emoji: "🤍",
  },
  dudu: {
    name: "Dudu",
    video: "/characters/dudu-kiss.webm",
    fallbackVideo: "/characters/dudu-kiss.mp4",
    description: "Your little Dudu has a kiss for you.",
    emoji: "🤎",
  },
} as const;

type CharacterKey = keyof typeof CHARACTER_VIDEOS;

export default function CharacterKiss({
  recipientGender,
  recipientName,
  primary,
  secondary,
  accent,
  background,
  onComplete,
}: CharacterKissProps) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [useMp4Fallback, setUseMp4Fallback] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [autoPlayCount, setAutoPlayCount] = useState(0);
  const [autoSequenceDone, setAutoSequenceDone] = useState(false);
  const [manualPlaying, setManualPlaying] = useState(false);

  const character = useMemo(() => {
    const gender = String(recipientGender ?? "").trim().toLowerCase();

    // WishVerse character contract:
    // male recipient -> Bubu (white female bear)
    // female recipient -> Dudu (brown male bear)
    if (gender === "boy" || gender === "male") return CHARACTER_VIDEOS.bubu;
    if (gender === "girl" || gender === "female") return CHARACTER_VIDEOS.dudu;
    return null;
  }, [recipientGender]);

  const characterKey = useMemo<CharacterKey | null>(() => {
    const gender = String(recipientGender ?? "").trim().toLowerCase();

    if (gender === "boy" || gender === "male") return "bubu";
    if (gender === "girl" || gender === "female") return "dudu";
    return null;
  }, [recipientGender]);

  useEffect(() => {
    setIsPlaying(false);
    setIsFinished(false);
    setVideoFailed(false);
    setUseMp4Fallback(false);
    setShowBurst(false);
    setAutoPlayCount(0);
    setAutoSequenceDone(false);
    setManualPlaying(false);

    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;
  }, [characterKey]);

  useEffect(() => {
    if (!character || !videoRef.current || autoSequenceDone) return;

    const video = videoRef.current;

    const startInitialSequence = async () => {
      try {
        video.currentTime = 0;
        await video.play();
        setIsPlaying(true);
        setAutoPlayCount(1);
      } catch {
        // If autoplay is blocked, the character card becomes the start button.
        setIsPlaying(false);
      }
    };

    const timer = window.setTimeout(startInitialSequence, reduceMotion ? 0 : 180);

    return () => window.clearTimeout(timer);
  }, [character, reduceMotion, useMp4Fallback, autoSequenceDone]);

  const handleVideoEnded = () => {
    setIsPlaying(false);

    // First: automatically play the same video 3 times continuously.
    if (!autoSequenceDone && !manualPlaying) {
      if (autoPlayCount < 3) {
        const nextCount = autoPlayCount + 1;
        setAutoPlayCount(nextCount);

        const video = videoRef.current;
        if (video) {
          video.currentTime = 0;
          void video.play().then(() => setIsPlaying(true)).catch(() => {
            setIsPlaying(false);
          });
        }
        return;
      }

      setAutoSequenceDone(true);
      setIsFinished(true);
      setShowBurst(true);
      window.setTimeout(() => setShowBurst(false), 1600);
      return;
    }

    // After the first 3 automatic plays, every card click is exactly 1 play.
    if (manualPlaying) {
      setManualPlaying(false);
      setIsFinished(true);
      setShowBurst(true);
      window.setTimeout(() => setShowBurst(false), 1600);
    }
  };

  const handleVideoError = () => {
    if (!useMp4Fallback) {
      setUseMp4Fallback(true);
      setVideoFailed(false);
      setAutoPlayCount(0);
      setAutoSequenceDone(false);
      setManualPlaying(false);
      return;
    }

    setVideoFailed(true);
    setIsPlaying(false);
    setManualPlaying(false);
  };

  const playVideoOnce = async () => {
    const video = videoRef.current;
    if (!video || videoFailed || !autoSequenceDone || isPlaying) return;

    setIsFinished(false);
    setShowBurst(false);
    setManualPlaying(true);

    try {
      video.currentTime = 0;
      await video.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
      setManualPlaying(false);
    }
  };

  const startAutoSequenceManually = async () => {
    const video = videoRef.current;
    if (!video || videoFailed || autoSequenceDone || isPlaying) return;

    setIsFinished(false);
    setManualPlaying(false);
    setAutoPlayCount(1);

    try {
      video.currentTime = 0;
      await video.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  if (!character || !characterKey) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-10 text-sm text-white/45">
        This wish does not have a valid recipient character.
      </div>
    );
  }

  const videoSource = useMp4Fallback ? character.fallbackVideo : character.video;
  const safeRecipientName = recipientName?.trim() || "you";

  return (
    <div className="relative z-10 flex w-full max-w-3xl flex-col items-center px-2">
      <div className="mb-7 max-w-xl text-center">
        <div
          className="mb-4 text-[10px] font-medium uppercase tracking-[0.52em]"
          style={{ color: `${accent}a8` }}
        >
          A tiny surprise
        </div>

        <h2 className="text-3xl font-light leading-tight sm:text-5xl">
          {character.name}
          <span className="block italic" style={{ color: secondary }}>
            has a kiss for you.
          </span>
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/40">
          {character.description} {safeRecipientName !== "you" ? `Just for ${safeRecipientName}.` : ""}
        </p>
      </div>

      <div className="relative flex w-full justify-center">
        {!reduceMotion && (
          <>
            {Array.from({ length: 18 }).map((_, index) => (
              <motion.span
                key={`spark-${index}`}
                aria-hidden="true"
                className="pointer-events-none absolute text-[9px]"
                style={{
                  left: `${8 + ((index * 37) % 84)}%`,
                  top: `${12 + ((index * 29) % 72)}%`,
                  color: index % 3 === 0 ? secondary : `${accent}99`,
                }}
                animate={{
                  opacity: [0.1, 0.65, 0.1],
                  scale: [0.7, 1.2, 0.7],
                  y: [0, -7, 0],
                }}
                transition={{
                  duration: 2.4 + (index % 4) * 0.4,
                  delay: index * 0.08,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {index % 2 ? "✦" : "·"}
              </motion.span>
            ))}
          </>
        )}

        <motion.div
          className="absolute inset-1/2 h-[290px] w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[75px] sm:h-[360px] sm:w-[360px]"
          animate={
            reduceMotion
              ? { opacity: 0.22 }
              : { opacity: [0.12, 0.28, 0.12], scale: [0.94, 1.08, 0.94] }
          }
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ backgroundColor: primary }}
        />

        <motion.div
          className="absolute h-[330px] w-[330px] rounded-[52px] border sm:h-[390px] sm:w-[390px]"
          animate={reduceMotion ? {} : { rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          style={{ borderColor: `${secondary}18` }}
        />

        <motion.div
          className="absolute h-[360px] w-[360px] rounded-[58px] border sm:h-[430px] sm:w-[430px]"
          animate={reduceMotion ? {} : { rotate: -360 }}
          transition={{ duration: 31, repeat: Infinity, ease: "linear" }}
          style={{ borderColor: `${accent}0d` }}
        />

        <motion.div
          role={autoSequenceDone ? "button" : undefined}
          tabIndex={autoSequenceDone ? 0 : -1}
          aria-label={
            autoSequenceDone
              ? `Play ${character.name}'s kiss once`
              : `Watch ${character.name}'s kiss animation`
          }
          onClick={autoSequenceDone ? playVideoOnce : startAutoSequenceManually}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              if (autoSequenceDone) {
                void playVideoOnce();
              } else {
                void startAutoSequenceManually();
              }
            }
          }}
          className={`relative h-[330px] w-[min(92vw,390px)] overflow-hidden rounded-[42px] border sm:h-[400px] sm:w-[430px] sm:rounded-[52px] ${
            !isPlaying ? "cursor-pointer" : "cursor-default"
          }`}
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{
            opacity: 1,
            y: isPlaying ? [0, -3, 0] : 0,
            scale: isFinished ? [1, 1.018, 1] : 1,
          }}
          transition={{
            opacity: { duration: 0.55 },
            y: { duration: 4.2, repeat: isPlaying && !reduceMotion ? Infinity : 0, ease: "easeInOut" },
            scale: { duration: 0.8, ease: "easeOut" },
          }}
          style={{
            borderColor: `${secondary}30`,
            background: `linear-gradient(145deg, ${secondary}10, ${primary}22 52%, ${accent}08)`,
            boxShadow: `0 35px 110px ${primary}38, inset 0 0 70px ${secondary}08`,
          }}
        >
          <motion.div
            className="pointer-events-none absolute inset-y-0 z-20 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={reduceMotion ? {} : { x: ["-140%", "140%"] }}
            transition={{ duration: 5.5, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
          />

          <div
            className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[34px] border sm:rounded-[44px]"
            style={{ borderColor: `${secondary}20`, backgroundColor: `${background}55` }}
          >
            {!videoFailed ? (
              <video
                ref={videoRef}
                key={`${characterKey}-${useMp4Fallback ? "mp4" : "webm"}`}
                autoPlay
                muted
                playsInline
                preload="auto"
                onPlay={() => setIsPlaying(true)}
                onPause={() => {
                  if (!isFinished) setIsPlaying(false);
                }}
                onEnded={handleVideoEnded}
                onError={handleVideoError}
                className="h-full w-full select-none object-contain"
                aria-label={`${character.name} sending a kiss to ${safeRecipientName}`}
              >
                <source src={videoSource} type={useMp4Fallback ? "video/mp4" : "video/webm"} />
              </video>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 px-8 text-center">
                <div className="text-7xl">{character.emoji}</div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/30">
                  Add {character.video} or {character.fallbackVideo} to your public characters folder.
                </p>
              </div>
            )}

            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, transparent 52%, ${background}55 100%), radial-gradient(circle at 50% 38%, transparent 52%, ${background}30 100%)`,
              }}
            />

            <div
              className="absolute bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-full border px-5 py-2 backdrop-blur-md"
              style={{ borderColor: `${secondary}30`, backgroundColor: `${background}75` }}
            >
              <span className="text-xs font-medium tracking-[0.22em] text-white/85">
                {character.name}
              </span>
            </div>

            {!isPlaying && !videoFailed && !autoSequenceDone && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pointer-events-none absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 rounded-full border px-5 py-3 text-center text-xs backdrop-blur-md"
                style={{
                  borderColor: `${secondary}45`,
                  backgroundColor: `${background}b8`,
                  color: secondary,
                }}
              >
                {autoPlayCount === 0 ? "Tap to start the 3 kisses ♥" : "Playing the kisses... ♥"}
              </motion.div>
            )}

            {!isPlaying && autoSequenceDone && !videoFailed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pointer-events-none absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 rounded-full border px-5 py-3 text-center text-xs backdrop-blur-md"
                style={{
                  borderColor: `${secondary}45`,
                  backgroundColor: `${background}b8`,
                  color: secondary,
                }}
              >
                Tap the character to replay once ♥
              </motion.div>
            )}

            <div className="absolute right-4 top-4 z-30 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/20 px-2.5 py-1.5 text-[9px] text-white/45 backdrop-blur-md">
              <VolumeX size={11} />
              <span>sound off</span>
            </div>
          </div>

          <AnimatePresence>
            {showBurst && !reduceMotion && (
              <div className="pointer-events-none absolute inset-0 z-50 overflow-visible">
                {Array.from({ length: 12 }).map((_, index) => (
                  <motion.span
                    key={`burst-${index}`}
                    initial={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
                    animate={{
                      opacity: [0, 1, 0],
                      x: Math.cos((index / 12) * Math.PI * 2) * (55 + (index % 3) * 18),
                      y: Math.sin((index / 12) * Math.PI * 2) * (55 + (index % 4) * 16),
                      scale: [0.3, 1, 0.6],
                      rotate: index * 22,
                    }}
                    transition={{ duration: 1.25, ease: "easeOut", delay: index * 0.025 }}
                    className="absolute left-1/2 top-1/2 text-lg"
                    style={{ color: index % 2 ? secondary : accent }}
                  >
                    {index % 3 === 0 ? "♥" : "♡"}
                  </motion.span>
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <motion.div
        key={isFinished ? "finished" : "playing"}
        initial={{ opacity: 0, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="mt-7 rounded-full border px-5 py-2.5 text-center text-[10px] uppercase tracking-[0.25em]"
        style={{
          borderColor: `${secondary}25`,
          backgroundColor: `${secondary}0c`,
          color: secondary,
        }}
      >
        {!autoSequenceDone
          ? `Kiss ${Math.min(autoPlayCount, 3)} of 3 ${autoPlayCount === 1 ? "is" : "are"} on the way ♥`
          : isPlaying && manualPlaying
            ? "One kiss replaying ♥"
            : "Three kisses delivered · Tap the character to replay once ♥"}
      </motion.div>

      <div
        className="mt-5 flex items-center gap-2"
        aria-label={`${Math.min(autoPlayCount, 3)} of 3 automatic kisses completed`}
      >
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            className="h-1 rounded-full"
            animate={{
              width: autoPlayCount > index ? 28 : 8,
              opacity: autoPlayCount > index ? 1 : 0.22,
            }}
            style={{ backgroundColor: secondary }}
          />
        ))}
      </div>

      <AnimatePresence>
        {isFinished && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8 flex flex-col items-center"
          >
            <div
              className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border"
              style={{ borderColor: `${secondary}30`, backgroundColor: `${secondary}10` }}
            >
              <Heart size={17} fill="currentColor" style={{ color: secondary }} />
            </div>

            <p className="mb-5 text-center text-xs text-white/40">
              Three automatic plays complete. Tap the character anytime for one more kiss. ♥
            </p>

            <motion.button
              type="button"
              onClick={onComplete}
              whileHover={{ scale: 1.035 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full border px-7 py-3 text-sm transition"
              style={{ borderColor: `${secondary}40`, backgroundColor: `${secondary}10`, color: secondary }}
            >
              One last memory awaits →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-white/20">
        <Sparkles size={11} />
        <span>Real Bubu &amp; Dudu · WishVerse</span>
      </div>
    </div>
  );
}
