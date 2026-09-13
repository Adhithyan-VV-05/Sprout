'use client';

import React, { useEffect, useRef } from 'react';

export default function ParticleCanvas({ sceneId = 1, emotionalState = 'WONDER' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Dynamic particle density and speed based on emotionalState
    const isWither = emotionalState === 'DANGER' || emotionalState === 'UNEASE' || sceneId === 3 || sceneId === 14;
    const isNight = emotionalState === 'INTIMACY' || sceneId === 12;

    const count = isNight ? 65 : isWither ? 45 : 40;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.4 + 0.6,
      speedX: (Math.random() - 0.5) * (isWither ? 0.8 : 0.4),
      speedY: -Math.random() * 0.4 - 0.15,
      alpha: Math.random() * 0.7 + 0.25,
      pulse: Math.random() * 0.04 + 0.01,
      sway: Math.random() * Math.PI * 2
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const time = Date.now() * 0.002;

      particles.forEach((p) => {
        p.sway += 0.02;
        p.x += p.speedX + Math.sin(p.sway) * 0.3;
        p.y += p.speedY;
        p.alpha += Math.sin(time + p.sway) * p.pulse;

        if (p.y < -15) p.y = height + 15;
        if (p.x < -15) p.x = width + 15;
        if (p.x > width + 15) p.x = -15;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        const currentAlpha = Math.max(0.1, Math.min(0.9, p.alpha));

        if (isNight) {
          // Night scene - twinkling starlight
          ctx.fillStyle = `rgba(240, 246, 255, ${currentAlpha})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#D4E6FF';
        } else if (isWither) {
          // Wither / Danger scene - ominous embers
          ctx.fillStyle = `rgba(220, 100, 90, ${currentAlpha * 0.85})`;
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#E74C3C';
        } else {
          // Golden growth spores
          ctx.fillStyle = `rgba(255, 220, 110, ${currentAlpha})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#FFDC69';
        }

        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [sceneId, emotionalState]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 3
      }}
    />
  );
}
