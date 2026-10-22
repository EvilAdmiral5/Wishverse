"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
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
  },
  dudu: {
    name: "Dudu",
    video: "/characters/dudu-kiss.webm",
  },
}; as const;

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
  type CharacterAction = "idle" | "lean" | "kiss" | "recoil";

  const [kissCount, setKissCount] = useState(0);
  const [kissPulse, setKissPulse] = useState(0);
  const [characterAction, setCharacterAction] = useState<CharacterAction>("idle");
  const [imageFailed, setImageFailed] = useState(false);
  const timers = useRef<number[]>([]);

  const character = useMemo(() => {
    const gender = String(recipientGender ?? "").toLowerCase();

    // This matches the existing WishForm contract:
    // boy -> Bubu, girl -> Dudu.
    if (gender === "boy" || gender === "male") return CHARACTER_ASSETS.bubu;
    if (gender === "girl" || gender === "female") return CHARACTER_ASSETS.dudu;
    return null;
  }, [recipientGender]);

  useEffect(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    setKissCount(0);
    setKissPulse(0);
    setCharacterAction("idle");
    setImageFailed(false);

    if (!character) return;

    if (reduceMotion) {
      const reducedDelays = [500, 1200, 1900];
      reducedDelays.forEach((delay, index) => {
        const timer = window.setTimeout(() => {
          setKissCount(index + 1);
          setKissPulse((value) => value + 1);
        }, delay);
        timers.current.push(timer);
      });
    } else {
      // Each kiss is a complete little performance:
      // idle → lean toward the recipient → kiss → recoil → idle.
      const sequence = [
        { start: 1200, count: 1 },
        { start: 4200, count: 2 },
        { start: 7200, count: 3 },
      ];

      sequence.forEach(({ start, count }) => {
        const leanTimer = window.setTimeout(() => {
          setCharacterAction("lean");
        }, start);

        const kissTimer = window.setTimeout(() => {
          setCharacterAction("kiss");
          setKissCount(count);
          setKissPulse((value) => value + 1);
        }, start + 650);

        const recoilTimer = window.setTimeout(() => {
          setCharacterAction("recoil");
        }, start + 1250);

        const idleTimer = window.setTimeout(() => {
          setCharacterAction("idle");
        }, start + 1900);

        timers.current.push(leanTimer, kissTimer, recoilTimer, idleTimer);
      });
    }

    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current = [];
    };
  }, [character, reduceMotion]);

  if (!character) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-10 text-sm text-white/45">
        This wish does not have a valid recipient character.
      </div>
    );
  }

  const delivered = kissCount >= 3;

  return (
    <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">
      <div className="mb-7 max-w-xl">
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
          {character.description}
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
          key={kissPulse}
          className="relative h-[330px] w-[min(88vw,390px)] overflow-hidden rounded-[42px] border p-3 sm:h-[400px] sm:w-[430px] sm:rounded-[52px]"
          animate={
            reduceMotion
              ? { opacity: 1 }
              : {
                  scale: kissPulse ? [1, 1.035, 0.992, 1] : [0.96, 1, 1],
                  y: kissPulse ? [0, -7, 2, 0] : [18, 0, -4, 0],
                }
          }
          transition={{ duration: kissPulse ? 0.8 : 1.4, ease: "easeOut" }}
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

          <motion.div
            className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[34px] border sm:rounded-[44px]"
            animate={reduceMotion ? {} : { y: [0, -5, 0], rotate: [-0.4, 0.4, -0.4] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ borderColor: `${secondary}20`, backgroundColor: `${background}55` }}
          >
            {!imageFailed ? (
              <motion.div
                className="relative h-full w-full"
                animate={
                  reduceMotion
                    ? { opacity: 1 }
                    : characterAction === "lean"
                      ? {
                          opacity: 1,
                          x: 14,
                          y: -12,
                          rotate: -4.5,
                          scale: 1.035,
                        }
                      : characterAction === "kiss"
                        ? {
                            opacity: 1,
                            x: 24,
                            y: -22,
                            rotate: -7,
                            scale: 1.085,
                          }
                        : characterAction === "recoil"
                          ? {
                              opacity: 1,
                              x: -5,
                              y: 5,
                              rotate: 2.5,
                              scale: 0.985,
                            }
                          : {
                              opacity: 1,
                              x: [0, -3, 2, 0],
                              y: [0, -8, 0, -5, 0],
                              rotate: [0, -1.2, 1.2, 0, -0.7, 0],
                              scale: [1, 1.018, 1, 1.012, 1],
                            }
                }
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : characterAction === "idle"
                      ? { duration: 4.2, repeat: Infinity, ease: "easeInOut" }
                      : { duration: characterAction === "kiss" ? 0.42 : 0.55, ease: [0.22, 1, 0.36, 1] }
                }
              >
                <Image
                  src={character.image}
                  alt={`${character.name} sending a kiss to ${recipientName?.trim() || "you"}`}
                  fill
                  sizes="(max-width: 640px) 88vw, 430px"
                  className="h-full w-full select-none object-contain object-center scale-[1.08] sm:scale-[1.1]"
                  draggable={false}
                  priority
                  onError={() => setImageFailed(true)}
                />
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 px-8 text-center">
                <div className="text-7xl">{character.name === "Bubu" ? "🤍" : "🤎"}</div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/30">
                  Add {character.image} to your public characters folder
                </p>
              </div>
            )}

            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, transparent 50%, ${background}70 100%), radial-gradient(circle at 50% 38%, transparent 45%, ${background}38 100%)`,
              }}
            />

            <div
              className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full border px-5 py-2 backdrop-blur-md"
              style={{ borderColor: `${secondary}30`, backgroundColor: `${background}75` }}
            >
              <span className="text-xs font-medium tracking-[0.22em] text-white/85">
                {character.name}
              </span>
            </div>
          </motion.div>

          <AnimatePresence>
            {kissPulse > 0 && (
              <motion.div
                key={`kiss-${kissPulse}`}
                initial={{ opacity: 0, scale: 0.35, x: 0, y: 18, rotate: -8 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0.35, 1.05, 1.18, 0.7],
                  x: [0, 18, 58, 92],
                  y: [18, -4, -24, -48],
                  rotate: [-8, 0, 7, 12],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.35, ease: "easeOut" }}
                className="pointer-events-none absolute left-[54%] top-[38%] z-40 -translate-x-1/2 text-5xl"
                style={{ filter: `drop-shadow(0 8px 18px ${secondary}55)` }}
              >
                💋
              </motion.div>
            )}
          </AnimatePresence>

          {kissPulse > 0 && !reduceMotion && (
            <motion.div
              key={`ripple-${kissPulse}`}
              initial={{ opacity: 0.55, scale: 0.45 }}
              animate={{ opacity: 0, scale: 1.8 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="pointer-events-none absolute left-[54%] top-[38%] z-20 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border"
              style={{ borderColor: `${secondary}55` }}
            />
          )}
        </motion.div>

        <AnimatePresence>
          {kissPulse > 0 && (
            <div className="pointer-events-none absolute inset-0 z-30 overflow-visible">
              {Array.from({ length: 8 }).map((_, index) => (
                <motion.span
                  key={`${kissPulse}-${index}`}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.35 }}
                  animate={{
                    opacity: [0, 0.95, 0],
                    x: (index % 2 ? 1 : -1) * (55 + (index % 4) * 24),
                    y: -55 - (index % 4) * 24,
                    scale: [0.35, 1, 0.65],
                    rotate: (index % 2 ? 1 : -1) * (10 + index * 3),
                  }}
                  transition={{ duration: 1.55, ease: "easeOut", delay: index * 0.035 }}
                  className="absolute left-[54%] top-[42%] text-xl"
                  style={{ color: secondary }}
                >
                  {index % 2 ? "♥" : "♡"}
                </motion.span>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        key={kissCount}
        initial={{ opacity: 0, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="mt-7 rounded-full border px-5 py-2.5 text-[10px] uppercase tracking-[0.25em]"
        style={{ borderColor: `${secondary}25`, backgroundColor: `${secondary}0c`, color: secondary }}
      >
        {kissCount === 0
          ? "Getting a little love ready..."
          : delivered
            ? "Three kisses delivered ♥"
            : `${kissCount} kiss${kissCount === 1 ? "" : "es"} on the way ♥`}
      </motion.div>

      <div className="mt-5 flex gap-2" aria-label={`${kissCount} of 3 kisses delivered`}>
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            animate={{ width: kissCount > index ? 26 : 6, opacity: kissCount > index ? 1 : 0.25 }}
            className="h-1 rounded-full"
            style={{ backgroundColor: secondary }}
          />
        ))}
      </div>

      <AnimatePresence>
        {delivered && (
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
            <p className="mb-5 text-xs text-white/40">Three tiny kisses, saved forever. ♥</p>
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
