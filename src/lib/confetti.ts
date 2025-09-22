import confetti from 'canvas-confetti';

// Hodges & Fooshee brand colors
const HF_COLORS = [
  '#f26522', // HF Orange
  '#6f2dbd', // HF Purple  
  '#7bb440', // HF Green
  '#c0392b', // HF Red
  '#000000'  // Black
];

export const confettiCannon = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  
  // Multiple burst patterns for ultra-realistic effect
  const confettiConfig = {
    particleCount: 150,
    spread: 60,
    origin: { y: 0.6 },
    colors: HF_COLORS,
    gravity: 1.2,
    drift: 0.1,
    ticks: 200,
    scalar: 1.2
  };

  const frame = () => {
    const timeLeft = animationEnd - Date.now();
    
    if (timeLeft <= 0) return;

    // Left cannon
    confetti({
      ...confettiConfig,
      angle: 60,
      origin: { x: 0.1, y: 0.6 },
      particleCount: Math.floor((timeLeft / duration) * 100)
    });
    
    // Right cannon  
    confetti({
      ...confettiConfig,
      angle: 120,
      origin: { x: 0.9, y: 0.6 },
      particleCount: Math.floor((timeLeft / duration) * 100)
    });
    
    // Center burst
    confetti({
      ...confettiConfig,
      angle: 90,
      spread: 120,
      origin: { x: 0.5, y: 0.5 },
      particleCount: Math.floor((timeLeft / duration) * 80)
    });

    requestAnimationFrame(frame);
  };
  
  frame();
  
  // Mega burst at the end
  setTimeout(() => {
    confetti({
      particleCount: 300,
      spread: 160,
      origin: { y: 0.3 },
      colors: HF_COLORS,
      gravity: 0.8,
      scalar: 1.5,
      ticks: 300
    });
  }, 500);
};