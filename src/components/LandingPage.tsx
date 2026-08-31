import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Clock, ArrowRight, Play, CheckCircle2, ChevronDown, HelpCircle, Lock, Shield } from 'lucide-react';
import { sampleSurprises } from '../data/sampleSurprises';
import { SurpriseData } from '../types';

interface LandingPageProps {
  onStartCreation: () => void;
  onSelectSample: (sample: SurpriseData) => void;
  onOpenHowItWorks: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartCreation,
  onSelectSample,
  onOpenHowItWorks
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'locked' | 'unlocked'>('locked');

  const faqs = [
    {
      q: 'Can they open it before 12:00 AM?',
      a: 'No. The surprise is protected by server-side unlock timing. Before the scheduled time, they will only see a calm countdown with their name. At exactly 12:00 AM, the gifts bloom open.'
    },
    {
      q: 'Can I edit the AI-generated messages?',
      a: 'Yes, absolutely. Our AI crafts 12 intimate notes and a personal letter based on your memories, and you have complete freedom to edit, reword, or rewrite every single word.'
    },
    {
      q: 'What if I do not have a microphone for voice notes?',
      a: 'Voice notes are completely optional. You can record one, select our ambient audio track, or skip it entirely.'
    },
    {
      q: 'Is my data and photos private?',
      a: 'Yes. Only someone with your unique private link can view the page, and the contents remain completely private forever with no advertisements.'
    },
    {
      q: 'How much does it cost?',
      a: 'It is a single one-time payment of ₹69 per surprise. No subscriptions, no hidden fees.'
    }
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. HERO SECTION (Clean Minimalism Grid) */}
      <section className="w-full max-w-6xl mx-auto px-6 sm:px-12 pt-10 pb-20 sm:pt-16 sm:pb-28">
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column Text & CTAs */}
          <section className="flex flex-col gap-6 text-left">
            <div className="flex flex-col gap-2">
              <span className="font-serif text-sm italic text-gray-500">
                A little something for someone special.
              </span>
              <h1 className="font-serif text-5xl sm:text-6xl font-light leading-[1.15] text-[#333333]">
                Be the first person to make their birthday special.
              </h1>
            </div>

            <p className="text-base sm:text-lg leading-relaxed text-gray-600 max-w-md">
              Create a private birthday experience with your memories, photos, voice and words — then let it open exactly when the moment arrives.
            </p>

            <div className="flex flex-col gap-4 mt-2">
              <button
                onClick={onStartCreation}
                className="w-fit flex items-center gap-3 bg-transparent border border-[#333333] px-8 py-4 rounded-full text-base sm:text-lg hover:bg-[#FAF8F5] transition-colors text-[#333333]"
                id="btn-hero-create-surprise"
              >
                <span>Create Their First Wish</span>
                <span className="text-xl">→</span>
              </button>

              <div className="flex gap-6 text-sm text-gray-400 font-medium tracking-wide px-2">
                <span>Personalized</span>
                <span>•</span>
                <span>Private</span>
                <span>•</span>
                <span className="text-gray-600 font-semibold">₹69</span>
              </div>
            </div>
          </section>

          {/* Right Column (Minimalist Device Mockup) */}
          <section className="relative flex justify-center items-center py-6">
            <div className="relative w-[300px] sm:w-[320px] h-[550px] sm:h-[580px] bg-white rounded-[48px] shadow-2xl border-[8px] border-white ring-1 ring-gray-200 overflow-hidden">
              {/* Speaker Bar */}
              <div className="absolute top-0 w-full h-8 bg-white flex justify-center items-center z-10">
                <div className="w-16 h-1.5 bg-gray-100 rounded-full" />
              </div>

              {/* Screen Canvas */}
              <div className="w-full h-full bg-[#FAF8F5] flex flex-col justify-between pt-8 pb-4">
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  {/* Photo Frame */}
                  <div className="w-44 h-52 bg-white rounded-3xl shadow-sm mb-5 overflow-hidden flex items-center justify-center border border-gray-100">
                    <img
                      src={sampleSurprises[0].first_photo}
                      alt="Sarah"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h2 className="font-serif text-2xl italic text-[#333333] mb-1">
                    Happy Birthday, Sarah.
                  </h2>
                  <p className="text-xs text-gray-500 mb-5">
                    I made this just for you. ❤️
                  </p>

                  <div className="w-full h-px bg-gray-200 mb-4" />

                  <div className="flex flex-col gap-2.5 w-full">
                    <div className="bg-white p-3.5 rounded-2xl text-left shadow-sm border border-gray-100">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">First Memory</p>
                      <p className="text-xs leading-relaxed text-gray-700 italic">
                        "{sampleSurprises[0].favorite_memory.slice(0, 55)}..."
                      </p>
                    </div>
                    <div className="bg-white p-3.5 rounded-2xl text-left shadow-sm border border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Our Beginning</p>
                        <p className="text-xs text-gray-700">September 15, 2021</p>
                      </div>
                      <button
                        onClick={() => onSelectSample(sampleSurprises[0])}
                        className="text-[11px] font-medium text-[#333333] hover:underline"
                      >
                        Sample →
                      </button>
                    </div>
                  </div>
                </div>

                <div className="h-10 bg-white border-t border-gray-100 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-black" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                </div>
              </div>
            </div>

            {/* Floating "Unlocks at 12:00 AM" Card */}
            <div className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-4 bg-white p-5 sm:p-6 rounded-3xl shadow-xl border border-gray-100 flex flex-col gap-1 z-20">
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Unlocks at</span>
              <span className="font-serif text-2xl italic text-[#333333]">12:00 AM</span>
            </div>
          </section>
        </main>
      </section>

      {/* 2. INTERACTIVE PHONE PREVIEW TEST CARD */}
      <section className="w-full max-w-4xl mx-auto px-6 mb-20 sm:mb-28">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col items-center text-center">
          <span className="text-xs uppercase tracking-widest text-gray-400 font-medium mb-2">
            Interactive Experience
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#333333] font-light mb-8">
            How they experience it
          </h2>

          <div className="inline-flex items-center p-1 rounded-full bg-[#FAF8F5] border border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab('locked')}
              className={`px-5 py-2 rounded-full text-xs font-medium transition-all ${
                activeTab === 'locked'
                  ? 'bg-[#333333] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              1. Before Midnight (Locked Countdown)
            </button>
            <button
              onClick={() => setActiveTab('unlocked')}
              className={`px-5 py-2 rounded-full text-xs font-medium transition-all ${
                activeTab === 'unlocked'
                  ? 'bg-[#333333] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              2. At 12:00 AM (Unlocked Reveal)
            </button>
          </div>

          {/* Mini preview container */}
          <div className="w-full max-w-sm rounded-3xl overflow-hidden border border-gray-100 bg-[#FAF8F5] shadow-sm p-6 sm:p-8 text-center transition-all duration-300">
            {activeTab === 'locked' ? (
              <div className="animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-full bg-white text-[#333333] border border-gray-200 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">
                  A little surprise for you
                </span>
                <h3 className="font-serif text-2xl text-[#333333] font-light mb-4">
                  This is for you, Sarah.
                </h3>
                <div className="bg-white border border-gray-200 rounded-2xl py-3 px-5 inline-flex items-center gap-3 font-mono text-xl text-[#333333]">
                  <span>02</span>:<span>14</span>:<span className="text-gray-400">38</span>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Come back when the clock strikes 12.
                </p>
              </div>
            ) : (
              <div className="animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-full bg-white text-[#333333] border border-gray-200 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-5 h-5 fill-black/10 stroke-[#333333]" />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold block mb-1">
                  12:00 AM Unlocked
                </span>
                <h3 className="font-serif text-2xl italic text-[#333333] mb-2">
                  Happy Birthday, Sarah.
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  "12 Things I Want You To Know" • Voice Note • Personal Letter
                </p>
                <button
                  onClick={() => onSelectSample(sampleSurprises[0])}
                  className="px-5 py-2.5 bg-[#333333] text-white hover:bg-black rounded-full text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Explore full demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. THREE SIMPLE STEPS */}
      <section className="w-full max-w-5xl mx-auto px-6 mb-20 sm:mb-28 text-center">
        <span className="text-xs uppercase tracking-widest text-gray-400 font-medium block mb-2">
          Effortless Craft
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#333333] font-light mb-12">
          How to create their First Wish
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm">
            <span className="font-serif text-3xl text-gray-300 font-light block mb-4">
              01
            </span>
            <h3 className="text-base font-semibold text-[#333333] mb-2">
              Share your memories
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Answer 5 heartfelt questions, upload your first photo, and record an optional 60-second voice note.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm">
            <span className="font-serif text-3xl text-gray-300 font-light block mb-4">
              02
            </span>
            <h3 className="text-base font-semibold text-[#333333] mb-2">
              AI personalizes the experience
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              We quietly turn your memories into "12 Things I Want You To Know" and a warm personal letter that you can edit.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm">
            <span className="font-serif text-3xl text-gray-300 font-light block mb-4">
              03
            </span>
            <h3 className="text-base font-semibold text-[#333333] mb-2">
              Schedule & share the link
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Send your private link on WhatsApp. It locks with a calm countdown and unlocks automatically at 12:00 AM.
            </p>
          </div>
        </div>
      </section>

      {/* 4. SAMPLES GALLERY */}
      <section className="w-full max-w-5xl mx-auto px-6 mb-20 sm:mb-28 text-center">
        <span className="text-xs uppercase tracking-widest text-gray-400 font-medium block mb-2">
          Sample Experiences
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#333333] font-light mb-10">
          Loved by people who love deeply.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
          {sampleSurprises.map((sample) => (
            <div
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="p-6 sm:p-7 rounded-3xl bg-white hover:bg-[#FAF8F5] border border-gray-100 hover:border-gray-300 transition-all cursor-pointer group flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="rounded-2xl overflow-hidden aspect-[16/10] bg-[#FAF8F5] mb-5">
                  <img
                    src={sample.first_photo}
                    alt={sample.partner_name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif text-2xl text-[#333333]">
                    For {sample.partner_name}
                  </h3>
                  <span className="text-xs text-gray-400">
                    By {sample.sender_name}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-2 mt-2">
                  "{sample.favorite_memory}"
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-[#333333] font-medium">
                <span>View Sample Surprise</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="w-full max-w-3xl mx-auto px-6 mb-20 sm:mb-28 text-center">
        <span className="text-xs uppercase tracking-widest text-gray-400 font-medium block mb-2">
          Questions
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#333333] font-light mb-10">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3 text-left">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-gray-100 overflow-hidden transition-colors shadow-sm"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 sm:p-6 flex items-center justify-between text-left text-sm sm:text-base font-medium text-[#333333]"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    activeFaq === idx ? 'rotate-180 text-black' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-6 text-xs sm:text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. BOTTOM CTA */}
      <section className="w-full max-w-3xl mx-auto px-6 mb-20 text-center">
        <div className="p-10 sm:p-14 rounded-3xl bg-[#FAF8F5] border border-gray-200 flex flex-col items-center">
          <span className="font-serif text-sm italic text-gray-500 mb-2">
            A little something for someone special.
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#333333] font-light mb-3">
            Ready to make their birthday unforgettable?
          </h2>
          <p className="text-sm text-gray-500 max-w-sm mb-8">
            Create a gentle digital love letter that waits quietly until midnight.
          </p>

          <button
            onClick={onStartCreation}
            className="px-8 py-4 bg-[#333333] text-white hover:bg-black rounded-full text-base font-medium transition-all shadow-sm flex items-center gap-2"
          >
            <span>Create a Surprise for ₹69</span>
            <span className="text-lg">→</span>
          </button>
        </div>
      </section>

      {/* 7. FOOTER (Clean Minimalism) */}
      <footer className="w-full py-12 border-t border-gray-200/70 text-gray-400 text-xs tracking-wide">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex gap-8 sm:gap-12">
            <span>Beautifully Designed</span>
            <span>Simply Shared</span>
            <span>Endlessly Special</span>
          </div>
          <div>© {new Date().getFullYear()} First Wish</div>
        </div>
      </footer>
    </div>
  );
};

