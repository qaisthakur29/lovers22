import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Smartphone, Lock, Unlock, ArrowRight, ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';
import { SurpriseData } from '../types';
import { RecipientLockedView } from './Recipient/RecipientLockedView';
import { RecipientMidnightUnlock } from './Recipient/RecipientMidnightUnlock';

interface InteractivePreviewProps {
  surprise: SurpriseData;
  onNext: () => void;
  onBack: () => void;
}

export const InteractivePreview: React.FC<InteractivePreviewProps> = ({
  surprise,
  onNext,
  onBack
}) => {
  const [simulationState, setSimulationState] = useState<'locked' | 'unlocked'>('locked');

  return (
    <div className="w-full max-w-4xl mx-auto text-center" id="section-interactive-preview">
      {/* Header */}
      <span className="font-serif text-sm italic text-gray-500 block mb-2">
        A preview through their eyes.
      </span>

      <h2 className="font-serif text-3xl sm:text-4xl text-[#333333] font-light tracking-tight mb-3">
        See it through {surprise.partner_name || 'their'} eyes.
      </h2>
      <p className="text-sm sm:text-base text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
        Test what they see before midnight and the moment their surprise unlocks.
      </p>

      {/* Simulator Switcher Controls */}
      <div className="inline-flex items-center p-1 rounded-full bg-[#FAF8F5] border border-gray-200 mb-8">
        <button
          type="button"
          onClick={() => setSimulationState('locked')}
          className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
            simulationState === 'locked'
              ? 'bg-[#333333] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Before 12:00 AM (Countdown)</span>
        </button>

        <button
          type="button"
          onClick={() => setSimulationState('unlocked')}
          className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
            simulationState === 'unlocked'
              ? 'bg-[#333333] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Unlock className="w-3.5 h-3.5" />
          <span>At Midnight (Unlocked Gifts)</span>
        </button>
      </div>

      {/* Phone Mockup Canvas (Clean Minimalism Chassis) */}
      <div className="relative mx-auto my-2 max-w-[390px] w-full aspect-[9/18.5] bg-white rounded-[48px] p-2.5 shadow-2xl border-[8px] border-white ring-1 ring-gray-200 flex flex-col overflow-hidden">
        {/* Top Speaker pill */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-white flex items-center justify-center z-30">
          <div className="w-12 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Screen Content */}
        <div className="w-full h-full rounded-[38px] overflow-hidden bg-[#FAF8F5] flex flex-col relative">
          {simulationState === 'locked' ? (
            <RecipientLockedView
              partnerName={surprise.partner_name}
              senderName={surprise.sender_name}
              unlockAt={surprise.unlock_at || new Date(Date.now() + 3600000 * 3).toISOString()}
              onSimulateUnlock={() => setSimulationState('unlocked')}
              isPreviewMode={true}
            />
          ) : (
            <RecipientMidnightUnlock
              surprise={surprise}
              onReplay={() => setSimulationState('unlocked')}
              onFinishPreview={onNext}
            />
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between gap-4 pt-8 mt-6 border-t border-gray-200/80 max-w-xl mx-auto">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-[#FAF8F5] rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Surprise</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-8 py-3.5 bg-[#333333] text-white hover:bg-black rounded-full text-sm sm:text-base font-medium transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          id="btn-preview-schedule"
        >
          <span>Ready to send it? ❤️</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

