import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StepPersonalQuestionsProps {
  partnerName: string;
  loveMost: string;
  neverTold: string;
  favoriteThing: string;
  wishForYear: string;
  specialNote: string;
  onChangeLoveMost: (v: string) => void;
  onChangeNeverTold: (v: string) => void;
  onChangeFavoriteThing: (v: string) => void;
  onChangeWishForYear: (v: string) => void;
  onChangeSpecialNote: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const QUESTIONS = [
  {
    key: 'loveMost',
    title: 'What do you love most about them?',
    subtext: 'Their kindness, the way they smile, their quirks, or how they treat people.',
    placeholder: 'e.g. The way your eyes light up when you talk about things you care about, and the calmness you bring...'
  },
  {
    key: 'neverTold',
    title: "What's something you've never properly told them?",
    subtext: 'A quiet truth you keep in your heart or a sweet moment you never spoke aloud.',
    placeholder: 'e.g. Whenever I see something funny or beautiful during the day, my first instinct is always to send it to you...'
  },
  {
    key: 'favoriteThing',
    title: "What's your favorite thing about being with them?",
    subtext: 'Simple everyday routines, silent moments, traveling, or making dinner.',
    placeholder: 'e.g. Making morning coffee together with zero rush, just sitting and talking about nothing...'
  },
  {
    key: 'wishForYear',
    title: "What do you wish for the two of you this year?",
    subtext: 'Peace, adventures, gentle moments, or a milestone you dream of sharing.',
    placeholder: 'e.g. I wish for you to feel completely unburdened, deeply cherished every day, and to chase your dreams...'
  },
  {
    key: 'specialNote',
    title: 'Write anything you want them to read tonight.',
    subtext: 'Your closing midnight thought before they close their eyes.',
    placeholder: 'e.g. You are my favorite place to come home to. Happy Birthday, my love.'
  }
];

export const StepPersonalQuestions: React.FC<StepPersonalQuestionsProps> = ({
  partnerName,
  loveMost,
  neverTold,
  favoriteThing,
  wishForYear,
  specialNote,
  onChangeLoveMost,
  onChangeNeverTold,
  onChangeFavoriteThing,
  onChangeWishForYear,
  onChangeSpecialNote,
  onNext,
  onBack
}) => {
  const [subIndex, setSubIndex] = useState(0);

  const values: Record<string, string> = {
    loveMost,
    neverTold,
    favoriteThing,
    wishForYear,
    specialNote
  };

  const setters: Record<string, (v: string) => void> = {
    loveMost: onChangeLoveMost,
    neverTold: onChangeNeverTold,
    favoriteThing: onChangeFavoriteThing,
    wishForYear: onChangeWishForYear,
    specialNote: onChangeSpecialNote
  };

  const currentQ = QUESTIONS[subIndex];
  const currentValue = values[currentQ.key] || '';
  const currentSetter = setters[currentQ.key];

  const handleSubNext = () => {
    if (subIndex < QUESTIONS.length - 1) {
      setSubIndex(subIndex + 1);
    } else {
      onNext();
    }
  };

  const handleSubBack = () => {
    if (subIndex > 0) {
      setSubIndex(subIndex - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto text-center" id="form-step-personal-questions">
      {/* Sub-step indicator */}
      <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold block mb-3">
        Personal Reflections ({subIndex + 1} of {QUESTIONS.length})
      </span>

      <AnimatePresence mode="wait">
        <motion.div
          key={subIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="font-serif text-3xl sm:text-4xl text-[#333333] font-light tracking-tight mb-3">
            {currentQ.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
            {currentQ.subtext}
          </p>

          <div className="mb-8 text-left">
            <textarea
              value={currentValue}
              onChange={(e) => currentSetter(e.target.value)}
              rows={5}
              placeholder={currentQ.placeholder}
              autoFocus
              className="w-full px-5 py-4 text-base sm:text-lg bg-white border border-gray-200 focus:border-black rounded-2xl outline-none transition-all placeholder:text-gray-300 text-[#333333] resize-none leading-relaxed shadow-sm"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={handleSubBack}
          className="px-5 py-3 text-sm text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-1.5">
          {QUESTIONS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSubIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === subIndex ? 'w-5 bg-black' : 'bg-gray-200'
              }`}
              title={`Question ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleSubNext}
          className="px-7 py-3.5 bg-[#333333] text-white hover:bg-black rounded-full text-sm sm:text-base font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
        >
          <span>{subIndex === QUESTIONS.length - 1 ? 'Save & Continue' : 'Next Question'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

