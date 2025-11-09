"use client";
import confetti from "canvas-confetti";
import { useCallback } from "react";

export default function useConfetti() {
  const fire = useCallback(() => {
    // create one-time full-screen canvas
    const canvas = document.createElement("canvas");
    canvas.className = "confetti-canvas";
    document.body.appendChild(canvas);

    const myConfetti = confetti.create(canvas, { resize: true, useWorker: true });

    const colors = ["#6A3EA1", "#F2572D", "#FF6A3E", "#1F2933", "#EDE3D6"];

    // sound (optional) - add /public/confetti-pop.mp3 if you want sound
    try {
      const audio = new Audio("/confetti-pop.mp3");
      audio.volume = 0.55;
      audio.play().catch(() => {});
    } catch (e) {
      // silently fail if audio file doesn't exist
    }

    const duration = 2500;
    const end = Date.now() + duration;

    (function frame() {
      myConfetti({
        particleCount: 8,
        spread: 75,
        startVelocity: 55,
        ticks: 200,
        gravity: 1.05,
        colors,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        scalar: 1.1,
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      } else {
        setTimeout(() => canvas.remove(), 400); // cleanup
      }
    })();
  }, []);

  return { fire };
}
