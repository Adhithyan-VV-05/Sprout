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
    let mouseX = -9999;
    let mouseY = -9999;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Dynamic particle density and speed based on emotionalState
    const isWither = emotionalState === 'DANGER' || emotionalState === 'UNEASE' || sceneId === 3 || sceneId === 14;
    const isNight = emotionalState === 'INTIMACY' || sceneId === 12;

    const count = isNight ? 70 : isWither ? 45 : 55;
    const particles = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 0.8,
      speedX: (Math.random() - 0.5) * (isWither ? 0.8 : 0.4),
      speedY: -Math.random() * 0.45 - 0.15,
      alpha: Math.random() * 0.7 + 0.25,
      pulse: Math.random() * 0.04 + 0.015,
      sway: Math.random() * Math.PI * 2,
      colorType: i % 3 // 0 = gold, 1 = emerald, 2 = cyan/amber
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const time = Date.now() * 0.002;

      particles.forEach((p) => {
        p.sway += 0.02;
        p.x += p.speedX + Math.sin(p.sway) * 0.35;
        p.y += p.speedY;
        p.alpha += Math.sin(time + p.sway) * p.pulse;

        // Interactive mouse reaction (gentle repulsion and swirl)
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140 && dist > 0) {
          const force = (140 - dist) / 140;
          p.x += (dx / dist) * force * 2.2;
          p.y += (dy / dist) * force * 2.2;
        }

        if (p.y < -15) p.y = height + 15;
        if (p.x < -15) p.x = width + 15;
        if (p.x > width + 15) p.x = -15;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        const currentAlpha = Math.max(0.12, Math.min(0.95, p.alpha));

        if (isNight) {
          ctx.fillStyle = `rgba(240, 246, 255, ${currentAlpha})`;
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#D4E6FF';
        } else if (isWither) {
          ctx.fillStyle = `rgba(220, 100, 90, ${currentAlpha * 0.85})`;
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#E74C3C';
        } else {
          // Bioluminescent forest fireflies palette
          if (p.colorType === 0) {
            ctx.fillStyle = `rgba(255, 225, 120, ${currentAlpha})`;
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#FBBF24';
          } else if (p.colorType === 1) {
            ctx.fillStyle = `rgba(134, 239, 172, ${currentAlpha})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#4ADE80';
          } else {
            ctx.fillStyle = `rgba(167, 243, 208, ${currentAlpha * 0.9})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#34D399';
          }
        }

        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [sceneId, emotionalState]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 3
      }}
    />
  );
}
