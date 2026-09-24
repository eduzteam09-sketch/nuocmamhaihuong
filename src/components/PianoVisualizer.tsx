import React, { useState } from 'react';
import { Volume2, Music } from 'lucide-react';
import { NoteName, NOTE_TO_INDEX } from '../utils/musicTheory.ts';
import { synth } from '../utils/audioSynth.ts';

interface PianoVisualizerProps {
  rootNote: NoteName;
  activeNotes: { note: NoteName; semitone: number; intervalName: string; degree: string }[];
  activePlayingNote?: string | null;
  type: 'scale' | 'chord';
  displayName: string;
}

interface KeyData {
  note: NoteName;
  octave: number;
  isBlack: boolean;
  midi: number;
}

export const PianoVisualizer: React.FC<PianoVisualizerProps> = ({
  rootNote,
  activeNotes,
  activePlayingNote,
  type,
  displayName,
}) => {
  const [labelMode, setLabelMode] = useState<'notes' | 'intervals' | 'degrees'>('degrees');
  const [startOctave, setStartOctave] = useState<number>(3);
  const octavesCount = 2; // 2 full octaves = 24 keys + ending C

  // Build key array
  const keys: KeyData[] = [];
  const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  for (let oct = startOctave; oct < startOctave + octavesCount; oct++) {
    const notesInOctave: { note: NoteName; isBlack: boolean }[] = [
      { note: 'C', isBlack: false },
      { note: 'C#', isBlack: true },
      { note: 'D', isBlack: false },
      { note: 'D#', isBlack: true },
      { note: 'E', isBlack: false },
      { note: 'F', isBlack: false },
      { note: 'F#', isBlack: true },
      { note: 'G', isBlack: false },
      { note: 'G#', isBlack: true },
      { note: 'A', isBlack: false },
      { note: 'A#', isBlack: true },
      { note: 'B', isBlack: false },
    ];

    notesInOctave.forEach((item) => {
      const pitchIdx = NOTE_TO_INDEX[item.note] ?? 0;
      keys.push({
        note: item.note,
        octave: oct,
        isBlack: item.isBlack,
        midi: (oct + 1) * 12 + pitchIdx,
      });
    });
  }

  // Add final C
  keys.push({
    note: 'C',
    octave: startOctave + octavesCount,
    isBlack: false,
    midi: (startOctave + octavesCount + 1) * 12,
  });

  // Map of active notes by pitch index (0-11)
  const activeMap = new Map<number, { degree: string; intervalName: string; isRoot: boolean }>();
  const rootIndex = NOTE_TO_INDEX[rootNote] ?? 0;

  activeNotes.forEach((an) => {
    const pIdx = NOTE_TO_INDEX[an.note];
    if (pIdx !== undefined) {
      activeMap.set(pIdx, {
        degree: an.degree,
        intervalName: an.intervalName,
        isRoot: pIdx === rootIndex,
      });
    }
  });

  const handleKeyClick = (note: NoteName, octave: number) => {
    const freq = synth.noteToFreq(note, octave);
    synth.playNote(freq, 1.2, 0, 0.35);
  };

  return (
    <div id="piano-visualizer-container" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-100 flex items-center gap-2">
              <span>Interactive Piano Keyboard</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-amber-500/20">
                {rootNote} {displayName}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Click any key to play notes and audition harmonic voicing
            </p>
          </div>
        </div>

        {/* Display and Octave controls */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center bg-slate-950/80 border border-slate-800 p-1 rounded-lg">
            <span className="px-2 text-slate-400">Labels:</span>
            <button
              id="piano-label-degrees"
              onClick={() => setLabelMode('degrees')}
              className={`px-2.5 py-1 rounded transition-all ${
                labelMode === 'degrees'
                  ? 'bg-amber-500 text-slate-950 font-medium'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Degrees (1, 3, 5)
            </button>
            <button
              id="piano-label-notes"
              onClick={() => setLabelMode('notes')}
              className={`px-2.5 py-1 rounded transition-all ${
                labelMode === 'notes'
                  ? 'bg-amber-500 text-slate-950 font-medium'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Notes (C, E, G)
            </button>
          </div>

          <div className="flex items-center bg-slate-950/80 border border-slate-800 p-1 rounded-lg">
            <span className="px-2 text-slate-400">Octave:</span>
            <button
              id="piano-octave-down"
              onClick={() => setStartOctave((o) => Math.max(2, o - 1))}
              disabled={startOctave <= 2}
              className="px-2 py-1 text-slate-300 hover:text-white disabled:opacity-30"
            >
              -1
            </button>
            <span className="px-1.5 font-mono text-amber-400">C{startOctave}–C{startOctave + octavesCount}</span>
            <button
              id="piano-octave-up"
              onClick={() => setStartOctave((o) => Math.min(5, o + 1))}
              disabled={startOctave >= 5}
              className="px-2 py-1 text-slate-300 hover:text-white disabled:opacity-30"
            >
              +1
            </button>
          </div>
        </div>
      </div>

      {/* Piano Keyboard Render */}
      <div className="relative overflow-x-auto pb-4 pt-1">
        <div className="relative inline-flex min-w-[620px] sm:min-w-full h-44 sm:h-52 bg-slate-950 rounded-xl p-3 border border-slate-800 shadow-inner select-none">
          {/* White keys layer */}
          <div className="flex w-full h-full">
            {keys
              .filter((k) => !k.isBlack)
              .map((k) => {
                const pitchIdx = NOTE_TO_INDEX[k.note] ?? 0;
                const active = activeMap.get(pitchIdx);
                const isPlaying = activePlayingNote === k.note;

                return (
                  <button
                    key={`${k.note}-${k.octave}`}
                    id={`piano-white-key-${k.note}-${k.octave}`}
                    onClick={() => handleKeyClick(k.note, k.octave)}
                    className={`flex-1 h-full rounded-b-md relative border-r border-slate-300/30 transition-colors flex flex-col justify-end pb-3 items-center group cursor-pointer ${
                      isPlaying
                        ? 'bg-amber-300 shadow-lg shadow-amber-400/50'
                        : active?.isRoot
                        ? 'bg-amber-50 shadow-inner'
                        : active
                        ? 'bg-amber-50/90'
                        : 'bg-white hover:bg-slate-100 active:bg-slate-200'
                    }`}
                  >
                    {/* Active highlight marker */}
                    {active && (
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-transform transform group-hover:scale-110 ${
                          active.isRoot
                            ? 'bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 ring-2 ring-amber-300'
                            : 'bg-slate-900 text-amber-400 border border-amber-500/40'
                        }`}
                      >
                        {labelMode === 'degrees' ? active.degree : k.note}
                      </div>
                    )}

                    {/* Subtle pitch name label at bottom */}
                    <span className="text-[10px] text-slate-400 font-mono mt-1 group-hover:text-slate-700">
                      {k.note}{k.octave}
                    </span>
                  </button>
                );
              })}
          </div>

          {/* Black keys overlay layer */}
          <div className="absolute inset-0 px-3 pointer-events-none flex w-full h-full">
            {/* Compute proportional positions for black keys */}
            {(() => {
              const whiteKeys = keys.filter((k) => !k.isBlack);
              const totalWhiteKeys = whiteKeys.length;
              const blackKeys = keys.filter((k) => k.isBlack);

              return blackKeys.map((k) => {
                // Find index of the white key just before this black key
                const whiteIndex = whiteKeys.findIndex(
                  (wk) => wk.octave === k.octave && NOTE_TO_INDEX[wk.note] === (NOTE_TO_INDEX[k.note] - 1)
                );

                if (whiteIndex === -1) return null;

                // Position black key between whiteIndex and whiteIndex + 1
                const leftPercent = ((whiteIndex + 0.65) / totalWhiteKeys) * 100;
                const widthPercent = (0.7 / totalWhiteKeys) * 100;

                const pitchIdx = NOTE_TO_INDEX[k.note] ?? 0;
                const active = activeMap.get(pitchIdx);
                const isPlaying = activePlayingNote === k.note;

                return (
                  <button
                    key={`${k.note}-${k.octave}`}
                    id={`piano-black-key-${k.note.replace('#', 's')}-${k.octave}`}
                    onClick={() => handleKeyClick(k.note, k.octave)}
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                    className={`absolute top-0 h-[60%] rounded-b-md pointer-events-auto border border-black/80 flex flex-col justify-end pb-2 items-center group cursor-pointer transition-all shadow-md ${
                      isPlaying
                        ? 'bg-amber-400 shadow-lg shadow-amber-400/50 z-20'
                        : active?.isRoot
                        ? 'bg-gradient-to-b from-amber-700 to-amber-900 border-amber-400 z-10'
                        : active
                        ? 'bg-gradient-to-b from-slate-700 to-slate-900 border-amber-500/40 z-10'
                        : 'bg-gradient-to-b from-slate-900 to-black hover:from-slate-800 hover:to-slate-900 active:bg-slate-950'
                    }`}
                  >
                    {active && (
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm transform group-hover:scale-110 ${
                          active.isRoot
                            ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
                        }`}
                      >
                        {labelMode === 'degrees' ? active.degree : k.note}
                      </div>
                    )}
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                      {k.note}
                    </span>
                  </button>
                );
              });
            })()}
          </div>
        </div>
      </div>

      {/* Legend & quick note pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-400 ring-2 ring-amber-300 inline-block" />
            <span className="text-slate-300 font-medium">Root Note (1)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-slate-800 border border-amber-500/40 text-amber-400 inline-block" />
            <span className="text-slate-300">Scale / Chord Tones</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400">Notes in {type}:</span>
          {activeNotes.map((an) => (
            <button
              key={an.note}
              onClick={() => handleKeyClick(an.note, 4)}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-xs border border-slate-700 flex items-center gap-1 transition-all"
            >
              <span>{an.note}</span>
              <span className="text-[10px] text-slate-400">({an.degree})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
