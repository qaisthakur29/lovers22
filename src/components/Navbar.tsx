import React from 'react';
import { HelpCircle, Eye, Sparkles } from 'lucide-react';

interface NavbarProps {
  onStartCreation: () => void;
  onOpenHowItWorks: () => void;
  onOpenDemo: () => void;
  onGoHome: () => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onStartCreation,
  onOpenHowItWorks,
  onOpenDemo,
  onGoHome,
  currentView
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-sm border-b border-gray-100 transition-all">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 h-20 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={onGoHome}
          className="text-left flex items-center focus:outline-none group"
          id="btn-brand-logo"
        >
          <span className="text-lg font-semibold tracking-widest text-[#333333]">
            FIRST WISH
          </span>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-6 sm:gap-10 text-sm tracking-wide font-medium text-gray-500">
          <button
            onClick={onOpenHowItWorks}
            className="hover:text-gray-900 transition-colors flex items-center gap-1.5"
            id="btn-nav-how-it-works"
          >
            <HelpCircle className="w-3.5 h-3.5 opacity-60" />
            <span className="hidden xs:inline">How it works</span>
          </button>

          <button
            onClick={onOpenDemo}
            className="hover:text-gray-900 transition-colors flex items-center gap-1.5"
            id="btn-nav-demo-preview"
          >
            <Eye className="w-3.5 h-3.5 opacity-60" />
            <span>Sample Demo</span>
          </button>

          {currentView === 'landing' && (
            <button
              onClick={onStartCreation}
              className="bg-[#333333] text-white px-6 py-2.5 rounded-full hover:bg-black transition-colors flex items-center gap-1.5 font-medium tracking-wide shadow-sm"
              id="btn-nav-create-surprise"
            >
              <span>Create a Surprise</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

