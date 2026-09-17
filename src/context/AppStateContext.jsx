'use client';

import React, { createContext, useContext, useState } from 'react';

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [userProfile, setUserProfile] = useState({
    visitorName: '',
    visitorAge: '',
    visitorLocation: '',
    visitorGender: '',
    visitorEmail: ''
  });
  
  const [postStoryTrigger, setPostStoryTrigger] = useState(null);
  
  // Track if the app has already played the loading sequence
  // so we skip it when navigating back from /story to /
  const [hasLoadedBefore, setHasLoadedBefore] = useState(false);

  const updateUserProfile = (key, value) => {
    setUserProfile((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <AppStateContext.Provider
      value={{
        userProfile,
        updateUserProfile,
        postStoryTrigger,
        setPostStoryTrigger,
        hasLoadedBefore,
        setHasLoadedBefore
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
