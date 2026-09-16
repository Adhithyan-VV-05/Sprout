import React, { useState, useEffect } from 'react';

export default function LoadingScreen({ onLoadingComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 1. Preload the massive main background image explicitly
    const bgImage = new Image();
    bgImage.src = '/main-story/main-bg-opt.webp';

    // 2. Preload Sprout's Avatar for immediate rendering
    const avatar = new Image();
    avatar.src = '/sprout-avatar.webp';

    let isImageLoaded = false;
    let minTimePassed = false;

    // Simulate progress bar jumping quickly to 80% while we wait for the big image
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev < 80) return prev + Math.random() * 15;
        if (prev < 95 && isImageLoaded) return prev + 5;
        return prev;
      });
    }, 200);

    // Minimum display time for the aesthetic loading screen
    const timer = setTimeout(() => {
      minTimePassed = true;
      checkCompletion();
    }, 2000);

    bgImage.onload = () => {
      isImageLoaded = true;
      checkCompletion();
    };

    bgImage.onerror = () => {
      console.warn("Failed to preload main background, continuing anyway.");
      isImageLoaded = true;
      checkCompletion();
    };

    function checkCompletion() {
      if (isImageLoaded && minTimePassed) {
        clearInterval(progressInterval);
        setProgress(100);
        setTimeout(() => {
          onLoadingComplete();
        }, 800); // Wait for progress bar to hit 100% smoothly
      }
    }

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [onLoadingComplete]);

  return (
    <div className="global-loading-screen">
      <div className="loading-content-wrapper">
        <div className="loading-avatar-glow">
          <img src="/sprout-avatar.webp" alt="Sprout" className="loading-sprout-avatar" />
        </div>
        
        <h2 className="loading-text">Summoning Asterra...</h2>
        
        <div className="loading-bar-container">
          <div 
            className="loading-bar-fill" 
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="loading-percentage">
          {Math.min(Math.round(progress), 100)}%
        </div>
      </div>
    </div>
  );
}
