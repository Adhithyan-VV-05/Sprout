import React, { useState } from 'react';
import { 
  ArrowRight, 
  ChevronRight,
  Sparkles,
  Heart,
  Users,
  Globe,
  Leaf,
  Flower2,
  Feather,
  Flame
} from 'lucide-react';
import { layoutConfig, calcBgOffset } from '../config/layoutConfig';

export default function SectionPillars({ userProfile, onStartStory }) {
  const [activeRuneId, setActiveRuneId] = useState(1);
  const cfg = layoutConfig.section3Pillars;
  const runes = cfg.powersRunes.runes;
  const storySteps = cfg.journeyArea.storySteps;

  const renderRuneIcon = (iconType, color) => {
    switch (iconType) {
      case 'leaf':
        return <Leaf size={20} color="#ffffff" />;
      case 'flower':
        return <Flower2 size={20} color="#ffffff" />;
      case 'feather':
        return <Feather size={20} color="#ffffff" />;
      case 'users':
        return <Users size={20} color="#ffffff" />;
      case 'heart':
        return <Heart size={20} color="#ffffff" />;
      case 'flame':
        return <Flame size={20} color="#ffffff" />;
      default:
        return <Sparkles size={20} color="#ffffff" />;
    }
  };

  return (
    <section id="powers" className="continuous-section section-pillars section-blend-3">


      {/* Foreground Content Layout */}
      <div className="continuous-section-content pillars-content-wrapper">
        
        {/* Top Powers Portion: SPROUT'S POWERS (Direct on background - No Card Box) */}
        <div 
          className="powers-top-area"
          style={{
            position: 'absolute',
            top: cfg.powersText.position.top,
            left: cfg.powersText.position.left,
            right: cfg.powersRunes.position.right,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1.5rem',
            zIndex: 15
          }}
        >
          {/* Left Text Block */}
          <div 
            className="powers-direct-content"
            style={{ maxWidth: cfg.powersText.position.maxWidth }}
          >
            <div className="section-eyebrow-tag powers-eyebrow">
              <Sparkles size={13} className="text-emerald-400" />
              <span>{cfg.powersText.eyebrow}</span>
            </div>

            <h2 className="powers-heading-serif" style={{ whiteSpace: 'pre-line' }}>
              {cfg.powersText.heading}
            </h2>

            <p className="powers-subtitle-text">
              {cfg.powersText.subtitle}
            </p>

            <button 
              type="button" 
              className="btn-lime-pill interactive"
              onClick={onStartStory}
            >
              <span>{cfg.powersText.buttonText}</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* 6 Circular Glowing Power Runes matching Reference Image */}
          <div 
            className="powers-circular-runes-row"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1.2rem',
              maxWidth: cfg.powersRunes.position.maxWidth
            }}
          >
            {runes.map((rune) => {
              const isActive = rune.id === activeRuneId;
              return (
                <div 
                  key={rune.id} 
                  className={`power-circular-item ${isActive ? 'active' : ''} interactive`}
                  onClick={() => setActiveRuneId(rune.id)}
                  style={{ '--rune-color': rune.color }}
                >
                  <div 
                    className="power-circle-badge"
                    style={{
                      backgroundColor: rune.color,
                      boxShadow: isActive 
                        ? `0 0 25px ${rune.color}, 0 0 40px ${rune.color}`
                        : `0 0 16px ${rune.color}aa`
                    }}
                  >
                    {renderRuneIcon(rune.iconType, rune.color)}
                  </div>
                  <h4 className="power-circle-title">{rune.name}</h4>
                  <p className="power-circle-desc" style={{ whiteSpace: 'pre-line' }}>{rune.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle Parchment Scroll Portion: THE JOURNEY (5 Story Steps) */}
        <div 
          className="journey-parchment-scroll-area" 
          id="journey"
          style={{
            position: 'absolute',
            top: cfg.journeyArea.position.top,
            left: cfg.journeyArea.position.left,
            transform: cfg.journeyArea.position.transform,
            width: cfg.journeyArea.position.width,
            maxWidth: cfg.journeyArea.position.maxWidth,
            zIndex: 15
          }}
        >
          <div className="journey-scroll-header">
            <div className="section-eyebrow-tag parchment-eyebrow">
              <span>{cfg.journeyArea.eyebrow}</span>
            </div>
            <h2 className="parchment-scroll-title">{cfg.journeyArea.title}</h2>
            <p className="parchment-scroll-sub">{cfg.journeyArea.subtitle}</p>
          </div>

          {/* 5 Sequence Story Cards */}
          <div className="journey-story-cards-row">
            {storySteps.map((step, idx) => {
              const targetSceneId = step.num === 1 ? 3 : step.num === 2 ? 6 : step.num === 3 ? 10 : step.num === 4 ? 11 : 12;
              return (
                <React.Fragment key={step.num}>
                  <div 
                    className="story-step-card interactive" 
                    onClick={() => onStartStory(targetSceneId)}
                    title={`Open Chapter ${targetSceneId}`}
                  >
                    <div className="story-step-img-wrapper">
                      <img src={step.image} alt={step.title} className="story-step-thumbnail-img" />
                    </div>
                    <h4 className="story-step-title">{step.title}</h4>
                    <p className="story-step-sub">{step.subtitle}</p>
                  </div>
                  {idx < storySteps.length - 1 && (
                    <div className="story-step-arrow-circle">
                      <ChevronRight size={13} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Bottom Portion: OUR MISSION (Direct on background - No Card Box) */}
        <div 
          className="mission-bottom-area" 
          id="mission"
          style={{
            position: 'absolute',
            bottom: cfg.missionArea.content.position.bottom,
            left: cfg.missionArea.signboard.position.left,
            right: cfg.missionArea.content.position.right,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            zIndex: 15
          }}
        >
          {/* Wooden Signboard Accent on Left */}
          <div className="wooden-signboard-accent desktop-only">
            <span className="handwritten-sign-text" style={{ whiteSpace: 'pre-line' }}>
              {cfg.missionArea.signboard.text}
            </span>
          </div>

          {/* Mission Content on Right - Direct on background */}
          <div 
            className="mission-direct-content"
            style={{ maxWidth: cfg.missionArea.content.position.maxWidth }}
          >
            <div className="section-eyebrow-tag mission-eyebrow">
              <Sparkles size={13} className="text-emerald-400" />
              <span>{cfg.missionArea.content.eyebrow}</span>
            </div>

            <h2 className="mission-heading-serif" style={{ whiteSpace: 'pre-line' }}>
              {cfg.missionArea.content.heading}
            </h2>

            <p className="mission-narrative-text">
              {cfg.missionArea.content.narrative}
            </p>

            <button 
              type="button" 
              className="btn-dark-green-pill interactive"
              onClick={onStartStory}
            >
              <span>{cfg.missionArea.content.buttonText}</span>
              <ArrowRight size={15} />
            </button>

            {/* 4 Feature Items */}
            <div className="mission-features-grid">
              {cfg.missionArea.content.features.map((feat, fIdx) => (
                <div key={fIdx} className="mission-feature-item">
                  {feat.icon === 'Leaf' && <Leaf size={15} className="text-emerald-400" />}
                  {feat.icon === 'Heart' && <Heart size={15} className="text-pink-400" />}
                  {feat.icon === 'Users' && <Users size={15} className="text-purple-400" />}
                  {feat.icon === 'Globe' && <Globe size={15} className="text-amber-400" />}
                  <span>{feat.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
