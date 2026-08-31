import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Edit3, ArrowRight, ArrowLeft, Heart, RefreshCw, Sparkles, Check } from 'lucide-react';
import { SurpriseData } from '../../types';

interface StepGenerationProps {
  surprise: SurpriseData;
  onUpdateGeneratedContent: (messages: string[], letter: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepGeneration: React.FC<StepGenerationProps> = ({
  surprise,
  onUpdateGeneratedContent,
  onNext,
  onBack
}) => {
  // Only generate if we don't already have messages in session memory
  const hasExistingContent = Boolean(
    surprise.generated_messages &&
    surprise.generated_messages.length >= 8 &&
    surprise.personal_letter
  );

  const [isGenerating, setIsGenerating] = useState(!hasExistingContent);
  const [messages, setMessages] = useState<string[]>(surprise.generated_messages || []);
  const [letter, setLetter] = useState<string>(surprise.personal_letter || '');
  const [activeTab, setActiveTab] = useState<'messages' | 'letter'>('messages');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!hasExistingContent && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      triggerGeneration();
    }
  }, []);

  const triggerGeneration = async () => {
    setIsGenerating(true);
    const startTime = Date.now();

    try {
      const payload = {
        partner_name: surprise.partner_name,
        sender_name: surprise.sender_name,
        nickname: surprise.nickname,
        relationship_start_date: surprise.relationship_start_date,
        how_we_met: surprise.how_we_met,
        favorite_memory: surprise.favorite_memory,
        love_most: surprise.love_most,
        never_told: surprise.never_told,
        favorite_thing: surprise.favorite_thing,
        wish_for_year: surprise.wish_for_year,
        special_note: surprise.special_note
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
          setLetter(data.letter);
          onUpdateGeneratedContent(data.messages, data.letter);
        }
      }
    } catch (err) {
      console.warn('Fast AI response fallback:', err);
    } finally {
      // Ensure smooth quick minimum transition of ~800ms for visual polish without frustrating wait
      const elapsed = Date.now() - startTime;
      const minWait = Math.max(0, 800 - elapsed);
      setTimeout(() => {
        setIsGenerating(false);
        setIsRegenerating(false);
      }, minWait);
    }
  };

  const handleMessageChange = (index: number, val: string) => {
    const updated = [...messages];
    updated[index] = val;
    setMessages(updated);
    onUpdateGeneratedContent(updated, letter);
  };

  const handleLetterChange = (val: string) => {
    setLetter(val);
    onUpdateGeneratedContent(messages, val);
  };

  if (isGenerating) {
    return (
      <div className="w-full max-w-lg mx-auto py-16 sm:py-20 text-center flex flex-col items-center justify-center">
        {/* Soft, lightweight pulse */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 rounded-full bg-[#FAF7F2] border border-[#E8E2D9] flex items-center justify-center text-[#333333] mb-6 shadow-xs"
        >
          <Heart className="w-8 h-8 fill-gray-200 stroke-[#333333]" />
        </motion.div>

        {/* Clean, exact requested text */}
        <motion.h2
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-serif text-3xl sm:text-4xl text-[#333333] font-light tracking-tight mb-3"
        >
          Your surprise is coming together... ❤️
        </motion.h2>

        <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed mb-6">
          Gathering your memories, photos, and heartfelt words.
        </p>

        {/* 3 small elegant moving dots */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#333333] animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-[#333333] animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-[#333333] animate-bounce" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto text-center" id="form-step-generation-review">
      <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold block mb-2">
        Crafted from your memories
      </span>

      <h2 className="font-serif text-3xl sm:text-4xl text-[#333333] font-light tracking-tight mb-2">
        Review & Edit Your Words
      </h2>
      <p className="text-sm sm:text-base text-gray-500 mb-6 max-w-md mx-auto">
        Feel free to tweak any line. Everything can be edited to match your exact tone.
      </p>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
            activeTab === 'messages'
              ? 'bg-[#333333] text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          12 Things I Want You To Know
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('letter')}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
            activeTab === 'letter'
              ? 'bg-[#333333] text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          Personal Birthday Letter
        </button>

        <button
          type="button"
          onClick={() => {
            setIsRegenerating(true);
            triggerGeneration();
          }}
          className="p-2 text-gray-500 hover:text-black rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          title="Regenerate with AI"
        >
          <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {activeTab === 'messages' ? (
        <div className="space-y-3 mb-8 text-left max-h-[50vh] overflow-y-auto pr-1">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white border border-gray-200 focus-within:border-black transition-all shadow-sm"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono font-semibold text-gray-400 uppercase tracking-wider">
                  Note #{idx + 1}
                </span>
                <Edit3 className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <textarea
                value={msg}
                onChange={(e) => handleMessageChange(idx, e.target.value)}
                rows={2}
                className="w-full text-sm sm:text-base bg-transparent outline-none resize-none text-[#333333] leading-relaxed"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-8 text-left">
          <div className="p-6 rounded-2xl bg-white border border-gray-200 focus-within:border-black transition-all shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-serif italic text-gray-400">Personal Letter</span>
              <span className="text-xs text-gray-400">Opens at the end of their surprise</span>
            </div>
            <textarea
              value={letter}
              onChange={(e) => handleLetterChange(e.target.value)}
              rows={12}
              className="w-full font-serif text-base sm:text-lg bg-transparent outline-none resize-none text-[#333333] leading-relaxed"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 text-sm text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-7 py-3.5 bg-[#333333] text-white hover:bg-black rounded-full text-sm sm:text-base font-medium transition-all duration-200 flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <span>Preview Surprise</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};


