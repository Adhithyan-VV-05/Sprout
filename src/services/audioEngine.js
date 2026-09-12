// SPROUT — CINEMATIC WEB AUDIO AMBIENT SOUNDTRACK & SFX ENGINE
// Generates rich polyphonic ambient pads, emotion-reactive chords, wind chimes & sound FX

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true; // Starts muted per browser autoplay policy
    this.masterGain = null;
    this.padGain = null;
    this.filterNode = null;
    this.oscillators = [];
    this.isInitialized = false;
    this.currentEmotion = null;
    this.chimeTimer = null;

    // Emotional Chord Mapping (Frequencies in Hz)
    this.emotionalChords = {
      WONDER: [146.83, 220.00, 277.18, 329.63],     // Dmaj9 - Magical & expansive
      UNEASE: [123.47, 146.83, 174.61, 220.00],     // Bm7b5 - Tense & shadowy
      MYSTERY: [110.00, 164.81, 196.00, 246.94],    // Am9 - Deep forest haze
      DISCOVERY: [164.81, 246.94, 311.13, 370.00],  // Emaj7 - Glowing crystal
      AWAKENING: [174.61, 261.63, 329.63, 392.00],  // Fmaj7 - Sunrise bloom
      CURIOSITY: [196.00, 293.66, 370.00, 440.00],  // Gmaj9 - Lighthearted inquiry
      CONNECTION: [220.00, 277.18, 329.63, 415.30], // Amaj7 - Warm friendship
      TRUST: [123.47, 185.00, 220.00, 277.18],      // Bm7 - Quiet shelter
      EMPOWERMENT: [130.81, 196.00, 246.94, 329.63],// Cmaj7 - Strong inner light
      PROTECTION: [146.83, 220.00, 277.18, 370.00], // Dmaj7 - Shield of compassion
      CLARITY: [164.81, 246.94, 311.13, 440.00],    // Emaj9 - Radiant wisdom
      INTIMACY: [110.00, 220.00, 246.94, 277.18],   // Aadd9 - Starlight conversation
      BELONGING: [98.00, 196.00, 220.00, 293.66],   // Gadd9 - Rooted home
      DANGER: [98.00, 116.54, 146.83, 155.56],      // Gm/Eb - The Wither shadow
      REALIZATION: [130.81, 196.00, 261.63, 293.66],// Cadd9 - Spark of hope
      UNITY: [146.83, 220.00, 293.66, 370.00],      // Dmaj7 - Standing together
      FAREWELL: [174.61, 220.00, 261.63, 293.66],   // Fadd9 - Bittersweet goodbye
      HOPE: [110.00, 220.00, 277.18, 329.63]        // A major - Eternal light
    };

    // Pentatonic scale notes for generative ambient wind chimes
    this.chimeNotes = [293.66, 369.99, 440.00, 554.37, 659.25, 739.99, 880.00];
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Output Node
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Low-pass Biquad Filter for warm analog pad sound
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(650, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(1.5, this.ctx.currentTime);

      // Pad Sub-Gain
      this.padGain = this.ctx.createGain();
      this.padGain.gain.setValueAtTime(0.07, this.ctx.currentTime);

      this.filterNode.connect(this.padGain);
      this.padGain.connect(this.masterGain);

      // Construct 4 Polyphonic Pad Oscillators with subtle detune for atmospheric depth
      const initialFreqs = this.emotionalChords.WONDER;
      this.oscillators = initialFreqs.map((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const detuneAmt = (idx % 2 === 0 ? 1 : -1) * (idx * 3 + 2);
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.detune.setValueAtTime(detuneAmt, this.ctx.currentTime);
        osc.connect(this.filterNode);
        osc.start();
        return osc;
      });

      this.isInitialized = true;
      this.scheduleGenerativeChimes();
    } catch (e) {
      console.warn("Web Audio API initialization failed:", e);
    }
  }

  toggleMute() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;

    if (this.masterGain) {
      const targetGain = this.isMuted ? 0 : 0.12;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.4);
    }

    if (!this.isMuted && this.currentEmotion) {
      this.setEmotion(this.currentEmotion);
    }

    return this.isMuted;
  }

  setEmotion(emotion) {
    if (!this.isInitialized || this.isMuted) {
      this.currentEmotion = emotion;
      return;
    }
    this.currentEmotion = emotion;

    const freqs = this.emotionalChords[emotion] || this.emotionalChords.WONDER;

    // Smoothly glide pad oscillators to new chord frequencies
    this.oscillators.forEach((osc, idx) => {
      if (freqs[idx]) {
        osc.frequency.setTargetAtTime(freqs[idx], this.ctx.currentTime, 1.2);
      }
    });

    // Dynamic Filter Cutoff Modulation based on scene emotion
    if (this.filterNode) {
      const filterFreqMap = {
        DANGER: 300,
        UNEASE: 400,
        MYSTERY: 500,
        WONDER: 850,
        DISCOVERY: 1100,
        AWAKENING: 950,
        CLARITY: 1300,
        EMPOWERMENT: 1000,
        UNITY: 1200
      };
      const cutoff = filterFreqMap[emotion] || 750;
      this.filterNode.frequency.setTargetAtTime(cutoff, this.ctx.currentTime, 1.5);
    }
  }

  // Generative wind chime sounds every 4 - 7 seconds
  scheduleGenerativeChimes() {
    if (this.chimeTimer) clearInterval(this.chimeTimer);
    this.chimeTimer = setInterval(() => {
      if (!this.isMuted && this.ctx && this.ctx.state === 'running') {
        const randomNote = this.chimeNotes[Math.floor(Math.random() * this.chimeNotes.length)];
        this.playSingleChimeNote(randomNote, 0.03);
      }
    }, Math.floor(Math.random() * 3000) + 4000);
  }

  playSingleChimeNote(freq, volume = 0.04) {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.8);

      if (panner) {
        panner.pan.setValueAtTime((Math.random() - 0.5) * 1.2, this.ctx.currentTime);
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(this.masterGain);
      } else {
        osc.connect(gain);
        gain.connect(this.masterGain);
      }

      osc.start();
      osc.stop(this.ctx.currentTime + 1.9);
    } catch (e) {}
  }

  // Interactive Sentence Advance Chime SFX
  playChime() {
    if (this.isMuted || !this.ctx) return;
    try {
      const root = 523.25; // C5
      const fifth = 783.99; // G5
      const octave = 1046.50; // C6

      // Play two harmonized arpeggiated tones
      this.playSingleChimeNote(root, 0.04);
      setTimeout(() => this.playSingleChimeNote(fifth, 0.03), 80);
      setTimeout(() => this.playSingleChimeNote(octave, 0.02), 160);
    } catch (e) {}
  }

  // Wither / Tension Rumble SFX
  playRumble() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(35, this.ctx.currentTime + 1.4);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.4);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 1.4);
    } catch (e) {}
  }
}

export const audioEngine = new AudioEngine();
