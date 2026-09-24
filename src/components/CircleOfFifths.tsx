import React from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { NoteName, CIRCLE_OF_FIFTHS, CircleKey } from '../utils/musicTheory.ts';
import { synth } from '../utils/audioSynth.ts';

interface CircleOfFifthsProps {
  currentRoot: NoteName;
  onSelectKey: (key: NoteName) => void;
}

export const CircleOfFifths: React.FC<CircleOfFifthsProps> = ({ currentRoot, onSelectKey }) => {
  // Find current key entry
  const selectedEntry =
    CIRCLE_OF_FIFTHS.find((item) => item.key === currentRoot) ||
    CIRCLE_OF_FIFTHS.find((item) => {
      // enharmonic match
      if (currentRoot === 'C#' && item.key === 'Db') return true;
      if (currentRoot === 'Db' && item.key === 'C#') return true;
      if (currentRoot === 'F#' && item.key === 'Gb') return true;
      if (currentRoot === 'Gb' && item.key === 'F#') return true;
      if (currentRoot === 'D#' && item.key === 'Eb') return true;
      if (currentRoot === 'Eb' && item.key === 'D#') return true;
      if (currentRoot === 'G#' && item.key === 'Ab') return true;
      if (currentRoot === 'Ab' && item.key === 'G#') return true;
      if (currentRoot === 'A#' && item.key === 'Bb') return true;
      if (currentRoot === 'Bb' && item.key === 'A#') return true;
      return false;
    }) ||
    CIRCLE_OF_FIFTHS[0];

  const handleKeyClick = (item: CircleKey) => {
    onSelectKey(item.key);
    synth.playChord([item.key, 'E', 'G'], 4, true);
  };

  // Diatonic Chords for the selected key
  // Diatonic chords in Major: I (Maj), ii (min), iii (min), IV (Maj), V (Dom/Maj), vi (min), vii° (dim)
  const getDiatonicChords = (order: number) => {
    const getAt = (offset: number) => {
      const idx = (order + offset + 12) % 12;
      return CIRCLE_OF_FIFTHS[idx];
    };

    const tonic = getAt(0); // I
    const dominant = getAt(1); // V
    const subdominant = getAt(-1); // IV
    const submediant = tonic.relativeMinor; // vi
    const supertonic = subdominant.relativeMinor; // ii
    const mediant = dominant.relativeMinor; // iii

    return [
      { degree: 'I', chord: tonic.key, role: 'Tonic (Home)', type: 'Major' },
      { degree: 'ii', chord: supertonic, role: 'Supertonic', type: 'Minor' },
      { degree: 'iii', chord: mediant, role: 'Mediant', type: 'Minor' },
      { degree: 'IV', chord: subdominant.key, role: 'Subdominant', type: 'Major' },
      { degree: 'V', chord: dominant.key, role: 'Dominant (Tension)', type: 'Major' },
      { degree: 'vi', chord: submediant, role: 'Relative Minor', type: 'Minor' },
      { degree: 'vii°', chord: `${dominant.key}#dim`, role: 'Leading Tone', type: 'Diminished' },
    ];
  };

  const diatonicChords = getDiatonicChords(selectedEntry.order);

  // Math for SVG positions
  const cx = 200;
  const cy = 200;
  const outerRadius = 145;
  const innerRadius = 95;

  return (
    <div id="circle-of-fifths-container" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-100 flex items-center gap-2">
              <span>Circle of Fifths &amp; Harmonic Wheel</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-indigo-400 border border-indigo-500/20">
                Key of {selectedEntry.key} ({selectedEntry.accidentalLabel})
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive wheel of key signatures, relative minors, and diatonic family chords
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Interactive SVG Circle (7 cols on lg) */}
        <div className="lg:col-span-7 flex justify-center items-center py-2">
          <div className="relative w-[340px] sm:w-[400px] h-[340px] sm:h-[400px]">
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full select-none filter drop-shadow-xl"
            >
              {/* Background rings */}
              <circle
                cx={cx}
                cy={cy}
                r={outerRadius + 32}
                className="fill-slate-950/70 stroke-slate-800"
                strokeWidth="1.5"
              />
              <circle
                cx={cx}
                cy={cy}
                r={outerRadius - 20}
                className="fill-slate-900/80 stroke-slate-800"
                strokeWidth="1"
              />
              <circle
                cx={cx}
                cy={cy}
                r={innerRadius - 20}
                className="fill-slate-950 stroke-slate-800/80"
                strokeWidth="1"
              />

              {/* Center decorative hub */}
              <circle
                cx={cx}
                cy={cy}
                r="40"
                className="fill-gradient-to-tr fill-slate-900 stroke-indigo-500/30"
                strokeWidth="2"
              />
              <text
                x={cx}
                y={cy - 6}
                textAnchor="middle"
                className="fill-indigo-400 text-[11px] font-bold tracking-widest uppercase"
              >
                Root
              </text>
              <text
                x={cx}
                y={cy + 14}
                textAnchor="middle"
                className="fill-amber-300 text-lg font-extrabold"
              >
                {selectedEntry.key}
              </text>

              {/* Wedge segments and key nodes */}
              {CIRCLE_OF_FIFTHS.map((item, idx) => {
                // angle in radians (C at 12 o'clock = -90 deg)
                const angleDeg = idx * 30 - 90;
                const angleRad = (angleDeg * Math.PI) / 180;

                // Outer coordinates (Major)
                const ox = cx + outerRadius * Math.cos(angleRad);
                const oy = cy + outerRadius * Math.sin(angleRad);

                // Inner coordinates (Minor)
                const ix = cx + innerRadius * Math.cos(angleRad);
                const iy = cy + innerRadius * Math.sin(angleRad);

                const isSelected = item.key === selectedEntry.key;
                const isNeighbor =
                  Math.abs(item.order - selectedEntry.order) === 1 ||
                  Math.abs(item.order - selectedEntry.order) === 11;

                return (
                  <g key={item.key} className="cursor-pointer group">
                    {/* Connecting line to center */}
                    <line
                      x1={cx}
                      y1={cy}
                      x2={ox}
                      y2={oy}
                      className={`stroke-slate-800/50 transition-colors ${
                        isSelected ? 'stroke-amber-400/40' : ''
                      }`}
                      strokeWidth="1"
                      strokeDasharray={isSelected ? 'none' : '2,3'}
                    />

                    {/* Outer Node (Major Key) */}
                    <circle
                      cx={ox}
                      cy={oy}
                      r={isSelected ? 22 : 18}
                      onClick={() => handleKeyClick(item)}
                      className={`transition-all duration-300 ${
                        isSelected
                          ? 'fill-amber-400 stroke-amber-200 stroke-2 filter drop-shadow-md'
                          : isNeighbor
                          ? 'fill-slate-800 hover:fill-indigo-900/70 stroke-indigo-400/60 stroke-1.5'
                          : 'fill-slate-900/90 hover:fill-slate-800 stroke-slate-700/80 stroke-1'
                      }`}
                    />
                    <text
                      x={ox}
                      y={oy + 4.5}
                      textAnchor="middle"
                      onClick={() => handleKeyClick(item)}
                      className={`text-xs font-bold pointer-events-none transition-colors ${
                        isSelected
                          ? 'fill-slate-950 font-extrabold text-[13px]'
                          : 'fill-slate-100 group-hover:fill-indigo-300'
                      }`}
                    >
                      {item.key}
                    </text>

                    {/* Inner Node (Relative Minor) */}
                    <circle
                      cx={ix}
                      cy={iy}
                      r="13"
                      onClick={() => handleKeyClick(item)}
                      className={`transition-all ${
                        isSelected
                          ? 'fill-indigo-600 stroke-indigo-300 stroke-1.5'
                          : 'fill-slate-950 hover:fill-slate-800 stroke-slate-800 stroke-1'
                      }`}
                    />
                    <text
                      x={ix}
                      y={iy + 3.5}
                      textAnchor="middle"
                      onClick={() => handleKeyClick(item)}
                      className={`text-[9.5px] font-medium pointer-events-none ${
                        isSelected ? 'fill-white font-bold' : 'fill-slate-400'
                      }`}
                    >
                      {item.relativeMinor}
                    </text>

                    {/* Accidental count tag outside */}
                    {item.accidentals !== 0 && (
                      <text
                        x={cx + (outerRadius + 24) * Math.cos(angleRad)}
                        y={cy + (outerRadius + 24) * Math.sin(angleRad) + 3}
                        textAnchor="middle"
                        className="fill-slate-400 text-[9px] font-mono pointer-events-none"
                      >
                        {item.accidentalLabel.replace('Natural', '0')}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Diatonic Chord Family Matrix (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col gap-3.5">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-amber-400 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Diatonic Chord Family for {selectedEntry.key} Major</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {diatonicChords.map((chord) => (
                <div
                  key={chord.degree}
                  className="bg-slate-900/80 border border-slate-800 rounded-lg p-2 flex flex-col justify-between hover:border-indigo-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-amber-400 font-bold text-sm">
                      {chord.chord}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                      {chord.degree}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">{chord.role}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-3.5 text-xs text-slate-400 space-y-1.5">
            <p className="text-slate-300 font-medium">Harmonic Navigation Tips:</p>
            <p>• Clockwise step adds 1 sharp / removes 1 flat (dominant direction).</p>
            <p>• Counter-clockwise step adds 1 flat / removes 1 sharp (subdominant direction).</p>
            <p>• Opposite keys across the wheel are tritone pairs (6 semitones apart).</p>
          </div>
        </div>
      </div>
    </div>
  );
};
