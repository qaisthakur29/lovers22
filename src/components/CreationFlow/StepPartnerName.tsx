import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface StepPartnerNameProps {
  partnerName: string;
  senderName: string;
  onChangePartnerName: (name: string) => void;
  onChangeSenderName: (name: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepPartnerName: React.FC<StepPartnerNameProps> = ({
  partnerName,
  senderName,
  onChangePartnerName,
  onChangeSenderName,
  onNext,
  onBack
}) => {
  const isValid = partnerName.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto text-center" id="form-step-name">
      <h2 className="font-serif text-3xl sm:text-4xl text-[#333333] font-light tracking-tight mb-3">
        What's their name?
      </h2>
      <p className="text-sm sm:text-base text-gray-500 mb-8 max-w-sm mx-auto">
        We'll personalize this entire experience around the person you cherish.
      </p>

      <div className="space-y-6 text-left mb-10">
        <div>
          <label htmlFor="input-partner-name" className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">
            Their Name
          </label>
          <input
            id="input-partner-name"
            type="text"
            value={partnerName}
            onChange={(e) => onChangePartnerName(e.target.value)}
            placeholder="Sarah"
            autoFocus
            className="w-full px-5 py-4 text-xl sm:text-2xl bg-white border border-gray-200 focus:border-black rounded-2xl outline-none transition-all placeholder:text-gray-300 text-[#333333] shadow-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="input-sender-name" className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">
            Your Name <span className="text-gray-400 font-normal">(so they know who it's from)</span>
          </label>
          <input
            id="input-sender-name"
            type="text"
            value={senderName}
            onChange={(e) => onChangeSenderName(e.target.value)}
            placeholder="Alex"
            className="w-full px-5 py-3.5 text-base sm:text-lg bg-white border border-gray-200 focus:border-black rounded-2xl outline-none transition-all placeholder:text-gray-300 text-[#333333] shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 text-sm text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors flex items-center gap-1.5"
          id="btn-back-step-name"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="submit"
          disabled={!isValid}
          className="px-7 py-3.5 bg-[#333333] text-white hover:bg-black disabled:opacity-40 disabled:hover:bg-[#333333] rounded-full text-sm sm:text-base font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
          id="btn-continue-step-name"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};

