import { h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { Signal, signal, useSignal } from "@preact/signals";

// Move configuration outside component but keep as signals
const particleCount = signal(50);
const colors = signal(["#1E88E5", "#00ACC1", "#64B5F6", "#4DD0E1"]);
const animationSpeed = signal(1);

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
}

// Split animation logic into a separate function
function createParticles(width: number, height: number): Particle[] {
  return Array.from({ length: particleCount.value }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 5 + 1,
    speedX: Math.random() * 3 - 1.5,
    speedY: Math.random() * 3 - 1.5,
    color: colors.value[Math.floor(Math.random() * colors.value.length)]
  }));
}

export default function AnimatedBackground() {
  // Early return for server-side rendering
  if (!IS_BROWSER) {
    return <div class="fixed inset-0 w-full h-full overflow-hidden -z-10" />;
  }

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useSignal<Particle[]>([]);
  const isAnimating = useSignal(true);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Reinitialize particles on resize
      particles.value = createParticles(canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    particles.value = createParticles(canvas.width, canvas.height);

    // Animation loop
    function animate() {
      if (!isAnimating.value || !ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.value = particles.value.map(particle => {
        // Update position
        particle.x += particle.speedX * animationSpeed.value;
        particle.y += particle.speedY * animationSpeed.value;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        return particle;
      });

      animationFrameId.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      isAnimating.value = false;
    };
  }, []);

  return (
    <div class="fixed inset-0 w-full h-full overflow-hidden -z-10">
      <canvas
        ref={canvasRef}
        class="absolute inset-0 w-full h-full"
        style={{
          opacity: 0.6,
          pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 100%)"
        }}
      />
    </div>
  );
}