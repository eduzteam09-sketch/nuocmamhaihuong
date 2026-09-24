import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, Download, RefreshCw, X, Maximize2, AlertCircle } from 'lucide-react';
import { NoteName } from '../utils/musicTheory.ts';

interface ImageStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  rootNote: NoteName;
  displayName: string;
  type: 'scale' | 'chord';
  notesList: string[];
}

export const ImageStudioModal: React.FC<ImageStudioModalProps> = ({
  isOpen,
  onClose,
  rootNote,
  displayName,
  type,
  notesList,
}) => {
  // Required affordance for user to specify image size (1K, 2K, 4K)
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '4:3' | '9:16'>('1:1');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [history, setHistory] = useState<{ url: string; prompt: string; size: string }[]>([]);

  if (!isOpen) return null;

  const promptPresets = [
    {
      title: 'Baroque Theory Manuscript',
      prompt: `An intricate 18th-century classical music theory engraving illustrating the ${rootNote} ${displayName} (${notesList.join(', ')}). Sepia parchment, vintage copperplate calligraphy, sacred geometry harmony circles, fine crosshatch linework, museum archive quality.`,
    },
    {
      title: 'Acoustic Harmonic Resonance',
      prompt: `Luminous acoustic wave visualization of ${rootNote} ${displayName} showing golden frequency overtones, cymatics chladni patterns on obsidian marble, ethereal ambient lighting, 3D render with pristine studio lighting.`,
    },
    {
      title: 'Cyberpunk Synth Hologram',
      prompt: `Futuristic neon holographic interface displaying the ${rootNote} ${displayName} chord and scale geometry. Oscilloscope waveforms, floating musical staff lines, cyan and amber neon vectors on dark titanium background.`,
    },
    {
      title: 'Bauhaus Modernist Poster',
      prompt: `Minimalist Swiss style graphic design poster of the ${rootNote} ${displayName}. Bold geometric circles and lines representing intervals (${notesList.join(', ')}), matte textured off-white paper, Bauhaus color palette.`,
    },
  ];

  const handleGenerate = async (promptToUse?: string) => {
    const text = (promptToUse || customPrompt).trim();
    if (!text) {
      setErrorMsg('Please enter a description or pick a preset style.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          imageSize,
          aspectRatio,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        setHistory((prev) => [
          { url: data.imageUrl, prompt: text, size: imageSize },
          ...prev.slice(0, 5),
        ]);
      } else {
        throw new Error('No image URL returned.');
      }
    } catch (err: any) {
      console.error('Image gen error:', err);
      setErrorMsg(err.message || 'Image generation failed. Ensure your Gemini API Key in Settings > Secrets is configured.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = `${rootNote}_${displayName.replace(/\s+/g, '_')}_${imageSize}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        id="image-generation-modal"
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-7 overflow-hidden my-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500/20 to-indigo-500/20 border border-amber-500/30 text-amber-300 rounded-xl">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>High-Quality AI Music Visual Generator</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-mono">
                  gemini-3-pro-image-preview
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Generate high-resolution infographics, harmonic diagrams, and artwork for {rootNote} {displayName}
              </p>
            </div>
          </div>
          <button
            id="close-image-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* Required Size Affordance: 1K, 2K, 4K */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-300 block mb-2">
                Resolution / Image Size (Affordance)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['1K', '2K', '4K'] as const).map((sz) => (
                  <button
                    key={sz}
                    id={`image-size-btn-${sz}`}
                    type="button"
                    onClick={() => setImageSize(sz)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold font-mono transition-all flex flex-col items-center gap-0.5 ${
                      imageSize === sz
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 ring-2 ring-amber-300'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    <span>{sz}</span>
                    <span className="text-[10px] font-normal opacity-80">
                      {sz === '1K' ? '1024 px' : sz === '2K' ? '2048 px' : '4096 px (Ultra)'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-300 block mb-2">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {(['1:1', '16:9', '4:3', '9:16'] as const).map((ar) => (
                  <button
                    key={ar}
                    type="button"
                    onClick={() => setAspectRatio(ar)}
                    className={`py-1.5 rounded-lg font-mono font-medium transition-all ${
                      aspectRatio === ar
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {ar}
                  </button>
                ))}
              </div>
            </div>

            {/* Presets */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-300 block mb-2">
                Select Visual Style Preset
              </label>
              <div className="grid grid-cols-2 gap-2">
                {promptPresets.map((preset) => (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => {
                      setCustomPrompt(preset.prompt);
                      handleGenerate(preset.prompt);
                    }}
                    disabled={isLoading}
                    className="p-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-850 hover:border-amber-500/40 border border-slate-800 text-left transition-all group disabled:opacity-50"
                  >
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-400 block">
                      {preset.title}
                    </span>
                    <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {preset.prompt.substring(0, 45)}...
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom prompt input */}
            <div>
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-300 block mb-1.5">
                Custom Prompt
              </label>
              <textarea
                id="custom-image-prompt-input"
                rows={3}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={`e.g. Infographic poster of ${rootNote} ${displayName} with harmonic circle, acoustic waveforms, and gold leaf accents...`}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 resize-none"
              />
            </div>

            {/* Submit button */}
            <button
              id="generate-image-submit-btn"
              onClick={() => handleGenerate()}
              disabled={isLoading || (!customPrompt.trim())}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating {imageSize} Artwork with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate {imageSize} Music Artwork</span>
                </>
              )}
            </button>

            {errorMsg && (
              <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl text-xs text-red-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Preview Column (6 cols) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center bg-slate-950/80 border border-slate-800 rounded-xl p-4 min-h-[380px] relative">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="relative w-16 h-16">
                  <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
                  <Sparkles className="w-6 h-6 text-amber-400 absolute inset-0 m-auto animate-pulse" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-200">
                    Generating {imageSize} High-Quality Visual...
                  </p>
                  <p className="text-xs text-slate-400">
                    Gemini 3 Pro Image is rendering your music theory artwork
                  </p>
                </div>
              </div>
            ) : generatedImage ? (
              <div className="w-full flex flex-col items-center gap-3">
                <div className="relative w-full max-h-[380px] rounded-lg overflow-hidden border border-slate-800 bg-black flex items-center justify-center group">
                  <img
                    src={generatedImage}
                    alt={`${rootNote} ${displayName} generated artwork`}
                    className="max-h-[360px] w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={handleDownload}
                      className="p-2 rounded-lg bg-black/80 hover:bg-black text-white text-xs flex items-center gap-1 backdrop-blur-sm"
                      title="Download image"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="w-full flex items-center justify-between text-xs text-slate-400 px-1">
                  <span className="font-mono text-amber-400">
                    Size: {imageSize} • {aspectRatio}
                  </span>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Image</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 text-slate-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium text-slate-400">
                  No image generated yet
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Choose a style preset or enter a prompt to generate high-resolution music visuals in 1K, 2K, or 4K.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
