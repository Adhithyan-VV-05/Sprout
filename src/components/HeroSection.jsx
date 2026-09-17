'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  ArrowRight, 
  Sparkles, 
  User, 
  HeartHandshake, 
  CheckCheck, 
  SendHorizontal, 
  ShieldAlert, 
  Shield,
  MessageCircle, 
  Heart, 
  Zap, 
  X, 
  Minus,
  Maximize2,
  Play, 
  Moon, 
  Sun, 
  Users, 
  Globe,
  Leaf
} from 'lucide-react';
import ParticleCanvas from './ParticleCanvas';
import { layoutConfig } from '../config/layoutConfig';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppState } from '../context/AppStateContext';

function CircularStoryProgress({ progress = 0, isLoaded = false, isWaiting = false }) {
  const radius = 10;
  const strokeWidth = 2.4;
  const circumference = 2 * Math.PI * radius; // 62.83
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

  return (
    <div className={`story-circular-loader ${isLoaded ? 'is-complete' : 'is-syncing'} ${isWaiting ? 'is-waiting' : ''}`} aria-hidden="true">
      <svg className="story-circular-svg" width="28" height="28" viewBox="0 0 28 28">
        <defs>
          <linearGradient id="orangeToggleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>

        {/* Ambient Pulsing Radar Ring */}
        <circle
          cx="14"
          cy="14"
          r="12.5"
          className="circular-outer-sonar"
        />

        {/* Background Track */}
        <circle
          cx="14"
          cy="14"
          r={radius}
          className="circular-track-bg"
          strokeWidth={strokeWidth}
        />

        {/* Dynamic Progressive Fill */}
        <circle
          cx="14"
          cy="14"
          r={radius}
          className="circular-progress-fill"
          stroke="url(#orangeToggleGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 14 14)"
        />
      </svg>

      {/* Center indicator: percentage number when loading, checkmark when ready */}
      <div className="circular-center-badge">
        {isLoaded ? (
          <span className="circular-check-icon">✓</span>
        ) : (
          <span className="circular-pct-num">{progress}%</span>
        )}
      </div>
    </div>
  );
}

export default function HeroSection() {
  const { 
    userProfile, 
    updateUserProfile, 
    postStoryTrigger,
    storyPreloadProgress = 0,
    storyImagesLoaded = false
  } = useAppState();
  const router = useRouter();
  const [isWaitingForStory, setIsWaitingForStory] = useState(false);

  useEffect(() => {
    if (isWaitingForStory && storyImagesLoaded) {
      router.push('/story');
    }
  }, [isWaitingForStory, storyImagesLoaded, router]);

  const handleSeeStoryClick = (e) => {
    e.preventDefault();
    if (storyImagesLoaded) {
      router.push('/story');
    } else {
      setIsWaitingForStory(true);
    }
  };

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState('casual'); // 'casual' | 'help'
  const [isNameConfirmed, setIsNameConfirmed] = useState(Boolean(userProfile?.visitorName));
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 768);

  const [messages, setMessages] = useState([]);
  const [latestAnalyzedIssue, setLatestAnalyzedIssue] = useState('');
  const chatBodyRef = useRef(null);
  
  // Needs Help form state
  const [formGrievance, setFormGrievance] = useState('');
  const [isSendingSignal, setIsSendingSignal] = useState(false);
  const [signalSent, setSignalSent] = useState(false);

  const getTimeString = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initial greeting matching Image 2
  useEffect(() => {
    const initialName = userProfile?.visitorName;
    const namedGreetings = [
      `Hey there ${initialName}! I'm Sprout, your Growth Guardian superhero! 🌿 How may I protect and brighten your world today?`,
      `Welcome back, ${initialName}! I'm ready to stand beside you. 🌿 What are we tackling today?`,
      `Hello ${initialName}! 🌿 Your Growth Guardian is here. Let's make today a little brighter!`,
    ];
    const anonymousGreetings = [
      "Hey there! I'm Sprout, your Growth Guardian superhero! 🌿 May I know your name so I know who I'm protecting and talking with today?",
      "Hello friend! 🌿 I'm Sprout. Before we begin our journey, what should I call you?",
      "Welcome! I am Sprout, your superhero guide. 🌿 What name do your loved ones call you?",
    ];
    
    const greetingsArray = initialName ? namedGreetings : anonymousGreetings;
    const randomGreeting = greetingsArray[Math.floor(Math.random() * greetingsArray.length)];

    setMessages([
      { id: 1, sender: 'sprout', text: randomGreeting, time: getTimeString() }
    ]);
  }, [userProfile?.visitorName]);

  // Post-Story Automatic Typing Animation & Sprout Question
  useEffect(() => {
    if (!postStoryTrigger) return;
    setIsClosed(false);
    setIsMinimized(false);
    setIsTyping(true);

    const timer = setTimeout(() => {
      setIsTyping(false);
      const namePart = userProfile?.visitorName ? ` ${userProfile.visitorName}` : '';
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'sprout',
          text: `How was my story${namePart}? 🌿 Remember, not all superheroes come with physical strength—some heal the world with kindness, empathy, and listening hearts. How are you feeling right now?`,
          time: getTimeString()
        }
      ]);
    }, 1400);

    return () => clearTimeout(timer);
  }, [postStoryTrigger, userProfile?.visitorName]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Profile extraction helper
  const handleExtractedProfile = (data) => {
    if (!data || !updateUserProfile) return;
    if (data.extractedAge && !userProfile?.visitorAge) {
      updateUserProfile('visitorAge', data.extractedAge);
    }
    if (data.extractedLocation && !userProfile?.visitorLocation) {
      updateUserProfile('visitorLocation', data.extractedLocation);
    }
    if (data.extractedEmail && !userProfile?.visitorEmail) {
      updateUserProfile('visitorEmail', data.extractedEmail);
    }
    if (data.extractedGender && !userProfile?.visitorGender) {
      updateUserProfile('visitorGender', data.extractedGender);
    }
    if (data.extractedName && !userProfile?.visitorName) {
      updateUserProfile('visitorName', data.extractedName);
      setIsNameConfirmed(true);
    }
  };

  // Switch chat mode between 'casual' and 'help'
  const handleModeChange = (e, newMode) => {
    if (e && e.preventDefault) e.preventDefault();
    if (newMode === chatMode) return;
    setChatMode(newMode);
    
    if (newMode === 'help') {
      setSignalSent(false); // Reset form state
    } else {
      const modeNotice = "Switched to 💬 Casual Talk mode. Let's chat about Asterra, dreams, and joyful thoughts!";
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'sprout',
          isModeTag: true,
          text: modeNotice,
          time: getTimeString()
        }
      ]);
    }
  };

  const handlePromptClick = (e, promptText) => {
    if (e && e.preventDefault) e.preventDefault();
    sendMessage(promptText);
  };

  const sendMessage = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: getTimeString()
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    const currentName = userProfile?.visitorName;
    const isFirstTimeNaming = !currentName;



    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          visitorName: userProfile?.visitorName,
          visitorAge: userProfile?.visitorAge,
          visitorLocation: userProfile?.visitorLocation,
          visitorGender: userProfile?.visitorGender,
          visitorEmail: userProfile?.visitorEmail,
          mode: chatMode,
          isNameSetup: isFirstTimeNaming,
          history: [...messages, userMsg].map((m) => ({
            sender: m.sender,
            text: m.text
          }))
        })
      });

      const data = await response.json();
      setIsTyping(false);

      if (data && data.reply) {
        if (data.extractedName && updateUserProfile && !userProfile?.visitorName) {
          updateUserProfile('visitorName', data.extractedName);
          setIsNameConfirmed(true);
        }

        if (data.analyzedIssue) {
          setLatestAnalyzedIssue(data.analyzedIssue);
        }

        handleExtractedProfile(data);

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'sprout',
            text: data.reply,
            time: getTimeString()
          }
        ]);
      }
    } catch (err) {
      setIsTyping(false);
      // Fallback empathetic response
      let fallbackText = "I'm right beside you. Every mighty oak started as a quiet seed that dared to open. What can we tackle next?";
      if (isFirstTimeNaming) {
        let extractedName = query.replace(/my name is|i am|i'm|call me/gi, '').trim();
        if (extractedName) {
          extractedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
          if (updateUserProfile) updateUserProfile('visitorName', extractedName);
          fallbackText = `It is so wonderful to meet you, ${extractedName}! I'm Sprout, your Growth Guardian superhero. How can I protect and support you today?`;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'sprout',
          text: fallbackText,
          time: getTimeString()
        }
      ]);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleDispatchSignal = async (e) => {
    e.preventDefault();
    if (isSendingSignal) return;
    setIsSendingSignal(true);

    const startTime = Date.now();

    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorName: userProfile?.visitorName || 'Friend in Velora',
          visitorEmail: userProfile?.visitorEmail,
          visitorAge: userProfile?.visitorAge,
          visitorLocation: userProfile?.visitorLocation,
          message: formGrievance,
          analyzedIssue: 'Emergency Signal Dispatched via Help Form',
          type: 'DISPATCH_SIGNAL'
        })
      });

      // Allow the cinematic dispatch animation to display smoothly
      const elapsed = Date.now() - startTime;
      if (elapsed < 1800) {
        await new Promise((resolve) => setTimeout(resolve, 1800 - elapsed));
      }

      setSignalSent(true);
      setFormGrievance('');
    } catch (err) {
      console.error('Failed to dispatch signal:', err);
    } finally {
      setIsSendingSignal(false);
    }
  };

  // Render Inner Chatbot Widget matching Image 2
  const renderImage2ChatWidget = () => (
    <div className={`sprout-superhero-card mode-${chatMode}`}>
      {/* Holographic light sheen reflection layer */}
      <div className="card-glass-sheen" aria-hidden="true" />

      {/* 1. Header (Matching Image 2 with superhero enhancements) */}
      <div className="sprout-card-header-bar">
        <div className="sprout-header-brand">
          <div className="sprout-avatar-wrapper">
            <div className="sprout-avatar-halo-ring" />
            <img 
              src="/sprout-avatar.webp" 
              alt="Sprout Growth Guardian" 
              className="sprout-header-avatar"
            />
            <span className="sprout-avatar-beacon">
              <span className="beacon-ping" />
              <span className="beacon-core" />
            </span>
          </div>
          <div className="sprout-header-info">
            <div className="sprout-title-row">
              <h2 className="sprout-pixel-title">SPROUT</h2>
            </div>
            <div className="sprout-subtitle-row">
              <span className="sprout-role-subtitle">Growth Guardian</span>
              <div className="sprout-guardian-vitality" title="Guardian Listening">
                <span className="vitality-bar bar-1" />
                <span className="vitality-bar bar-2" />
                <span className="vitality-bar bar-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Window Controls: Close Only */}
        <div className="sprout-window-controls">

          <button 
            type="button" 
            className="sprout-win-btn close-btn interactive" 
            title="Close Chat"
            onClick={() => {
              setIsClosed(true);
              setIsMobileChatOpen(false);
            }}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="sprout-header-separator" />

      {!isMinimized && (
        <>
          {/* 2. Mode Selector Toggle Pills (Matching Image 2) */}
          <div className="sprout-mode-toggle-row">
            <button
              type="button"
              className={`sprout-mode-pill mode-btn-casual interactive ${chatMode === 'casual' ? 'active' : ''}`}
              onClick={(e) => handleModeChange(e, 'casual')}
            >
              <MessageCircle size={15} className="mode-icon-bounce" />
              <span>Casual Talk</span>
            </button>

            <button
              type="button"
              className={`sprout-mode-pill mode-btn-help interactive ${chatMode === 'help' ? 'active' : ''}`}
              onClick={(e) => handleModeChange(e, 'help')}
            >
              <Shield size={15} className="mode-icon-pulse" />
              <span>Needs Help</span>
            </button>
          </div>

          {/* 3. Conversation Message Area or Needs Help Form */}
          {chatMode === 'casual' ? (
            <>
              <div className="sprout-chat-messages-scroll" ref={chatBodyRef}>
                {messages.map((m) => (
                  <React.Fragment key={m.id}>
                    {m.isModeTag ? (
                      <div className="sprout-mode-tag-pill">
                        <span>{m.text}</span>
                      </div>
                    ) : (
                      <div className={`sprout-message-row ${m.sender}`}>
                        {m.sender === 'sprout' && (
                          <img 
                            src="/sprout-avatar.webp" 
                            alt="Sprout" 
                            className="sprout-bubble-avatar" 
                          />
                        )}

                        <div className="sprout-bubble-box">
                          <p className="sprout-bubble-text">{m.text}</p>
                          <div className="sprout-bubble-meta">
                            <span className="sprout-bubble-time">{m.time}</span>
                            {m.sender === 'user' && <CheckCheck size={12} className="tick-icon" />}
                          </div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}

                {isTyping && (
                  <div className="sprout-message-row sprout">
                    <img src="/sprout-avatar.webp" alt="Sprout" className="sprout-bubble-avatar" />
                    <div className="sprout-bubble-box typing-container">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Quick Action Chips (Matching Image 2) */}
              <div className="sprout-quick-chips-row">
                <button
                  type="button"
                  className="sprout-chip-btn interactive"
                  onClick={(e) => handlePromptClick(e, "I want to share a worry with you Sprout...")}
                >
                  Share a Worry
                </button>
                <button
                  type="button"
                  className="sprout-chip-btn interactive"
                  onClick={(e) => handlePromptClick(e, "Can you give me some guidance and courage?")}
                >
                  Seek Guidance
                </button>
              </div>

              {/* 5. Input Form (Matching Image 2) */}
              <form onSubmit={handleSend} className="sprout-input-form-row">
                <input
                  type="text"
                  className="sprout-text-input interactive"
                  placeholder="Chat with Sprout..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="sprout-circular-send-btn interactive" 
                  title="Send to Sprout"
                >
                  <Send size={15} />
                </button>
              </form>
            </>
          ) : (
            <div className="sprout-help-form-container">
              {isSendingSignal ? (
                <div className="sprout-dispatching-overlay">
                  <div className="dispatch-beacon-core">
                    <div className="beacon-ring ring-1" />
                    <div className="beacon-ring ring-2" />
                    <div className="beacon-ring ring-3" />
                    <div className="beacon-avatar-wrap">
                      <img src="/sprout-avatar.webp" alt="Sprout Beacon" className="beacon-avatar-img" />
                      <div className="beacon-sweep-radar" />
                    </div>
                  </div>

                  <div className="dispatch-status-box">
                    <div className="dispatch-badge-pill">
                      <span className="dispatch-live-dot" />
                      <span>BROADCASTING EMERGENCY BEACON</span>
                    </div>
                    <h3 className="dispatch-title">Transmitting to Sprout...</h3>
                    <p className="dispatch-desc">Locking telemetry coordinates. Dispatching Guardian rescue beacon across Velora.</p>

                    <div className="dispatch-meter-track">
                      <div className="dispatch-meter-fill" />
                    </div>

                    <div className="dispatch-coordinates-text">
                      <span>FREQ: 842.10 MHz</span>
                      <span>SECURE DISPATCH ENCRYPTED</span>
                    </div>
                  </div>
                </div>
              ) : signalSent ? (
                <div className="sprout-signal-sent-card animate-scale-up">
                  <div className="signal-success-icon-wrap">
                    <div className="signal-burst-ring ring-burst-1" />
                    <div className="signal-burst-ring ring-burst-2" />
                    <div className="signal-success-icon"><ShieldAlert size={36} color="#2ECC71" /></div>
                  </div>
                  <h3>Signal Dispatched!</h3>
                  <p>A superhero has been notified and is coming to help. Check your email for an immediate beacon of hope!</p>
                  <button className="sprout-return-casual-btn interactive" onClick={() => handleModeChange(null, 'casual')}>Return to Chat</button>
                </div>
              ) : (
                <form className="sprout-needs-help-form" onSubmit={handleDispatchSignal}>
                  <p className="form-intro">You are not alone. Send an emergency beacon directly to a superhero.</p>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Name</label>
                      <input type="text" value={userProfile?.visitorName || ''} onChange={(e) => updateUserProfile && updateUserProfile('visitorName', e.target.value)} placeholder="Your Name" required />
                    </div>
                    <div className="form-group">
                      <label>Age</label>
                      <input type="text" value={userProfile?.visitorAge || ''} onChange={(e) => updateUserProfile && updateUserProfile('visitorAge', e.target.value)} placeholder="Your Age" required />
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input type="text" value={userProfile?.visitorLocation || ''} onChange={(e) => updateUserProfile && updateUserProfile('visitorLocation', e.target.value)} placeholder="Your Location" required />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" value={userProfile?.visitorEmail || ''} onChange={(e) => updateUserProfile && updateUserProfile('visitorEmail', e.target.value)} placeholder="Your Email" required />
                    </div>
                  </div>
                  <div className="form-group full-width">
                    <label>Grievance / Issue</label>
                    <textarea 
                      value={formGrievance} 
                      onChange={(e) => setFormGrievance(e.target.value)} 
                      placeholder="Tell us what you are facing..." 
                      rows={4}
                      required 
                    />
                  </div>
                  <button type="submit" className="sprout-dispatch-btn interactive glowing-border-btn" disabled={isSendingSignal}>
                    {isSendingSignal ? 'Dispatching...' : 'Dispatch Signal'}
                    <SendHorizontal size={16} style={{ marginLeft: 8 }} />
                  </button>
                </form>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <section id="home" className="hero-wrapper continuous-section section-hero">
      {/* Dynamic Ambient Particle Overlay */}
      <div className="hero-particle-overlay">
        <ParticleCanvas sceneId={1} emotionalState="WONDER" />
      </div>

      {/* Main Hero Foreground Content Grid */}
      <div className="hero-main-layer-container">
        
        {/* Ambient Overlays Matching Background Portions (Badges, Squirrel, & Flowers) */}
        <div className="bg-matched-animations" aria-hidden="true">
          {/* 1. The 3 Badges Glow Auras (A Kinder World, Stronger Together, Brighter Tomorrows) */}
          <div className="bg-badge-glow-cluster" style={{ position: 'absolute', top: '8.8%', left: '8%', pointerEvents: 'none', zIndex: 12 }}>
            <span className="badge-aura-pulse leaf" title="A Kinder World" />
            <span className="badge-aura-pulse people" title="Stronger Together" />
            <span className="badge-aura-pulse sun" title="Brighter Tomorrows" />
          </div>

          {/* 2. Nature Fireflies Playing Around the Squirrel */}
          <div className="bg-squirrel-fireflies" style={{ position: 'absolute', top: '10.5%', left: '39%', pointerEvents: 'none', zIndex: 12 }}>
            <span className="firefly-orb f1" />
            <span className="firefly-orb f2" />
            <span className="firefly-orb f3" />
          </div>

          {/* 3. White Flower Dewdrop Twinkles on the Moss Bank */}
          <div className="bg-flower-dewdrops" style={{ position: 'absolute', top: '18.2%', left: '50%', transform: 'translateX(-50%)', width: '85%', maxWidth: '900px', pointerEvents: 'none', zIndex: 12 }}>
            <span className="dewdrop-twinkle d1" style={{ position: 'absolute', left: '15%', top: '0' }}>✧</span>
            <span className="dewdrop-twinkle d2" style={{ position: 'absolute', left: '42%', top: '5px' }}>✦</span>
            <span className="dewdrop-twinkle d3" style={{ position: 'absolute', left: '68%', top: '-2px' }}>✧</span>
            <span className="dewdrop-twinkle d4" style={{ position: 'absolute', left: '88%', top: '4px' }}>✦</span>
          </div>
        </div>

        {/* ACTION BUTTONS DOCK: Sits at the bottom of the first screen (100vh) */}
        <div 
          className="hero-buttons-slot animate-hero-left"
          style={{
            position: 'absolute',
            top: '88vh',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 25,
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <div className="hero-action-dock-container">
            {/* Ambient subtle floating nature sparks */}
            <div className="dock-ambient-spores" aria-hidden="true">
              <span className="spore-mote mote-1">✦</span>
              <span className="spore-mote mote-2">✧</span>
              <span className="spore-mote mote-3">✦</span>
            </div>

            <div className="hero-bottom-actions-row hero-actions-dock" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <button 
                type="button"
                onClick={handleSeeStoryClick}
                className={`hero-btn-primary-journey btn-shimmer interactive glowing-border-btn ${
                  !storyImagesLoaded ? 'btn-orange-toggling-active' : 'btn-story-unlocked'
                } ${isWaitingForStory ? 'btn-story-dispatching' : ''}`}
                title={storyImagesLoaded ? 'See the story' : `Buffering scenes: ${storyPreloadProgress}%`}
              >
                <span className="btn-ambient-beam" />

                {/* Circular progressive bar with orange toggling way */}
                <CircularStoryProgress 
                  progress={storyPreloadProgress} 
                  isLoaded={storyImagesLoaded} 
                  isWaiting={isWaitingForStory} 
                />

                <span className="btn-text-label">
                  {isWaitingForStory && !storyImagesLoaded
                    ? `Preparing Story (${storyPreloadProgress}%)`
                    : 'See the story'
                  }
                </span>

                {/* Orange Toggle Status Pill Indicator */}
                {!storyImagesLoaded && (
                  <span className="btn-orange-toggle-pill">
                    <span className="orange-toggle-dot" />
                    <span>{isWaitingForStory ? 'LOADING' : 'SYNCING'}</span>
                  </span>
                )}

                {storyImagesLoaded && (
                  <ArrowRight size={16} className="journey-arrow-icon" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Chatbot Widget (Matching Image 2) */}
        {!isClosed && (
          <div 
            className={`hero-right-chatbot-wrapper animate-hero-right desktop-only ${isMinimized ? 'minimized' : ''}`}
          >
            {renderImage2ChatWidget()}
          </div>
        )}

        {/* Floating Closed Summon Launcher Button */}
        {isClosed && (
          <div className="closed-chat-summon-trigger animate-beat-in desktop-only">
            <button 
              type="button" 
              className="sprout-summon-btn interactive"
              onClick={() => {
                setIsClosed(false);
                setIsMinimized(false);
              }}
              title="Open Sprout Chat"
            >
              <img src="/sprout-avatar.webp" alt="Sprout" className="summon-avatar" />
              <span>Ask Sprout</span>
              <span className="summon-pulse-dot" />
            </button>
          </div>
        )}

      </div>

      {/* MOBILE FLOATING TRIGGER BUTTON */}
      <div className="mobile-chat-trigger-bar">
        <button 
          type="button" 
          className="mobile-chat-toggle-btn interactive"
          onClick={() => setIsMobileChatOpen(true)}
        >
          <img src="/sprout-avatar.webp" alt="Sprout" className="mobile-btn-avatar" />
          <span>Ask Sprout</span>
          <span className="mobile-unread-dot" />
        </button>
      </div>

      {/* MOBILE CHAT DRAWER */}
      {isMobileChatOpen && (
        <div className="mobile-chat-overlay" onClick={() => setIsMobileChatOpen(false)}>
          <div 
            className="mobile-chat-bottom-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-sheet-drag-pill" />
            {renderImage2ChatWidget()}
          </div>
        </div>
      )}
    </section>
  );
}
