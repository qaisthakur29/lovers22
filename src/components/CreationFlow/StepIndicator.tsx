import React from 'react';

interface StepIndicatorProps {
  currentStepIndex: number;
  totalSteps: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStepIndex,
  totalSteps
}) => {
  const currentFormatted = String(currentStepIndex + 1).padStart(2, '0');
  const totalFormatted = String(totalSteps).padStart(2, '0');
  const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <div className="w-full max-w-md mx-auto mb-8 sm:mb-12">
      <div className="flex items-center justify-between text-xs text-gray-400 font-medium tracking-wider mb-2.5">
        <span>Step {currentFormatted} of {totalFormatted}</span>
        <span className="text-gray-400 text-xs uppercase tracking-widest font-semibold">First Wish</span>
      </div>
      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#333333] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

