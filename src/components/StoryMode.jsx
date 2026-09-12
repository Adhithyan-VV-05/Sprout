'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, ChevronRight, BookOpen, User, Sparkles, ArrowDown } from 'lucide-react';
import { STORY_SCENES } from '../data/storyData';
import ParticleCanvas from './ParticleCanvas';
import { getAdaptiveImageSource, getBlurPlaceholder } from '../services/imageOptimizer';

export default function StoryMode({ isActive, onClose, userProfile, updateUserProfile }) {
  const [beatIndex, setBeatIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [validationMsg, setValidationMsg] = useState('');
  const [showPortalTransition, setShowPortalTransition] = useState(true);
  const [isChapterDrawerOpen, setIsChapterDrawerOpen] = useState(false);

  // Background Image State
  const [bgImageSrc, setBgImageSrc] = useState('');
  const [bgBlurSrc, setBgBlurSrc] = useState('');
  const [isBgLoaded, setIsBgLoaded] = useState(false);

  const containerRef = useRef(null);

  // Flatten all 18 scenes into individual discrete beats with safeZone metadata
  const flatBeats = useMemo(() => {
    const beats = [];
    STORY_SCENES.forEach((scene) => {
      const sceneSafeZone = scene.safeZone || 'pos-top-left';

      // Narrative beats
      if (scene.beats) {
        scene.beats.forEach((b) => {
          beats.push({
            sceneId: scene.id,
            sceneTitle: scene.title,
            sceneCounter: scene.sceneCounter,
            image: scene.image,
            emotionalState: scene.emotionalState,
            safeZone: sceneSafeZone,
            type: b.type || 'narrative',
            text: b.text
          });
        });
      }

      // Wither Dialogue
      if (scene.witherDialogue) {
        beats.push({
          sceneId: scene.id,
          sceneTitle: scene.title,
          sceneCounter: scene.sceneCounter,
          image: scene.image,
          emotionalState: scene.emotionalState,
          safeZone: sceneSafeZone,
          type: 'wither',
          speaker: 'wither',
          text: scene.witherDialogue
        });
      }

      // Sprout Dialogue
      if ((scene.sproutVO || scene.sproutDialogue) && !scene.sproutHighlightBeats) {
        beats.push({
          sceneId: scene.id,
          sceneTitle: scene.title,
          sceneCounter: scene.sceneCounter,
          image: scene.image,
          emotionalState: scene.emotionalState,
          safeZone: sceneSafeZone,
          type: 'sprout',
          speaker: 'sprout',
          text: scene.sproutVO || scene.sproutDialogue
        });
      }

      // Visitor Dialogue
      if (scene.visitorDialogue) {
        beats.push({
          sceneId: scene.id,
          sceneTitle: scene.title,
          sceneCounter: scene.sceneCounter,
          image: scene.image,
          emotionalState: scene.emotionalState,
          safeZone: sceneSafeZone,
          type: 'visitor',
          speaker: 'visitor',
          text: scene.visitorDialogue
        });
      }

      // Interactive Choice Card
      if (scene.interaction) {
        beats.push({
          sceneId: scene.id,
          sceneTitle: scene.title,
          sceneCounter: scene.sceneCounter,
          image: scene.image,
          emotionalState: scene.emotionalState,
          safeZone: sceneSafeZone,
          type: 'interaction',
          interaction: scene.interaction
        });
      }

      // Golden Highlight Beats (Scene 15)
      if (scene.sproutHighlightBeats) {
        scene.sproutHighlightBeats.forEach((hb) => {
          beats.push({
            sceneId: scene.id,
            sceneTitle: scene.title,
            sceneCounter: scene.sceneCounter,
            image: scene.image,
            emotionalState: scene.emotionalState,
            safeZone: sceneSafeZone,
            type: 'highlight',
            text: hb
          });
        });
      }

      // Power Reveal Badge
      if (scene.powerReveal) {
        beats.push({
          sceneId: scene.id,
          sceneTitle: scene.title,
          sceneCounter: scene.sceneCounter,
          image: scene.image,
          emotionalState: scene.emotionalState,
          safeZone: sceneSafeZone,
          type: 'power',
          text: scene.powerReveal
        });
      }

      // Final VO Beats
      if (scene.finalVOBeats) {
        scene.finalVOBeats.forEach((fb) => {
          beats.push({
            sceneId: scene.id,
            sceneTitle: scene.title,
            sceneCounter: scene.sceneCounter,
            image: scene.image,
            emotionalState: scene.emotionalState,
            safeZone: sceneSafeZone,
            type: 'narrative',
            text: fb
          });
        });
      }
    });
    return beats;
  }, []);

  useEffect(() => {
    if (isActive) {
      setShowPortalTransition(true);
      setBeatIndex(0);
      setValidationMsg('');
      setIsChapterDrawerOpen(false);
      const timer = setTimeout(() => {
        setShowPortalTransition(false);
      }, 1100);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  const currentBeat = flatBeats[beatIndex] || flatBeats[0];

  // Network Adaptive & Pre-warming Image Loading Effect
  useEffect(() => {
    if (!currentBeat || !currentBeat.image) return;

    const adaptiveSrc = getAdaptiveImageSource(currentBeat.image);
    const blurSrc = getBlurPlaceholder(currentBeat.image);

    setBgBlurSrc(blurSrc);
    setBgImageSrc(adaptiveSrc);
    setIsBgLoaded(false);

    const img = new Image();
    img.src = adaptiveSrc;
    img.onload = () => setIsBgLoaded(true);

    const nextBeat = flatBeats[beatIndex + 1];
    if (nextBeat && nextBeat.image) {
      const nextAdaptiveSrc = getAdaptiveImageSource(nextBeat.image);
      const prewarmImg = new Image();
      prewarmImg.src = nextAdaptiveSrc;
    }
  }, [currentBeat, beatIndex, flatBeats]);

  // Check if mandatory input is pending
  const isInputPending = currentBeat && currentBeat.type === 'interaction' && (
    (currentBeat.interaction.storeKey === 'visitorName' && !userProfile.visitorName) ||
    (currentBeat.interaction.storeKey === 'visitorAge' && !userProfile.visitorAge) ||
    (currentBeat.interaction.storeKey === 'visitorLocation' && !userProfile.visitorLocation) ||
    (currentBeat.interaction.storeKey === 'visitorEmail' && !userProfile.visitorEmail)
  );

  // Click Viewport to Advance Beat
  const handleViewportClick = (e) => {
    if (
      e.target.closest('input') ||
      e.target.closest('button') ||
      e.target.closest('.cinematic-input-card') ||
      e.target.closest('.story-top-navbar') ||
      e.target.closest('.chapter-drawer-overlay')
    ) {
      return;
    }

    if (isInputPending) return;

    if (beatIndex >= flatBeats.length - 1) {
      onClose();
    } else {
      setBeatIndex((prev) => prev + 1);
    }
  };

  // Keyboard and Wheel Scroll Listener
  useEffect(() => {
    if (!isActive || showPortalTransition || isChapterDrawerOpen) return;

    let touchStartY = 0;

    const handleWheel = (e) => {
      e.preventDefault();
      if (isInputPending) return;
      if (e.deltaY > 20) {
        setBeatIndex((prev) => Math.min(flatBeats.length - 1, prev + 1));
      } else if (e.deltaY < -20) {
        setBeatIndex((prev) => Math.max(0, prev - 1));
      }
    };

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (!touchStartY || isInputPending) return;
      const touchY = e.touches[0].clientY;
      const diffY = touchStartY - touchY;
      if (diffY > 40) {
        setBeatIndex((prev) => Math.min(flatBeats.length - 1, prev + 1));
        touchStartY = touchY;
      } else if (diffY < -40) {
        setBeatIndex((prev) => Math.max(0, prev - 1));
        touchStartY = touchY;
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
        if (!isInputPending) {
          setBeatIndex((prev) => Math.min(flatBeats.length - 1, prev + 1));
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        setBeatIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        if (isChapterDrawerOpen) {
          setIsChapterDrawerOpen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, showPortalTransition, isChapterDrawerOpen, flatBeats.length, onClose]);

  if (!isActive) return null;

  const handleInteractionSubmit = async (e) => {
    e.preventDefault();
    if (!currentBeat.interaction) return;

    if (currentBeat.interaction.type === 'EMAIL' && !inputValue.includes('@')) {
      setValidationMsg(currentBeat.interaction.validationError || "That light address doesn't seem quite ready yet.");
      return;
    }

    setValidationMsg('');
    const val = inputValue.trim();
    updateUserProfile(currentBeat.interaction.storeKey, val);

    try {
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorName: currentBeat.interaction.storeKey === 'visitorName' ? val : userProfile.visitorName,
          visitorEmail: currentBeat.interaction.type === 'EMAIL' ? val : userProfile.visitorEmail,
          visitorAge: currentBeat.interaction.type === 'AGE' ? val : userProfile.visitorAge,
          visitorLocation: currentBeat.interaction.type === 'LOCATION' ? val : userProfile.visitorLocation,
          message: `Submitted ${currentBeat.interaction.type} choice: "${val}"`,
          type: 'STORY_INTERACTION'
        })
      });
    } catch (err) {
      console.warn('API email dispatch:', err);
    }

    setInputValue('');
    setBeatIndex((prev) => Math.min(flatBeats.length - 1, prev + 1));
  };

  const formatText = (text) => {
    if (!text) return '';
    return text
      .replace('{visitorName}', userProfile.visitorName || 'friend')
      .replace('{visitorAge}', userProfile.visitorAge || 'many')
      .replace('{visitorLocation}', userProfile.visitorLocation || 'home');
  };

  const isNameAlreadySet = currentBeat.type === 'interaction' && currentBeat.interaction.storeKey === 'visitorName' && userProfile.visitorName;

  return (
    <div 
      className="scroll-story-viewport active" 
      ref={containerRef}
      onClick={handleViewportClick}
    >
      {/* Film Grain & Letterbox */}
      <div className="film-grain-overlay" />
      <div className="cinematic-letterbox-top" />
      <div className="cinematic-letterbox-bottom" />

      {/* Portal Transition */}
      {showPortalTransition ? (
        <div className="story-transition-portal-overlay">
          <div className="portal-circle-container">
            <div className="portal-ring-spinning" />
            <img 
              src="/story/1 pc-sm.webp" 
              alt="Sprout World Portal" 
              className="portal-avatar-img" 
            />
          </div>
          <div className="portal-caption">Entering Sprout's World...</div>
          <div className="portal-subcaption">Step into the story of Asterra</div>
          <div className="portal-arrow">↓</div>
        </div>
      ) : (
        <>
          {/* Instant Blur Placeholder Background */}
          {bgBlurSrc && (
            <div 
              className="story-background-blur-placeholder"
              style={{ backgroundImage: `url('${bgBlurSrc}')` }}
            />
          )}

          {/* 100% Fill Proper Background Image Layer */}
          <div 
            className={`story-background-layer ${isBgLoaded ? 'loaded' : ''}`}
            style={{
              backgroundImage: bgImageSrc ? `url('${bgImageSrc}')` : undefined
            }}
          />

          {/* Living Particle Canvas */}
          <ParticleCanvas sceneId={currentBeat.sceneId} emotionalState={currentBeat.emotionalState} />

          {/* TOP BAR: BRAND + CLEAN CHAPTER TITLE */}
          <div className="story-top-bar-redesigned">
            {/* Top-Left Clean Chapter Title Pill (Only Chapter Title) */}
            <div 
              className="story-top-chapter-pill interactive"
              onClick={(e) => {
                e.stopPropagation();
                setIsChapterDrawerOpen(!isChapterDrawerOpen);
              }}
              title="Open Chapter Index"
            >
              <BookOpen size={15} className="chapter-hud-icon" />
              <span className="chapter-hud-title-text">{currentBeat.sceneTitle}</span>
            </div>

            {/* Top-Right Close Control */}
            <div className="story-ctrl-btns">
              <button 
                type="button" 
                className="icon-circle-btn interactive" 
                onClick={onClose}
                title="Return to Hero"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* DYNAMIC BEAT CONTENT POSITIONING WITH SAFE ZONES */}
          
          {/* BEAT TYPE 1: SPROUT SPEECH BUBBLE */}
          {currentBeat.type === 'sprout' && (
            <div className={`sprout-speech-bubble-floating animate-beat-in ${currentBeat.safeZone || 'pos-top-right'}`}>
              <div className="bubble-speaker-header">
                <img src="/story/1 pc-sm.webp" alt="Sprout" className="speaker-avatar-circle" />
                <span className="speaker-name-title">Sprout</span>
                <span className="speaker-pulse-badge" />
              </div>
              <p className="bubble-sentence-text">
                "{formatText(currentBeat.text)}"
              </p>
            </div>
          )}

          {/* BEAT TYPE 2: VISITOR SPEECH BUBBLE */}
          {currentBeat.type === 'visitor' && (
            <div className={`visitor-speech-bubble-floating animate-beat-in ${currentBeat.safeZone || 'pos-top-left'}`}>
              <div className="bubble-speaker-header visitor-header">
                <div className="visitor-avatar-icon">
                  <User size={14} />
                </div>
                <span className="speaker-name-title visitor">{userProfile.visitorName || 'You'}</span>
              </div>
              <p className="bubble-sentence-text visitor-text">
                "{formatText(currentBeat.text)}"
              </p>
            </div>
          )}

          {/* BEAT TYPE 3: WITHER SPEECH BUBBLE */}
          {currentBeat.type === 'wither' && (
            <div className="wither-speech-bubble-floating animate-beat-in pos-top-right">
              <div className="bubble-speaker-header wither-header">
                <span className="speaker-name-title wither">WITHER</span>
              </div>
              <p className="bubble-sentence-text wither-text">
                "{currentBeat.text}"
              </p>
            </div>
          )}

          {/* BEAT TYPE 4: NARRATIVE BEAT (CLEAN CENTERED CAPTION BAR) */}
          {currentBeat.type === 'narrative' && (
            <div className="single-sentence-caption-bar animate-beat-in">
              <p className="narrative-single-line">
                "{formatText(currentBeat.text)}"
              </p>
            </div>
          )}

          {/* BEAT TYPE 5: GOLDEN HIGHLIGHT BEAT */}
          {currentBeat.type === 'highlight' && (
            <div className="golden-highlight-single-bar animate-beat-in">
              <p className="golden-emotional-single-line">
                "{formatText(currentBeat.text)}"
              </p>
            </div>
          )}

          {/* BEAT TYPE 6: POWER REVEAL BADGE */}
          {currentBeat.type === 'power' && (
            <div className="power-reveal-single-badge animate-beat-in">
              <span>{currentBeat.text}</span>
            </div>
          )}

          {/* BEAT TYPE 7: INTERACTIVE INPUT CARD */}
          {currentBeat.type === 'interaction' && (
            isNameAlreadySet ? (
              <div className="sprout-speech-bubble-floating animate-beat-in pos-top-right">
                <div className="bubble-speaker-header">
                  <img src="/story/1 pc-sm.webp" alt="Sprout" className="speaker-avatar-circle" />
                  <span className="speaker-name-title">Sprout</span>
                  <span className="speaker-pulse-badge" />
                </div>
                <p className="bubble-sentence-text">
                  "{userProfile.visitorName}. That's a lovely name. I'm so glad we met."
                </p>
              </div>
            ) : (
              <div className="cinematic-input-card animate-beat-in" onClick={(e) => e.stopPropagation()}>
                <h2 className="card-title">{currentBeat.interaction.title}</h2>
                {currentBeat.interaction.subtitle && (
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '1.2rem' }}>
                    {currentBeat.interaction.subtitle}
                  </p>
                )}

                <form onSubmit={handleInteractionSubmit}>
                  <input 
                    type={currentBeat.interaction.type === 'AGE' ? 'number' : currentBeat.interaction.type === 'EMAIL' ? 'email' : 'text'}
                    className="card-input-field interactive"
                    placeholder={currentBeat.interaction.placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    autoFocus
                    required
                  />

                  {validationMsg && (
                    <div className="card-validation-error">
                      {validationMsg}
                    </div>
                  )}

                  <button type="submit" className="card-submit-btn interactive">
                    <span>{currentBeat.interaction.buttonText}</span>
                    <ChevronRight size={18} />
                  </button>
                </form>
              </div>
            )
          )}

          {/* LEFT-SIDE PROGRESS BAR & SCROLL DOWN ICON */}
          <div className="story-bottom-left-progress">
            <div className="scroll-icon-circle interactive" title="Scroll or click to advance">
              <ArrowDown size={18} className="bounce-anim" />
            </div>
            <div className="progress-mini-bar">
              <div 
                className="progress-mini-fill" 
                style={{ width: `${((beatIndex + 1) / flatBeats.length) * 100}%` }}
              />
            </div>
          </div>

          {/* CHAPTER INDEX DRAWER */}
          {isChapterDrawerOpen && (
            <div className="chapter-drawer-overlay" onClick={() => setIsChapterDrawerOpen(false)}>
              <div className="chapter-drawer-content" onClick={(e) => e.stopPropagation()}>
                <div className="drawer-header">
                  <div className="drawer-title">
                    <BookOpen size={20} className="drawer-title-icon" />
                    <span>ASTERRA STORY INDEX</span>
                  </div>
                  <button 
                    type="button" 
                    className="drawer-close-btn interactive"
                    onClick={() => setIsChapterDrawerOpen(false)}
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="drawer-grid">
                  {STORY_SCENES.map((s) => {
                    const firstBeatIndex = flatBeats.findIndex((b) => b.sceneId === s.id);
                    const isActiveChapter = currentBeat.sceneId === s.id;
                    return (
                      <div 
                        key={s.id}
                        className={`drawer-chapter-card interactive ${isActiveChapter ? 'active' : ''}`}
                        onClick={() => {
                          if (firstBeatIndex !== -1) setBeatIndex(firstBeatIndex);
                          setIsChapterDrawerOpen(false);
                        }}
                      >
                        <img src={getAdaptiveImageSource(s.image)} alt={s.title} className="drawer-card-thumb" />
                        <div className="drawer-card-meta">
                          <h4 className="drawer-card-title">{s.title}</h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
