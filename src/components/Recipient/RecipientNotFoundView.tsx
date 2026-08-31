import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowLeft, Lock } from 'lucide-react';

interface RecipientNotFoundViewProps {
  isUnpaid?: boolean;
  onGoHome?: () => void;
}

export const RecipientNotFoundView: React.FC<RecipientNotFoundViewProps> = ({
  isUnpaid = false,
  onGoHome,
}) => {
  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] text-[#333333] flex flex-col items-center justify-center p-6 sm:p-10 text-center relative overflow-hidden select-none">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md mx-auto my-auto flex flex-col items-center bg-white p-8 sm:p-10 rounded-[32px] border border-[#E8E2D9] shadow-xs"
      >
        <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border border-[#E8E2D9] flex items-center justify-center text-[#333333] mb-6 shadow-2xs">
          {isUnpaid ? <Lock className="w-6 h-6 stroke-[1.5]" /> : <Sparkles className="w-6 h-6 stroke-[1.5]" />}
        </div>

        <h1 className="font-serif text-3xl text-[#333333] font-light tracking-tight mb-2">
          {isUnpaid ? 'Surprise Pending Activation' : "This surprise doesn't exist."}
        </h1>

        <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-8">
          {isUnpaid
            ? 'This private surprise is awaiting payment confirmation before it can be unlocked.'
            : 'The link may be incorrect or the surprise may have been removed.'}
        </p>

        {onGoHome && (
          <button
            type="button"
            onClick={onGoHome}
            className="px-6 py-3 bg-[#333333] text-white hover:bg-black rounded-full text-xs font-medium transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
            id="btn-return-home-404"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Create a Birthday Surprise</span>
          </button>
        )}
      </motion.div>

      <div className="relative z-10 text-[11px] text-gray-400 mt-8 tracking-wider">
        FIRST WISH • Private Birthday Surprise
      </div>
    </div>
  );
};
