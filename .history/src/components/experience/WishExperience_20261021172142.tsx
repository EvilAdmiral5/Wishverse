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
