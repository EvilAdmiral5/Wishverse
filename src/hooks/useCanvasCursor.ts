import { useEffect, useRef } from "react";

type Point = {
  x: number;
  y: number;
};

type Node = Point & {
  vx: number;
  vy: number;
};

const TRAIL_COUNT = 20;
const NODE_COUNT = 50;
const SPRING = 0.4;
const FRICTION = 0.45;
const TENSION = 0.98;

const useCanvasCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) return;

    let animationFrame = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const mouse: Point = {
      x: width / 2,
      y: height / 2,
    };

    const trails: Node[][] = Array.from(
      { length: TRAIL_COUNT },
      () =>
        Array.from({ length: NODE_COUNT }, () => ({
          x: mouse.x,
          y: mouse.y,
          vx: 0,
          vy: 0,
        })),
    );

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const updatePointer = (event: PointerEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const drawTrail = (
      trail: Node[],
      trailIndex: number,
      time: number,
    ) => {
      let targetX = mouse.x;
      let targetY = mouse.y;

      for (let i = 0; i < NODE_COUNT; i += 1) {
        const node = trail[i];

        const dx = targetX - node.x;
        const dy = targetY - node.y;

        node.vx += dx * SPRING;
        node.vy += dy * SPRING;

        node.vx *= FRICTION;
        node.vy *= FRICTION;

        node.x += node.vx;
        node.y += node.vy;

        targetX = node.x;
        targetY = node.y;
      }

      context.beginPath();
      context.moveTo(trail[0].x, trail[0].y);

      for (let i = 1; i < NODE_COUNT - 1; i += 1) {
        const current = trail[i];
        const next = trail[i + 1];

        const controlX = current.x;
        const controlY = current.y;
        const endX = (current.x + next.x) / 2;
        const endY = (current.y + next.y) / 2;

        context.quadraticCurveTo(
          controlX,
          controlY,
          endX,
          endY,
        );
      }

      const alpha =
        (1 - trailIndex / TRAIL_COUNT) * 0.18;

      const hue =
        325 + Math.sin(time * 0.00045 + trailIndex * 0.16) * 8;

      context.strokeStyle = `hsla(${hue}, 58%, 82%, ${alpha})`;
      context.lineWidth =
        1.8 * (1 - trailIndex / TRAIL_COUNT * 0.72);
      context.lineCap = "round";
      context.lineJoin = "round";
      context.stroke();
    };

    const render = (time: number) => {
      context.clearRect(0, 0, width, height);

      context.globalCompositeOperation = "lighter";

      for (let i = TRAIL_COUNT - 1; i >= 0; i -= 1) {
        drawTrail(trails[i], i, time);
      }

      context.globalCompositeOperation = "source-over";

      animationFrame = window.requestAnimationFrame(render);
    };

    resize();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", updatePointer, {
      passive: true,
    });

    animationFrame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", updatePointer);
      context.clearRect(0, 0, width, height);
    };
  }, []);

  return canvasRef;
};

export default useCanvasCursor;
