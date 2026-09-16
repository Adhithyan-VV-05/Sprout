// =============================================================================
// SPROUT SITE COMPONENT & POSITIONING CONFIGURATION (layoutConfig.js)
// =============================================================================
// All component coordinates are defined in percentages (%) relative to their section,
// allowing effortless manual positioning and adaptation to any device ratio.
//
// Background Offset:
//   bgY: 100 is base.
//   101 moves the background image 1% UP (translateY(-1%)).
//   99 moves the background image 1% DOWN (translateY(+1%)).
//
// Card format for text has been removed: Text, titles, buttons, and badges
// sit directly over the artwork with pristine typography and subtle shadows.
// =============================================================================

export const calcBgOffset = (bgY) => {
  const val = typeof bgY === 'number' ? bgY : 100;
  const offsetPercent = 100 - val;
  return {
    transform: `translateY(${offsetPercent}%)`
  };
};

export const layoutConfig = {
  // ===========================================================================
  // GLOBAL SINGLE BACKGROUND IMAGE (1764 x 4669 px complete-site poster)
  // ===========================================================================
  mainBackground: {
    image: '/main-story/main bg.png',
    bgY: 100 // 100 = base. 101 = 1% up, 99 = 1% down
  },

  // ===========================================================================
  // SECTION 1: HERO CANOPY (Asterra Canopy)
  // ===========================================================================
  section1Hero: {
    // 100 = base. 101 = 1% up, 99 = 1% down
    bgY: 100,

    // Top Navigation Bar
    navbar: {
      position: { top: '2.5%', left: '5%', right: '5%' },
      brandTitle: 'Sprout',
      brandTagline: 'Small Steps, Brighter Tomorrows.',
      brandLogo: '/favicon.webp',
      meetButton: {
        text: 'Meet Sprout',
        padding: '0.6rem 1.35rem'
      }
    },

    // Left Hero Story Content (No Card Box - Direct on background)
    storyBlock: {
      position: { top: '20%', left: '5%', maxWidth: '480px' },
      eyebrow: {
        text: 'A KINDER TOMORROW BEGINS',
        color: '#fef08a'
      },
      title: {
        line1: 'When Hope',
        line2: 'Takes Root,',
        line3: 'Everything Can',
        highlightText: 'Grow Again.'
      },
      subtitle: 'Small acts of hope, understanding, and kindness can awaken a brighter world.'
    },

    // Action Buttons
    buttons: {
      position: { marginTop: '1.8rem', gap: '0.9rem' },
      startJourneyButton: {
        text: 'Start the Journey',
        bg: '#bbf7d0',
        textColor: '#052e16'
      },
      watchStoryButton: {
        text: 'Watch the Story',
        bg: 'rgba(5, 20, 12, 0.75)',
        textColor: '#ffffff'
      }
    },

    // 3 Feature Badges
    featureBadges: {
      position: { marginTop: '1.6rem', gap: '0.6rem' },
      badges: [
        { id: 1, icon: 'Globe', label: 'A Kinder World', color: '#34d399' },
        { id: 2, icon: 'Users', label: 'Stronger Together', color: '#c084fc' },
        { id: 3, icon: 'Sparkles', label: 'Brighter Tomorrows', color: '#fbbf24' }
      ]
    },

    // Chatbot Widget ("Ask Sprout") on Top Right
    chatWidget: {
      position: { top: '4.2%', right: '5%', width: '350px' },
      title: 'Ask Sprout',
      subtitle: 'How can I help you today?',
      avatar: '/sprout-avatar.webp',
      prompts: [
        'How can I be kinder today?',
        'Tell me a hopeful story.',
        'Tips for a greener lifestyle?'
      ]
    },

    // Handwritten Script Accent on Right Hill
    rightHillAccent: {
      show: true,
      position: { top: '65%', right: '4%', rotation: '2deg' },
      text: 'Different People\nSame Planet\nBrighter Tomorrows\n♡'
    }
  },

  // ===========================================================================
  // SECTION 2: OUR STORY & THE SHADOW WE FACE
  // ===========================================================================
  section2Journey: {
    // 100 = base. 101 = 1% up, 99 = 1% down
    bgY: 100,

    // Top Portion: OUR STORY (Direct on painted parchment - No Card Box!)
    storyText: {
      position: { top: '6.5%', left: '6%', maxWidth: '370px' },
      eyebrow: 'OUR STORY',
      heading: 'Born from\na Single Seed.',
      description: 'In an ancient forest, a tiny seed awakened. Nurtured by nature, Sprout grew into a guardian of hope — to bring warmth, kindness, and life where there is darkness.',
      buttonText: 'Discover the Story'
    },

    // 3 Polaroid Cards & Captions (Rotatable Angles & Coordinates)
    // Cleanly positioned on the bottom borders of the polaroids without covering artwork
    polaroidCards: [
      {
        id: 1,
        caption: 'A tiny seed.',
        position: { top: '23.8%', left: '42.2%' },
        rotation: '-3.5deg',
        title: 'The Sacred Awakening',
        subtitle: 'Heart of the Elder Grove',
        description: 'Nested in golden moss, the ancient seed absorbed the tears and dreams of Asterra, giving life to Sprout — a guardian of boundless empathy.',
        quote: '"Every mighty forest begins with a quiet seed that dared to open."'
      },
      {
        id: 2,
        caption: 'A new beginning.',
        position: { top: '22.2%', left: '60.5%' },
        rotation: '1.5deg',
        title: 'The Guiding Lantern',
        subtitle: 'Through the Misty Brambles',
        description: 'Carrying the living flame of compassion, Sprout learned to walk alongside those who lost their path in the dark.',
        quote: '"You do not need to see the entire staircase. Just take the first small step."'
      },
      {
        id: 3,
        caption: 'Hope takes root.',
        position: { top: '24.2%', left: '78.5%' },
        rotation: '-2deg',
        title: 'The Dawn Over Asterra',
        subtitle: 'Vow to the Living City',
        description: 'Looking across the majestic waterfall citadel, Sprout vowed to always listen, protect, and restore hope to every tired heart.',
        quote: '"As long as the sun rises, new growth is always possible."'
      }
    ],

    // Bottom Portion: THE SHADOW WE FACE (Direct on background - No Card Box!)
    shadowText: {
      position: { bottom: '8%', left: '6%', maxWidth: '400px' },
      eyebrow: 'THE SHADOW WE FACE',
      heading: 'A World\nWithout Hope.',
      description: 'Astra took away hope — turning people into machines, isolating communities, and dimming dreams.',
      buttonText: 'Explore the Story'
    },

    // Right Handwritten Script Accent
    shadowRightScript: {
      position: { bottom: '11%', right: '6%', rotation: '-1deg' },
      text: 'A world\nwithout hope\nis only\nhalf alive.'
    }
  },

  // ===========================================================================
  // SECTION 3: SPROUT'S POWERS, THE JOURNEY & OUR MISSION
  // ===========================================================================
  section3Pillars: {
    // 100 = base. 101 = 1% up, 99 = 1% down
    bgY: 100,

    // Top Portion: SPROUT'S POWERS (Direct on background - No Card Box!)
    powersText: {
      position: { top: '2.5%', left: '6%', maxWidth: '330px' },
      eyebrow: "SPROUT'S POWERS",
      heading: 'Gentle Powers.\nReal Change.',
      subtitle: 'Six small powers. A brighter world.',
      buttonText: 'Explore All Powers'
    },

    // 6 Circular Glowing Power Runes with Titles & Subtitles (Matching Reference Image)
    powersRunes: {
      position: { top: '2.5%', right: '5%', maxWidth: '780px' },
      runes: [
        { 
          id: 1, 
          name: 'Hope', 
          desc: 'Believe\nagain.', 
          color: '#4ADE80', 
          iconType: 'leaf' 
        },
        { 
          id: 2, 
          name: 'Happiness', 
          desc: 'Find joy\nin little things.', 
          color: '#F472B6', 
          iconType: 'flower' 
        },
        { 
          id: 3, 
          name: 'Freedom of Thought', 
          desc: 'Question,\nExplore.', 
          color: '#38BDF8', 
          iconType: 'feather' 
        },
        { 
          id: 4, 
          name: 'Connection', 
          desc: 'Grow\ntogether.', 
          color: '#C084FC', 
          iconType: 'users' 
        },
        { 
          id: 5, 
          name: 'Understanding', 
          desc: 'See beyond\ndifferences.', 
          color: '#22C55E', 
          iconType: 'heart' 
        },
        { 
          id: 6, 
          name: 'Courage', 
          desc: 'Believe\nin yourself.', 
          color: '#FB923C', 
          iconType: 'flame' 
        }
      ]
    },

    // Middle Portion: THE JOURNEY (Direct on painted parchment scroll)
    journeyArea: {
      position: { top: '16.8%', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '1060px' },
      eyebrow: 'THE JOURNEY',
      title: 'From Brokenness to Brighter Tomorrows.',
      subtitle: 'Small moments. A kinder world.',
      storySteps: [
        { num: 1, image: '/story/3.webp', title: '1. A World Controlled', subtitle: 'Hope begins to fade.' },
        { num: 2, image: '/story/6.webp', title: '2. A Spark of Hope', subtitle: 'Kindness awakens.' },
        { num: 3, image: '/story/10.webp', title: '3. People Rise Again', subtitle: 'Hearts reconnect.' },
        { num: 4, image: '/story/11.webp', title: '4. Together We Stand', subtitle: 'Unity creates change.' },
        { num: 5, image: '/story/12.webp', title: '5. A Brighter Tomorrow', subtitle: 'A kinder world.' }
      ]
    },

    // Bottom Portion: OUR MISSION (Direct on background - No Card Box!)
    missionArea: {
      signboard: {
        position: { bottom: '4.5%', left: '6%' },
        text: 'Different\nPeople\nSame Planet\n♡'
      },
      content: {
        position: { bottom: '4.5%', right: '5%', maxWidth: '440px' },
        eyebrow: 'OUR MISSION',
        heading: 'A Guardian for\nEvery Growing Dream.',
        narrative: 'Protect nature. Spread kindness. Inspire a brighter tomorrow.',
        buttonText: 'Join the Mission',
        features: [
          { icon: 'Leaf', label: 'Protect Nature' },
          { icon: 'Heart', label: 'Inspire Kindness' },
          { icon: 'Users', label: 'Support Communities' },
          { icon: 'Globe', label: 'Create a Greener Future' }
        ]
      }
    }
  },

  // ===========================================================================
  // SECTION 4: LET HOPE TAKE ROOT & FOOTER
  // ===========================================================================
  section4Reflection: {
    // 100 = base. 101 = 1% up, 99 = 1% down
    bgY: 100,

    // Main Content (Direct on background - No Card Box!)
    mainContent: {
      position: { top: '16%', left: '6%', maxWidth: '440px' },
      heading: 'Let Hope Take Root.',
      subtitle: 'Small steps. Shared courage. Brighter tomorrows.',
      buttonText: 'Talk to Sprout'
    },

    // Right Handwritten Script Accent
    rightScript: {
      position: { top: '18%', right: '6%', rotation: '2deg' },
      text: 'A Kinder\nTomorrow\nStarts with You\n♡'
    },

    // Footer matching master reference image
    footer: {
      enabled: true,
      brandTitle: 'Sprout',
      brandTagline: 'Small Steps, Brighter Tomorrows.',
      centerText: 'A story. A conversation. A kinder tomorrow.',
      copyright: '© 2025 Sprout. All rights reserved.',
      navLinks: ['Home', 'Story', 'Powers', 'World', 'Mission', 'Contact']
    }
  }
};
