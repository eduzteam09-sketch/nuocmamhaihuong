import React, { useState } from 'react';
import { Play, Square, Volume2, Sparkles, BookOpen, Layers } from 'lucide-react';
import { NoteName } from '../utils/musicTheory.ts';
import { synth } from '../utils/audioSynth.ts';

interface HarmonicFormulaCardProps {
  rootNote: NoteName;
  type: 'scale' | 'chord';
  displayName: string;
  category?: string;
  formula?: string;
  description: string;
  mood?: string;
  activeNotes: { note: NoteName; semitone: number; intervalName: string; degree: string }[];
  onPlayingNoteChange?: (note: string | null) => void;
}

export const HarmonicFormulaCard: React.FC<HarmonicFormulaCardProps> = ({
  rootNote,
  type,
  displayName,
  category,
  formula,
  description,
  mood,
  activeNotes,
  onPlayingNoteChange,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handlePlayChord = () => {
    setIsPlaying(true);
    const noteNames = activeNotes.map((n) => n.note);
    synth.playChord(noteNames, 4, true);
    setTimeout(() => setIsPlaying(false), 2000);
  };

  const handlePlayScale = () => {
    setIsPlaying(true);
    const noteNames = activeNotes.map((n) => n.note);

    synth.playScaleArpeggio(noteNames, 4, 150, (note) => {
      if (onPlayingNoteChange) {
        onPlayingNoteChange(note);
      }
    });

    const totalDuration = (noteNames.length + 1) * (60 / 150) * 1000 + 400;
    setTimeout(() => {
      setIsPlaying(false);
      if (onPlayingNoteChange) onPlayingNoteChange(null);
    }, totalDuration);
  };

  const handleStop = () => {
    synth.stopAll();
    setIsPlaying(false);
    if (onPlayingNoteChange) onPlayingNoteChange(null);
  };

  return (
    <div id="harmonic-formula-card" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium">
              {type === 'scale' ? 'Scale / Mode' : 'Chord Voicing'}
            </span>
            {category && (
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {category}
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
            <span className="text-amber-400">{rootNote}</span>
            <span>{displayName}</span>
          </h2>
        </div>

        {/* Audio playback buttons */}
        <div className="flex items-center gap-2">
          {type === 'chord' ? (
            <button
              id="play-chord-strum-btn"
              onClick={handlePlayChord}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Strum Chord</span>
            </button>
          ) : (
            <button
              id="play-scale-run-btn"
              onClick={handlePlayScale}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Play Scale Run</span>
            </button>
          )}

          {isPlaying && (
            <button
              id="stop-audio-btn"
              onClick={handleStop}
              className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all cursor-pointer"
              title="Stop playback"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          )}
        </div>
      </div>

      {/* Interval Formulas & Notes Grid */}
      <div className="py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
            Degree Formula
          </span>
          <span className="text-sm font-mono text-amber-400 font-bold">
            {formula || activeNotes.map((n) => n.degree).join(' - ')}
          </span>
        </div>

        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
            Pitch Spelling
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {activeNotes.map((n) => (
              <span
                key={n.note}
                className="font-mono text-sm font-bold text-slate-100 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800"
              >
                {n.note}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
            Semitone Offsets
          </span>
          <span className="text-xs font-mono text-indigo-400">
            [{activeNotes.map((n) => n.semitone).join(', ')}]
          </span>
        </div>

        {mood && (
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
              Harmonic Mood
            </span>
            <span className="text-xs text-slate-300 font-medium">
              {mood}
            </span>
          </div>
        )}
      </div>

      {/* Description & Theory Notes */}
      <div className="pt-2 text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/50 flex items-start gap-2.5">
        <BookOpen className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        <p>{description}</p>
      </div>
    </div>
  );
};
