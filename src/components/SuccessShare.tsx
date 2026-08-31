import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, ExternalLink, MessageCircle, Clock, Heart } from 'lucide-react';
import { SurpriseData } from '../types';

interface SuccessShareProps {
  surprise: SurpriseData;
  shareToken: string;
  onOpenRecipientView: () => void;
  onCreateAnother: () => void;
}

export const SuccessShare: React.FC<SuccessShareProps> = ({
  surprise,
  shareToken,
  onOpenRecipientView,
  onCreateAnother
}) => {
  const [copied, setCopied] = useState(false);

  // Determine the best base URL (custom domain env var, or current browser window origin)
  const baseUrl = (
    (typeof import.meta !== 'undefined' && (import.meta.env.VITE_APP_URL || import.meta.env.NEXT_PUBLIC_APP_URL)) ||
    (typeof window !== 'undefined' ? window.location.origin : 'https://firstwish.com')
  ).replace(/\/$/, '');

  const fullShareUrl = `${baseUrl}/s/${shareToken}`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(fullShareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = fullShareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  // Format the unlock timestamp (e.g. September 15, 2026 · 12:00 AM)
  const formatUnlockAt = (isoStr?: string) => {
    if (!isoStr) return 'Midnight · 12:00 AM';
    try {
      const dateObj = new Date(isoStr);
      const month = dateObj.toLocaleDateString(undefined, { month: 'long' });
      const day = dateObj.toLocaleDateString(undefined, { day: 'numeric' });
      const hours = dateObj.getHours();
      const mins = dateObj.getMinutes();
      const isMidnight = hours === 0 && mins === 0;

      let timeStr = '12:00 AM';
      if (!isMidnight) {
        timeStr = dateObj.toLocaleTimeString(undefined, {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      }
      return `${month} ${day} · ${timeStr}`;
    } catch {
      return 'September 15 · 12:00 AM';
    }
  };

  // Safe WhatsApp message without exposing inner surprise content
  const whatsappText = encodeURIComponent(
    `A little surprise for you. ❤️\nOpen this at 12:00 AM:\n${fullShareUrl}`
  );

  return (
    <div className="w-full max-w-lg mx-auto text-center" id="section-success-share">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full"
      >
        <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#E8E2D9] flex items-center justify-center text-[#333333] mx-auto mb-5 shadow-xs">
          <Heart className="w-7 h-7 fill-gray-300 stroke-[#333333]" />
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl text-[#333333] font-light tracking-tight mb-2">
          It's ready. ❤️
        </h1>
        
        <p className="text-sm sm:text-base text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
          Your private birthday surprise has been created.
        </p>

        {/* Link Box */}
        <div className="p-7 sm:p-9 rounded-[32px] bg-white border border-gray-200 shadow-sm text-left mb-6">
          <span className="text-xs uppercase tracking-widest font-semibold text-gray-400 block mb-2">
            Your private link
          </span>

          <div className="flex items-center gap-2 bg-[#FAF8F5] border border-gray-200 rounded-2xl p-2 pl-4 mb-4">
            <span className="w-full bg-transparent text-sm sm:text-base text-[#333333] font-mono truncate select-all">
              {fullShareUrl}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="px-5 py-2.5 bg-[#333333] text-white hover:bg-black rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              id="btn-copy-link-primary"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>

          {/* WhatsApp Primary Share Button */}
          <a
            href={`https://api.whatsapp.com/send?text=${whatsappText}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/30 rounded-2xl text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-xs mb-6"
            id="btn-whatsapp-share"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Share on WhatsApp</span>
          </a>

          {/* Unlock Time Reminder */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span className="text-gray-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>Unlocks at</span>
            </span>
            <span className="font-semibold text-[#333333]">
              {formatUnlockAt(surprise.unlock_at)}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onOpenRecipientView}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#333333] text-white hover:bg-black rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
            id="btn-open-recipient-page"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Recipient Page</span>
          </button>

          <button
            type="button"
            onClick={onCreateAnother}
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 hover:text-[#333333] rounded-full text-sm font-medium transition-colors"
          >
            <span>Create Another Wish</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
