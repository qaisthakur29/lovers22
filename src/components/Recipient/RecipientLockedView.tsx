import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, Play } from 'lucide-react';

interface RecipientLockedViewProps {
  partnerName: string;
  senderName?: string;
  unlockAt: string;
  onSimulateUnlock?: () => void;
  isPreviewMode?: boolean;
}

export const RecipientLockedView: React.FC<RecipientLockedViewProps> = ({
  partnerName,
  senderName,
  unlockAt,
  onSimulateUnlock,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(unlockAt).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, Math.floor((target - now) / 1000));

      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      setTimeLeft({ hours, minutes, seconds, totalSeconds: diff });

      if (diff === 0 && onSimulateUnlock) {
        onSimulateUnlock();
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [unlockAt, onSimulateUnlock]);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] text-[#333333] flex flex-col items-center justify-center p-6 sm:p-10 text-center relative overflow-hidden select-none">
      {/* Main Content */}
      <div className="relative z-10 max-w-sm sm:max-w-md mx-auto my-auto flex flex-col items-center">
        {/* Soft breathing icon */}
        <motion.div
          animate={{ scale: [1, 1.04, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-14 h-14 rounded-full bg-white border border-[#E8E2D9] shadow-xs flex items-center justify-center text-[#333333] mb-6"
        >
          <Clock className="w-6 h-6 stroke-[1.5]" />
        </motion.div>

        {/* Small line */}
        <span className="font-serif text-sm italic text-gray-500 block mb-2">
          A little surprise for you. ❤️
        </span>

        {/* Main greeting */}
        <h1 className="font-serif text-3xl sm:text-4xl text-[#333333] font-light tracking-tight mb-2">
          This is for you, {partnerName || 'my love'}.
        </h1>

        {senderName && (
          <p className="text-xs sm:text-sm text-gray-500 font-serif italic mb-6">
            From {senderName}
          </p>
        )}

        {/* Countdown Header */}
        <div className="mt-3 mb-3">
          <span className="text-[11px] uppercase tracking-widest text-gray-400 font-medium">
            Your surprise unlocks in
          </span>
        </div>

        {/* Large Countdown */}
        <div className="flex items-center justify-center gap-3 my-2">
          <div className="bg-white border border-gray-200/80 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-xs min-w-[70px] sm:min-w-[80px]">
            <span className="font-mono text-2xl sm:text-3xl font-normal text-[#333333]">
              {pad(timeLeft.hours)}
            </span>
            <span className="block text-[10px] uppercase tracking-wider text-gray-400 mt-1">Hours</span>
          </div>

          <span className="font-mono text-lg text-gray-300">:</span>

          <div className="bg-white border border-gray-200/80 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-xs min-w-[70px] sm:min-w-[80px]">
            <span className="font-mono text-2xl sm:text-3xl font-normal text-[#333333]">
              {pad(timeLeft.minutes)}
            </span>
            <span className="block text-[10px] uppercase tracking-wider text-gray-400 mt-1">Mins</span>
          </div>

          <span className="font-mono text-lg text-gray-300">:</span>

          <div className="bg-white border border-gray-200/80 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-xs min-w-[70px] sm:min-w-[80px]">
            <span className="font-mono text-2xl sm:text-3xl font-normal text-gray-500">
              {pad(timeLeft.seconds)}
            </span>
            <span className="block text-[10px] uppercase tracking-wider text-gray-400 mt-1">Secs</span>
          </div>
        </div>

        {/* Supporting reminder */}
        <p className="text-xs sm:text-sm text-gray-500 mt-6 max-w-xs leading-relaxed font-serif italic">
          Come back when the clock strikes midnight.
        </p>

        {/* Optional quick unlock trigger for testing / preview */}
        {onSimulateUnlock && (
          <div className="mt-8 pt-6 border-t border-gray-200/70 w-full">
            <button
              onClick={onSimulateUnlock}
              className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 hover:text-black rounded-full text-xs font-medium transition-all flex items-center justify-center gap-1.5 mx-auto shadow-xs"
              id="btn-simulate-unlock"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Simulate Midnight Unlock (Test Mode)</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer subtle brand */}
      <div className="relative z-10 text-[11px] text-gray-400 mt-8 tracking-wider">
        FIRST WISH • Private Birthday Surprise
      </div>
    </div>
  );
};
