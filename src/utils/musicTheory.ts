// Core Music Theory Definitions & Computational Engine

export type NoteName =
  | 'C'
  | 'C#'
  | 'Db'
  | 'D'
  | 'D#'
  | 'Eb'
  | 'E'
  | 'F'
  | 'F#'
  | 'Gb'
  | 'G'
  | 'G#'
  | 'Ab'
  | 'A'
  | 'A#'
  | 'Bb'
  | 'B';

export const CHROMATIC_SHARP: NoteName[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

export const CHROMATIC_FLAT: NoteName[] = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
];

// Map note name to pitch class index (0-11)
export const NOTE_TO_INDEX: Record<string, number> = {
  C: 0,
  'B#': 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  Fb: 4,
  F: 5,
  'E#': 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
  Cb: 11,
};

export interface IntervalInfo {
  semitones: number;
  degreeName: string;
  shortName: string;
  intervalName: string;
}

export const INTERVAL_MAP: Record<number, { shortName: string; name: string }> = {
  0: { shortName: '1', name: 'Root (P1)' },
  1: { shortName: 'b2', name: 'Minor 2nd (m2)' },
  2: { shortName: '2', name: 'Major 2nd (M2)' },
  3: { shortName: 'b3', name: 'Minor 3rd (m3)' },
  4: { shortName: '3', name: 'Major 3rd (M3)' },
  5: { shortName: '4', name: 'Perfect 4th (P4)' },
  6: { shortName: 'b5/#4', name: 'Tritone (d5/A4)' },
  7: { shortName: '5', name: 'Perfect 5th (P5)' },
  8: { shortName: 'b6', name: 'Minor 6th (m6)' },
  9: { shortName: '6', name: 'Major 6th (M6)' },
  10: { shortName: 'b7', name: 'Minor 7th (m7)' },
  11: { shortName: '7', name: 'Major 7th (M7)' },
  12: { shortName: '8', name: 'Octave (P8)' },
  13: { shortName: 'b9', name: 'Flat 9th (m9)' },
  14: { shortName: '9', name: 'Major 9th (M9)' },
  15: { shortName: '#9', name: 'Sharp 9th (A9)' },
  17: { shortName: '11', name: 'Perfect 11th (P11)' },
  18: { shortName: '#11', name: 'Sharp 11th (A11)' },
  20: { shortName: 'b13', name: 'Flat 13th (m13)' },
  21: { shortName: '13', name: 'Major 13th (M13)' },
};

export interface ScaleDefinition {
  id: string;
  name: string;
  category: 'Major Modes' | 'Minor & Melodic' | 'Pentatonic & Blues' | 'Jazz & Bebop' | 'Symmetrical & Exotic';
  semitones: number[]; // e.g., [0, 2, 4, 5, 7, 9, 11]
  degrees: string[];
  description: string;
  mood: string;
}

export const SCALE_DATABASE: ScaleDefinition[] = [
  // Major Modes
  {
    id: 'major',
    name: 'Major (Ionian)',
    category: 'Major Modes',
    semitones: [0, 2, 4, 5, 7, 9, 11],
    degrees: ['1', '2', '3', '4', '5', '6', '7'],
    description: 'The foundation of Western diatonic harmony. Bright, resolute, and stable.',
    mood: 'Triumphant, joyful, balanced',
  },
  {
    id: 'dorian',
    name: 'Dorian Mode',
    category: 'Major Modes',
    semitones: [0, 2, 3, 5, 7, 9, 10],
    degrees: ['1', '2', 'b3', '4', '5', '6', 'b7'],
    description: 'Minor scale with a bright natural 6th. Popular in jazz, funk, Celtic, and modal rock.',
    mood: 'Soulful, contemplative, sophisticated',
  },
  {
    id: 'phrygian',
    name: 'Phrygian Mode',
    category: 'Major Modes',
    semitones: [0, 1, 3, 5, 7, 8, 10],
    degrees: ['1', 'b2', 'b3', '4', '5', 'b6', 'b7'],
    description: 'Dark minor scale with an exotic minor 2nd. Signature flamenco, metal, and Middle Eastern flavor.',
    mood: 'Exotic, tense, mysterious',
  },
  {
    id: 'lydian',
    name: 'Lydian Mode',
    category: 'Major Modes',
    semitones: [0, 2, 4, 6, 7, 9, 11],
    degrees: ['1', '2', '3', '#4', '5', '6', '7'],
    description: 'Major scale featuring a raised 4th (#4). Quintessential film score, cosmic and ethereal sound.',
    mood: 'Dreamlike, luminous, celestial',
  },
  {
    id: 'mixolydian',
    name: 'Mixolydian Mode',
    category: 'Major Modes',
    semitones: [0, 2, 4, 5, 7, 9, 10],
    degrees: ['1', '2', '3', '4', '5', '6', 'b7'],
    description: 'Major scale with a flat 7th. The quintessential blues, classic rock, and funk dominant mode.',
    mood: 'Uplifting, groovy, relaxed dominant',
  },
  {
    id: 'minor',
    name: 'Natural Minor (Aeolian)',
    category: 'Major Modes',
    semitones: [0, 2, 3, 5, 7, 8, 10],
    degrees: ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
    description: 'The standard minor scale. Melancholic, dramatic, and emotionally evocative.',
    mood: 'Somber, melancholic, reflective',
  },
  {
    id: 'locrian',
    name: 'Locrian Mode',
    category: 'Major Modes',
    semitones: [0, 1, 3, 5, 6, 8, 10],
    degrees: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'],
    description: 'Dissonant mode built on diminished triad with a flat 5th. Highly unstable.',
    mood: 'Unsettling, tense, unresolved',
  },

  // Minor & Melodic
  {
    id: 'harmonic-minor',
    name: 'Harmonic Minor',
    category: 'Minor & Melodic',
    semitones: [0, 2, 3, 5, 7, 8, 11],
    degrees: ['1', '2', 'b3', '4', '5', 'b6', '7'],
    description: 'Minor scale with a raised 7th, creating an augmented second interval between b6 and 7.',
    mood: 'Neoclassical, passionate, dramatic',
  },
  {
    id: 'melodic-minor',
    name: 'Melodic Minor (Jazz Minor)',
    category: 'Minor & Melodic',
    semitones: [0, 2, 3, 5, 7, 9, 11],
    degrees: ['1', '2', 'b3', '4', '5', '6', '7'],
    description: 'Minor scale with natural 6th and 7th. Generates prominent modern jazz modes.',
    mood: 'Sleek, enigmatic, modern',
  },
  {
    id: 'phrygian-dominant',
    name: 'Phrygian Dominant (Spanish Gypsy)',
    category: 'Minor & Melodic',
    semitones: [0, 1, 4, 5, 7, 8, 10],
    degrees: ['1', 'b2', '3', '4', '5', 'b6', 'b7'],
    description: '5th mode of Harmonic Minor. Famous in flamenco, progressive metal, and klezmer music.',
    mood: 'Passionate, Spanish, Middle-Eastern fire',
  },
  {
    id: 'lydian-dominant',
    name: 'Lydian Dominant (Mixolydian #4)',
    category: 'Minor & Melodic',
    semitones: [0, 2, 4, 6, 7, 9, 10],
    degrees: ['1', '2', '3', '#4', '5', '6', 'b7'],
    description: '4th mode of Melodic Minor. The ultimate scale for dominant 7th chords with sharp 11 extensions.',
    mood: 'Playful, modern jazz, futuristic',
  },
  {
    id: 'altered',
    name: 'Altered Scale (Super Locrian)',
    category: 'Minor & Melodic',
    semitones: [0, 1, 3, 4, 6, 8, 10],
    degrees: ['1', 'b9', '#9', '3', 'b5', '#5', 'b7'],
    description: '7th mode of Melodic Minor. Every non-root note is an alteration: b9, #9, b5, #5.',
    mood: 'Maximum tension, modern jazz dominant',
  },

  // Pentatonic & Blues
  {
    id: 'minor-pentatonic',
    name: 'Minor Pentatonic',
    category: 'Pentatonic & Blues',
    semitones: [0, 3, 5, 7, 10],
    degrees: ['1', 'b3', '4', '5', 'b7'],
    description: '5-note scale that is the backbone of rock, blues, R&B, and pop soloing.',
    mood: 'Raw, soulful, universally resonant',
  },
  {
    id: 'major-pentatonic',
    name: 'Major Pentatonic',
    category: 'Pentatonic & Blues',
    semitones: [0, 2, 4, 7, 9],
    degrees: ['1', '2', '3', '5', '6'],
    description: 'Smooth 5-note scale without dissonant half steps. Country, folk, and soul staple.',
    mood: 'Bright, sweet, pastoral, uplifting',
  },
  {
    id: 'blues',
    name: 'Blues Scale',
    category: 'Pentatonic & Blues',
    semitones: [0, 3, 5, 6, 7, 10],
    degrees: ['1', 'b3', '4', 'b5', '5', 'b7'],
    description: 'Minor pentatonic plus the tritone "blue note" (b5), delivering grit and groove.',
    mood: 'Gritty, expressive, deeply emotive',
  },
  {
    id: 'major-blues',
    name: 'Major Blues Scale',
    category: 'Pentatonic & Blues',
    semitones: [0, 2, 3, 4, 7, 9],
    degrees: ['1', '2', 'b3', '3', '5', '6'],
    description: 'Major pentatonic with passing minor 3rd. Essential for BB King, gospel, and country blues.',
    mood: 'Jubilant, twangy, soulful',
  },

  // Jazz & Bebop
  {
    id: 'bebop-dominant',
    name: 'Bebop Dominant',
    category: 'Jazz & Bebop',
    semitones: [0, 2, 4, 5, 7, 9, 10, 11],
    degrees: ['1', '2', '3', '4', '5', '6', 'b7', '7'],
    description: 'Mixolydian with added chromatic natural 7th. Keeps chord tones on downbeats in 8th-note runs.',
    mood: 'Swinging, kinetic, Charlie Parker jazz',
  },
  {
    id: 'bebop-major',
    name: 'Bebop Major',
    category: 'Jazz & Bebop',
    semitones: [0, 2, 4, 5, 7, 8, 9, 11],
    degrees: ['1', '2', '3', '4', '5', 'b6', '6', '7'],
    description: 'Major scale with an added passing flat 6th for smooth downbeat alignment.',
    mood: 'Fluid, elegant, bebop fluidity',
  },

  // Symmetrical & Exotic
  {
    id: 'whole-tone',
    name: 'Whole Tone Scale',
    category: 'Symmetrical & Exotic',
    semitones: [0, 2, 4, 6, 8, 10],
    degrees: ['1', '2', '3', '#4', '#5', 'b7'],
    description: 'Hexatonic scale made entirely of whole steps. Debussy, impressionism, dream sequences.',
    mood: 'Floating, weightless, surreal',
  },
  {
    id: 'diminished-wh',
    name: 'Diminished (Whole-Half)',
    category: 'Symmetrical & Exotic',
    semitones: [0, 2, 3, 5, 6, 8, 9, 11],
    degrees: ['1', '2', 'b3', '4', 'b5', 'b6', '6', '7'],
    description: 'Octatonic symmetrical scale alternating whole and half steps. Diminished chord mastery.',
    mood: 'Intricate, tense, symmetrical mystery',
  },
  {
    id: 'hirajoshi',
    name: 'Japanese Hirajoshi',
    category: 'Symmetrical & Exotic',
    semitones: [0, 2, 3, 7, 8],
    degrees: ['1', '2', 'b3', '5', 'b6'],
    description: 'Traditional Japanese pentatonic tuning for Koto and Shamisen.',
    mood: 'Meditative, poignant, ancient',
  },
  {
    id: 'double-harmonic',
    name: 'Double Harmonic (Byzantine / Arabic)',
    category: 'Symmetrical & Exotic',
    semitones: [0, 1, 4, 5, 7, 8, 11],
    degrees: ['1', 'b2', '3', '4', '5', 'b6', '7'],
    description: 'Scale featuring two augmented seconds. Found in Middle Eastern and Mediterranean traditions.',
    mood: 'Mesmerizing, mystical, exotic',
  },
];

export interface ChordDefinition {
  id: string;
  name: string;
  suffix: string;
  category: 'Triads' | '7th Chords' | 'Extended Chords' | 'Altered & Sus';
  semitones: number[]; // e.g., [0, 4, 7]
  intervals: string[];
  formula: string;
  description: string;
}

export const CHORD_DATABASE: ChordDefinition[] = [
  // Triads
  {
    id: 'major-triad',
    name: 'Major Triad',
    suffix: '',
    category: 'Triads',
    semitones: [0, 4, 7],
    intervals: ['1', '3', '5'],
    formula: '1 - 3 - 5',
    description: 'Bright, stable, primary building block of Western tonality.',
  },
  {
    id: 'minor-triad',
    name: 'Minor Triad',
    suffix: 'm',
    category: 'Triads',
    semitones: [0, 3, 7],
    intervals: ['1', 'b3', '5'],
    formula: '1 - b3 - 5',
    description: 'Dark, introspective, fundamental minor sonority.',
  },
  {
    id: 'diminished-triad',
    name: 'Diminished Triad',
    suffix: 'dim',
    category: 'Triads',
    semitones: [0, 3, 6],
    intervals: ['1', 'b3', 'b5'],
    formula: '1 - b3 - b5',
    description: 'Two stacked minor thirds. High tension, seeks resolution.',
  },
  {
    id: 'augmented-triad',
    name: 'Augmented Triad',
    suffix: 'aug',
    category: 'Triads',
    semitones: [0, 4, 8],
    intervals: ['1', '3', '#5'],
    formula: '1 - 3 - #5',
    description: 'Two stacked major thirds. Floating, unresolved, dreamlike.',
  },

  // 7th Chords
  {
    id: 'maj7',
    name: 'Major 7th',
    suffix: 'maj7',
    category: '7th Chords',
    semitones: [0, 4, 7, 11],
    intervals: ['1', '3', '5', '7'],
    formula: '1 - 3 - 5 - 7',
    description: 'Lush, warm, elegant. Hallmarked in jazz, bossa nova, and neo-soul.',
  },
  {
    id: 'dom7',
    name: 'Dominant 7th',
    suffix: '7',
    category: '7th Chords',
    semitones: [0, 4, 7, 10],
    intervals: ['1', '3', '5', 'b7'],
    formula: '1 - 3 - 5 - b7',
    description: 'The engine of functional harmony. Tritone between 3rd and b7 drives resolution to the tonic.',
  },
  {
    id: 'm7',
    name: 'Minor 7th',
    suffix: 'm7',
    category: '7th Chords',
    semitones: [0, 3, 7, 10],
    intervals: ['1', 'b3', '5', 'b7'],
    formula: '1 - b3 - 5 - b7',
    description: 'Smooth, relaxed, quintessential ii-chord in ii-V-I progressions.',
  },
  {
    id: 'm7b5',
    name: 'Half-Diminished 7th (m7b5)',
    suffix: 'm7b5',
    category: '7th Chords',
    semitones: [0, 3, 6, 10],
    intervals: ['1', 'b3', 'b5', 'b7'],
    formula: '1 - b3 - b5 - b7',
    description: 'The ii-chord in minor key ii-V-i progressions. Melancholic and mysterious.',
  },
  {
    id: 'dim7',
    name: 'Fully Diminished 7th',
    suffix: 'dim7',
    category: '7th Chords',
    semitones: [0, 3, 6, 9],
    intervals: ['1', 'b3', 'b5', 'bb7'],
    formula: '1 - b3 - b5 - bb7',
    description: 'Symmetrical stack of minor 3rds. Pivots to 4 different tonics for modulation.',
  },
  {
    id: 'mmaj7',
    name: 'Minor-Major 7th',
    suffix: 'm(maj7)',
    category: '7th Chords',
    semitones: [0, 3, 7, 11],
    intervals: ['1', 'b3', '5', '7'],
    formula: '1 - b3 - 5 - 7',
    description: 'James Bond spy chord. Dark minor third with biting major 7th tension.',
  },

  // Extended Chords
  {
    id: 'maj9',
    name: 'Major 9th',
    suffix: 'maj9',
    category: 'Extended Chords',
    semitones: [0, 4, 7, 11, 14],
    intervals: ['1', '3', '5', '7', '9'],
    formula: '1 - 3 - 5 - 7 - 9',
    description: 'Glistening, open, sophisticated chord favored in modern R&B, jazz, and ambient.',
  },
  {
    id: 'dom9',
    name: 'Dominant 9th',
    suffix: '9',
    category: 'Extended Chords',
    semitones: [0, 4, 7, 10, 14],
    intervals: ['1', '3', '5', 'b7', '9'],
    formula: '1 - 3 - 5 - b7 - 9',
    description: 'Funk and blues staple. Rich dominant sound with added color.',
  },
  {
    id: 'm9',
    name: 'Minor 9th',
    suffix: 'm9',
    category: 'Extended Chords',
    semitones: [0, 3, 7, 10, 14],
    intervals: ['1', 'b3', '5', 'b7', '9'],
    formula: '1 - b3 - 5 - b7 - 9',
    description: 'Deep, atmospheric, emotionally complex minor harmony.',
  },
  {
    id: 'maj13',
    name: 'Major 13th',
    suffix: 'maj13',
    category: 'Extended Chords',
    semitones: [0, 4, 7, 11, 14, 21],
    intervals: ['1', '3', '5', '7', '9', '13'],
    formula: '1 - 3 - 5 - 7 - 9 - (11) - 13',
    description: 'The pinnacle of lush orchestral jazz harmony with full upper extensions.',
  },
  {
    id: 'hendrix',
    name: 'Hendrix Chord (7#9)',
    suffix: '7#9',
    category: 'Extended Chords',
    semitones: [0, 4, 7, 10, 15],
    intervals: ['1', '3', '5', 'b7', '#9'],
    formula: '1 - 3 - 5 - b7 - #9',
    description: 'Iconic Purple Haze sonority combining major 3rd and minor 3rd (as #9). Aggressive and bluesy.',
  },

  // Altered & Sus
  {
    id: 'sus4',
    name: 'Suspended 4th (sus4)',
    suffix: 'sus4',
    category: 'Altered & Sus',
    semitones: [0, 5, 7],
    intervals: ['1', '4', '5'],
    formula: '1 - 4 - 5',
    description: 'Replaces 3rd with 4th, creating an open tension that yearns to resolve to 3.',
  },
  {
    id: 'sus2',
    name: 'Suspended 2nd (sus2)',
    suffix: 'sus2',
    category: 'Altered & Sus',
    semitones: [0, 2, 7],
    intervals: ['1', '2', '5'],
    formula: '1 - 2 - 5',
    description: 'Open, airy, modern folk and pop staple.',
  },
  {
    id: '7b9',
    name: 'Dominant 7(b9)',
    suffix: '7b9',
    category: 'Altered & Sus',
    semitones: [0, 4, 7, 10, 13],
    intervals: ['1', '3', '5', 'b7', 'b9'],
    formula: '1 - 3 - 5 - b7 - b9',
    description: 'Standard altered dominant resolving to a minor tonic. Contains diminished 7th upper structure.',
  },
  {
    id: '7sharp11',
    name: 'Dominant 7(#11) (Lydian Dominant Chord)',
    suffix: '7#11',
    category: 'Altered & Sus',
    semitones: [0, 4, 7, 10, 18],
    intervals: ['1', '3', '5', 'b7', '#11'],
    formula: '1 - 3 - 5 - b7 - #11',
    description: 'Modern jazz dominant with raised 11th, evocative of The Simpsons theme and tritone subs.',
  },
  {
    id: 'add9',
    name: 'Add 9 (Major Add9)',
    suffix: 'add9',
    category: 'Altered & Sus',
    semitones: [0, 4, 7, 14],
    intervals: ['1', '3', '5', '9'],
    formula: '1 - 3 - 5 - 9',
    description: 'Triad with added 9th without the 7th. Bright, crystalline, acoustic guitar favorite.',
  },
];

// Helper: Calculate concrete note names given root note and semitone intervals
export function getNotesForIntervals(root: NoteName, semitones: number[]): { note: NoteName; semitone: number; intervalName: string; degree: string }[] {
  const rootIndex = NOTE_TO_INDEX[root] ?? 0;
  const isFlatKey = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Dm', 'Gm', 'Cm', 'Fm', 'Bbm'].includes(root);
  const chromatic = isFlatKey ? CHROMATIC_FLAT : CHROMATIC_SHARP;

  return semitones.map((st, i) => {
    const pitchIndex = (rootIndex + st) % 12;
    const note = chromatic[pitchIndex];
    const mapping = INTERVAL_MAP[st] || { shortName: `+${st}`, name: `${st} st` };
    return {
      note,
      semitone: st,
      intervalName: mapping.name,
      degree: mapping.shortName,
    };
  });
}

// Circle of Fifths data
export interface CircleKey {
  key: NoteName;
  relativeMinor: string;
  accidentals: number; // positive = sharps, negative = flats
  accidentalLabel: string;
  order: number; // 0 to 11 starting at C at 12 o'clock
}

export const CIRCLE_OF_FIFTHS: CircleKey[] = [
  { key: 'C', relativeMinor: 'Am', accidentals: 0, accidentalLabel: 'Natural', order: 0 },
  { key: 'G', relativeMinor: 'Em', accidentals: 1, accidentalLabel: '1 #', order: 1 },
  { key: 'D', relativeMinor: 'Bm', accidentals: 2, accidentalLabel: '2 #', order: 2 },
  { key: 'A', relativeMinor: 'F#m', accidentals: 3, accidentalLabel: '3 #', order: 3 },
  { key: 'E', relativeMinor: 'C#m', accidentals: 4, accidentalLabel: '4 #', order: 4 },
  { key: 'B', relativeMinor: 'G#m', accidentals: 5, accidentalLabel: '5 #', order: 5 },
  { key: 'F#', relativeMinor: 'D#m', accidentals: 6, accidentalLabel: '6 # / 6 b', order: 6 },
  { key: 'Db', relativeMinor: 'Bbm', accidentals: -5, accidentalLabel: '5 b', order: 7 },
  { key: 'Ab', relativeMinor: 'Fm', accidentals: -4, accidentalLabel: '4 b', order: 8 },
  { key: 'Eb', relativeMinor: 'Cm', accidentals: -3, accidentalLabel: '3 b', order: 9 },
  { key: 'Bb', relativeMinor: 'Gm', accidentals: -2, accidentalLabel: '2 b', order: 10 },
  { key: 'F', relativeMinor: 'Dm', accidentals: -1, accidentalLabel: '1 b', order: 11 },
];

// Instrument Tunings for Fretboard
export interface InstrumentTuning {
  id: string;
  name: string;
  strings: NoteName[]; // low to high
  baseOctaves: number[];
  frets: number;
}

export const INSTRUMENT_TUNINGS: InstrumentTuning[] = [
  {
    id: 'guitar-standard',
    name: 'Guitar (Standard E)',
    strings: ['E', 'A', 'D', 'G', 'B', 'E'],
    baseOctaves: [2, 2, 3, 3, 3, 4],
    frets: 16,
  },
  {
    id: 'guitar-drop-d',
    name: 'Guitar (Drop D)',
    strings: ['D', 'A', 'D', 'G', 'B', 'E'],
    baseOctaves: [2, 2, 3, 3, 3, 4],
    frets: 16,
  },
  {
    id: 'guitar-dadgad',
    name: 'Guitar (DADGAD)',
    strings: ['D', 'A', 'D', 'G', 'A', 'D'],
    baseOctaves: [2, 2, 3, 3, 3, 4],
    frets: 16,
  },
  {
    id: 'bass-4',
    name: 'Bass Guitar (4-String)',
    strings: ['E', 'A', 'D', 'G'],
    baseOctaves: [1, 1, 2, 2],
    frets: 16,
  },
  {
    id: 'ukulele-standard',
    name: 'Ukulele (GCEA)',
    strings: ['G', 'C', 'E', 'A'],
    baseOctaves: [4, 4, 4, 4],
    frets: 14,
  },
];
