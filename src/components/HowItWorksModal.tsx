import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCreation: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onStartCreation
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg bg-[#FFFDF9] rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-8 z-10 my-8"
          id="modal-how-it-works"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold block mb-1">
              Simple & Thoughtful
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#333333] font-light">
              How First Wish Works
            </h3>
            <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
              A private digital love letter that opens at the strike of midnight.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {/* Step 1 */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-gray-200 text-[#333333] flex items-center justify-center font-serif text-sm font-semibold shrink-0">
                1
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#333333]">Share your memories</h4>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 leading-relaxed">
                  Answer a few gentle questions, upload your favorite photos, and record an optional 60-second voice note.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-gray-200 text-[#333333] flex items-center justify-center font-serif text-sm font-semibold shrink-0">
                2
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#333333]">AI crafts 12 intimate notes & letter</h4>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 leading-relaxed">
                  Our quiet AI weaves your real memories into "12 Things I Want You To Know" and a warm personal letter. You can edit every word.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-gray-200 text-[#333333] flex items-center justify-center font-serif text-sm font-semibold shrink-0">
                3
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#333333]">Schedule midnight unlock & share link</h4>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 leading-relaxed">
                  Send your private link on WhatsApp. Before 12:00 AM, they see a peaceful countdown. At midnight, their world unlocks.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-gray-100">
            <div className="text-xs text-gray-500 text-center sm:text-left">
              <span className="font-semibold text-[#333333]">₹50 only</span> • No subscription • Private
            </div>
            <button
              onClick={() => {
                onClose();
                onStartCreation();
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#333333] text-white hover:bg-black rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
              id="btn-modal-create-now"
            >
              <span>Create Their First Wish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

