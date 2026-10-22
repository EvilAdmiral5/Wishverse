"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";

const occasions = [
  {
    label: "Birthday",
    symbol: "✦",
    tone: "#C8A24A",
    mood: "Velvet Celebration",
    description: "Warm, elegant and a little dramatic — made for the birthday that deserves more than a text.",
    palette: ["#6A0C1F", "#B56B78", "#C8A24A", "#0F0D0E"],
  },
  {
    label: "Romantic",
    symbol: "♡",
    tone: "#F2B5C5",
    mood: "Rose Noir",
    description: "Soft romance with a darker, intimate edge — made for feelings that deserve their own little world.",
    palette: ["#7A1735", "#D05A7A", "#F2B5C5", "#12090D"],
  },
  {
    label: "Best Friend",
    symbol: "∞",
    tone: "#F3C677",
    mood: "Sunset Bloom",
    description: "Golden, playful and full of warmth — for the person who somehow makes ordinary days better.",
    palette: ["#A65335", "#E58B61", "#F3C677", "#15100D"],
  },
  {
    label: "Anniversary",
    symbol: "◌",
    tone: "#D6A6B8",
    mood: "Midnight Romance",
    description: "Deep, elegant and timeless — a mood for memories, promises and everything in between.",
    palette: ["#4A1026", "#9B4D68", "#D6A6B8", "#100A0D"],
  },
  {
    label: "Just Because",
    symbol: "✧",
    tone: "#E8C7D8",
    mood: "Soft Bloom",
    description: "Gentle, dreamy and unexpectedly sweet — because some people deserve to be celebrated for no reason.",
    palette: ["#6B3A5B", "#B982A4", "#E8C7D8", "#100B10"],
  },
];

const steps = [
  ["01", "Make it personal", "Add their name, your words, memories and little details."],
  ["02", "Make it interactive", "Pick the mood and let WishVerse turn your message into an experience."],
  ["03", "Send one link", "They open it. Then the surprises unfold, one moment at a time."],
];

export default function WishVerseHomepage() {
  const [activeOccasion, setActiveOccasion] = useState("Birthday");
  const [vibeOpen, setVibeOpen] = useState(true);
  const [entered, setEntered] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  const scrollToHow = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main
      ref={heroRef}
      className="min-h-screen overflow-x-hidden bg-[#070609] text-white selection:bg-[#E8C7D8]/20"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none fixed z-0 hidden h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl md:block"
        style={{
          left: smoothX,
          top: smoothY,
          background: "radial-gradient(circle, rgba(232,199,216,.12), transparent 65%)",
        }}
      />

      <div className="pointer-events-none fixed inset-0 z-0 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(122,23,53,.18),transparent_30%),radial-gradient(circle_at_85%_18%,rgba(93,79,163,.12),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(200,162,74,.07),transparent_35%)]" />
        <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-10">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-sm shadow-[0_0_35px_rgba(232,199,216,.08)] backdrop-blur-xl transition group-hover:rotate-6 group-hover:border-white/20">
            ♡
          </span>
          <span className="text-sm font-medium tracking-[-0.02em]">WishVerse</span>
        </Link>

        <div className="hidden items-center gap-7 text-xs text-white/40 sm:flex">
          <button onClick={scrollToHow} className="transition hover:text-white/80">How it works</button>
          <Link href="/create" className="transition hover:text-white/80">Create</Link>
        </div>

        <Link
          href="/create"
          className="rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/75 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.09] hover:text-white"
        >
          Make a wish →
        </Link>
      </nav>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl items-center px-5 pb-20 pt-10 sm:px-8 lg:px-10">
        <div className="grid w-full gap-14 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .7 }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3.5 py-2 text-[9px] uppercase tracking-[0.3em] text-white/45 backdrop-blur-xl"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E8C7D8] shadow-[0_0_14px_#E8C7D8]" />
              Digital wishes, but make them unforgettable
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .8, delay: .08 }}
              className="max-w-4xl text-[clamp(3.6rem,8vw,7.7rem)] font-semibold leading-[.82] tracking-[-0.075em]"
            >
              Don&apos;t just
              <br />
              <span className="bg-gradient-to-r from-white via-white/80 to-[#E8C7D8] bg-clip-text text-transparent">say it.</span>
              <br />
              <span className="text-white/35">make them feel it.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .7, delay: .2 }}
              className="mt-8 max-w-xl text-sm leading-7 text-white/45 sm:text-base"
            >
              Create a tiny universe made just for them — words, memories, music,
              surprises and moments that unfold through one beautiful link.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .7, delay: .3 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/create"
                onMouseEnter={() => setEntered(true)}
                onMouseLeave={() => setEntered(false)}
                className="group relative inline-flex min-h-14 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white px-7 text-sm font-semibold text-black shadow-[0_18px_70px_rgba(232,199,216,.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_90px_rgba(232,199,216,.2)]"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/[0.08] to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Create something they&apos;ll remember</span>
                <motion.span
                  animate={{ x: entered ? 4 : 0 }}
                  className="relative ml-3"
                >→</motion.span>
              </Link>

              <button
                onClick={scrollToHow}
                className="min-h-14 rounded-2xl border border-white/10 bg-white/[0.035] px-6 text-sm text-white/65 backdrop-blur-xl transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                See how it works ↓
              </button>
            </motion.div>

            <div className="mt-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/25">
              <span>No app</span><span>·</span><span>No sign-up for them</span><span>·</span><span>One link</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[520px] lg:justify-self-end">
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [-1, 1, -1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="relative aspect-[.82] overflow-hidden rounded-[2.5rem] border border-white/[0.11] bg-white/[0.045] p-3 shadow-[0_40px_120px_rgba(0,0,0,.5)] backdrop-blur-2xl"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(242,181,197,.15),transparent_32%),radial-gradient(circle_at_30%_80%,rgba(200,162,74,.08),transparent_30%)]" />
              <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[#0c0a0f]/90 p-6 sm:p-8">
                <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.3em] text-white/30">
                  <span>WishVerse</span><span>01 / 07</span>
                </div>

                <div className="relative py-10 text-center">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1], opacity: [.7, 1, .7] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-[#E8C7D8]/20 bg-[#E8C7D8]/[0.06] text-4xl text-[#E8C7D8] shadow-[0_0_80px_rgba(232,199,216,.12)]"
                  >
                    ♡
                  </motion.div>
                  <p className="mt-8 text-[10px] uppercase tracking-[0.4em] text-[#E8C7D8]/60">A little something for</p>
                  <h2 className="mt-3 text-4xl font-light tracking-[-0.04em] sm:text-5xl">Someone special.</h2>
                  <p className="mx-auto mt-4 max-w-xs text-xs leading-6 text-white/30">A message can be read. A WishVerse can be experienced.</p>
                </div>

                <div>
                  <div className="mb-4 flex items-center justify-between text-[9px] uppercase tracking-[0.25em] text-white/25">
                    <span>{activeOccasion}</span><span>Keep going →</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-white/[0.07]">
                    <motion.div animate={{ width: "28%" }} className="h-full rounded-full bg-[#E8C7D8]" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: .8 }}
              className="absolute -right-2 top-14 hidden w-44 rounded-2xl border border-white/10 bg-black/45 p-3 backdrop-blur-xl sm:block"
            >
              <p className="text-[8px] uppercase tracking-[.25em] text-white/25">The vibe</p>
              <p className="mt-2 text-xs text-white/65">Cinematic. Personal. A little addictive.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="absolute -bottom-5 -left-3 hidden w-48 rounded-2xl border border-white/10 bg-black/45 p-3 backdrop-blur-xl sm:block"
            >
              <p className="text-[8px] uppercase tracking-[.25em] text-white/25">Built for moments</p>
              <p className="mt-2 text-xs text-white/65">Birthdays · love · friendship · just because</p>
            </motion.div>
          </div>
        </div>

        <button
          onClick={scrollToHow}
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-[9px] uppercase tracking-[.35em] text-white/25 transition hover:text-white/60 sm:flex"
        >
          <span className="h-8 w-px bg-white/20" /> Scroll to explore
        </button>
      </section>

      <section className="relative z-10 border-y border-white/[0.06] bg-white/[0.018] py-7 sm:py-8">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="shrink-0">
              <button
                type="button"
                onClick={() => setVibeOpen((open) => !open)}
                className="group flex items-center gap-2 text-left"
              >
                <span className="text-[9px] uppercase tracking-[.3em] text-white/25">Pick your vibe</span>
                <span className="grid h-5 w-5 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[10px] text-white/45 transition group-hover:border-white/20 group-hover:text-white">
                  {vibeOpen ? "−" : "+"}
                </span>
              </button>
              <p className="mt-1 text-[11px] text-white/25">Tap a mood and preview the world they&apos;ll open.</p>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto [scrollbar-width:none]">
              {occasions.map((occasion) => (
                <button
                  key={occasion.label}
                  onClick={() => {
                    setActiveOccasion(occasion.label);
                    setVibeOpen(true);
                  }}
                  className={`group flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-[11px] transition ${
                    activeOccasion === occasion.label
                      ? "border-white/15 bg-white/[0.08] text-white shadow-[0_10px_35px_rgba(0,0,0,.18)]"
                      : "border-white/[0.06] bg-white/[0.02] text-white/35 hover:border-white/10 hover:text-white/70"
                  }`}
                >
                  <span style={{ color: occasion.tone }}>{occasion.symbol}</span>
                  {occasion.label}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            initial={false}
            animate={{ height: vibeOpen ? "auto" : 0, opacity: vibeOpen ? 1 : 0, marginTop: vibeOpen ? 20 : 0 }}
            className="overflow-hidden"
          >
            {(() => {
              const selected = occasions.find((item) => item.label === activeOccasion) ?? occasions[0];
              return (
                <motion.div
                  key={selected.label}
                  initial={{ opacity: 0, y: 10, scale: .985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: .35, ease: "easeOut" }}
                  className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-black/30 p-5 shadow-[0_25px_80px_rgba(0,0,0,.22)] backdrop-blur-2xl sm:p-6"
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-70"
                    style={{
                      background: `radial-gradient(circle at 15% 20%, ${selected.palette[1]}22, transparent 30%), radial-gradient(circle at 85% 80%, ${selected.palette[2]}18, transparent 32%)`,
                    }}
                  />

                  <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <div className="flex items-center gap-2 text-[9px] uppercase tracking-[.3em] text-white/30">
                        <span style={{ color: selected.tone }}>{selected.symbol}</span>
                        {selected.label} mood
                      </div>
                      <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
                        <h3 className="text-2xl font-medium tracking-[-.04em] sm:text-3xl">{selected.mood}</h3>
                        <span className="pb-1 text-[10px] uppercase tracking-[.2em] text-white/25">Theme preview</span>
                      </div>
                      <p className="mt-3 max-w-2xl text-xs leading-6 text-white/40 sm:text-sm">
                        {selected.description}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        {selected.palette.map((color, index) => (
                          <span key={color} className="group relative">
                            <span
                              className="block h-7 w-7 rounded-full border border-white/15 shadow-[0_5px_20px_rgba(0,0,0,.25)]"
                              style={{ backgroundColor: color }}
                            />
                            <span className="pointer-events-none absolute left-1/2 top-9 z-20 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/80 px-2 py-1 text-[8px] text-white/50 opacity-0 transition group-hover:opacity-100">
                              {index === 0 ? "Primary" : index === 1 ? "Secondary" : index === 2 ? "Accent" : "Background"}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div
                      className="relative min-h-32 overflow-hidden rounded-2xl border border-white/10 p-4 md:w-56"
                      style={{
                        background: `linear-gradient(145deg, ${selected.palette[0]}, ${selected.palette[3]})`,
                      }}
                    >
                      <div
                        className="absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl"
                        style={{ backgroundColor: selected.palette[2], opacity: .32 }}
                      />
                      <div className="relative flex h-full min-h-24 flex-col justify-between">
                        <div className="flex items-center justify-between text-[8px] uppercase tracking-[.25em] text-white/45">
                          <span>WishVerse</span><span>01 / 07</span>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase tracking-[.25em]" style={{ color: selected.palette[2] }}>A little world for</div>
                          <div className="mt-1 text-lg font-light text-white/90">Someone special.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </motion.div>
        </div>
      </section>

      <section id="how-it-works" className="relative z-10 mx-auto max-w-7xl px-5 py-28 sm:px-8 lg:px-10 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <p className="text-[9px] uppercase tracking-[.35em] text-white/25">The whole idea</p>
            <h2 className="mt-5 max-w-md text-4xl font-medium leading-[.95] tracking-[-.05em] sm:text-6xl">
              Less &ldquo;send a text.&rdquo;
              <br />
              More <span className="text-white/35">&ldquo;wait… wow.&rdquo;</span>
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {steps.map(([number, title, description], index) => (
              <motion.div
                key={number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: .2 }}
                transition={{ delay: index * .08 }}
                whileHover={{ y: -6, rotateX: 2, rotateY: -2 }}
                className="group rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 transition-shadow duration-300 hover:border-white/[0.13] hover:bg-white/[0.045] hover:shadow-[0_25px_80px_rgba(0,0,0,.25)]"
              >
                <span className="text-[9px] tracking-[.3em] text-white/25">{number}</span>
                <h3 className="mt-14 text-lg tracking-[-.02em]">{title}</h3>
                <p className="mt-3 text-xs leading-6 text-white/35">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 pb-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-8 shadow-[0_35px_100px_rgba(0,0,0,.25)] sm:p-12 lg:p-16">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[.35em] text-[#E8C7D8]/55">Your move</p>
              <h2 className="mt-4 max-w-2xl text-4xl font-medium leading-[.95] tracking-[-.05em] sm:text-6xl">
                Someone you love is going to open this.
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-6 text-white/35">Give them something worth opening.</p>
            </div>
            <Link
              href="/create"
              className="group inline-flex min-h-14 shrink-0 items-center justify-center rounded-2xl bg-white px-7 text-sm font-semibold text-black transition hover:-translate-y-1 hover:shadow-[0_20px_70px_rgba(232,199,216,.18)]"
            >
              Start your WishVerse <span className="ml-3 transition group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-[9px] uppercase tracking-[.25em] text-white/20 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <span>WishVerse · made for meaningful moments</span>
        <span>Not another boring wish link.</span>
      </footer>
    </main>
  );
}
