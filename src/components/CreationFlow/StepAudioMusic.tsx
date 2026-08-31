import React, { useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, Upload, Check, Play, Pause, Trash2 } from 'lucide-react';

interface StepAudioMusicProps {
  songTitle?: string;
  songUrl?: string;
  onChangeAudio: (title?: string, url?: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const PRESET_AMBIENTS = [
  {
    title: 'Quiet Morning Strings',
    url: 'https://actions.google.com/sounds/v1/ambiences/quiet_morning_strings.ogg'
  },
  {
    title: 'Gentle Acoustic Breeze',
    url: 'https://actions.google.com/sounds/v1/ambiences/gentle_acoustic_breeze.ogg'
  },
  {
    title: 'Soft Piano Lullaby',
    url: 'https://actions.google.com/sounds/v1/ambiences/soft_piano_lullaby.ogg'
  }
];

export const StepAudioMusic: React.FC<StepAudioMusicProps> = ({
  songTitle,
  songUrl,
  onChangeAudio,
  onNext,
  onBack
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChangeAudio(file.name.replace(/\.[^/.]+$/, ''), event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePreview = (url: string) => {
    if (playingUrl === url) {
      audioRef.current?.pause();
      setPlayingUrl(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play().catch(() => {});
        setPlayingUrl(url);
      }
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto text-center" id="form-step-audio-music">
      <audio
        ref={audioRef}
        onEnded={() => setPlayingUrl(null)}
        className="hidden"
      />

      <h2 className="font-serif text-3xl sm:text-4xl text-[#333333] font-light tracking-tight mb-3">
        Is there a song that reminds you of them?
      </h2>
      <p className="text-sm sm:text-base text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
        Choose a gentle background melody or upload your own audio file. This is completely optional.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="space-y-3 mb-8 text-left">
        {PRESET_AMBIENTS.map((item) => {
          const isSelected = songUrl === item.url;
          return (
            <div
              key={item.title}
              onClick={() => onChangeAudio(item.title, item.url)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-sm ${
                isSelected
                  ? 'bg-white border-black text-[#333333] ring-1 ring-black'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePreview(item.url);
                  }}
                  className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 hover:scale-105 transition-transform"
                >
                  {playingUrl === item.url ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                </button>
                <div>
                  <div className="text-sm font-medium text-[#333333]">{item.title}</div>
                  <div className="text-[11px] text-gray-400">Serene ambient track</div>
                </div>
              </div>

              {isSelected && <Check className="w-4 h-4 text-black" />}
            </div>
          );
        })}

        {/* Custom Upload Option */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="p-4 rounded-2xl border-2 border-dashed border-gray-300 bg-white hover:border-black transition-all cursor-pointer flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FAF8F5] text-gray-700 border border-gray-200 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-[#333333]">
                {songTitle && !PRESET_AMBIENTS.some(p => p.url === songUrl)
                  ? songTitle
                  : 'Upload your own song / audio'}
              </div>
              <div className="text-[11px] text-gray-400">MP3, WAV, M4A</div>
            </div>
          </div>

          {songUrl && !PRESET_AMBIENTS.some(p => p.url === songUrl) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChangeAudio(undefined, undefined);
              }}
              className="p-1.5 text-red-500 hover:bg-gray-100 rounded-full"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 text-sm text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-7 py-3.5 bg-[#333333] text-white hover:bg-black rounded-full text-sm sm:text-base font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
        >
          <span>Craft Birthday Gift</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

