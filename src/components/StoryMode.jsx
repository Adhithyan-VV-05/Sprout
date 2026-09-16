'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, ChevronRight, ChevronLeft, ArrowRight, RotateCcw, Heart } from 'lucide-react';
import { STORY_SCENES } from '../data/storyData';
import ParticleCanvas from './ParticleCanvas';

const renderTextWithPlaceholders = (text) => {
  if (typeof text !== 'string') return text;
  const parts = text.split(/(\[[^\]]+\])/g);
  return parts.map((part, index) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      return (
        <span key={index} className="faded-placeholder-blank">
          {part}
        </span>
      );
    }
    return part;
  });
};

export default function StoryMode({ 
  isActive, 
  onClose, 
  onStoryFinished, 
  userProfile, 
  updateUserProfile, 
  initialSceneId = 1 
}) {
  const [beatIndex, setBeatIndex] = useState(0);
  const [localName, setLocalName] = useState(userProfile?.visitorName || '');
  const [localLocation, setLocalLocation] = useState(userProfile?.visitorLocation || '');
  const [localEmail, setLocalEmail] = useState(userProfile?.visitorEmail || '');
  const [localAge, setLocalAge] = useState(userProfile?.visitorAge || '');
  const [hasClicked, setHasClicked] = useState(false);
  
  // Validation error states
  const [nameError, setNameError] = useState(false);
  const [ageError, setAgeError] = useState(false);

  useEffect(() => {
    const handleFirstInteraction = () => setHasClicked(true);
    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    if (userProfile?.visitorName) setLocalName(userProfile.visitorName);
    if (userProfile?.visitorLocation) setLocalLocation(userProfile.visitorLocation);
    if (userProfile?.visitorEmail) setLocalEmail(userProfile.visitorEmail);
    if (userProfile?.visitorAge) setLocalAge(userProfile.visitorAge);
  }, [userProfile]);

  // Flatten scenes into clean structured narrative beats
  const flatBeats = useMemo(() => {
    const beats = [];
    
    STORY_SCENES.forEach((scene) => {
      if (scene.beats && scene.beats.length > 0) {
        scene.beats.forEach((b) => {
          beats.push({
            sceneId: scene.id,
            sceneTitle: scene.title,
            heading: scene.heading,
            sceneCounter: scene.sceneCounter,
            image: scene.image,
            emotionalState: scene.emotionalState,
            type: b.type || 'narrative',
            speaker: b.speaker,
            text: b.text
          });
        });
      }
    });

    return beats;
  }, []);

  // Lock background body scroll
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isActive]);

  // Jump to initialSceneId when opened
  useEffect(() => {
    if (isActive) {
      if (initialSceneId && initialSceneId > 1) {
        const targetIdx = flatBeats.findIndex((b) => b.sceneId === initialSceneId);
        if (targetIdx !== -1) {
          setBeatIndex(targetIdx);
          return;
        }
      }
      setBeatIndex(0);
    }
  }, [isActive, initialSceneId, flatBeats]);

  const currentBeat = flatBeats[beatIndex] || flatBeats[0] || {};
  const isFinalBeat = beatIndex >= flatBeats.length - 1;
  const progressPercent = ((beatIndex + 1) / flatBeats.length) * 100;

  // Preload chapter images
  useEffect(() => {
    if (!isActive) return;
    STORY_SCENES.forEach((scene) => {
      if (scene.image) {
        const img = new Image();
        img.src = scene.image;
      }
    });
  }, [isActive]);

  const getSpeakerBgClass = (speaker) => {
    if (!speaker) return 'bg-narration';
    if (speaker.toLowerCase().includes('sprout')) return 'bg-sprout';
    return 'bg-roboman';
  };

  const handleNext = () => {
    // Reset errors first
    setNameError(false);
    setAgeError(false);

    if (currentBeat?.type === 'interactive-name') {
      if (!localName.trim() || /\d/.test(localName)) {
        setNameError(true);
        return;
      }
    }
    if (currentBeat?.type === 'interactive-location' && !localLocation.trim()) return;
    if (currentBeat?.type === 'interactive-email' && !localEmail.trim()) return;
    if (currentBeat?.type === 'interactive-age') {
      const ageNum = parseInt(localAge.trim(), 10);
      if (!localAge.trim() || !/^\d+$/.test(localAge.trim()) || isNaN(ageNum) || ageNum >= 150) {
        setAgeError(true);
        return;
      }
    }

    if (beatIndex < flatBeats.length - 1) {
      setBeatIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (beatIndex > 0) {
      setBeatIndex((prev) => prev - 1);
    }
  };

  // Keyboard Navigation
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, beatIndex, flatBeats, onClose]);

  const handleScreenClick = (e) => {
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('.no-screen-click')) {
      return;
    }
    handleNext();
  };

  const handleReturnToSprout = () => {
    // Dispatch complete info collected email to both hero and visitor
    try {
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorName: userProfile?.visitorName || localName || 'Friend in Asterra',
          visitorEmail: userProfile?.visitorEmail || localEmail,
          visitorAge: userProfile?.visitorAge || localAge,
          visitorLocation: userProfile?.visitorLocation || localLocation,
          visitorGender: userProfile?.visitorGender,
          message: `Story Completed! Information collected during Sprout's Journey: Name: ${userProfile?.visitorName || localName || 'Friend'}, Location: ${userProfile?.visitorLocation || localLocation || 'N/A'}, Age: ${userProfile?.visitorAge || localAge || 'N/A'}, Email: ${userProfile?.visitorEmail || localEmail || 'N/A'}.`,
          analyzedIssue: 'Story Mode Completed — Information Collected',
          type: 'STORY_COMPLETE'
        })
      });
    } catch (err) {
      console.warn('Final story email dispatch notice:', err);
    }

    if (onStoryFinished) {
      onStoryFinished();
    } else {
      onClose();
    }
  };

  if (!isActive) return null;

  return (
    <div 
      className="fullscreen-story-modal-overlay" 
      onClick={handleScreenClick}
    >
      {!hasClicked && (
        <div className="center-click-hint-overlay">
          <div className="center-pulse-text">
            Click anywhere or press Space to continue
          </div>
        </div>
      )}

      {/* 1. Fullscreen Cinematic Background Layers */}
      <div className="story-slides-backdrop-container">
        {STORY_SCENES.map((scene) => {
          const isCurrentScene = scene.id === (currentBeat?.sceneId || 1);
          return (
            <div
              key={scene.id}
              className={`story-slide-image-layer ${isCurrentScene ? 'active-layer' : 'hidden-layer'}`}
              style={{
                backgroundImage: `url('${scene.image}')`
              }}
            />
          );
        })}
        {/* Soft bottom atmospheric gradient for text readability */}
        <div className="minimal-story-scrim" />
      </div>

      {/* 2. Ambient Particles */}
      <div className="story-ambient-particles">
        <ParticleCanvas 
          sceneId={currentBeat?.sceneId || 1} 
          emotionalState={currentBeat?.emotionalState || 'WONDER'} 
        />
      </div>

      {/* 3. Sleek Minimal Top Bar */}
      <header className="minimal-story-header no-screen-click">
        <div className="minimal-story-progress-line">
          <div 
            className="minimal-story-progress-fill" 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>

        <div className="minimal-story-header-content">
          <div className="minimal-story-chapter-label">
            <span className="chapter-num-pill">CHAPTER {currentBeat?.sceneCounter || '01 / 12'}</span>
            <span className="chapter-sep">·</span>
            <span className="chapter-name">{currentBeat?.sceneTitle}</span>
          </div>

          <button
            type="button"
            className="minimal-story-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            title="Close Story (Esc)"
            aria-label="Close Story"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      {/* 4. Minimal Story Narrative Text (Direct on background, NO CARD) */}
      <main className="minimal-story-content-area">
        <div key={beatIndex} className="minimal-story-text-wrapper story-text-fade-up">

          {/* Heading - Only show for the first beat of a scene */}
          {(beatIndex === 0 || flatBeats[beatIndex - 1].sceneId !== currentBeat.sceneId) && (
            <div className="minimal-story-subheading">
              {currentBeat.heading}
            </div>
          )}

          {/* 1. Scene Directions [Sprout approaches Robo-Man...] */}
          {currentBeat.type === 'scene-direction' && (
            <div className={`minimal-story-body-text scene-direction-beat ${getSpeakerBgClass(currentBeat.speaker)}`}>
              <span className="scene-direction-bracket-text">{currentBeat.text}</span>
            </div>
          )}

          {/* 2. Standard Dialogue & Narrative */}
          {currentBeat.type !== 'scene-direction' && 
           !currentBeat.type?.startsWith('interactive-') && (
            <div className={`minimal-story-body-text ${currentBeat.type || 'narrative'} ${getSpeakerBgClass(currentBeat.speaker)}`}>
              {currentBeat.speaker && (
                <span className={`minimal-speaker-prefix ${currentBeat.speaker.toLowerCase().includes('sprout') ? 'speaker-sprout' : 'speaker-other'}`}>
                  {currentBeat.speaker}:
                </span>
              )}
              <span>{renderTextWithPlaceholders(currentBeat.text)}</span>
            </div>
          )}

          {/* 3. Robo-Man Question 1: Name */}
          {currentBeat.type === 'interactive-name' && (
            <div className={`minimal-story-body-text interactive-sentence-beat no-screen-click ${getSpeakerBgClass('Robo-Man')}`}>
              <div className="sentence-with-speaker">
                <span className="minimal-speaker-prefix speaker-other">Robo-Man:</span>
                <span>
                  “I still remember my mom calling me, ‘
                  <input 
                    type="text"
                    className={`story-inline-blank name-blank ${nameError ? 'has-error' : ''}`}
                    placeholder="[your name]"
                    value={localName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLocalName(val);
                      if (nameError) setNameError(false);
                      if (updateUserProfile) updateUserProfile('visitorName', val);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleNext();
                      }
                    }}
                    autoFocus
                  />
                  .’ We used to play games together.”
                </span>
              </div>
            </div>
          )}

          {/* 4. Robo-Man Question 2: Location / Place */}
          {currentBeat.type === 'interactive-location' && (
            <div className={`minimal-story-body-text interactive-sentence-beat no-screen-click ${getSpeakerBgClass('Robo-Man')}`}>
              <div className="sentence-with-speaker">
                <span className="minimal-speaker-prefix speaker-other">Robo-Man:</span>
                <span>
                  “We lived in 
                  <input 
                    type="text"
                    className="story-inline-blank location-blank"
                    placeholder="[your place]"
                    value={localLocation}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLocalLocation(val);
                      if (updateUserProfile) updateUserProfile('visitorLocation', val);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleNext();
                      }
                    }}
                    autoFocus
                  />
                  , a place that was once a heaven.”
                </span>
              </div>
            </div>
          )}

          {/* 5. Robo-Man Question 3: Email ID */}
          {currentBeat.type === 'interactive-email' && (
            <div className={`minimal-story-body-text interactive-sentence-beat no-screen-click ${getSpeakerBgClass('Robo-Man')}`}>
              <div className="sentence-with-speaker">
                <span className="minimal-speaker-prefix speaker-other">Robo-Man:</span>
                <span>
                  “I used to send emails to my son whenever he left for his studies, writing to him through my email ID, 
                  <input 
                    type="email"
                    className="story-inline-blank email-blank"
                    placeholder="[your mail ID]"
                    value={localEmail}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLocalEmail(val);
                      if (updateUserProfile) updateUserProfile('visitorEmail', val);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleNext();
                      }
                    }}
                    autoFocus
                  />
                  . It has been so long since I last saw him.”
                </span>
              </div>
            </div>
          )}

          {/* 6. Robo-Man Question 4: Age */}
          {currentBeat.type === 'interactive-age' && (
            <div className={`minimal-story-body-text interactive-sentence-beat no-screen-click ${getSpeakerBgClass('Robo-Man')}`}>
              <div className="sentence-with-speaker">
                <span className="minimal-speaker-prefix speaker-other">Robo-Man:</span>
                <span>
                  “I have been living here for 
                  <input 
                    type="text"
                    className={`story-inline-blank age-blank ${ageError ? 'has-error' : ''}`}
                    placeholder="[your age]"
                    value={localAge}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLocalAge(val);
                      if (ageError) setAgeError(false);
                      if (updateUserProfile) updateUserProfile('visitorAge', val);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleNext();
                      }
                    }}
                    autoFocus
                  />
                  years. But then, something happened that changed everything.”
                </span>
              </div>
            </div>
          )}

          {/* 5. Final Beat: Return to Sprout Button */}
          {isFinalBeat && (
            <div className="minimal-story-finish-wrap no-screen-click">
              <button 
                type="button" 
                className="minimal-finish-btn sprout-return-btn interactive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReturnToSprout();
                }}
              >
                <span>Go Back to Sprout</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

        </div>
      </main>

      {/* 5. Minimal Bottom Navigation & Hints */}
      <footer className="minimal-story-footer no-screen-click">
        <div className="minimal-story-footer-inner">
          <span className="minimal-advance-hint">
            {isFinalBeat 
              ? 'Journey Completed' 
              : currentBeat?.type?.startsWith('interactive-')
                ? 'Press Enter ↵ to continue'
                : ''}
          </span>

          <div className="minimal-nav-arrows">
            {beatIndex > 0 && (
              <button 
                type="button" 
                className="minimal-arrow-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                title="Previous (←)"
                aria-label="Previous Beat"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {!isFinalBeat && (
              <button 
                type="button" 
                className="minimal-arrow-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                title="Next (→)"
                aria-label="Next Beat"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      </footer>

    </div>
  );
}

