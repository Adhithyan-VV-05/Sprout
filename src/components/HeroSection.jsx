'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowRight, Sparkles, User, HeartHandshake, CheckCheck, SendHorizontal, ShieldAlert, MessageCircle, Heart, Zap, X } from 'lucide-react';
import ParticleCanvas from './ParticleCanvas';
import { getAdaptiveImageSource, getBlurPlaceholder, isMobileViewport } from '../services/imageOptimizer';

export default function HeroSection({ isStoryActive, onStartStory, userProfile, updateUserProfile }) {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Chat Modes: 'casual' | 'help'
  const [chatMode, setChatMode] = useState('casual');
  const [isNameConfirmed, setIsNameConfirmed] = useState(Boolean(userProfile?.visitorName));
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 768);

  // Sync extracted profile fields from API
  const handleExtractedProfile = (data) => {
    if (!data || !updateUserProfile) return;
    if (data.extractedAge && !userProfile.visitorAge) {
      updateUserProfile('visitorAge', data.extractedAge);
    }
    if (data.extractedLocation && !userProfile.visitorLocation) {
      updateUserProfile('visitorLocation', data.extractedLocation);
    }
    if (data.extractedEmail && !userProfile.visitorEmail) {
      updateUserProfile('visitorEmail', data.extractedEmail);
    }
    // Extract name if not yet stored
    if (data.extractedName && !userProfile.visitorName) {
      updateUserProfile('visitorName', data.extractedName);
      setIsNameConfirmed(true);
    }
  };

  // Chat Messages State with WhatsApp Timestamps & History
  const [messages, setMessages] = useState([]);
  const [latestAnalyzedIssue, setLatestAnalyzedIssue] = useState('');
  const [visitorProblem, setVisitorProblem] = useState('');
  const [showConfirmationBtn, setShowConfirmationBtn] = useState(false);
  const [isSignalDispatched, setIsSignalDispatched] = useState(false);
  const [isDispatchingSignal, setIsDispatchingSignal] = useState(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  const chatBodyRef = useRef(null);

  // Hero Image Adaptive Loader
  const [heroImageSrc, setHeroImageSrc] = useState('');
  const [heroBlurSrc, setHeroBlurSrc] = useState('');
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);

  const getTimeString = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Track viewport size changes for mobile/desktop image swapping
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load hero background image — re-runs when mobile state changes
  useEffect(() => {
    const baseHero = '/story/hero bg pc.webp';
    const adaptiveSrc = getAdaptiveImageSource(baseHero);
    const blurSrc = getBlurPlaceholder(baseHero);

    setHeroBlurSrc(blurSrc);
    setIsHeroLoaded(false);

    const img = new Image();
    img.src = adaptiveSrc;
    img.onload = () => {
      setHeroImageSrc(adaptiveSrc);
      setIsHeroLoaded(true);
    };
    img.onerror = () => {
      setHeroImageSrc(adaptiveSrc);
    };
  }, [isMobile]);

  // Sync name from Story Mode or User Profile state
  useEffect(() => {
    if (userProfile?.visitorName) {
      setIsNameConfirmed(true);
    }
  }, [userProfile?.visitorName]);

  // Initialize Chat Greeting - Runs ONCE on mount to avoid overwriting 1st sent message!
  useEffect(() => {
    const initialName = userProfile.visitorName;
    const initialText = initialName 
      ? `Welcome back, ${initialName}! I'm listening with full care. How can I help you today?`
      : "Hey there! I'm Sprout, your Growth Guardian superhero! 🌿 May I know your name so I know who I'm protecting and talking with today?";

    setMessages([
      { id: 1, sender: 'sprout', text: initialText, time: getTimeString() }
    ]);
  }, []);


  // Auto-scroll chat body
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping, isDispatchingSignal, showConfirmationBtn]);

  const handleModeChange = (e, newMode) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (newMode === chatMode) return;
    setChatMode(newMode);
    setShowConfirmationBtn(false);

    if (newMode === 'help') {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'sprout',
          isModeTag: true,
          text: `Switched mode to ⚡ Needs Help.`,
          time: getTimeString()
        },
        {
          id: Date.now() + 1,
          sender: 'sprout',
          isRedGrievance: true,
          text: "🚨 WHAT IS THE ISSUE? Please tell me what happened or what is troubling you, so I can understand your grievance and protect you.",
          time: getTimeString()
        }
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'sprout',
          isModeTag: true,
          text: `Switched mode to 💬 Casual Talk.`,
          time: getTimeString()
        }
      ]);
    }
  };

  const [collectingField, setCollectingField] = useState(null);

  const getMissingProfileField = (profile) => {
    if (!profile?.visitorName) {
      return {
        field: 'visitorName',
        question: "To call upon Sprout superhero, what is your true name, my friend?"
      };
    }
    if (!profile?.visitorAge) {
      return {
        field: 'visitorAge',
        question: `How many winters have your roots seen in this realm, ${profile.visitorName}? (What is your age?)`
      };
    }
    if (!profile?.visitorLocation) {
      return {
        field: 'visitorLocation',
        question: `Where on Earth are your roots grounded right now, ${profile.visitorName}? (Your city or country so Sprout can navigate to you)`
      };
    }
    if (!profile?.visitorEmail) {
      return {
        field: 'visitorEmail',
        question: `What light address (email) should Sprout send word to so you receive confirmation that help is on the way?`
      };
    }
    return null;
  };

  const dispatchSuperheroSignal = async (profileData) => {
    setIsDispatchingSignal(true);
    setShowConfirmationBtn(false);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorName: profileData.visitorName,
          visitorEmail: profileData.visitorEmail,
          visitorAge: profileData.visitorAge,
          visitorLocation: profileData.visitorLocation,
          analyzedIssue: visitorProblem || latestAnalyzedIssue || 'Superhero grievance signal dispatched',
          fullTranscript: messages,
          type: 'SUPERHERO_DISTRESS_SIGNAL'
        })
      });

      await res.json();
      setIsDispatchingSignal(false);
      setIsSignalDispatched(true);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: 'sprout',
          isSpecial: true,
          text: `🚨 SUPERHERO SIGNAL ACTIVATED & DISPATCHED! Your grievance regarding "${visitorProblem || 'your issue'}" has been transmitted directly to Hero inbox (adhithyanvv4u@gmail.com) and a hope message sent to your email (${profileData.visitorEmail}). Sprout superhero is coming to ${profileData.visitorLocation || 'your location'}!`,
          time: getTimeString()
        }
      ]);
    } catch (err) {
      console.error('Error dispatching superhero signal:', err);
      setIsDispatchingSignal(false);
    }
  };

  const handleDispatchSignalClick = () => {
    // Check if visitor has described their problem yet
    if (!visitorProblem || !visitorProblem.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'sprout',
          isRedGrievance: true,
          text: "Before I dispatch the signal to the Growth Guardians, please tell me what happened! What is your problem?",
          time: getTimeString()
        }
      ]);
      return;
    }

    // Visitor has told what the problem is -> Ask for confirmation to send issue content
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'sprout',
        isConfirmationReq: true,
        text: `I have recorded your grievance: "${visitorProblem}". Are you ready to dispatch this signal with the content of your issue to Sprout?`,
        time: getTimeString()
      }
    ]);
    setShowConfirmationBtn(true);
  };

  const handleConfirmSignalSend = () => {
    const missing = getMissingProfileField(userProfile);
    if (missing) {
      setCollectingField(missing.field);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'sprout', text: missing.question, time: getTimeString() }
      ]);
      return;
    }

    dispatchSuperheroSignal(userProfile);
  };

  const handlePromptClick = (e, promptText) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    processInput(promptText, true);
  };

  const processInput = async (text, overrideIsPrompt = false) => {
    if (!text || !text.trim()) return;
    const currentInput = text.trim();
    setInputText('');

    const time = getTimeString();

    // Add User Message
    const userMsg = { id: Date.now(), sender: 'user', text: currentInput, time };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Record problem if in Help mode or answering grievance prompt
    if (chatMode === 'help' || !visitorProblem) {
      setVisitorProblem(currentInput);
    }

    // Check if user is typing their age explicitly (e.g. "I am 18", "18", "My age is 21")
    const ageMatch = currentInput.match(/(?:i am|i'm|my age is|age is|age)\s*([0-9]{1,2})\b|\b([0-9]{1,2})\s*(?:years old|yrs old|years)\b/i);
    if (ageMatch && updateUserProfile) {
      const parsedAge = ageMatch[1] || ageMatch[2];
      if (parsedAge && parseInt(parsedAge, 10) >= 5 && parseInt(parsedAge, 10) <= 120) {
        updateUserProfile('visitorAge', parsedAge);
      }
    }

    // If currently collecting missing profile fields step-by-step
    if (collectingField) {
      let val = currentInput;
      if (collectingField === 'visitorName') {
        val = currentInput.replace(/my name is|i am|i'm|call me/gi, '').trim();
        if (!val) val = currentInput;
        val = val.charAt(0).toUpperCase() + val.slice(1);
        setIsNameConfirmed(true);
      }

      if (updateUserProfile) {
        updateUserProfile(collectingField, val);
      }

      const updatedProfile = { ...userProfile, [collectingField]: val };
      const nextMissing = getMissingProfileField(updatedProfile);

      setIsTyping(false);

      if (nextMissing) {
        setCollectingField(nextMissing.field);
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: 'sprout', text: nextMissing.question, time: getTimeString() }
        ]);
      } else {
        setCollectingField(null);
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: 'sprout', text: `Thank you, ${updatedProfile.visitorName}! All your details are verified. Transmitting superhero distress signal now...`, time: getTimeString() }
        ]);
        dispatchSuperheroSignal(updatedProfile);
      }
      return;
    }

    // Normal conversation response via API
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          visitorName: userProfile.visitorName || '',
          visitorAge: userProfile.visitorAge || '',
          visitorLocation: userProfile.visitorLocation || '',
          mode: chatMode,
          history: messages
        })
      });

      const data = await res.json();
      setIsTyping(false);
      handleExtractedProfile(data);

      if (data && data.reply) {
        if (data.analyzedIssue) {
          setLatestAnalyzedIssue(data.analyzedIssue);
        }

        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: 'sprout', text: data.reply, time: getTimeString() }
        ]);
      } else {
        const nameClause = userProfile.visitorName ? `, ${userProfile.visitorName}` : '';
        setMessages((prev) => [
          ...prev,
          { 
            id: Date.now() + 1, 
            sender: 'sprout', 
            text: `I hear you deeply${nameClause}. Every small leaf grows towards the light.`, 
            time: getTimeString() 
          }
        ]);
      }
    } catch (err) {
      console.warn('Gemini API call error:', err);
      setIsTyping(false);
      const nameClause = userProfile.visitorName ? `, ${userProfile.visitorName}` : '';
      setMessages((prev) => [
        ...prev,
        { 
          id: Date.now() + 1, 
          sender: 'sprout', 
          text: `I'm right here with you${nameClause}. You don't have to carry everything alone.`, 
          time: getTimeString() 
        }
      ]);
    }
  };


  const handleSend = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    processInput(inputText);
  };

  // Reusable Chatbot Inner Widget JSX
  const renderChatWidgetInner = () => (
    <>
      {/* WhatsApp-Style Header */}
      <div className="chat-card-header whatsapp-header">
        <div className="chat-header-user-info">
          <div className="avatar-pulse-wrapper">
            <img src="/favicon.webp" alt="Sprout" className="chat-sprout-avatar-noborder" />
          </div>
          <div className="chat-header-text">
            <h3 className="chat-sprout-name">SPROUT</h3>
            <span className="chat-sprout-status">Growth Guardian</span>
          </div>
        </div>
        {isMobileChatOpen && (
          <button 
            type="button" 
            className="icon-circle-btn mobile-close-chat-btn" 
            onClick={() => setIsMobileChatOpen(false)}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* 2 Interactive Modes Switcher Bar */}
      <div className="chat-mode-tabs-bar mode-bar-2">
        <button
          type="button"
          className={`mode-tab-btn ${chatMode === 'casual' ? 'active casual' : ''}`}
          onClick={(e) => handleModeChange(e, 'casual')}
          title="Casual conversation, stories & friendly banter"
        >
          <MessageCircle size={14} />
          <span>Casual Talk</span>
        </button>
        <button
          type="button"
          className={`mode-tab-btn ${chatMode === 'help' ? 'active help' : ''}`}
          onClick={(e) => handleModeChange(e, 'help')}
          title="Grievance resolution & superhero signal dispatch"
        >
          <ShieldAlert size={14} />
          <span>Needs Help</span>
        </button>
      </div>

      {/* Conversation Body */}
      <div className="chat-card-body whatsapp-body" ref={chatBodyRef}>
        {messages.map((m) => (
          <React.Fragment key={m.id}>
            {m.isModeTag ? (
              <div className="chat-mode-system-badge">
                <span>{m.text}</span>
              </div>
            ) : (
              <div 
                className={`minimal-chat-bubble ${m.sender} ${m.isRedGrievance ? 'red-grievance-bubble' : ''} ${m.isConfirmationReq ? 'confirmation-req-bubble' : ''} ${m.isSpecial ? 'special-signal' : ''} animate-beat-in`}
              >
                {m.sender === 'sprout' && (
                  <img src="/favicon.webp" alt="Sprout" className="bubble-avatar-mini-noborder" />
                )}
                <div className="minimal-bubble-content">
                  <p className="bubble-text">{m.text}</p>
                  <div className="bubble-timestamp">
                    <span>{m.time}</span>
                    {m.sender === 'user' && <CheckCheck size={13} className="whatsapp-tick" />}
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}

        {isTyping && (
          <div className="minimal-chat-bubble sprout animate-beat-in">
            <img src="/favicon.webp" alt="Sprout" className="bubble-avatar-mini-noborder" />
            <div className="minimal-bubble-content typing-dots">
              <span className="tdot t1" />
              <span className="tdot t2" />
              <span className="tdot t3" />
            </div>
          </div>
        )}
      </div>

      {/* Action Bar: Prompt Chips in Casual mode OR Single Button in Needs Help mode */}
      {chatMode === 'casual' ? (
        <div className="chat-card-prompt-chips">
          <button 
            type="button" 
            className="minimal-chip interactive" 
            onClick={(e) => handlePromptClick(e, "I need your help with something.")}
          >
            Share a Worry
          </button>
          <button 
            type="button" 
            className="minimal-chip interactive" 
            onClick={(e) => handlePromptClick(e, "How can I find hope today?")}
          >
            Seek Guidance
          </button>
          <button 
            type="button" 
            className="minimal-chip interactive" 
            onClick={(e) => handlePromptClick(e, "Tell me about Asterra")}
          >
            Just Talk
          </button>
        </div>
      ) : (
        <div className="help-single-button-area">
          {showConfirmationBtn ? (
            <button 
              type="button" 
              className="confirm-send-signal-btn interactive animate-beat-in" 
              onClick={handleConfirmSignalSend}
            >
              <Zap size={16} />
              <span>Confirm & Send Signal</span>
            </button>
          ) : (
            <button 
              type="button" 
              className="dispatch-signal-single-btn interactive" 
              onClick={handleDispatchSignalClick}
            >
              <Zap size={16} />
              <span>Dispatch the Signal</span>
            </button>
          )}
        </div>
      )}

      {/* WhatsApp-Style Input Bar */}
      <form onSubmit={handleSend} className="chat-card-input-form whatsapp-input">
        <input 
          type="text" 
          className="chat-card-input-field interactive"
          placeholder={
            chatMode === 'casual' 
              ? "Chat with Sprout..." 
              : "Describe your issue / problem..."
          }
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit" className="chat-card-send-btn interactive" title="Send message">
          <SendHorizontal size={15} />
        </button>
      </form>
    </>
  );

  return (
    <section id="home" className="hero-wrapper">
      {/* Top Header - Branding with Out-of-Screen Entrance Animation */}
      <header className="hero-top-navbar animate-hero-nav">
        <div className="brand-logo-reference">
          <img src="/title.webp" alt="Sprout Title" className="brand-title-image-header" />
        </div>
      </header>

      {/* Zero-CLS Blur Placeholder Background */}
      {heroBlurSrc && (
        <div 
          className="hero-bg-blur-placeholder"
          style={{ backgroundImage: `url("${encodeURI(heroBlurSrc)}")` }}
        />
      )}

      {/* 100% Fill Proper High-Quality Hero Background */}
      <div 
        className="hero-bg-animated loaded"
        style={{
          backgroundImage: `url("${encodeURI(heroImageSrc || '/story/hero bg pc.webp')}")`
        }}
      />

      {/* Radial Gradient Overlay */}
      <div className="hero-overlay-gradient" />

      {/* Living Ambient Particle Canvas */}
      <ParticleCanvas sceneId={1} emotionalState="WONDER" />

      {/* Left Column Story Content with Premium Out-of-Screen Entrance Animations */}
      <div className="hero-left-story-content reference-matched animate-hero-left">

        <h1 className="hero-story-title reference-title">
          <span className="title-line-1 animate-title-line-1">A kinder</span>
          <br />
          <span className="title-line-2 animate-title-line-2" style={{ color: 'var(--color-gold-bright)' }}>tomorrow.</span>
        </h1>

        <p className="hero-story-subtitle reference-subtitle animate-subtitle-fade">
          A little light, a listening friend,<br />
          and a place to begin.
        </p>

        {/* Story Mode Primary CTA — both CTAs are here; CSS hides chat btn on desktop */}
        <div className="reference-buttons-row animate-cta-pop">
          <button 
            type="button" 
            className="ref-btn-primary-explore interactive"
            onClick={onStartStory}
          >
            <span>Explore the Story</span>
            <ArrowRight size={18} />
          </button>
          {/* Chat button — visible only on mobile via CSS */}
          {!isStoryActive && (
            <button
              type="button"
              className="mobile-inline-chat-btn mobile-chat-toggle-btn interactive"
              onClick={() => setIsMobileChatOpen(true)}
            >
              <MessageCircle size={17} />
              <span>Chat with Sprout</span>
            </button>
          )}
        </div>
      </div>

      {/* DESKTOP CHAT WIDGET */}
      {!isStoryActive && (
        <div className={`hero-right-chatbot-card whatsapp-style desktop-only-card mode-${chatMode} animate-hero-right ${isEmergencyActive ? 'emergency-flashing-active' : ''}`}>
          {renderChatWidgetInner()}
        </div>
      )}

      {/* MOBILE FLOATING TRIGGER BUTTON */}
      {!isStoryActive && (
        <div className="mobile-chat-trigger-bar">
          <button 
            type="button" 
            className="mobile-chat-toggle-btn interactive"
            onClick={() => setIsMobileChatOpen(true)}
          >
            <MessageCircle size={18} />
            <span>Chat with Sprout</span>
            <span className="mobile-unread-dot" />
          </button>
        </div>
      )}

      {/* MOBILE BOTTOM SHEET CHAT DRAWER */}
      {isMobileChatOpen && (
        <div className="mobile-chat-overlay" onClick={() => setIsMobileChatOpen(false)}>
          <div 
            className={`mobile-chat-bottom-sheet mode-${chatMode}`} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-sheet-drag-pill" />
            {renderChatWidgetInner()}
          </div>
        </div>
      )}
    </section>
  );
}



