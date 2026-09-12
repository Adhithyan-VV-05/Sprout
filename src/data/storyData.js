// SPROUT — THE GROWTH GUARDIAN STORY REGISTRY
// Concise, crystal-clear narrative beats preserving full emotional depth & interactive cards.

export const STORY_SCENES = [
  {
    id: 1,
    title: "ASTERRA",
    sceneCounter: "01 / 18",
    image: "/story/1 pc.webp",
    emotionalState: "WONDER",
    safeZone: "pos-top-center",
    beats: [
      { text: "Once, Asterra grew without limits.", type: "narrative" },
      { text: "People dreamed, built, and helped each other stand.", type: "narrative" }
    ],
    sproutVO: "Welcome to Asterra, where kindness makes everything grow."
  },
  {
    id: 2,
    title: "THE FADING",
    sceneCounter: "02 / 18",
    image: "/story/2 pc.webp",
    emotionalState: "UNEASE",
    safeZone: "pos-bottom-center",
    beats: [
      { text: "Then slowly, people stopped noticing.", type: "narrative" },
      { text: "Conversations faded, and Asterra grew quiet inside.", type: "narrative" }
    ],
    sproutVO: "The city kept moving. It just stopped noticing."
  },
  {
    id: 3,
    title: "THE WITHER",
    sceneCounter: "03 / 18",
    image: "/story/3 pc.webp",
    emotionalState: "MYSTERY",
    safeZone: "pos-top-left",
    beats: [
      { text: "Darkness spread wherever hope was left alone.", type: "narrative" },
      { text: "The forest remembered its name: The Wither.", type: "emphasis" }
    ]
  },
  {
    id: 4,
    title: "THE FIRST SEED",
    sceneCounter: "04 / 18",
    image: "/story/4 pc.webp",
    emotionalState: "DISCOVERY",
    safeZone: "pos-top-left",
    beats: [
      { text: "But hope never disappears — it waits.", type: "narrative" },
      { text: "Deep beneath the oldest roots, a tiny light glowed.", type: "narrative" }
    ],
    sproutVO: "A tiny light, still waiting after all this time."
  },
  {
    id: 5,
    title: "BIRTH OF SPROUT",
    sceneCounter: "05 / 18",
    image: "/story/5 pc.webp",
    emotionalState: "AWAKENING",
    safeZone: "pos-top-right",
    beats: [
      { text: "Leaves gathered. Roots stirred. Light took shape.", type: "narrative" }
    ],
    sproutDialogue: "Hello? Someone out there is hurting. I can feel it."
  },
  {
    id: 6,
    title: "THE CALL",
    sceneCounter: "06 / 18",
    image: "/story/6 pc.webp",
    emotionalState: "CURIOSITY",
    safeZone: "pos-top-center",
    beats: [
      { text: "Beyond the quiet forest, a distant world was calling.", type: "narrative" }
    ],
    sproutDialogue: "I think… I'm supposed to go there."
  },
  {
    id: 7,
    title: "FIRST MEETING",
    sceneCounter: "07 / 18",
    image: "/story/7 pc.webp",
    emotionalState: "CONNECTION",
    safeZone: "pos-top-center",
    beats: [
      { text: "Sprout followed a quiet sadness into the city and sat down.", type: "narrative" }
    ],
    sproutDialogue: "Hey. I can sit quietly with you, or I can listen.",
    visitorDialogue: "I've just been feeling lost lately.",
    interaction: {
      type: "NAME",
      title: "WHAT SHOULD I CALL YOU?",
      placeholder: "Your name",
      buttonText: "Continue",
      storeKey: "visitorName",
      postSubmitSprout: "{visitorName}. That's a lovely name."
    }
  },
  {
    id: 8,
    title: "QUIET",
    sceneCounter: "08 / 18",
    image: "/story/8 pc.webp",
    emotionalState: "TRUST",
    safeZone: "pos-top-center",
    sproutDialogue: "You don't have to explain. We can just sit here, and I'll listen."
  },
  {
    id: 9,
    title: "ROOT OF UNDERSTANDING",
    sceneCounter: "09 / 18",
    image: "/story/9 pc.webp",
    emotionalState: "EMPOWERMENT",
    safeZone: "pos-bottom-right",
    beats: [
      { text: "{visitorName} said they were okay, but felt tired inside.", type: "narrative" }
    ],
    sproutDialogue: "I hear what words leave unsaid.",
    powerReveal: "ROOT OF UNDERSTANDING — hearing what words leave unsaid."
  },
  {
    id: 10,
    title: "HEARTLIGHT",
    sceneCounter: "10 / 18",
    image: "/story/10 pc.webp",
    emotionalState: "PROTECTION",
    safeZone: "pos-top-left",
    beats: [
      { text: "The darkness returned, making {visitorName} panic.", type: "narrative" }
    ],
    sproutDialogue: "Look at me. You don't have to fight the whole world right now.",
    powerReveal: "HEARTLIGHT — a shield made of compassion."
  },
  {
    id: 11,
    title: "SEED OF CLARITY",
    sceneCounter: "11 / 18",
    image: "/story/11 pc.webp",
    emotionalState: "CLARITY",
    safeZone: "pos-top-left",
    beats: [
      { text: "A city trapped in darkness. Sprout touched the earth.", type: "narrative" }
    ],
    sproutDialogue: "Knowing isn't enough — we need each other.",
    powerReveal: "SEED OF CLARITY — revealing the path others can't see."
  },
  {
    id: 12,
    title: "NIGHT CONVERSATION",
    sceneCounter: "12 / 18",
    image: "/story/12 pc.webp",
    emotionalState: "INTIMACY",
    safeZone: "pos-top-left",
    beats: [
      { text: "They sat together beneath the quiet stars.", type: "narrative" }
    ],
    sproutDialogue: "How many years have you been growing?",
    interaction: {
      type: "AGE",
      title: "HOW MANY YEARS HAVE YOU BEEN GROWING?",
      placeholder: "Your age",
      buttonText: "Continue",
      storeKey: "visitorAge",
      postSubmitSprout: "{visitorAge}. That's {visitorAge} years of stories."
    }
  },
  {
    id: 13,
    title: "HOME",
    sceneCounter: "13 / 18",
    image: "/story/13 pc.webp",
    emotionalState: "BELONGING",
    safeZone: "pos-top-left",
    beats: [
      { text: "Every seed grows somewhere.", type: "narrative" }
    ],
    sproutDialogue: "Where is your little corner of the world?",
    interaction: {
      type: "LOCATION",
      title: "WHERE DOES YOUR STORY GROW?",
      placeholder: "Your location",
      buttonText: "This is home",
      storeKey: "visitorLocation",
      postSubmitSprout: "{visitorLocation}. So that's where you're rooted. Beautiful."
    }
  },
  {
    id: 14,
    title: "THE WITHER RETURNS",
    sceneCounter: "14 / 18",
    image: "/story/14 pc.webp",
    emotionalState: "DANGER",
    safeZone: "pos-bottom-left",
    beats: [
      { text: "The Wither returned stronger than ever.", type: "narrative" }
    ],
    witherDialogue: "You cannot save them.",
    sproutDialogue: "Maybe… I'm not supposed to win alone."
  },
  {
    id: 15,
    title: "THE SMALLEST LIGHT",
    sceneCounter: "15 / 18",
    image: "/story/15 pc.webp",
    emotionalState: "REALIZATION",
    safeZone: "pos-bottom-center",
    beats: [
      { text: "Sprout realized a hero doesn't carry everyone's weight.", type: "narrative" }
    ],
    sproutHighlightBeats: [
      "I was never meant to carry everyone's light.",
      "I was meant to help them remember they had one."
    ]
  },
  {
    id: 16,
    title: "TOGETHER",
    sceneCounter: "16 / 18",
    image: "/story/16 pc.webp",
    emotionalState: "UNITY",
    safeZone: "pos-bottom-left",
    beats: [
      { text: "People reached out for each other, and Asterra bloomed.", type: "narrative" }
    ],
    sproutDialogue: "We're doing this together."
  },
  {
    id: 17,
    title: "FAREWELL BEGINS",
    sceneCounter: "17 / 18",
    image: "/story/17 pc.webp",
    emotionalState: "FAREWELL",
    safeZone: "pos-top-right",
    beats: [
      { text: "Asterra was alive again — growing.", type: "narrative" },
      { text: "Heroes don't stand above us. They help us stand together.", type: "narrative" }
    ],
    visitorDialogue: "So… you're leaving?",
    sproutDialogue: "For now. Whenever you need a little light, I'll be right here.",
    interaction: {
      type: "EMAIL",
      title: "YOUR LIGHT ADDRESS",
      subtitle: "A way for Sprout's light to find you again.",
      placeholder: "Your email",
      buttonText: "Send my light",
      validationError: "That light address doesn't seem quite ready yet.",
      storeKey: "visitorEmail",
      postSubmitSprout: "Got it. I'll know where to send a little light your way."
    }
  },
  {
    id: 18,
    title: "DEPARTURE",
    sceneCounter: "18 / 18",
    image: "/story/18 pc.webp",
    emotionalState: "HOPE",
    safeZone: "pos-top-left",
    visitorDialogue: "Good bye, Sprout. I will remember this light.",
    beats: []
  }
];
