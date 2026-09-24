// Web Audio API Polyphonic Synthesizer for Chords, Scales, and Interactive Keys

class MusicSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private activeTimeouts: number[] = [];

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Convert note name and octave to frequency (A4 = 440 Hz)
  public noteToFreq(note: string, octave: number = 4): number {
    const noteMap: Record<string, number> = {
      C: 0,
      'C#': 1,
      Db: 1,
      D: 2,
      'D#': 3,
      Eb: 3,
      E: 4,
      F: 5,
      'F#': 6,
      Gb: 6,
      G: 7,
      'G#': 8,
      Ab: 8,
      A: 9,
      'A#': 10,
      Bb: 10,
      B: 11,
    };

    const cleanNote = note.trim();
    const semitone = noteMap[cleanNote] ?? 0;
    // MIDI number for C0 is 12. A4 is 69.
    const midiNumber = (octave + 1) * 12 + semitone;
    return 440 * Math.pow(2, (midiNumber - 69) / 12);
  }

  // Play a single synthesized note with warm piano/rhodes acoustic modeling
  public playNote(
    freq: number,
    duration: number = 0.8,
    delaySec: number = 0,
    volume: number = 0.3
  ) {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime + delaySec;

      // Master gain for this note
      const noteGain = ctx.createGain();
      noteGain.gain.setValueAtTime(0, now);
      // Quick attack to avoid clicks
      noteGain.gain.linearRampToValueAtTime(volume, now + 0.015);
      // Natural exponential decay
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      // Warm low-pass filter for acoustic richness
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(Math.min(freq * 5, 6000), now);
      filter.frequency.exponentialRampToValueAtTime(Math.min(freq * 2, 2000), now + duration);

      // Fundamental oscillator (triangle for body)
      const osc1 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);

      // Harmonic oscillator (sine for tone chime)
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, now);

      const osc2Gain = ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.3, now);
      osc2Gain.gain.exponentialRampToValueAtTime(0.01, now + duration * 0.6);

      // Subtle detuned overtone for acoustic width
      const osc3 = ctx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(freq * 3 + 0.5, now);
      const osc3Gain = ctx.createGain();
      osc3Gain.gain.setValueAtTime(0.12, now);

      // Connect graph
      osc1.connect(filter);
      osc2.connect(osc2Gain);
      osc2Gain.connect(filter);
      osc3.connect(osc3Gain);
      osc3Gain.connect(filter);

      filter.connect(noteGain);
      noteGain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      osc1.stop(now + duration);
      osc2.stop(now + duration);
      osc3.stop(now + duration);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  // Play chord: strum mode or simultaneous block
  public playChord(
    notes: string[],
    baseOctave: number = 4,
    strum: boolean = true
  ) {
    this.stopAll();
    const strumDelay = strum ? 0.055 : 0; // slight guitar-like or harp roll
    let currentOctave = baseOctave;
    let prevSemitone = -1;

    const noteIndices: Record<string, number> = {
      C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6,
      G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11
    };

    notes.forEach((note, index) => {
      const semitone = noteIndices[note] ?? 0;
      if (semitone <= prevSemitone) {
        currentOctave += 1;
      }
      prevSemitone = semitone;

      const freq = this.noteToFreq(note, currentOctave);
      const delay = index * strumDelay;
      this.playNote(freq, 1.6, delay, 0.25 / Math.sqrt(notes.length || 1));
    });
  }

  // Play scale arpeggio up and optionally down
  public playScaleArpeggio(
    notes: string[],
    baseOctave: number = 4,
    bpm: number = 140,
    onNotePlay?: (note: string, index: number) => void
  ) {
    this.stopAll();
    const beatSec = 60 / bpm;
    let currentOctave = baseOctave;
    let prevSemitone = -1;

    const noteIndices: Record<string, number> = {
      C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6,
      G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11
    };

    // Include the root octave at the top
    const arpeggioNotes = [...notes, notes[0]];

    arpeggioNotes.forEach((note, index) => {
      const semitone = noteIndices[note] ?? 0;
      if (index > 0 && semitone <= prevSemitone) {
        currentOctave += 1;
      }
      prevSemitone = semitone;

      const freq = this.noteToFreq(note, currentOctave);
      const delay = index * beatSec;

      this.playNote(freq, beatSec * 1.5, delay, 0.28);

      if (onNotePlay) {
        const timeoutId = window.setTimeout(() => {
          onNotePlay(note, index);
        }, delay * 1000);
        this.activeTimeouts.push(timeoutId);
      }
    });
  }

  public stopAll() {
    this.activeTimeouts.forEach((id) => clearTimeout(id));
    this.activeTimeouts = [];
  }
}

export const synth = new MusicSynthesizer();
