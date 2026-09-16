import React, { useState } from 'react';
import HeroSection from './components/HeroSection';
import SectionJourney from './components/SectionJourney';
import SectionPillars from './components/SectionPillars';
import SectionReflection from './components/SectionReflection';
import StoryMode from './components/StoryMode';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';
import { layoutConfig, calcBgOffset } from './config/layoutConfig';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isStoryActive, setIsStoryActive] = useState(false);
  const [initialSceneId, setInitialSceneId] = useState(1);
  const mainBg = layoutConfig.mainBackground;
  
  const [userProfile, setUserProfile] = useState({
    visitorName: '',
    visitorAge: '',
    visitorLocation: '',
    visitorGender: '',
    visitorEmail: ''
  });
  const [postStoryTrigger, setPostStoryTrigger] = useState(null);

  const updateUserProfile = (key, value) => {
    setUserProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleStartStory = (sceneId = 1) => {
    setInitialSceneId(sceneId);
    setIsStoryActive(true);
  };

  const handleStoryFinished = () => {
    setIsStoryActive(false);
    setPostStoryTrigger(Date.now());
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="continuous-site-flow fade-in-flow">
      {/* Custom Awwwards Magnetic Cursor */}
      <CustomCursor />

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
      <HeroSection 
        isStoryActive={isStoryActive}
        onStartStory={() => handleStartStory(1)}
        userProfile={userProfile}
        updateUserProfile={updateUserProfile}
        postStoryTrigger={postStoryTrigger}
      />

      {/* Interactive Dedicated Story Mode Section */}
      <StoryMode 
        isActive={isStoryActive}
        initialSceneId={initialSceneId}
        onClose={() => setIsStoryActive(false)}
        onStoryFinished={handleStoryFinished}
        userProfile={userProfile}
        updateUserProfile={updateUserProfile}
      />
    </div>
  );
}
