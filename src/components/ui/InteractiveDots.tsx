'use client';

import { useEffect, useRef, useCallback } from 'react';

interface InteractiveDotsProps {
  backgroundColor?: string;
  dotColor?: string;
  gridSpacing?: number;
  animationSpeed?: number;
  removeWaveLine?: boolean;
}

interface Dot {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  phase: number;
}

interface Ripple {
  x: number;
  y: number;
  time: number;
  intensity: number;
}

const InteractiveDots = ({
  backgroundColor = '#0F0D0E',
  dotColor = '#C8A24A',
  gridSpacing = 32,
  animationSpeed = 0.005,
  removeWaveLine = true,
}: InteractiveDotsProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const timeRef = useRef<number>(0);
  const animationFrameId = useRef<number | null>(null);

  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    isDown: false,
  });

  const ripples = useRef<Ripple[]>([]);
  const dotsRef = useRef<Dot[]>([]);
  const dprRef = useRef<number>(1);

  /*
   * Mouse influence
   */
  const getMouseInfluence = useCallback(
    (x: number, y: number): number => {
      const dx = x - mouseRef.current.x;
      const dy = y - mouseRef.current.y;

      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 150;

      return Math.max(0, 1 - distance / maxDistance);
    },
    []
  );

  /*
   * Ripple influence
   */
  const getRippleInfluence = useCallback(
    (x: number, y: number, currentTime: number): number => {
      let totalInfluence = 0;

      ripples.current.forEach((ripple) => {
        const age = currentTime - ripple.time;
        const maxAge = 3000;

        if (age >= maxAge) return;

        const dx = x - ripple.x;
        const dy = y - ripple.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        const progress = age / maxAge;
        const rippleRadius = progress * 300;

        const rippleWidth = 60;

        const distanceFromWave = Math.abs(
          distance - rippleRadius
        );

        if (distanceFromWave < rippleWidth) {
          const rippleStrength =
            (1 - progress) * ripple.intensity;

          const proximity =
            1 - distanceFromWave / rippleWidth;

          totalInfluence +=
            rippleStrength * proximity;
        }
      });

      return Math.min(totalInfluence, 2);
    },
    []
  );

  /*
   * Create dot grid
   */
  const initializeDots = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    const dots: Dot[] = [];

    for (
      let x = gridSpacing / 2;
      x < canvasWidth;
      x += gridSpacing
    ) {
      for (
        let y = gridSpacing / 2;
        y < canvasHeight;
        y += gridSpacing
      ) {
        dots.push({
          x,
          y,
          originalX: x,
          originalY: y,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    dotsRef.current = dots;
  }, [gridSpacing]);

  /*
   * Resize canvas
   */
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    dprRef.current = dpr;

    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;

    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    const ctx = canvas.getContext('2d');

    if (ctx) {
      /*
       * Important:
       * reset transform before applying DPR.
       * This prevents scaling from stacking
       * after repeated window resizes.
       */
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    initializeDots();
  }, [initializeDots]);

  /*
   * Mouse movement
   */
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();

      mouseRef.current.x =
        event.clientX - rect.left;

      mouseRef.current.y =
        event.clientY - rect.top;
    },
    []
  );

  /*
   * Mouse click
   */
  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      mouseRef.current.isDown = true;

      const rect = canvas.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      ripples.current.push({
        x,
        y,
        time: Date.now(),
        intensity: 2,
      });

      /*
       * Keep only recent ripples.
       */
      const now = Date.now();

      ripples.current =
        ripples.current.filter(
          (ripple) =>
            now - ripple.time < 3000
        );
    },
    []
  );

  /*
   * Mouse release
   */
  const handleMouseUp = useCallback(() => {
    mouseRef.current.isDown = false;
  }, []);

  /*
   * Animation loop
   */
  const animate = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    timeRef.current += animationSpeed;

    const currentTime = Date.now();

    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    /*
     * Clear background
     */
    ctx.fillStyle = backgroundColor;

    ctx.fillRect(
      0,
      0,
      canvasWidth,
      canvasHeight
    );

    /*
     * Convert HEX → RGB
     */
    const hex = dotColor.replace('#', '');

    const red = Number.parseInt(
      hex.substring(0, 2),
      16
    );

    const green = Number.parseInt(
      hex.substring(2, 4),
      16
    );

    const blue = Number.parseInt(
      hex.substring(4, 6),
      16
    );

    /*
     * Draw dots
     */
    dotsRef.current.forEach((dot) => {
      const mouseInfluence =
        getMouseInfluence(
          dot.originalX,
          dot.originalY
        );

      const rippleInfluence =
        getRippleInfluence(
          dot.originalX,
          dot.originalY,
          currentTime
        );

      const totalInfluence =
        mouseInfluence + rippleInfluence;

      /*
       * Keep grid fixed.
       * Only the visual size changes.
       */
      dot.x = dot.originalX;
      dot.y = dot.originalY;

      const baseDotSize = 1.6;

      const breathing =
        Math.sin(
          timeRef.current + dot.phase
        ) * 0.35;

      const dotSize =
        baseDotSize +
        totalInfluence * 5 +
        breathing;

      const opacity = Math.max(
        0.18,
        Math.min(
          0.85,
          0.35 +
            totalInfluence * 0.3 +
            Math.abs(
              Math.sin(
                timeRef.current * 0.5 +
                  dot.phase
              )
            ) *
              0.08
        )
      );

      ctx.beginPath();

      ctx.arc(
        dot.x,
        dot.y,
        Math.max(0.5, dotSize),
        0,
        Math.PI * 2
      );

      ctx.fillStyle = `rgba(
        ${red},
        ${green},
        ${blue},
        ${opacity}
      )`;

      ctx.fill();
    });

    /*
     * Optional ripple circles.
     *
     * Disabled by default for WishVerse
     * to keep the background subtle.
     */
    if (!removeWaveLine) {
      ripples.current.forEach((ripple) => {
        const age =
          currentTime - ripple.time;

        const maxAge = 3000;

        if (age >= maxAge) return;

        const progress =
          age / maxAge;

        const radius =
          progress * 300;

        const alpha =
          (1 - progress) *
          0.3 *
          ripple.intensity;

        ctx.beginPath();

        ctx.strokeStyle =
          `rgba(200, 162, 74, ${alpha})`;

        ctx.lineWidth = 1.5;

        ctx.arc(
          ripple.x,
          ripple.y,
          radius,
          0,
          Math.PI * 2
        );

        ctx.stroke();
      });
    }

    animationFrameId.current =
      requestAnimationFrame(animate);
  }, [
    animationSpeed,
    backgroundColor,
    dotColor,
    getMouseInfluence,
    getRippleInfluence,
    removeWaveLine,
  ]);

  /*
   * Setup
   */
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    resizeCanvas();

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener(
      'resize',
      handleResize
    );

    canvas.addEventListener(
      'mousemove',
      handleMouseMove
    );

    canvas.addEventListener(
      'mousedown',
      handleMouseDown
    );

    window.addEventListener(
      'mouseup',
      handleMouseUp
    );

    animate();

    return () => {
      window.removeEventListener(
        'resize',
        handleResize
      );

      canvas.removeEventListener(
        'mousemove',
        handleMouseMove
      );

      canvas.removeEventListener(
        'mousedown',
        handleMouseDown
      );

      window.removeEventListener(
        'mouseup',
        handleMouseUp
      );

      if (
        animationFrameId.current !== null
      ) {
        cancelAnimationFrame(
          animationFrameId.current
        );

        animationFrameId.current = null;
      }

      timeRef.current = 0;

      ripples.current = [];

      dotsRef.current = [];

      mouseRef.current = {
        x: -1000,
        y: -1000,
        isDown: false,
      };
    };
  }, [
    animate,
    resizeCanvas,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
  ]);

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto"
      style={{
        backgroundColor,
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
    </div>
  );
};

export default InteractiveDots;