'use client';

import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorType, setCursorType] = useState('default'); // 'journey', 'watch', 'help', 'casual', 'chip', 'input', 'avatar', 'default'

  const posRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    setIsVisible(true);

    const handleMouseMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    const handleMouseOver = (e) => {
      const target = e.target;
      
      if (target.closest('.hero-btn-primary-journey') || target.closest('.btn-lime-pill')) {
        setIsHovered(true);
        setCursorType('journey');
      } else if (target.closest('.hero-btn-secondary-watch') || target.closest('.play-icon-bubble')) {
        setIsHovered(true);
        setCursorType('watch');
      } else if (target.closest('.mode-btn-help') || target.closest('.chat-mode-help-active')) {
        setIsHovered(true);
        setCursorType('help');
      } else if (target.closest('.mode-btn-casual') || target.closest('.chat-mode-casual-active')) {
        setIsHovered(true);
        setCursorType('casual');
      } else if (target.closest('.sprout-chip-btn') || target.closest('.ask-sprout-chip-item')) {
        setIsHovered(true);
        setCursorType('chip');
      } else if (target.closest('input') || target.closest('textarea')) {
        setIsHovered(true);
        setCursorType('input');
      } else if (target.closest('.sprout-avatar-badge') || target.closest('.sprout-header-avatar') || target.closest('.brand-leaf-logo-icon')) {
        setIsHovered(true);
        setCursorType('avatar');
      } else if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.interactive') ||
        target.closest('.feature-badge-item')
      ) {
        setIsHovered(true);
        setCursorType('default-hover');
      } else {
        setIsHovered(false);
        setCursorType('default');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    // Smooth spring follower loop for outer ring
    let animId;
    const renderLoop = () => {
      const dx = posRef.current.x - ringPosRef.current.x;
      const dy = posRef.current.y - ringPosRef.current.y;

      ringPosRef.current.x += dx * 0.18;
      ringPosRef.current.y += dy * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPosRef.current.x}px, ${ringPosRef.current.y}px, 0)`;
      }

      animId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div 
        ref={dotRef} 
        className={`awwwards-cursor-dot ${isClicked ? 'clicked' : ''} ${isHovered ? 'hovered' : ''} cursor-${cursorType}`} 
      />
      <div 
        ref={ringRef} 
        className={`awwwards-cursor-ring ${isClicked ? 'clicked' : ''} ${isHovered ? 'hovered' : ''} cursor-${cursorType}`} 
      />
    </>
  );
}
