"use client";

import { useEffect, useRef, useState } from "react";

type TextTypeProps = {
  text: string[];
  typingSpeed?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  deleteMode?: "backspace";
  typeEffect?: "none";
  mistakes?: number;
  cursorStyle?: "underscore";
  cursorGlide?: boolean;
  showCursor?: boolean;
  cursorColor?: string;
  prefixColor?: string;
  cursorBlinkDuration?: number;
  cursorCharacter?: string;
  prefix?: string;
};

export default function TextType({
  text,
  typingSpeed = 75,
  pauseDuration = 1500,
  deletingSpeed = 50,
  deleteMode = "backspace",
  typeEffect = "none",
  mistakes = 0,
  cursorStyle = "underscore",
  cursorGlide = true,
  showCursor = true,
  cursorColor = "currentColor",
  prefixColor = "currentColor",
  cursorBlinkDuration = 0.5,
  cursorCharacter = "_",
  prefix = "",
}: TextTypeProps) {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentText = text[textIndex] ?? "";

  useEffect(() => {
    if (!text.length) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Finished typing
    if (!isDeleting && displayText === currentText) {
      timeoutRef.current = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }

    // Finished deleting
    if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % text.length);

      return;
    }

    const speed = isDeleting ? deletingSpeed : typingSpeed;

    timeoutRef.current = setTimeout(() => {
      if (isDeleting) {
        setDisplayText((prev) => prev.slice(0, -1));
      } else {
        setDisplayText(currentText.slice(0, displayText.length + 1));
      }
    }, speed);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    currentText,
    displayText,
    isDeleting,
    text,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
  ]);

  return (
    <span
      className="inline-flex items-baseline"
      style={{
        color: "inherit",
      }}
    >
      {prefix && (
        <span style={{ color: prefixColor }}>
          {prefix}
        </span>
      )}

      <span>{displayText}</span>

      {showCursor && (
        <span
          aria-hidden="true"
          style={{
            color: cursorColor,
            display: "inline-block",
            marginLeft: "0.05em",
            animation: `textTypeBlink ${cursorBlinkDuration}s ease-in-out infinite`,
            transform: cursorGlide ? "translateY(0)" : undefined,
          }}
        >
          {cursorCharacter}
        </span>
      )}

      <style jsx>{`
        @keyframes textTypeBlink {
          0%,
          45% {
            opacity: 1;
          }

          50%,
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </span>
  );
}