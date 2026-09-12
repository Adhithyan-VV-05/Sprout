'use client';

import React, { useState, useEffect } from 'react';
import { X, Send, User } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

export default function SproutChatModal({ isOpen, onClose, userProfile, updateUserProfile }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      const greeting = userProfile.visitorName 
        ? `Hey, ${userProfile.visitorName}. It's so good to talk with you. What's on your mind today? 🌱`
        : "Hello friend. I'm Sprout, the Growth Guardian. What should I call you?";
      
      setMessages([
        {
          id: 1,
          sender: 'sprout',
          text: greeting
        }
      ]);
    }
  }, [isOpen, userProfile.visitorName]);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input.trim();
    setInput('');
    audioEngine.playChime();

    // Send email dispatch to Sprout the Superhero via Next.js API
    try {
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorName: userProfile.visitorName,
          visitorEmail: userProfile.visitorEmail,
          visitorAge: userProfile.visitorAge,
          visitorLocation: userProfile.visitorLocation,
          message: currentInput,
          type: 'CHAT_MESSAGE'
        })
      });
    } catch (err) {
      console.warn('API email dispatch:', err);
    }

    // Check if user is sharing their name for the first time
    if (!userProfile.visitorName) {
      let extractedName = currentInput.replace(/my name is|i am|i'm|call me/gi, '').trim();
      if (!extractedName) extractedName = currentInput;
      // Capitalize first letter
      extractedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
      
      if (updateUserProfile) {
        updateUserProfile('visitorName', extractedName);
      }

      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          { 
            id: Date.now() + 1, 
            sender: 'sprout', 
            text: `${extractedName}. That's a lovely name. I'm so glad you're here. You don't have to carry everything alone. 🌱` 
          }
        ]);
      }, 750);
      return;
    }

    // Generate Sprout's empathetic response
    setTimeout(() => {
      let responseText = "I hear you deeply. Every seed goes through dark soil before reaching the sunlight. 🌱";
      const nameStr = userProfile.visitorName || 'friend';

      if (currentInput.toLowerCase().includes('sad') || currentInput.toLowerCase().includes('lonely')) {
        responseText = `You don't have to carry that sadness alone, ${nameStr}. Even the vast forest shares its shelter with the smallest leaf.`;
      } else if (currentInput.toLowerCase().includes('fear') || currentInput.toLowerCase().includes('wither')) {
        responseText = `Darkness can be scary, but remember Heartlight: you don't have to fight the whole world right now. Just focus on your next breath.`;
      } else if (currentInput.toLowerCase().includes('who are you') || currentInput.toLowerCase().includes('sprout')) {
        responseText = `I'm Sprout. I was born from the First Seed to help people remember the light they carry inside.`;
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'sprout', text: responseText }]);
    }, 750);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 600,
      background: 'rgba(7, 16, 10, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="hero-right-card" style={{ width: '100%', maxWidth: '640px', margin: 0 }}>
        <div className="card-header-top">
          <span className="card-tag">
            <span>🌱</span> SPROUT CHATBOT
          </span>
          <button 
            type="button" 
            onClick={onClose} 
            style={{ color: 'var(--color-cream)' }}
          >
            <X size={22} />
          </button>
        </div>

        <h2 className="card-headline" style={{ fontSize: '1.5rem' }}>
          {userProfile.visitorName ? `Welcome back, ${userProfile.visitorName}` : "Talk with Sprout"}
        </h2>

        <div className="status-badge">
          <span className="status-dot"></span>
          <span>ONLINE • LISTENING WITH CARE</span>
        </div>

        {/* Conversation List */}
        <div className="hero-chat-body" style={{ maxHeight: '340px' }}>
          {messages.map((m) => (
            <div key={m.id} className={`chat-bubble ${m.sender}`}>
              {m.sender === 'sprout' ? (
                <img src="/story/1 pc.webp" alt="Sprout" className="avatar-circle" />
              ) : (
                <div className="user-avatar-circle">
                  <User size={18} />
                </div>
              )}
              <div className="bubble-content">
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="hero-input-form">
          <input 
            type="text" 
            className="hero-input-field"
            placeholder="Share what's in your heart..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="hero-send-btn">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
