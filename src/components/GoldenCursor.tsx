import { useEffect, useRef, useCallback } from "react";

interface Trail {
  x: number;
  y: number;
  life: number;
  size: number;
}

const GoldenCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trails = useRef<Trail[]>([]);
  const mouse = useRef({ x: -100, y: -100 });
  const raf = useRef<number>(0);

  const lastSpawn = useRef(0);
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouse.current = { x: e.clientX, y: e.clientY };
    const now = performance.now();
    if (now - lastSpawn.current < 24) return; // throttle spawns ~40fps
    lastSpawn.current = now;
    trails.current.push({
      x: e.clientX + (Math.random() - 0.5) * 6,
      y: e.clientY + (Math.random() - 0.5) * 6,
      life: 1,
      size: Math.random() * 3 + 2,
    });
    if (trails.current.length > 40) trails.current = trails.current.slice(-40);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw trail particles
      trails.current = trails.current.filter((t) => {
        t.life -= 0.025;
        if (t.life <= 0) return false;

        const alpha = t.life * 0.6;
        const size = t.size * t.life;

        // Gold glow
        ctx.beginPath();
        ctx.arc(t.x, t.y, size, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, size);
        grad.addColorStop(0, `hsla(42, 85%, 55%, ${alpha})`);
        grad.addColorStop(0.5, `hsla(30, 80%, 48%, ${alpha * 0.5})`);
        grad.addColorStop(1, `hsla(42, 85%, 55%, 0)`);
        ctx.fillStyle = grad;
        ctx.fill();

        return true;
      });

      // Main cursor glow
      const glow = ctx.createRadialGradient(
        mouse.current.x, mouse.current.y, 0,
        mouse.current.x, mouse.current.y, 25
      );
      glow.addColorStop(0, "hsla(42, 85%, 55%, 0.15)");
      glow.addColorStop(0.5, "hsla(30, 80%, 48%, 0.05)");
      glow.addColorStop(1, "hsla(42, 85%, 55%, 0)");
      ctx.beginPath();
      ctx.arc(mouse.current.x, mouse.current.y, 25, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      raf.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default GoldenCursor;
