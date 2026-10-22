
"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

type CharacterKissProps = {
  recipientGender?: string | null;
  recipientName?: string;
};

export default function CharacterKiss({
  recipientGender,
  recipientName,
}: CharacterKissProps) {
  const reduceMotion = useReducedMotion();

  // Your requested mapping:
  // Male recipient -> Bubu (white bear)
  // Female recipient -> Dudu (brown bear)
  const gender = recipientGender?.toLowerCase();

  const character =
    gender === "male" || gender === "boy"
      ? {
          name: "Bubu",
          image: "/characters/bubu-kiss.webp",
        }
      : gender === "female" || gender === "girl"
      ? {
          name: "Dudu",
          image: "/characters/dudu-kiss.webp",
        }
      : null;

  // Never guess which character to display.
  if (!character) return null;

  return (
    <section
      aria-label={`${character.name} blows a kiss`}
      className="relative isolate flex min-h-[300px] w-full
        flex-col items-center justify-center overflow-hidden
        rounded-3xl px-4 py-8"
    >
      {/* Soft romantic background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10
          rounded-3xl bg-gradient-to-b from-rose-100/60
          via-pink-50/40 to-transparent"
      />

      {/* Floating hearts */}
      {["♡", "♥", "♡", "♥", "♡"].map((heart, index) => (
        <motion.span
          key={`${character.name}-heart-${index}`}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-12
            text-rose-400"
          style={{
            left: `${15 + index * 15}%`,
            fontSize: `${20 + (index % 3) * 8}px`,
          }}
          initial={{ opacity: 0, y: 20, scale: 0.5 }}
          animate={
            reduceMotion
              ? { opacity: 0.7 }
              : {
                  opacity: [0, 1, 0],
                  y: [20, -65 - (index % 3) * 15],
                  x: [0, (index % 2 ? 1 : -1) * 18],
                  scale: [0.5, 1, 0.8],
                }
          }
          transition={{
            duration: 2.2,
            delay: index * 0.25,
            repeat: reduceMotion ? 0 : 1,
            ease: "easeOut",
          }}
        >
          {heart}
        </motion.span>
      ))}

      {/* Only the selected character is rendered */}
      <motion.div
        className="relative z-10"
        initial={
          reduceMotion
            ? false
            : { opacity: 0, y: 45, scale: 0.85 }
        }
        animate={
          reduceMotion
            ? { opacity: 1 }
            : {
                opacity: 1,
                y: [45, 0, -5, 0, -3, 0],
                scale: [0.85, 1, 1.04, 1, 1.02, 1],
                rotate: [0, -4, 5, 0, -3, 0],
              }
        }
        transition={{
          duration: 3.2,
          times: [0, 0.2, 0.4, 0.55, 0.75, 1],
          ease: "easeInOut",
        }}
      >
        <Image
          src={character.image}
          alt={`${character.name}, a cute bear blowing a kiss`}
          width={220}
          height={220}
          className="h-52 w-52 object-contain drop-shadow-md
            sm:h-56 sm:w-56"
          priority={false}
        />
      </motion.div>

      {/* Kiss message */}
      <motion.p
        className="relative z-10 mt-3 text-center
          text-base font-medium text-rose-700 sm:text-lg"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduceMotion ? 0 : 0.8 }}
      >
        A little kiss just for {recipientName?.trim() || "you"} 💋
      </motion.p>
    </section>
  );
}
