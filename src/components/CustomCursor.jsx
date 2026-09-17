'use client';

import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const dotWrapRef = useRef(null);
  const ringWrapRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isInside, setIsInside] = useState(false);
  const [cursorType, setCursorType] = useState('default');
  const [isSupported, setIsSupported] = useState(false);

  const mousePos = useRef({ x: -200, y: -200 });
  const ringPos = useRef({ x: -200, y: -200 });

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    setIsSupported(true);

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isInside) setIsInside(true);

      // Instant 1-to-1 tracking for center dot with zero latency
      if (dotWrapRef.current) {
        dotWrapRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsInside(false);
    const handleMouseEnter = () => setIsInside(true);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target || !(target instanceof Element)) return;

      if (
        target.closest('.hero-btn-primary-journey') || 
        target.closest('.btn-lime-pill') || 
        target.closest('.sprout-return-btn')
      ) {
        setIsHovered(true);
        setCursorType('journey');
      } else if (
        target.closest('.hero-btn-secondary-watch') || 
        target.closest('.play-icon-bubble')
      ) {
        setIsHovered(true);
        setCursorType('watch');
      } else if (
        target.closest('.mode-btn-help') || 
        target.closest('.chat-mode-help-active') || 
        target.closest('.sprout-dispatch-btn')
      ) {
        setIsHovered(true);
        setCursorType('help');
      } else if (
        target.closest('.mode-btn-casual') || 
        target.closest('.chat-mode-casual-active')
      ) {
        setIsHovered(true);
        setCursorType('casual');
      } else if (
        target.closest('.sprout-chip-btn') || 
        target.closest('.ask-sprout-chip-item') || 
        target.closest('.prompt-chip')
      ) {
        setIsHovered(true);
        setCursorType('chip');
      } else if (
        target.closest('input') || 
        target.closest('textarea')
      ) {
        setIsHovered(true);
        setCursorType('input');
      } else if (
        target.closest('.sprout-avatar-badge') || 
        target.closest('.sprout-header-avatar') || 
        target.closest('.brand-leaf-logo-icon') || 
        target.closest('.mobile-btn-avatar')
      ) {
        setIsHovered(true);
        setCursorType('avatar');
      } else if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.interactive') ||
        target.closest('.minimal-arrow-btn') ||
        target.closest('.minimal-story-close-btn') ||
        target.closest('.feature-badge-item')
      ) {
        setIsHovered(true);
        setCursorType('default-hover');
      } else {
        setIsHovered(false);
        setCursorType('default');
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    // Smooth physics follower loop for outer ring
    let animId;
    const lerp = 0.22; // Buttery responsive trailing

    const renderLoop = () => {
      const dx = mousePos.current.x - ringPos.current.x;
      const dy = mousePos.current.y - ringPos.current.y;

      ringPos.current.x += dx * lerp;
      ringPos.current.y += dy * lerp;

      if (ringWrapRef.current) {
        ringWrapRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animId);
    };
  }, [isInside]);

  if (!isSupported) return null;

  const visibilityClass = isInside ? 'cursor-visible' : 'cursor-hidden';

  return (
    <div className={`awwwards-cursor-system ${visibilityClass}`} aria-hidden="true">
      {/* 1. Instant Center Dot Position Wrapper */}
      <div ref={dotWrapRef} className="awwwards-cursor-dot-wrap">
        <div 
          className={`awwwards-cursor-dot-core ${isClicked ? 'clicked' : ''} ${isHovered ? 'hovered' : ''} cursor-${cursorType}`} 
        />
      </div>

      {/* 2. Physics Trailing Ring Position Wrapper */}
      <div ref={ringWrapRef} className="awwwards-cursor-ring-wrap">
        <div 
          className={`awwwards-cursor-ring-core ${isClicked ? 'clicked' : ''} ${isHovered ? 'hovered' : ''} cursor-${cursorType}`} 
        />
      </div>
    </div>
  );
}
