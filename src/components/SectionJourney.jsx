'use client';

import React, { useState } from 'react';
import { ArrowRight, Sparkles, Shield, BookOpen } from 'lucide-react';
import { layoutConfig, calcBgOffset } from '../config/layoutConfig';

export default function SectionJourney({ onStartStory }) {
  const [activePolaroid, setActivePolaroid] = useState(null);
  const cfg = layoutConfig.section2Journey;
  const polaroids = cfg.polaroidCards;

  return (
    <section id="story" className="continuous-section section-journey section-blend-2">


      {/* Foreground Content Layout */}
      <div className="continuous-section-content journey-content-wrapper">
        
        {/* Top Scroll Portion: OUR STORY (Direct on painted parchment - No Card Box) */}
        <div 
          className="scroll-story-direct-content"
          style={{
            position: 'absolute',
            top: cfg.storyText.position.top,
            left: cfg.storyText.position.left,
            right: cfg.storyText.position.right,
            bottom: cfg.storyText.position.bottom,
            maxWidth: cfg.storyText.position.maxWidth,
            zIndex: 15
          }}
        >
          <div className="section-eyebrow-tag dark-eyebrow">
            <span>{cfg.storyText.eyebrow}</span>
          </div>
          
          <h2 className="scroll-heading-serif" style={{ whiteSpace: 'pre-line' }}>
            {cfg.storyText.heading}
          </h2>
          
          <p className="scroll-narrative-text">
            {cfg.storyText.description}
          </p>
          
          <button 
            type="button" 
            className="btn-dark-green-pill interactive"
            onClick={onStartStory}
          >
            <span>{cfg.storyText.buttonText}</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* 3 Polaroid Captions with individual angle rotation and percentage coordinates */}
        {polaroids.map((p, idx) => (
          <div 
            key={p.id}
            className={`polaroid-caption-slot slot-${idx + 1} interactive`}
            style={{
              position: 'absolute',
              top: p.position.top,
              left: p.position.left,
              right: p.position.right,
              bottom: p.position.bottom,
              transform: `rotate(${p.rotation || '0deg'})`,
              zIndex: 20
            }}
            onClick={() => setActivePolaroid(activePolaroid === p.id ? null : p.id)}
            title="Click to view memory lore"
          >
            <span className="polaroid-handwritten-caption">{p.caption}</span>
          </div>
        ))}

        {/* Modal if Polaroid is clicked */}
        {activePolaroid && (
          <div className="polaroid-lore-modal" onClick={() => setActivePolaroid(null)}>
            <div className="polaroid-lore-card animate-beat-in" onClick={(e) => e.stopPropagation()}>
              <div className="lore-header">
                <span className="lore-badge">Memory 0{activePolaroid}</span>
                <h3 className="lore-title">{polaroids.find(p => p.id === activePolaroid)?.title}</h3>
                <span className="lore-sub">{polaroids.find(p => p.id === activePolaroid)?.subtitle}</span>
              </div>
              <p className="lore-desc">{polaroids.find(p => p.id === activePolaroid)?.description}</p>
              <blockquote className="lore-quote">{polaroids.find(p => p.id === activePolaroid)?.quote}</blockquote>
              <button 
                type="button" 
                className="lore-close-btn interactive"
                onClick={() => setActivePolaroid(null)}
              >
                Close Memory
              </button>
            </div>
          </div>
        )}

        {/* Bottom Portion: THE SHADOW WE FACE (Direct on background - No Card Box) */}
        <div 
          className="shadow-content-direct-block"
          style={{
            position: 'absolute',
            bottom: cfg.shadowText.position.bottom,
            top: cfg.shadowText.position.top,
            left: cfg.shadowText.position.left,
            right: cfg.shadowText.position.right,
            maxWidth: cfg.shadowText.position.maxWidth,
            zIndex: 15
          }}
        >
          <div className="section-eyebrow-tag shadow-eyebrow">
            <span>{cfg.shadowText.eyebrow}</span>
          </div>
          
          <h2 className="shadow-heading-serif" style={{ whiteSpace: 'pre-line' }}>
            {cfg.shadowText.heading}
          </h2>
          
          <p className="shadow-narrative-text">
            {cfg.shadowText.description}
          </p>
          
          <button 
            type="button" 
            className="btn-lime-pill interactive"
            onClick={onStartStory}
          >
            <span>{cfg.shadowText.buttonText}</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Decorative Handwritten Script Accent on Right */}
        <div 
          className="handwritten-script-accent shadow-right-script desktop-only"
          style={{
            position: 'absolute',
            bottom: cfg.shadowRightScript.position.bottom,
            right: cfg.shadowRightScript.position.right,
            top: cfg.shadowRightScript.position.top,
            left: cfg.shadowRightScript.position.left,
            transform: `rotate(${cfg.shadowRightScript.position.rotation || '0deg'})`,
            whiteSpace: 'pre-line',
            zIndex: 15
          }}
        >
          {cfg.shadowRightScript.text}
        </div>

      </div>
    </section>
  );
}
