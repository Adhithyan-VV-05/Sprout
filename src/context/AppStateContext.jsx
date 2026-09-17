'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AppStateContext = createContext(null);

export const STORY_IMAGE_URLS = [
  '/story/c_1.webp',
  '/story/c_2.webp',
  '/story/c_3.webp',
  '/story/c_4.webp',
  '/story/c_5.webp',
  '/story/c_6.webp',
  '/story/c_7.webp',
  '/story/c_8.webp',
  '/story/c_9.webp',
  '/story/c_10.webp',
  '/story/c_11.webp',
  '/story/c_12.webp'
];

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

  // Story Images Preloading State
  const [storyPreloadProgress, setStoryPreloadProgress] = useState(0);
  const [storyImagesLoaded, setStoryImagesLoaded] = useState(false);
  const isPreloadingRef = useRef(false);

  const updateUserProfile = (key, value) => {
    setUserProfile((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (typeof window === 'undefined' || isPreloadingRef.current) return;
    isPreloadingRef.current = true;

    const completedUrls = new Set();
    const total = STORY_IMAGE_URLS.length;

    const onImageDone = (url) => {
      if (completedUrls.has(url)) return;
      completedUrls.add(url);
      const pct = Math.min(100, Math.round((completedUrls.size / total) * 100));
      setStoryPreloadProgress(pct);
      if (completedUrls.size >= total) {
        setStoryImagesLoaded(true);
      }
    };

    STORY_IMAGE_URLS.forEach((url) => {
      const img = new Image();
      img.onload = () => onImageDone(url);
      img.onerror = () => onImageDone(url);
      img.src = url;
      if (img.complete) {
        onImageDone(url);
      }
    });
  }, []);

  return (
    <AppStateContext.Provider
      value={{
        userProfile,
        updateUserProfile,
        postStoryTrigger,
        setPostStoryTrigger,
        hasLoadedBefore,
        setHasLoadedBefore,
        storyPreloadProgress,
        storyImagesLoaded,
        storyImagesTotal: STORY_IMAGE_URLS.length
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
