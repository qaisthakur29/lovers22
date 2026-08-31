import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface StepNicknameProps {
  nickname: string;
  partnerName: string;
  onChangeNickname: (nickname: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const PRESET_OPTIONS = ['Baby', 'Love', 'My Person', 'Sunshine', 'Sweetheart'];

export const StepNickname: React.FC<StepNicknameProps> = ({
  nickname,
  partnerName,
  onChangeNickname,
  onNext,
  onBack
}) => {
  const [isCustom, setIsCustom] = useState(!PRESET_OPTIONS.includes(nickname) && nickname.length > 0);
  const [customValue, setCustomValue] = useState(!PRESET_OPTIONS.includes(nickname) ? nickname : '');

  const handleSelectPreset = (opt: string) => {
    setIsCustom(false);
    onChangeNickname(opt);
  };

  const handleCustomChange = (val: string) => {
    setCustomValue(val);
    onChangeNickname(val);
  };

  const currentSelection = isCustom ? customValue : nickname;
  const isValid = currentSelection.trim().length > 0;

  return (
    <div className="w-full max-w-lg mx-auto text-center" id="form-step-nickname">
      <h2 className="font-serif text-3xl sm:text-4xl text-[#333333] font-light tracking-tight mb-3">
        What do you call them?
      </h2>
      <p className="text-sm sm:text-base text-gray-500 mb-8 max-w-sm mx-auto">
        Pick a pet name or write the special nickname only you use for {partnerName || 'them'}.
      </p>

      {/* Preset Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {PRESET_OPTIONS.map((opt) => {
          const selected = !isCustom && nickname === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => handleSelectPreset(opt)}
              className={`px-4 py-3.5 rounded-2xl text-sm sm:text-base font-medium transition-all duration-200 border flex items-center justify-center gap-2 ${
                selected
                  ? 'bg-white border-black text-[#333333] shadow-sm ring-1 ring-black'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <span>{opt}</span>
              {selected && <Check className="w-4 h-4 text-black" />}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => {
            setIsCustom(true);
            if (!customValue) onChangeNickname('');
          }}
          className={`px-4 py-3.5 rounded-2xl text-sm sm:text-base font-medium transition-all duration-200 border flex items-center justify-center gap-2 ${
            isCustom
              ? 'bg-white border-black text-[#333333] shadow-sm ring-1 ring-black'
              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <span>Custom...</span>
          {isCustom && <Check className="w-4 h-4 text-black" />}
        </button>
      </div>

      {/* Custom Input */}
      {isCustom && (
        <div className="mb-8 text-left animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">
            Your unique nickname
          </label>
          <input
            type="text"
            value={customValue}
            onChange={(e) => handleCustomChange(e.target.value)}
            placeholder="e.g. Boo, Pumpkin, Honeybee..."
            autoFocus
            className="w-full px-5 py-3.5 text-base sm:text-lg bg-white border border-gray-200 rounded-2xl outline-none focus:border-black text-[#333333] shadow-sm"
          />
        </div>
      )}

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
          disabled={!isValid}
          className="px-7 py-3.5 bg-[#333333] text-white hover:bg-black disabled:opacity-40 disabled:hover:bg-[#333333] rounded-full text-sm sm:text-base font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

