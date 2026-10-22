"use client";

import { useEffect, useRef, useState } from "react";

type SquishSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  trackColor?: string;
  trackOnColor?: string;
  width?: number;
  height?: number;
  radius?: number;
  speed?: number;
  stretch?: number;
  hoverScale?: number;
  colorDuration?: number;
  disabled?: boolean;
  thumbColor?: string;
  thumbOnColor?: string;
};

export default function SquishSwitch({
  checked,
  onChange,
  label = "",
  trackColor = "#27272a",
  trackOnColor = "#f5f5f5",
  width = 50,
  height = 30,
  radius = 15,
  speed = 50,
  stretch = 20,
  hoverScale = 1.035,
  colorDuration = 320,
  disabled = false,
  thumbColor = "#4e4e51",
  thumbOnColor = "#27272a",
}: SquishSwitchProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const previousChecked = useRef(checked);

  useEffect(() => {
    previousChecked.current = checked;
  }, [checked]);

  const thumbSize = Math.max(4, height - 8);
  const travel = Math.max(0, width - thumbSize - 8);

  // "stretch" controls how much the thumb visually squishes while moving.
  const safeStretch = Math.max(0, Math.min(stretch, 60));
  const moving =
    previousChecked.current !== checked;

  const handleClick = () => {
    if (disabled) return;
    onChange(!checked);
  };

  return (
    <div className="inline-flex items-center">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label || "Toggle switch"}
        disabled={disabled}
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setPressed(false);
        }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        className="relative shrink-0 border-0 p-0 outline-none"
        style={{
          width,
          height,
          borderRadius: radius,
          background: checked ? trackOnColor : trackColor,
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
          transition: `background ${colorDuration}ms ease, transform ${Math.max(
            80,
            speed * 2
          )}ms ease`,
          transform: hovered && !disabled
            ? `scale(${hoverScale})`
            : "scale(1)",
          boxShadow: checked
            ? "inset 0 0 0 1px rgba(0,0,0,0.08)"
            : "inset 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 4,
            left: 4,
            width: thumbSize,
            height: thumbSize,
            borderRadius: "50%",
            background: checked ? thumbOnColor : thumbColor,
            transform: `
              translateX(${checked ? travel : 0}px)
              scaleX(${pressed ? 0.82 : moving ? 1 + safeStretch / 100 : 1})
            `,
            transformOrigin: checked ? "right center" : "left center",
            transition: `
              transform ${Math.max(100, speed * 3)}ms cubic-bezier(.22,1,.36,1),
              background ${colorDuration}ms ease,
              box-shadow ${colorDuration}ms ease
            `,
            boxShadow: checked
              ? "0 2px 7px rgba(0,0,0,0.18)"
              : "0 2px 6px rgba(0,0,0,0.24)",
          }}
        />

        {label ? (
          <span className="sr-only">{label}</span>
        ) : null}
      </button>
    </div>
  );
}
