'use client';

import React, { useState, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import SectionJourney from './components/SectionJourney';
import SectionPillars from './components/SectionPillars';
import SectionReflection from './components/SectionReflection';
import LoadingScreen from './components/LoadingScreen';
import { layoutConfig, calcBgOffset } from './config/layoutConfig';
import { useAppState } from './context/AppStateContext';

export default function App() {
  const { hasLoadedBefore, setHasLoadedBefore } = useAppState();
  const [isLoading, setIsLoading] = useState(!hasLoadedBefore);
  
  const mainBg = layoutConfig.mainBackground;

  useEffect(() => {
    if (!isLoading) {
      setHasLoadedBefore(true);
    }
  }, [isLoading, setHasLoadedBefore]);

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="continuous-site-flow fade-in-flow">
      {/* Single Continuous Full-Page Background Poster Image */}
      <div className="single-full-backdrop">
        <img 
          src={mainBg.image} 
          alt="Sprout Continuous Story Background" 
          className="single-full-backdrop-img"
          style={calcBgOffset(mainBg.bgY)}
        />
      </div>

      {/* Main Interactive Hero Layer with Chatbox & Story Triggers */}
      <HeroSection />
    </div>
  );
}
