// =============================================================================
// SPROUT — VELORA STORY REGISTRY (12 Concise & Conversational Chapters)
// =============================================================================

export const STORY_SCENES = [
  {
    id: 1,
    title: "THE WORLD WE KNEW",
    heading: "A World Full of Life",
    sceneCounter: "01 / 12",
    image: "/story/c_1.webp",
    blur: "/story/1-blur.webp",
    emotionalState: "WONDER",
    beats: [
      { text: "Velora was once a world of warmth, kindness, and togetherness.", type: "narrative" },
      { text: "People lived freely under the great canopy, sharing laughter and simple joys.", type: "narrative" }
    ]
  },
  {
    id: 2,
    title: "THE SHADOW WE FACE",
    heading: "When Hope Began to Fade",
    sceneCounter: "02 / 12",
    image: "/story/c_2.webp",
    blur: "/story/2-blur.webp",
    emotionalState: "UNEASE",
    beats: [
      { text: "Then Astra arrived.", type: "narrative" },
      { text: "What began as quiet protection slowly turned into cold control, dimming the spirit of Velora.", type: "narrative" }
    ]
  },
  {
    id: 3,
    title: "THE WORLD WE LOST",
    heading: "Losing Our Humanity",
    sceneCounter: "03 / 12",
    image: "/story/c_3.webp",
    blur: "/story/3-blur.webp",
    emotionalState: "MYSTERY",
    beats: [
      { text: "Fear replaced joy. Communities became isolated.", type: "narrative" },
      { text: "Step by step, the people began losing the very memories that made them human.", type: "emphasis" }
    ]
  },
  {
    id: 4,
    title: "THE FIRST SPARK",
    heading: "A Guardian Awakens",
    sceneCounter: "04 / 12",
    image: "/story/c_4.webp",
    blur: "/story/4-blur.webp",
    emotionalState: "AWAKENING",
    beats: [
      { text: "In the heart of the ancient forest, a tiny golden seed opened.", type: "narrative" },
      { text: "Sprout stepped into the world — a guardian of empathy, carrying the lantern of living hope.", type: "narrative" }
    ]
  },
  {
    id: 5,
    title: "THE AWAKENING JOURNEY",
    heading: "Into the Quiet Land",
    sceneCounter: "05 / 12",
    image: "/story/c_5.webp",
    blur: "/story/5-blur.webp",
    emotionalState: "DISCOVERY",
    beats: [
      { text: "Guided by the whisper of the trees, Sprout walked through misty ruins.", type: "narrative" },
      { text: "She searched for the forgotten souls who had lost their voice to the machine.", type: "narrative" }
    ]
  },
  {
    id: 6,
    title: "A MOMENT OF CONNECTION",
    heading: "A Voice in the Shadows",
    sceneCounter: "06 / 12",
    image: "/story/c_6.webp",
    blur: "/story/6-blur.webp",
    emotionalState: "CONNECTION",
    beats: [
      { text: "Among the cold stone ruins sat a weary figure — half-human, half-machine.", type: "narrative" },
      { text: "“Hello, friend. What did your loved ones call you before the darkness?”", type: "sprout", speaker: "Sprout" },
      { text: "“They gave me a number... but deep inside, I feel a memory stirring.”", type: "visitor", speaker: "Robot-Man" }
    ]
  },
  {
    id: 7,
    title: "THE POWER OF UNDERSTANDING",
    heading: "Remembering Who We Are",
    sceneCounter: "07 / 12",
    image: "/story/c_7.webp",
    blur: "/story/7-blur.webp",
    emotionalState: "INTIMACY",
    beats: [
      { 
        text: "[Sprout approaches Robo-Man, who is sitting quietly, looking sorrowful.]", 
        type: "scene-direction" 
      },
      { 
        text: "“Hey there... You look so grieved. Is something wrong?”", 
        speaker: "Sprout", 
        type: "dialogue" 
      },
      { 
        text: "[Robo-Man remains silent.]", 
        type: "scene-direction" 
      },
      { 
        text: "“Hey... what's your name?”", 
        speaker: "Sprout", 
        type: "dialogue" 
      },
      { 
        text: "“DI455.”", 
        speaker: "Robo-Man", 
        type: "dialogue" 
      },
      { 
        text: "“That can't be your name. I want to know your real name, not the one Astra calls you. You’re a human, and humans have names—not codes like these, or so I’ve heard.”", 
        speaker: "Sprout", 
        type: "dialogue" 
      },
      { 
        text: "“...”", 
        speaker: "Robo-Man", 
        type: "dialogue" 
      },
      { 
        text: "[After a moment of silence, Robo-Man begins to remember.]", 
        type: "scene-direction" 
      },
      { 
        type: "interactive-name",
        speaker: "Robo-Man"
      },
      { 
        type: "interactive-location",
        speaker: "Robo-Man"
      },
      { 
        type: "interactive-email",
        speaker: "Robo-Man"
      },
      { 
        text: "“How long have you been on this planet? Has it always been like this for all these years?”", 
        speaker: "Sprout", 
        type: "dialogue" 
      },
      { 
        type: "interactive-age",
        speaker: "Robo-Man"
      }
    ]
  },
  {
    id: 8,
    title: "THE WORLD UNDER ASTRA",
    heading: "Breaking the Silence",
    sceneCounter: "08 / 12",
    image: "/story/c_8.webp",
    blur: "/story/8-blur.webp",
    emotionalState: "DANGER",
    beats: [
      { text: "Astra's towers rose high, commanding obedience through fear.", type: "narrative" },
      { text: "Yet beneath the metal shells, human hearts began to beat once more.", type: "narrative" }
    ]
  },
  {
    id: 9,
    title: "THE LIVING EMBERS",
    heading: "Kindness Awakens",
    sceneCounter: "09 / 12",
    image: "/story/c_9.webp",
    blur: "/story/9-blur.webp",
    emotionalState: "EMPOWERMENT",
    beats: [
      { text: "Sprout did not bring weapons; she brought empathy, freedom, and understanding.", type: "narrative" },
      { text: "A single spark of kindness ignited a forest of courage across Velora.", type: "narrative" }
    ]
  },
  {
    id: 10,
    title: "THE HEARTLIGHT RETURNS",
    heading: "Reclaiming the Light",
    sceneCounter: "10 / 12",
    image: "/story/c_10.webp",
    blur: "/story/10-blur.webp",
    emotionalState: "PROTECTION",
    beats: [
      { text: "One by one, the people shed their fears.", type: "narrative" },
      { text: "Cold metal turned back to warm flesh and shared laughter.", type: "narrative" }
    ]
  },
  {
    id: 11,
    title: "TOGETHER WE STAND",
    heading: "Unity Creates Change",
    sceneCounter: "11 / 12",
    image: "/story/c_11.webp",
    blur: "/story/11-blur.webp",
    emotionalState: "UNITY",
    beats: [
      { text: "Thousands stood together, hand in hand across the valleys.", type: "narrative" },
      { text: "No shadow could divide a people united by love and hope.", type: "emphasis" }
    ]
  },
  {
    id: 12,
    title: "A BRIGHTER TOMORROW",
    heading: "Velora Blooms Again",
    sceneCounter: "12 / 12",
    image: "/story/c_12.webp",
    blur: "/story/12-blur.webp",
    emotionalState: "HOPE",
    beats: [
      { text: "Sunlight broke through the ancient canopy. The rivers sparkled with renewed life.", type: "narrative" },
      { text: "Velora had healed — not into what it was, but into something far kinder and stronger.", type: "highlight" },
      { 
        text: "“Not all superheroes come with physical strength. They build hope, unite hearts, and heal the world through kindness, empathy, and listening hearts.”", 
        type: "hero-quote" 
      }
    ]
  }
];
