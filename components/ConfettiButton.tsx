"use client";

import { useState } from "react";
import { Rocket } from "lucide-react";

export function ConfettiButton() {
  const [isExploding, setIsExploding] = useState(false);

  const handleClick = () => {
    setIsExploding(true);

    // Create confetti effect
    const colors = ["#E87722", "#7BB241", "#6F4DA0", "#C0392B"];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement("div");
      confetti.style.position = "fixed";
      confetti.style.left = "50%";
      confetti.style.top = "20%";
      confetti.style.width = "10px";
      confetti.style.height = "10px";
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0%";
      confetti.style.pointerEvents = "none";
      confetti.style.zIndex = "9999";

      document.body.appendChild(confetti);

      const angle = (Math.PI * 2 * i) / confettiCount;
      const velocity = 5 + Math.random() * 5;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity - 10;

      let x = 0;
      let y = 0;
      let opacity = 1;
      let rotation = 0;

      const animate = () => {
        x += vx;
        y += vy + (y * 0.05); // gravity
        opacity -= 0.01;
        rotation += 10;

        confetti.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
        confetti.style.opacity = opacity.toString();

        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          confetti.remove();
        }
      };

      requestAnimationFrame(animate);
    }

    setTimeout(() => setIsExploding(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isExploding}
      className="glass px-3 py-2 rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-colors disabled:opacity-50"
    >
      <Rocket className={`w-4 h-4 ${isExploding ? "animate-bounce" : ""}`} />
      Celebrate
    </button>
  );
}
