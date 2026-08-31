import React from 'react';
import { ArrowRight, ArrowLeft, Calendar, Sparkles } from 'lucide-react';

interface StepBeginningProps {
  startDate: string;
  howWeMet: string;
  partnerName: string;
  onChangeStartDate: (date: string) => void;
  onChangeHowWeMet: (text: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepBeginning: React.FC<StepBeginningProps> = ({
  startDate,
  howWeMet,
  partnerName,
  onChangeStartDate,
  onChangeHowWeMet,
  onNext,
  onBack
}) => {
  const isValid = howWeMet.trim().length > 3;

  return (
    <div className="w-full max-w-lg mx-auto text-center" id="form-step-beginning">
      <h2 className="font-serif text-3xl sm:text-4xl text-[#333333] font-light tracking-tight mb-3">
        When did your story begin?
      </h2>
      <p className="text-sm sm:text-base text-gray-500 mb-8 max-w-sm mx-auto">
        Every great love story has a moment where everything quietly shifted.
      </p>

      <div className="space-y-6 text-left mb-10">
        <div>
          <label htmlFor="input-start-date" className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>Relationship Start Date or First Day</span>
          </label>
          <input
            id="input-start-date"
            type="date"
            value={startDate}
            onChange={(e) => onChangeStartDate(e.target.value)}
            className="w-full px-5 py-3.5 text-base sm:text-lg bg-white border border-gray-200 focus:border-black rounded-2xl outline-none transition-all text-[#333333] shadow-sm"
          />
        </div>

        <div>
          <label htmlFor="input-how-we-met" className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gray-400" />
            <span>How did you two meet?</span>
          </label>
          <textarea
            id="input-how-we-met"
            value={howWeMet}
            onChange={(e) => onChangeHowWeMet(e.target.value)}
            rows={3}
            placeholder={`e.g. We met during a sudden rainstorm under a café awning on 4th street...`}
            className="w-full px-5 py-3.5 text-base sm:text-lg bg-white border border-gray-200 focus:border-black rounded-2xl outline-none transition-all placeholder:text-gray-300 text-[#333333] resize-none leading-relaxed shadow-sm"
          />
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

