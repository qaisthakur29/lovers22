import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Heart, Camera, Mic, Music2, Mail, Sparkles, FileText } from 'lucide-react';

interface FloatingLiveElementProps {
  currentStepIndex: number;
  partnerName?: string;
}

export const FloatingLiveElement: React.FC<FloatingLiveElementProps> = ({
  currentStepIndex,
  partnerName
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Render specific live keepsake depending on the step
  const renderKeepsakeContent = () => {
    switch (currentStepIndex) {
      case 0:
      case 1:
        // Name & Nickname step: Small floating cream envelope with wax stamp
        return (
          <div className="relative w-14 h-11 sm:w-16 sm:h-12 bg-[#FAF7F2] border border-[#E8E2D9] rounded-lg shadow-md flex items-center justify-center p-1 overflow-hidden">
            {/* Envelope flap folds */}
            <div className="absolute inset-0 border-b border-r border-[#E2DAD0]/60 pointer-events-none" />
            <div className="w-5 h-5 rounded-full bg-[#EFE9E0] border border-[#DDD3C5] flex items-center justify-center text-[#555] shadow-xs">
              <Mail className="w-2.5 h-2.5" />
            </div>
            <div className="absolute bottom-1 right-1.5 text-[8px] font-serif italic text-gray-400">
              {partnerName ? partnerName.slice(0, 6) : 'wish'}
            </div>
          </div>
        );

      case 2:
      case 3:
      case 4:
      case 5:
        // Beginning & Photo steps: Small floating miniature keepsake Polaroid
        return (
          <div className="relative w-12 h-15 sm:w-14 sm:h-17 bg-white border border-gray-200 rounded-sm shadow-md p-1 pb-3 flex flex-col items-center">
            <div className="w-full aspect-square bg-[#F5EFEB] rounded-xs flex items-center justify-center overflow-hidden">
              <Camera className="w-3.5 h-3.5 text-gray-400" />
            </div>
            <div className="mt-1 w-6 h-0.5 bg-gray-200 rounded-full" />
          </div>
        );

      case 6:
        // Personal Questions step: Small floating handwritten paper note
        return (
          <div className="relative w-12 h-14 sm:w-14 sm:h-16 bg-[#FFFDF9] border border-[#E8E2D7] rounded-sm shadow-md p-2 flex flex-col justify-between transform -rotate-2">
            <div className="flex items-center justify-between">
              <FileText className="w-3 h-3 text-gray-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            </div>
            <div className="space-y-1">
              <div className="w-full h-0.5 bg-gray-200 rounded-full" />
              <div className="w-4/5 h-0.5 bg-gray-200 rounded-full" />
              <div className="w-3/5 h-0.5 bg-gray-200 rounded-full" />
            </div>
            <div className="text-[7px] font-serif italic text-gray-400 text-right">notes</div>
          </div>
        );

      case 7:
        // Voice Note step: Small floating voice capsule with microphone
        return (
          <div className="relative px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E8E2D9] rounded-full shadow-md flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-[#333333] text-white flex items-center justify-center">
              <Mic className="w-2.5 h-2.5" />
            </div>
            <div className="flex items-center gap-0.5">
              <span className="w-0.5 h-2 bg-gray-400 rounded-full animate-pulse" />
              <span className="w-0.5 h-3 bg-[#333333] rounded-full" />
              <span className="w-0.5 h-1.5 bg-gray-400 rounded-full" />
            </div>
          </div>
        );

      case 8:
        // Music step: Small floating vinyl / melody note
        return (
          <div className="relative w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E8E2D9] shadow-md flex items-center justify-center p-2">
            <div className="w-full h-full rounded-full border border-dashed border-gray-300 flex items-center justify-center">
              <Music2 className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        );

      case 9:
      default:
        // Generation / Letter step: Small floating heart wax seal letter
        return (
          <div className="relative w-14 h-12 bg-[#FFFDF9] border border-[#E8E2D9] rounded-lg shadow-md flex items-center justify-center p-1.5">
            <div className="w-5 h-5 rounded-full bg-[#FAF0EB] border border-[#E8D5CE] flex items-center justify-center text-[#333333] shadow-xs">
              <Heart className="w-2.5 h-2.5 fill-gray-400/20" />
            </div>
            <Sparkles className="w-2.5 h-2.5 text-gray-400 absolute top-1 right-1" />
          </div>
        );
    }
  };

  return (
    <div
      className="pointer-events-none select-none absolute z-10 transition-all duration-700 right-3 sm:right-6 md:right-8 top-12 sm:top-16"
      aria-hidden="true"
    >
      <motion.div
        animate={
          shouldReduceMotion
            ? { opacity: [0.85, 1, 0.85] }
            : {
                y: [0, -12, 4, -8, 0],
                x: [0, 6, -4, 5, 0],
                rotate: [0, 3, -2, 2.5, 0],
              }
        }
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative flex flex-col items-center"
      >
        {/* The live floating object */}
        {renderKeepsakeContent()}

        {/* Soft dynamic ambient shadow */}
        {!shouldReduceMotion && (
          <motion.div
            animate={{
              scale: [1, 0.75, 1.15, 0.85, 1],
              opacity: [0.25, 0.12, 0.35, 0.18, 0.25],
            }}
            transition={{
              duration: 6.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-8 h-2 bg-gray-400/25 rounded-full blur-[2.5px] mt-2.5"
          />
        )}
      </motion.div>
    </div>
  );
};
