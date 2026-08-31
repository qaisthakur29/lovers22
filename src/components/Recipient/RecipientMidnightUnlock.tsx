import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Play, Pause, ChevronRight, ChevronLeft, Volume2, Sparkles, Mail, RotateCcw, ArrowRight } from 'lucide-react';
import { SurpriseData } from '../../types';

interface RecipientMidnightUnlockProps {
  surprise: SurpriseData;
  onReplay?: () => void;
  onFinishPreview?: () => void;
}

export const RecipientMidnightUnlock: React.FC<RecipientMidnightUnlockProps> = ({
  surprise,
  onReplay,
  onFinishPreview
}) => {
  const [currentSection, setCurrentSection] = useState<
    'intro' | 'first_memory' | 'beginning' | 'twelve_things' | 'voice' | 'letter' | 'final'
  >('intro');

  const [messageIndex, setMessageIndex] = useState(0);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [voiceProgress, setVoiceProgress] = useState(0);
  const [bgMusicPlaying, setBgMusicPlaying] = useState(false);

  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);

  // Progressive Image Preloading for instant transitions
  useEffect(() => {
    const imagesToPreload: string[] = [];
    if (currentSection === 'intro' && surprise.first_photo) {
      imagesToPreload.push(surprise.first_photo);
    } else if (currentSection === 'first_memory' && surprise.memory_photo) {
      imagesToPreload.push(surprise.memory_photo);
    } else if (currentSection === 'beginning' && surprise.additional_photos?.length) {
      imagesToPreload.push(surprise.additional_photos[0].url);
    }

    imagesToPreload.forEach((src) => {
      if (src && !src.startsWith('data:')) {
        const img = new Image();
        img.src = src;
      }
    });
  }, [currentSection, surprise]);

  // Toggle background music
  const toggleBgMusic = () => {
    if (!bgAudioRef.current || !surprise.song_url) return;
    if (bgMusicPlaying) {
      bgAudioRef.current.pause();
      setBgMusicPlaying(false);
    } else {
      bgAudioRef.current.play().catch(() => {});
      setBgMusicPlaying(true);
    }
  };

  const toggleVoiceAudio = () => {
    if (!voiceAudioRef.current || !surprise.voice_note_url) return;
    if (isVoicePlaying) {
      voiceAudioRef.current.pause();
      setIsVoicePlaying(false);
    } else {
      // pause bg music if playing voice
      if (bgMusicPlaying && bgAudioRef.current) {
        bgAudioRef.current.pause();
        setBgMusicPlaying(false);
      }
      voiceAudioRef.current.play().catch(() => {});
      setIsVoicePlaying(true);
    }
  };

  const handleVoiceTimeUpdate = () => {
    if (voiceAudioRef.current) {
      const dur = voiceAudioRef.current.duration || surprise.voice_note_duration || 30;
      setVoiceProgress((voiceAudioRef.current.currentTime / dur) * 100);
    }
  };

  const handleNextSection = () => {
    if (currentSection === 'intro') setCurrentSection('first_memory');
    else if (currentSection === 'first_memory') setCurrentSection('beginning');
    else if (currentSection === 'beginning') setCurrentSection('twelve_things');
    else if (currentSection === 'twelve_things') setCurrentSection('voice');
    else if (currentSection === 'voice') setCurrentSection('letter');
    else if (currentSection === 'letter') setCurrentSection('final');
  };

  const handlePrevSection = () => {
    if (currentSection === 'first_memory') setCurrentSection('intro');
    else if (currentSection === 'beginning') setCurrentSection('first_memory');
    else if (currentSection === 'twelve_things') setCurrentSection('beginning');
    else if (currentSection === 'voice') setCurrentSection('twelve_things');
    else if (currentSection === 'letter') setCurrentSection('voice');
    else if (currentSection === 'final') setCurrentSection('letter');
  };

  const restartAll = () => {
    setMessageIndex(0);
    setIsLetterOpen(false);
    setIsVoicePlaying(false);
    if (voiceAudioRef.current) voiceAudioRef.current.pause();
    setCurrentSection('intro');
    if (onReplay) onReplay();
  };

  const messages = surprise.generated_messages || [];

  return (
    <div className="relative min-h-screen w-full bg-[#FAF8F5] text-[#333333] flex flex-col justify-between overflow-x-hidden selection:bg-gray-200">
      {/* Background Audio */}
      {surprise.song_url && (
        <audio
          ref={bgAudioRef}
          src={surprise.song_url}
          loop
          className="hidden"
        />
      )}

      {/* Voice Note Audio */}
      {surprise.voice_note_url && (
        <audio
          ref={voiceAudioRef}
          src={surprise.voice_note_url}
          onTimeUpdate={handleVoiceTimeUpdate}
          onEnded={() => setIsVoicePlaying(false)}
          className="hidden"
        />
      )}

      {/* Top Bar Navigation */}
      <header className="relative z-20 px-6 py-5 flex items-center justify-between max-w-2xl mx-auto w-full">
        <div className="text-[11px] font-semibold tracking-widest uppercase text-gray-400">
          FIRST WISH
        </div>

        {/* Music toggle */}
        {surprise.song_url && (
          <button
            onClick={toggleBgMusic}
            className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all ${
              bgMusicPlaying
                ? 'bg-white border-[#333333] text-[#333333]'
                : 'bg-white border-gray-200 text-gray-500 hover:text-black'
            }`}
          >
            <Volume2 className={`w-3.5 h-3.5 ${bgMusicPlaying ? 'text-black animate-pulse' : ''}`} />
            <span>{bgMusicPlaying ? 'Music Playing' : 'Play Music'}</span>
          </button>
        )}
      </header>

      {/* Main Experiential Canvas */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* 1. INTRO / MIDNIGHT BLOOM */}
          {currentSection === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center w-full py-8"
            >
              <span className="font-serif text-sm italic text-gray-500 block mb-3">
                A little something for someone special.
              </span>

              <h1 className="font-serif text-4xl sm:text-5xl text-[#333333] font-light tracking-tight mb-3">
                Happy Birthday, {surprise.partner_name || 'Sarah'}.
              </h1>

              <p className="text-base sm:text-lg text-gray-600 font-light max-w-sm mx-auto mb-10 leading-relaxed">
                I made this just for you. ❤️
              </p>

              <button
                onClick={handleNextSection}
                className="px-8 py-4 bg-[#333333] text-white hover:bg-black rounded-full text-base font-medium transition-all duration-300 flex items-center gap-2.5 mx-auto shadow-sm active:scale-[0.98]"
              >
                <span>Open Your Surprise</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* 2. GIFT 1 — FIRST MEMORY */}
          {currentSection === 'first_memory' && (
            <motion.div
              key="first_memory"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
              className="text-center w-full"
            >
              <span className="text-xs uppercase tracking-widest text-gray-400 block mb-2 font-medium">
                Gift 01
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#333333] font-light mb-6">
                Let's start with this one.
              </h2>

              <div className="relative rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-white p-3 max-w-sm mx-auto mb-6">
                <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-[#F6F1ED]">
                  <img
                    src={surprise.first_photo || 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80'}
                    alt="First Memory"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
                  />
                </div>
                {surprise.first_photo_caption && (
                  <p className="font-serif italic text-xs text-gray-500 mt-2.5 px-2 text-center">
                    "{surprise.first_photo_caption}"
                  </p>
                )}
              </div>

              <div className="max-w-sm mx-auto mb-8 bg-white p-5 rounded-2xl border border-gray-100 text-left shadow-sm">
                <h3 className="font-serif text-base text-[#333333] font-medium mb-1">
                  Do you remember this day?
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {surprise.favorite_memory || "Every little moment since this day has quietly become my favorite memory."}
                </p>
              </div>

              <div className="flex items-center justify-between max-w-sm mx-auto">
                <button
                  onClick={handlePrevSection}
                  className="px-4 py-2 text-xs text-gray-500 hover:text-black rounded-full flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleNextSection}
                  className="px-6 py-3 bg-[#333333] text-white hover:bg-black rounded-full text-sm font-medium transition-all flex items-center gap-2 shadow-sm"
                >
                  <span>Our Beginning</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* 3. GIFT 2 — OUR BEGINNING */}
          {currentSection === 'beginning' && (
            <motion.div
              key="beginning"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
              className="text-center w-full"
            >
              <span className="text-xs uppercase tracking-widest text-gray-400 block mb-2 font-medium">
                Gift 02
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#333333] font-light mb-6">
                This is where our story began.
              </h2>

              <div className="space-y-4 max-w-sm mx-auto mb-8 text-left">
                {/* Beginning Card */}
                <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>How We Met</span>
                  </div>
                  <p className="text-sm sm:text-base text-[#333333] font-serif leading-relaxed italic">
                    "{surprise.how_we_met || "A moment that quietly turned into our entire world."}"
                  </p>
                </div>

                {surprise.relationship_start_date && (
                  <div className="p-4 rounded-2xl bg-white border border-gray-100 flex items-center justify-between text-xs shadow-sm">
                    <span className="text-gray-500">Chapter One Date</span>
                    <span className="font-semibold text-[#333333]">
                      {new Date(surprise.relationship_start_date).toLocaleDateString(undefined, {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}

                {/* Additional Memory Photo */}
                {surprise.memory_photo && (
                  <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm aspect-[16/10] bg-[#F6F1ED]">
                    <img
                      src={surprise.memory_photo}
                      alt="Special moment"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between max-w-sm mx-auto">
                <button
                  onClick={handlePrevSection}
                  className="px-4 py-2 text-xs text-gray-500 hover:text-black rounded-full flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleNextSection}
                  className="px-6 py-3 bg-[#333333] text-white hover:bg-black rounded-full text-sm font-medium transition-all flex items-center gap-2 shadow-sm"
                >
                  <span>12 Things</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* 4. GIFT 3 — 12 THINGS */}
          {currentSection === 'twelve_things' && (
            <motion.div
              key="twelve_things"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="text-center w-full max-w-md mx-auto"
            >
              <div className="mb-2">
                <span className="font-serif text-5xl sm:text-6xl text-[#333333] font-light block leading-none">
                  12
                </span>
                <span className="text-xs uppercase tracking-widest text-gray-500 font-medium block mt-2">
                  Things I want you to know
                </span>
              </div>

              {/* Progress counter */}
              <div className="flex items-center justify-center gap-1.5 my-4">
                {messages.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === messageIndex ? 'w-6 bg-[#333333]' : 'w-1.5 bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              {/* Card Reveal */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={messageIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 sm:p-10 rounded-3xl bg-white border border-gray-100 shadow-sm min-h-[220px] flex flex-col justify-between my-4 text-center"
                >
                  <span className="text-xs font-mono text-gray-400">
                    #{String(messageIndex + 1).padStart(2, '0')}
                  </span>
                  
                  <p className="font-serif text-xl sm:text-2xl text-[#333333] font-normal leading-relaxed my-auto italic">
                    "{messages[messageIndex]}"
                  </p>

                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                    {surprise.partner_name} & {surprise.sender_name}
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* Carousel Controls */}
              <div className="flex items-center justify-between gap-3 mt-4">
                <button
                  onClick={() => setMessageIndex(Math.max(0, messageIndex - 1))}
                  disabled={messageIndex === 0}
                  className="px-4 py-2.5 bg-white border border-gray-200 text-gray-600 disabled:opacity-30 rounded-full text-xs font-medium flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {messageIndex < messages.length - 1 ? (
                  <button
                    onClick={() => setMessageIndex(messageIndex + 1)}
                    className="px-6 py-2.5 bg-[#333333] text-white hover:bg-black rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Next ({messageIndex + 1}/12)</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleNextSection}
                    className="px-6 py-2.5 bg-[#333333] text-white hover:bg-black rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Hear My Voice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* 5. GIFT 4 — VOICE NOTE */}
          {currentSection === 'voice' && (
            <motion.div
              key="voice"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
              className="text-center w-full max-w-sm mx-auto"
            >
              <span className="text-xs uppercase tracking-widest text-gray-400 block mb-2 font-medium">
                Gift 04
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#333333] font-light mb-3">
                I wanted you to hear this from me.
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-8 leading-relaxed">
                Press play for a little message left in my voice.
              </p>

              {/* Audio player card */}
              <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm mb-8 flex flex-col items-center">
                <button
                  onClick={toggleVoiceAudio}
                  className="w-16 h-16 rounded-full bg-[#333333] hover:bg-black text-white flex items-center justify-center shadow-md transition-transform active:scale-95 mb-6"
                >
                  {isVoicePlaying ? (
                    <Pause className="w-7 h-7" />
                  ) : (
                    <Play className="w-7 h-7 ml-1 fill-current" />
                  )}
                </button>

                {/* Animated Waveform */}
                <div className="h-10 w-full flex items-center justify-center gap-1.5 px-4">
                  {[14, 28, 42, 22, 48, 32, 18, 44, 52, 30, 16, 38, 46, 24, 34, 50, 20, 28, 36, 14].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-200 ${
                        isVoicePlaying
                          ? 'bg-[#333333] animate-pulse'
                          : 'bg-gray-200'
                      }`}
                      style={{
                        height: isVoicePlaying ? `${Math.max(6, (h * Math.random()) + 10)}px` : `${h}px`
                      }}
                    />
                  ))}
                </div>

                <div className="w-full bg-gray-100 h-1 rounded-full mt-6 overflow-hidden">
                  <div
                    className="h-full bg-[#333333] transition-all duration-300"
                    style={{ width: `${voiceProgress}%` }}
                  />
                </div>

                <span className="text-[11px] text-gray-400 mt-3 block">
                  Voice Note from {surprise.sender_name || 'Me'}
                </span>
              </div>

              <div className="flex items-center justify-between max-w-sm mx-auto">
                <button
                  onClick={handlePrevSection}
                  className="px-4 py-2 text-xs text-gray-500 hover:text-black rounded-full flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleNextSection}
                  className="px-6 py-3 bg-[#333333] text-white hover:bg-black rounded-full text-sm font-medium transition-all flex items-center gap-2 shadow-sm"
                >
                  <span>The Letter</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* 6. GIFT 5 — ENVELOPE & PERSONAL LETTER */}
          {currentSection === 'letter' && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
              className="text-center w-full max-w-lg mx-auto"
            >
              <span className="text-xs uppercase tracking-widest text-gray-400 block mb-2 font-medium">
                Gift 05
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#333333] font-light mb-2">
                One last thing.
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-6">
                A personal letter written just for tonight.
              </p>

              {!isLetterOpen ? (
                /* Interactive Closed Envelope */
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsLetterOpen(true)}
                  className="p-10 rounded-3xl bg-white border border-gray-200 shadow-sm cursor-pointer my-6 flex flex-col items-center justify-center max-w-sm mx-auto group transition-all"
                >
                  <div className="w-16 h-16 rounded-full bg-[#FAF8F5] text-[#333333] border border-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Mail className="w-8 h-8" />
                  </div>
                  <span className="font-serif text-lg text-[#333333] mb-1">
                    For {surprise.partner_name || 'Sarah'}
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Tap to open letter →
                  </span>
                </motion.div>
              ) : (
                /* Open Letter Unfolded */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="p-8 sm:p-10 rounded-3xl bg-white border border-gray-200 shadow-sm text-left my-4 max-h-[60vh] overflow-y-auto"
                >
                  <div className="text-right text-xs font-serif italic text-gray-400 mb-4">
                    Midnight Wish
                  </div>
                  <div className="font-serif text-base sm:text-lg text-[#333333] leading-loose whitespace-pre-line">
                    {surprise.personal_letter}
                  </div>
                </motion.div>
              )}

              <div className="flex items-center justify-between max-w-lg mx-auto mt-6">
                <button
                  onClick={handlePrevSection}
                  className="px-4 py-2 text-xs text-gray-500 hover:text-black rounded-full flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleNextSection}
                  className="px-6 py-3 bg-[#333333] text-white hover:bg-black rounded-full text-sm font-medium transition-all flex items-center gap-2 shadow-sm"
                >
                  <span>Final Birthday Wish</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* 7. FINAL SCREEN */}
          {currentSection === 'final' && (
            <motion.div
              key="final"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center w-full max-w-sm mx-auto py-6"
            >
              {/* Favorite photo frame */}
              <div className="relative rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-white p-3 max-w-[260px] mx-auto mb-6">
                <div className="rounded-2xl overflow-hidden aspect-square bg-[#F6F1ED]">
                  <img
                    src={
                      surprise.additional_photos?.[0]?.url ||
                      surprise.first_photo ||
                      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80'
                    }
                    alt="Birthday memory"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <p className="font-serif italic text-base sm:text-lg text-gray-600 max-w-xs mx-auto mb-4 leading-relaxed">
                "I hope this is the first thing that makes you smile today."
              </p>

              <h2 className="font-serif text-3xl sm:text-4xl text-[#333333] font-light mb-2">
                Happy Birthday, {surprise.partner_name || 'Sarah'}.
              </h2>

              <p className="text-sm font-medium text-gray-600 mb-6">
                From, {surprise.sender_name || 'Alex'} ❤️
              </p>

              <div className="flex flex-col gap-2.5 max-w-xs mx-auto mb-4">
                {onFinishPreview && (
                  <button
                    type="button"
                    onClick={onFinishPreview}
                    className="w-full py-3.5 bg-[#333333] hover:bg-black text-white rounded-full text-xs sm:text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    id="btn-finish-preview-send"
                  >
                    <span>Ready to send it? ❤️</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={restartAll}
                  className="w-full py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-[#333333] rounded-full text-xs font-medium transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
                  <span>Replay your surprise</span>
                </button>
              </div>

              <div className="mt-6 text-[11px] text-gray-400">
                Made with love through First Wish.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer step indicators */}
      <footer className="relative z-10 py-4 px-6 max-w-md mx-auto w-full flex items-center justify-center gap-2 text-xs text-gray-400">
        <span>Beautifully Designed</span>
        <span>•</span>
        <span>Simply Shared</span>
        <span>•</span>
        <span>Endlessly Special</span>
      </footer>
    </div>
  );
};

