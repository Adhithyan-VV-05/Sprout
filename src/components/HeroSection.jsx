'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowRight, Sparkles, User, HeartHandshake, CheckCheck, SendHorizontal, ShieldAlert } from 'lucide-react';
import ParticleCanvas from './ParticleCanvas';
import { getAdaptiveImageSource, getBlurPlaceholder } from '../services/imageOptimizer';

export default function HeroSection({ onStartStory, userProfile, updateUserProfile }) {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Chat Messages State with WhatsApp Timestamps & History
  const [messages, setMessages] = useState([]);
  const [latestAnalyzedIssue, setLatestAnalyzedIssue] = useState('');
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

  useEffect(() => {
    const baseHero = '/story/hero bg pc.webp';
    const adaptiveSrc = getAdaptiveImageSource(baseHero);
    const blurSrc = getBlurPlaceholder(baseHero);

    setHeroBlurSrc(blurSrc);
    setHeroImageSrc(adaptiveSrc);

    const img = new Image();
    img.src = adaptiveSrc;
    img.onload = () => setIsHeroLoaded(true);
  }, []);

  // Initialize WhatsApp Chat Greetings with Sprout Character
  useEffect(() => {
    const initialName = userProfile.visitorName;
    const initialText = initialName 
      ? `Welcome back, ${initialName}. I'm listening with full care. What's on your mind today?`
      : "Hello friend! I'm Sprout, the Growth Guardian from Asterra. What's on your mind today?";

    setMessages([
      { id: 1, sender: 'sprout', text: initialText, time: getTimeString() }
    ]);
  }, [userProfile.visitorName]);

  // Auto-scroll chat body
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping, isDispatchingSignal]);

  const handlePromptClick = (promptText) => {
    setInputText(promptText);
    processInput(promptText);
  };

  const processInput = async (text) => {
    if (!text.trim()) return;
    const currentInput = text.trim();
    setInputText('');

    const time = getTimeString();

    // Add User Message
    const userMsg = { id: Date.now(), sender: 'user', text: currentInput, time };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Update visitor name if shared
    if (!userProfile.visitorName) {
      let extractedName = currentInput.replace(/my name is|i am|i'm|call me/gi, '').trim();
      if (!extractedName) extractedName = currentInput;
      extractedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);

      if (updateUserProfile) {
        updateUserProfile('visitorName', extractedName);
      }
    }

    // Call Google Gemini API Route (/api/chat)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          visitorName: userProfile.visitorName,
          visitorAge: userProfile.visitorAge,
          visitorLocation: userProfile.visitorLocation,
          history: messages
        })
      });

      const data = await res.json();
      setIsTyping(false);

      if (data && data.reply) {
        if (data.analyzedIssue) {
          setLatestAnalyzedIssue(data.analyzedIssue);
        }

        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: 'sprout', text: data.reply, time: getTimeString() }
        ]);
      } else {
        const nameStr = userProfile.visitorName || 'friend';
        setMessages((prev) => [
          ...prev,
          { 
            id: Date.now() + 1, 
            sender: 'sprout', 
            text: `I hear you deeply, ${nameStr}. Every small leaf grows towards the light.`, 
            time: getTimeString() 
          }
        ]);
      }
    } catch (err) {
      console.warn('Gemini API call error:', err);
      setIsTyping(false);
      const nameStr = userProfile.visitorName || 'friend';
      setMessages((prev) => [
        ...prev,
        { 
          id: Date.now() + 1, 
          sender: 'sprout', 
          text: `I'm right here with you, ${nameStr}. You don't have to carry everything alone.`, 
          time: getTimeString() 
        }
      ]);
    }
  };

  // Dispatch Emergency Superhero Signal to Hero's Gmail
  const handleEmergencySignalDispatch = async () => {
    setIsEmergencyActive(true);
    if (isDispatchingSignal) return;
    setIsDispatchingSignal(true);

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorName: userProfile.visitorName || 'Friend in Need',
          visitorEmail: userProfile.visitorEmail || 'Not provided',
          visitorAge: userProfile.visitorAge || 'Unspecified',
          visitorLocation: userProfile.visitorLocation || 'Earth / Asterra Portal',
          analyzedIssue: latestAnalyzedIssue || 'Emergency Superhero Call & struggle shared by visitor',
          fullTranscript: messages,
          type: 'EMERGENCY_HERO_SIGNAL'
        })
      });

      await res.json();
      setIsDispatchingSignal(false);
      setIsSignalDispatched(true);

      const nameStr = userProfile.visitorName || 'friend';
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: 'sprout',
          isSpecial: true,
          text: `🚨 EMERGENCY SUPERHERO SIGNAL ACTIVATED! Your visitor profile, issue analysis, and chat transcript have been dispatched directly to Sprout's hero inbox. Sprout is listening & standing by for ${nameStr}!`,
          time: getTimeString()
        }
      ]);
    } catch (err) {
      console.error('Error dispatching emergency signal to hero:', err);
      setIsDispatchingSignal(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    processInput(inputText);
  };

  return (
    <section id="home" className="hero-wrapper">
      {/* Top Header - Branding */}
      <header className="hero-top-navbar">
        <div className="brand-logo-reference">
          <img src="/title.webp" alt="Sprout Title" className="brand-title-image-header" />
        </div>
      </header>

      {/* Zero-CLS Blur Placeholder Background */}
      {heroBlurSrc && (
        <div 
          className="hero-bg-blur-placeholder"
          style={{ backgroundImage: `url('${heroBlurSrc}')` }}
        />
      )}

      {/* 100% Fill Proper High-Quality Hero Background */}
      <div 
        className={`hero-bg-animated ${isHeroLoaded ? 'loaded' : ''}`}
        style={{
          backgroundImage: heroImageSrc ? `url('${heroImageSrc}')` : undefined
        }}
      />

      {/* Radial Gradient Overlay */}
      <div className="hero-overlay-gradient" />

      {/* Living Ambient Particle Canvas */}
      <ParticleCanvas sceneId={1} emotionalState="WONDER" />

      {/* Left Column Story Content */}
      <div className="hero-left-story-content reference-matched">

        <h1 className="hero-story-title reference-title animate-title-stagger">
          <span className="title-line-1">A kinder</span>
          <br />
          <span className="title-line-2">tomorrow.</span>
        </h1>

        <p className="hero-story-subtitle reference-subtitle animate-subtitle-fade">
          A little light, a listening friend,<br />
          and a place to begin.
        </p>

        {/* Story Mode Primary CTA */}
        <div className="reference-buttons-row">
          <button 
            type="button" 
            className="ref-btn-primary-explore interactive"
            onClick={onStartStory}
          >
            <span>Explore the Story</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* RIGHT SIDE WHATSAPP-STYLE SPROUT SUPERHERO CHATBOT WIDGET */}
      <div className={`hero-right-chatbot-card whatsapp-style ${isEmergencyActive ? 'emergency-flashing-active' : ''}`}>
        {/* WhatsApp-Style Header */}
        <div className="chat-card-header whatsapp-header">
          <div className="chat-header-user-info">
            <div className="avatar-pulse-wrapper">
              <img src="/favicon.webp" alt="Sprout" className="chat-sprout-avatar-noborder" />
              <span className="chat-online-dot" />
            </div>
            <div className="chat-header-text">
              <h3 className="chat-sprout-name">SPROUT</h3>
              <span className="chat-sprout-status">Growth Guardian • listening</span>
            </div>
          </div>
          <button 
            type="button" 
            className={`chat-header-emergency-btn ${isEmergencyActive ? 'active-flashing' : ''} interactive`}
            onClick={handleEmergencySignalDispatch}
            title="Click to activate Emergency Superhero Beacon Signal & dispatch details to Hero"
          >
            <ShieldAlert size={14} className="emergency-icon-pulse" />
            <span>EMERGENCY</span>
          </button>
        </div>

        {/* Conversation Body */}
        <div className="chat-card-body whatsapp-body" ref={chatBodyRef}>
          {messages.map((m) => (
            <div 
              key={m.id} 
              className={`minimal-chat-bubble ${m.sender} ${m.isSpecial ? 'special-signal' : ''} animate-beat-in`}
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

        {/* Superhero Action Button: SEEK THE LIGHT (Always Visible) */}
        <div className="seek-light-action-bar">
          <button 
            type="button" 
            className={`seek-light-btn interactive ${isSignalDispatched ? 'dispatched' : ''}`}
            onClick={handleEmergencySignalDispatch}
            disabled={isDispatchingSignal || isSignalDispatched}
          >
            <HeartHandshake size={16} />
            <span>
              {isSignalDispatched 
                ? "Emergency Signal Dispatched to Hero" 
                : isDispatchingSignal 
                  ? "Dispatching Signal..." 
                  : "Seek the Light (Signal Superhero)"}
            </span>
          </button>
        </div>

        {/* Prompt Chips matching Image 3 */}
        <div className="chat-card-prompt-chips">
          <button 
            type="button" 
            className="minimal-chip interactive" 
            onClick={() => handlePromptClick("I need your help with something.")}
          >
            Share a Worry
          </button>
          <button 
            type="button" 
            className="minimal-chip interactive" 
            onClick={() => handlePromptClick("How can I find hope today?")}
          >
            Seek Guidance
          </button>
          <button 
            type="button" 
            className="minimal-chip interactive" 
            onClick={() => handlePromptClick("Tell me about Asterra")}
          >
            Just Talk
          </button>
        </div>

        {/* WhatsApp-Style Input Bar matching Image 3 */}
        <form onSubmit={handleSend} className="chat-card-input-form whatsapp-input">
          <input 
            type="text" 
            className="chat-card-input-field interactive"
            placeholder="Message Sprout..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="chat-card-send-btn interactive" title="Send message">
            <SendHorizontal size={15} />
          </button>
        </form>
      </div>
    </section>
  );
}
