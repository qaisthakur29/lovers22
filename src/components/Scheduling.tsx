import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Clock, Calendar, Check } from 'lucide-react';

interface SchedulingProps {
  unlockAt: string;
  partnerName: string;
  onChangeUnlockAt: (isoString: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Scheduling: React.FC<SchedulingProps> = ({
  unlockAt,
  partnerName,
  onChangeUnlockAt,
  onNext,
  onBack
}) => {
  // Determine mode
  const [mode, setMode] = useState<'midnight' | 'custom'>('midnight');

  // Tomorrow midnight default
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [birthdayDate, setBirthdayDate] = useState(defaultDate);
  const [customDateTime, setCustomDateTime] = useState(
    unlockAt ? unlockAt.slice(0, 16) : `${defaultDate}T00:00`
  );

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const handleSelectMidnight = (dateStr: string) => {
    setBirthdayDate(dateStr);
    const target = new Date(`${dateStr}T00:00:00`);
    onChangeUnlockAt(target.toISOString());
  };

  const handleSelectCustom = (dateTimeStr: string) => {
    setCustomDateTime(dateTimeStr);
    const target = new Date(dateTimeStr);
    onChangeUnlockAt(target.toISOString());
  };

  const handleTestNow = () => {
    // Unlock 5 seconds ago
    const past = new Date(Date.now() - 5000).toISOString();
    onChangeUnlockAt(past);
  };

  return (
    <div className="w-full max-w-lg mx-auto text-center" id="section-scheduling">
      <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold block mb-3">
        Midnight Timing
      </span>

      <h2 className="font-serif text-3xl sm:text-4xl text-[#333333] font-light tracking-tight mb-3">
        When should they open it?
      </h2>
      <p className="text-sm sm:text-base text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
        Choose when their surprise unlocks. Until that exact moment, they'll only see a peaceful countdown.
      </p>

      {/* Mode Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-left">
        <div
          onClick={() => {
            setMode('midnight');
            handleSelectMidnight(birthdayDate);
          }}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            mode === 'midnight'
              ? 'bg-white border-[#333333] text-[#333333] shadow-sm'
              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-sm text-[#333333]">12:00 AM Midnight</span>
            {mode === 'midnight' && <Check className="w-4 h-4 text-black" />}
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            The exact strike of midnight on their birthday.
          </p>
        </div>

        <div
          onClick={() => {
            setMode('custom');
            handleSelectCustom(customDateTime);
          }}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            mode === 'custom'
              ? 'bg-white border-[#333333] text-[#333333] shadow-sm'
              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-sm text-[#333333]">Custom Date & Time</span>
            {mode === 'custom' && <Check className="w-4 h-4 text-black" />}
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Any specific day or hour of your choosing.
          </p>
        </div>
      </div>

      {/* Inputs */}
      <div className="mb-8 p-6 rounded-3xl bg-white border border-gray-100 shadow-sm text-left">
        {mode === 'midnight' ? (
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
              <span>{partnerName || 'Their'} Birthday Date</span>
            </label>
            <input
              type="date"
              value={birthdayDate}
              onChange={(e) => handleSelectMidnight(e.target.value)}
              className="w-full px-5 py-3.5 text-base sm:text-lg bg-[#FAF8F5] border border-gray-200 focus:border-[#333333] rounded-2xl outline-none text-[#333333] transition-colors"
            />
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <span>Will unlock at: 12:00 AM ({timezone})</span>
            </p>
          </div>
        ) : (
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <span>Custom Unlock Timestamp</span>
            </label>
            <input
              type="datetime-local"
              value={customDateTime}
              onChange={(e) => handleSelectCustom(e.target.value)}
              className="w-full px-5 py-3.5 text-base sm:text-lg bg-[#FAF8F5] border border-gray-200 focus:border-[#333333] rounded-2xl outline-none text-[#333333] transition-colors"
            />
            <p className="text-xs text-gray-400 mt-2">
              Timezone: {timezone}
            </p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
          <span className="text-gray-500">Want to test unlock instantly?</span>
          <button
            type="button"
            onClick={handleTestNow}
            className="text-xs font-semibold text-[#333333] hover:underline"
          >
            Set to unlock immediately
          </button>
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
          id="btn-schedule-continue"
        >
          <span>Continue to Gift Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

