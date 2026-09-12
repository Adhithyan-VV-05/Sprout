import React, { useState } from 'react';
import HeroSection from './components/HeroSection';
import StoryMode from './components/StoryMode';
import CustomCursor from './components/CustomCursor';

export default function App() {
  const [isStoryActive, setIsStoryActive] = useState(false);
  
  const [userProfile, setUserProfile] = useState({
    visitorName: '',
    visitorAge: '',
    visitorLocation: '',
    visitorEmail: ''
  });

  const updateUserProfile = (key, value) => {
    setUserProfile((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="app-root">
      {/* Custom Awwwards Magnetic Cursor */}
      <CustomCursor />

      {/* Hero Section */}
      <HeroSection 
        onStartStory={() => setIsStoryActive(true)}
        userProfile={userProfile}
        updateUserProfile={updateUserProfile}
      />

      {/* Fixed Viewport Interactive Story Mode */}
      <StoryMode 
        isActive={isStoryActive}
        onClose={() => setIsStoryActive(false)}
        userProfile={userProfile}
        updateUserProfile={updateUserProfile}
      />
    </div>
  );
}
