"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type WishVerseIntroProps = {
  onComplete: () => void;
};

export default function WishVerseIntro({
  onComplete,
}: WishVerseIntroProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2400;
    const start = performance.now();

    const animate = (time: number) => {
      const elapsed = time - start;
      const nextProgress = Math.min(
        Math.round((elapsed / duration) * 100),
        100
      );

      setProgress(nextProgress);

      if (nextProgress < 100) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(onComplete, 700);
      }
    };

    requestAnimationFrame(animate);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505] text-white"
    >
      <div className="w-[min(420px,80vw)]">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-3xl font-light tracking-[0.45em] sm:text-4xl">
            WISHVERSE
          </h1>

          <p className="mt-4 text-[10px] uppercase tracking-[0.35em] text-white/35">
            Preparing something special
          </p>
        </motion.div>

        {/* Progress */}
        <div className="mt-14">
          <div className="h-[1px] w-full overflow-hidden bg-white/10">
            <motion.div
              className="h-full bg-white"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/35">
            <span>
              {progress < 100 ? "Loading experience" : "Ready"}
            </span>

            <span>{progress}%</span>
          </div>
        </div>

        {/* Bottom message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="mt-10 text-center text-xs text-white/25"
        >
          A little surprise is waiting for you.
        </motion.p>
      </div>
    </motion.div>
  );
}