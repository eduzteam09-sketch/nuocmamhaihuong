import React, { useState } from 'react';
import { Guitar, Sliders } from 'lucide-react';
import {
  NoteName,
  NOTE_TO_INDEX,
  CHROMATIC_SHARP,
  INSTRUMENT_TUNINGS,
  InstrumentTuning,
} from '../utils/musicTheory.ts';
import { synth } from '../utils/audioSynth.ts';

interface FretboardVisualizerProps {
  rootNote: NoteName;
  activeNotes: { note: NoteName; semitone: number; intervalName: string; degree: string }[];
  activePlayingNote?: string | null;
  displayName: string;
}

export const FretboardVisualizer: React.FC<FretboardVisualizerProps> = ({
  rootNote,
  activeNotes,
  activePlayingNote,
  displayName,
}) => {
  const [selectedTuningId, setSelectedTuningId] = useState<string>('guitar-standard');
  const [labelType, setLabelType] = useState<'degrees' | 'notes'>('degrees');
  const [showAllNotes, setShowAllNotes] = useState<boolean>(false);

  const currentTuning: InstrumentTuning =
    INSTRUMENT_TUNINGS.find((t) => t.id === selectedTuningId) || INSTRUMENT_TUNINGS[0];

  const rootIndex = NOTE_TO_INDEX[rootNote] ?? 0;
  const activeMap = new Map<number, { degree: string; intervalName: string; isRoot: boolean }>();

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

  const handleFretClick = (note: NoteName, octave: number) => {
    const freq = synth.noteToFreq(note, octave);
    synth.playNote(freq, 1.2, 0, 0.35);
  };

  // Standard fret inlay marker positions
  const singleDotFrets = [3, 5, 7, 9, 15, 17, 19, 21];
  const doubleDotFrets = [12, 24];

  return (
    <div id="fretboard-visualizer-container" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
      {/* Header with Tuning Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
            <Guitar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-100 flex items-center gap-2">
              <span>Interactive Fretboard</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/20">
                {currentTuning.name}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Guitar, Bass, &amp; Ukulele string voicings with degree positions
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Tuning dropdown */}
          <div className="flex items-center bg-slate-950/80 border border-slate-800 px-2 py-1 rounded-lg">
            <Sliders className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
            <select
              id="fretboard-tuning-select"
              value={selectedTuningId}
              onChange={(e) => setSelectedTuningId(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer"
            >
              {INSTRUMENT_TUNINGS.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-slate-200">
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Label mode toggle */}
          <div className="flex items-center bg-slate-950/80 border border-slate-800 p-1 rounded-lg">
            <button
              id="fretboard-label-degrees"
              onClick={() => setLabelType('degrees')}
              className={`px-2.5 py-1 rounded transition-all ${
                labelType === 'degrees'
                  ? 'bg-emerald-500 text-slate-950 font-medium'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Degrees (1, 3, 5)
            </button>
            <button
              id="fretboard-label-notes"
              onClick={() => setLabelType('notes')}
              className={`px-2.5 py-1 rounded transition-all ${
                labelType === 'notes'
                  ? 'bg-emerald-500 text-slate-950 font-medium'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Notes (C, E, G)
            </button>
          </div>
        </div>
      </div>

      {/* Fretboard Canvas / Grid */}
      <div className="overflow-x-auto pb-4 pt-1">
        <div className="inline-block min-w-[780px] w-full bg-gradient-to-r from-amber-950/40 via-stone-900/90 to-amber-950/30 border border-amber-900/30 rounded-xl p-3 shadow-2xl relative select-none">
          {/* Top Fret Number markers */}
          <div className="flex pl-10 mb-1 border-b border-slate-800/80 pb-1">
            <div className="w-10 text-center font-mono text-[10px] text-amber-400/80 font-semibold">
              Open (0)
            </div>
            {Array.from({ length: currentTuning.frets }).map((_, fIdx) => (
              <div
                key={fIdx + 1}
                className="flex-1 text-center font-mono text-[10px] text-slate-400 font-medium"
              >
                {fIdx + 1}
              </div>
            ))}
          </div>

          {/* Strings and Frets Grid */}
          <div className="relative flex flex-col gap-2.5 py-2">
            {/* Render strings in reverse so highest string is at top, like looking down at neck */}
            {currentTuning.strings
              .map((strNote, strIdx) => ({
                note: strNote,
                baseOctave: currentTuning.baseOctaves[strIdx],
                stringNumber: strIdx + 1,
              }))
              .reverse()
              .map((strInfo, reversedIndex) => {
                const openPitchIdx = NOTE_TO_INDEX[strInfo.note] ?? 0;
                const stringGaugeThickness = 1 + (reversedIndex * 0.4); // visual string thickness

                return (
                  <div key={reversedIndex} className="relative flex items-center h-8">
                    {/* String line running across the neck */}
                    <div
                      style={{ height: `${stringGaugeThickness}px` }}
                      className="absolute left-10 right-0 bg-gradient-to-r from-amber-200/40 via-slate-300/60 to-amber-200/40 z-0 pointer-events-none shadow-sm"
                    />

                    {/* Open string headstock nut */}
                    <div className="w-10 flex items-center justify-center z-10">
                      {(() => {
                        const active = activeMap.get(openPitchIdx);
                        const isPlaying = activePlayingNote === strInfo.note;
                        return (
                          <button
                            id={`fretboard-open-${reversedIndex}`}
                            onClick={() => handleFretClick(strInfo.note, strInfo.baseOctave)}
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md cursor-pointer border ${
                              isPlaying
                                ? 'bg-emerald-300 text-slate-950 scale-110 shadow-emerald-400/60'
                                : active?.isRoot
                                ? 'bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-400/50'
                                : active
                                ? 'bg-slate-900 text-emerald-400 border-emerald-500/50'
                                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                            }`}
                          >
                            {active
                              ? labelType === 'degrees'
                                ? active.degree
                                : strInfo.note
                              : strInfo.note}
                          </button>
                        );
                      })()}
                    </div>

                    {/* Frets 1 to N */}
                    {Array.from({ length: currentTuning.frets }).map((_, fIdx) => {
                      const fretNum = fIdx + 1;
                      const fretPitchIdx = (openPitchIdx + fretNum) % 12;
                      const fretNote = CHROMATIC_SHARP[fretPitchIdx];
                      const active = activeMap.get(fretPitchIdx);

                      // Calculate octave
                      const octaveIncrement = Math.floor((openPitchIdx + fretNum) / 12);
                      const currentOctave = strInfo.baseOctave + octaveIncrement;
                      const isPlaying = activePlayingNote === fretNote;

                      return (
                        <div
                          key={fretNum}
                          className="flex-1 h-full flex items-center justify-center relative border-r border-slate-600/40 z-10"
                        >
                          {/* Note marker if active */}
                          {active && (
                            <button
                              id={`fret-${reversedIndex}-${fretNum}`}
                              onClick={() => handleFretClick(fretNote, currentOctave)}
                              className={`w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs transition-all shadow-md cursor-pointer ${
                                isPlaying
                                  ? 'bg-emerald-300 text-slate-950 scale-125 ring-2 ring-emerald-300 shadow-emerald-400/60'
                                  : active.isRoot
                                  ? 'bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 ring-2 ring-amber-300 font-extrabold scale-105'
                                  : 'bg-slate-900 text-emerald-400 border border-emerald-500/50 hover:bg-slate-800'
                              }`}
                            >
                              {labelType === 'degrees' ? active.degree : fretNote}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
          </div>

          {/* Fretboard Inlays (Wood dots) at bottom */}
          <div className="flex pl-10 pt-2 border-t border-slate-800/80">
            <div className="w-10" />
            {Array.from({ length: currentTuning.frets }).map((_, fIdx) => {
              const fretNum = fIdx + 1;
              const isSingleDot = singleDotFrets.includes(fretNum);
              const isDoubleDot = doubleDotFrets.includes(fretNum);

              return (
                <div key={fretNum} className="flex-1 flex justify-center items-center h-4">
                  {isSingleDot && (
                    <span className="w-2 h-2 rounded-full bg-slate-500/40 border border-slate-400/30" />
                  )}
                  {isDoubleDot && (
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400/60" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400/60" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Details */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-3 border-t border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 ring-2 ring-amber-300 inline-block" />
            <span className="text-slate-300 font-medium">Root Note (1)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-900 border border-emerald-500/50 text-emerald-400 inline-block" />
            <span className="text-slate-300">Interval / Scale Note</span>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          Showing complete string coverage for {rootNote} {displayName}
        </p>
      </div>
    </div>
  );
};
