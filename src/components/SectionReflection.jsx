'use client';

import React from 'react';
import { ArrowRight, Instagram, Youtube } from 'lucide-react';
import { layoutConfig } from '../config/layoutConfig';

export default function SectionReflection({ onStartStory, onOpenChat }) {
  const cfg = layoutConfig.section4Reflection;
  const footerCfg = cfg.footer;

  return (
    <section id="contact" className="continuous-section section-reflection section-blend-4">

      {/* Foreground Content Layout */}
      <div className="continuous-section-content reflection-content-wrapper">
        
        {/* Main Content Area - Direct on background (No Card Box) */}
        <div 
          className="reflection-direct-content"
          style={{
            position: 'absolute',
            top: cfg.mainContent.position.top,
            left: cfg.mainContent.position.left,
            right: cfg.mainContent.position.right,
            bottom: cfg.mainContent.position.bottom,
            maxWidth: cfg.mainContent.position.maxWidth,
            zIndex: 15
          }}
        >
          <h2 className="reflection-heading-serif">
            {cfg.mainContent.heading}
          </h2>
          <p className="reflection-subtitle-text">
            {cfg.mainContent.subtitle}
          </p>
          <button 
            type="button" 
            className="btn-lime-pill interactive"
            onClick={onOpenChat || onStartStory}
          >
            <span>{cfg.mainContent.buttonText}</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Right Script Accent matching reference image */}
        {cfg.rightScript && (
          <div 
            className="handwritten-script-accent reflection-right-script desktop-only"
            style={{
              position: 'absolute',
              top: cfg.rightScript.position.top,
              right: cfg.rightScript.position.right,
              transform: `rotate(${cfg.rightScript.position.rotation || '0deg'})`,
              whiteSpace: 'pre-line',
              textAlign: 'center',
              lineHeight: 1.3,
              zIndex: 15
            }}
          >
            {cfg.rightScript.text}
          </div>
        )}

        {/* Master Reference Footer Bar at the bottom */}
        {footerCfg?.enabled && (
          <footer className="template-master-footer-bar">
            {/* Left Brand */}
            <div className="footer-left-brand">
              <img src="/favicon.webp" alt="Sprout Icon" className="footer-leaf-logo" />
              <div className="footer-brand-text">
                <span className="footer-brand-name">{footerCfg.brandTitle}</span>
                <span className="footer-brand-tagline">{footerCfg.brandTagline}</span>
              </div>
            </div>

            {/* Center Navigation & Subtitle */}
            <div className="footer-center-nav-block">
              <div className="footer-nav-links-row">
                {footerCfg.navLinks.map((link) => (
                  <a key={link} href={`#${link.toLowerCase()}`} className="footer-nav-anchor">
                    {link}
                  </a>
                ))}
              </div>
              <p className="footer-center-motto">{footerCfg.centerText}</p>
              <div className="footer-glowing-leaf-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                </svg>
              </div>
            </div>

            {/* Right Socials & Copyright */}
            <div className="footer-right-meta-block">
              <div className="footer-social-icons-row">
                <a href="#instagram" className="footer-social-icon-btn" aria-label="Instagram">
                  <Instagram size={16} />
                </a>
                <a href="#x" className="footer-social-icon-btn" aria-label="X Twitter">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#youtube" className="footer-social-icon-btn" aria-label="YouTube">
                  <Youtube size={16} />
                </a>
                <a href="#discord" className="footer-social-icon-btn" aria-label="Discord">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </a>
              </div>
              <span className="footer-copyright-text">{footerCfg.copyright}</span>
            </div>
          </footer>
        )}

      </div>
    </section>
  );
}
