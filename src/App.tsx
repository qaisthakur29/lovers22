import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { HowItWorksModal } from './components/HowItWorksModal';
import { AdminOverviewModal } from './components/AdminOverviewModal';

// Creation Steps
import { StepIndicator } from './components/CreationFlow/StepIndicator';
import { FloatingLiveElement } from './components/CreationFlow/FloatingLiveElement';
import { StepPartnerName } from './components/CreationFlow/StepPartnerName';
import { StepNickname } from './components/CreationFlow/StepNickname';
import { StepBeginning } from './components/CreationFlow/StepBeginning';
import { StepFirstPhoto } from './components/CreationFlow/StepFirstPhoto';
import { StepMemoryPhoto } from './components/CreationFlow/StepMemoryPhoto';
import { StepAdditionalPhotos } from './components/CreationFlow/StepAdditionalPhotos';
import { StepPersonalQuestions } from './components/CreationFlow/StepPersonalQuestions';
import { StepVoiceNote } from './components/CreationFlow/StepVoiceNote';
import { StepAudioMusic } from './components/CreationFlow/StepAudioMusic';
import { StepGeneration } from './components/CreationFlow/StepGeneration';

// Next Phases
import { InteractivePreview } from './components/InteractivePreview';
import { Scheduling } from './components/Scheduling';
import { PricingPayment } from './components/PricingPayment';
import { SuccessShare } from './components/SuccessShare';

// Recipient Views
import { RecipientLockedView } from './components/Recipient/RecipientLockedView';
import { RecipientMidnightUnlock } from './components/Recipient/RecipientMidnightUnlock';
import { RecipientNotFoundView } from './components/Recipient/RecipientNotFoundView';

import { SurpriseData, PhotoItem, PublicSurpriseResponse } from './types';
import { sampleSurprises } from './data/sampleSurprises';

export default function App() {
  // Navigation views: 'landing' | 'creation' | 'preview' | 'scheduling' | 'payment' | 'success' | 'recipient'
  const [currentView, setCurrentView] = useState<string>('landing');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Modals
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isAdminOverviewOpen, setIsAdminOverviewOpen] = useState(false);

  // Active surprise being built
  const [surprise, setSurprise] = useState<SurpriseData>(() => ({
    id: 'surprise-' + Date.now(),
    partner_name: '',
    sender_name: '',
    nickname: 'Love',
    relationship_start_date: '2023-04-15',
    how_we_met: '',
    first_photo: '',
    first_photo_caption: '',
    favorite_memory: '',
    memory_photo: '',
    additional_photos: [],
    love_most: '',
    never_told: '',
    favorite_thing: '',
    wish_for_year: '',
    special_note: '',
    voice_note_url: '',
    voice_note_duration: 0,
    song_title: '',
    song_url: '',
    generated_messages: [],
    personal_letter: '',
    unlock_at: new Date(Date.now() + 3600000 * 4).toISOString(),
    created_at: new Date().toISOString(),
    payment_status: 'pending',
    share_token: 'wish-' + Math.random().toString(36).substring(2, 9)
  }));

  // Share Token state
  const [generatedShareToken, setGeneratedShareToken] = useState<string>('');

  // Recipient public data when viewing via share link
  const [activeRecipientToken, setActiveRecipientToken] = useState<string>('');
  const [publicData, setPublicData] = useState<PublicSurpriseResponse | null>(null);
  const [recipientSurprise, setRecipientSurprise] = useState<SurpriseData | null>(null);
  const [recipientLoading, setRecipientLoading] = useState(false);
  const [recipientError, setRecipientError] = useState<'not_found' | 'unpaid' | 'general' | null>(null);

  // Recipient Data Loader from Server
  const loadRecipientSurprise = useCallback(async (token: string, simulateUnlocked = false) => {
    if (!token) return;
    setRecipientLoading(true);
    setRecipientError(null);
    setActiveRecipientToken(token);

    try {
      const endpoint = `/api/surprises/${encodeURIComponent(token)}${simulateUnlocked ? '?simulate_unlocked=true' : ''}`;
      const res = await fetch(endpoint);
      
      if (res.status === 404) {
        setRecipientError('not_found');
        setCurrentView('recipient');
        return;
      }
      
      if (res.status === 403 || res.status === 402) {
        setRecipientError('unpaid');
        setCurrentView('recipient');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to load surprise');
      }

      const data: PublicSurpriseResponse = await res.json();
      setPublicData(data);
      
      if (data.is_unlocked && data.surprise) {
        setRecipientSurprise(data.surprise);
      } else {
        setRecipientSurprise(null);
      }
      
      setCurrentView('recipient');
    } catch (err: any) {
      console.error('Error fetching recipient surprise:', err);
      setRecipientError('not_found');
      setCurrentView('recipient');
    } finally {
      setRecipientLoading(false);
    }
  }, []);

  // Handle URL Path on initial load and browser back/forward
  useEffect(() => {
    const handleUrlRoute = () => {
      const pathname = window.location.pathname;
      const match = pathname.match(/^\/s\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        const token = match[1];
        loadRecipientSurprise(token);
      } else if (currentView === 'recipient') {
        setCurrentView('landing');
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, [loadRecipientSurprise, currentView]);

  const handleStartCreation = () => {
    setCurrentStepIndex(0);
    setCurrentView('creation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSample = (sample: SurpriseData) => {
    setSurprise(sample);
    setCurrentView('preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step Update Handlers
  const handleUpdate = (fields: Partial<SurpriseData>) => {
    setSurprise((prev) => ({ ...prev, ...fields }));
  };

  const handleGoHome = () => {
    if (window.location.pathname.startsWith('/s/')) {
      window.history.pushState({}, '', '/');
    }
    setRecipientError(null);
    setPublicData(null);
    setRecipientSurprise(null);
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalSteps = 10;

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#333333] flex flex-col selection:bg-gray-200">
      {/* Top Navbar */}
      {currentView !== 'recipient' && (
        <Navbar
          onStartCreation={handleStartCreation}
          onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
          onOpenDemo={() => handleSelectSample(sampleSurprises[0])}
          onGoHome={handleGoHome}
          currentView={currentView}
        />
      )}

      {/* Main Container */}
      <main className="flex-1 flex flex-col">
        {/* 1. LANDING PAGE */}
        {currentView === 'landing' && (
          <LandingPage
            onStartCreation={handleStartCreation}
            onSelectSample={handleSelectSample}
            onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
          />
        )}

        {/* 2. CREATION WIZARD */}
        {currentView === 'creation' && (
          <div className="relative w-full max-w-3xl mx-auto px-4 py-8 sm:py-12 flex-1 flex flex-col justify-between">
            <FloatingLiveElement
              currentStepIndex={currentStepIndex}
              partnerName={surprise.partner_name}
            />

            <StepIndicator
              currentStepIndex={currentStepIndex}
              totalSteps={totalSteps}
            />

            <div className="my-auto py-4">
              {currentStepIndex === 0 && (
                <StepPartnerName
                  partnerName={surprise.partner_name}
                  senderName={surprise.sender_name}
                  onChangePartnerName={(val) => handleUpdate({ partner_name: val })}
                  onChangeSenderName={(val) => handleUpdate({ sender_name: val })}
                  onNext={() => setCurrentStepIndex(1)}
                  onBack={() => setCurrentView('landing')}
                />
              )}

              {currentStepIndex === 1 && (
                <StepNickname
                  nickname={surprise.nickname}
                  partnerName={surprise.partner_name}
                  onChangeNickname={(val) => handleUpdate({ nickname: val })}
                  onNext={() => setCurrentStepIndex(2)}
                  onBack={() => setCurrentStepIndex(0)}
                />
              )}

              {currentStepIndex === 2 && (
                <StepBeginning
                  startDate={surprise.relationship_start_date}
                  howWeMet={surprise.how_we_met}
                  partnerName={surprise.partner_name}
                  onChangeStartDate={(val) => handleUpdate({ relationship_start_date: val })}
                  onChangeHowWeMet={(val) => handleUpdate({ how_we_met: val })}
                  onNext={() => setCurrentStepIndex(3)}
                  onBack={() => setCurrentStepIndex(1)}
                />
              )}

              {currentStepIndex === 3 && (
                <StepFirstPhoto
                  firstPhoto={surprise.first_photo}
                  firstPhotoCaption={surprise.first_photo_caption || ''}
                  onChangeFirstPhoto={(val) => handleUpdate({ first_photo: val })}
                  onChangeCaption={(val) => handleUpdate({ first_photo_caption: val })}
                  onNext={() => setCurrentStepIndex(4)}
                  onBack={() => setCurrentStepIndex(2)}
                />
              )}

              {currentStepIndex === 4 && (
                <StepMemoryPhoto
                  memoryPhoto={surprise.memory_photo || ''}
                  favoriteMemory={surprise.favorite_memory}
                  onChangeMemoryPhoto={(val) => handleUpdate({ memory_photo: val })}
                  onChangeFavoriteMemory={(val) => handleUpdate({ favorite_memory: val })}
                  onNext={() => setCurrentStepIndex(5)}
                  onBack={() => setCurrentStepIndex(3)}
                />
              )}

              {currentStepIndex === 5 && (
                <StepAdditionalPhotos
                  photos={surprise.additional_photos || []}
                  onChangePhotos={(photos: PhotoItem[]) => handleUpdate({ additional_photos: photos })}
                  onNext={() => setCurrentStepIndex(6)}
                  onBack={() => setCurrentStepIndex(4)}
                />
              )}

              {currentStepIndex === 6 && (
                <StepPersonalQuestions
                  partnerName={surprise.partner_name}
                  loveMost={surprise.love_most}
                  neverTold={surprise.never_told}
                  favoriteThing={surprise.favorite_thing}
                  wishForYear={surprise.wish_for_year}
                  specialNote={surprise.special_note}
                  onChangeLoveMost={(val) => handleUpdate({ love_most: val })}
                  onChangeNeverTold={(val) => handleUpdate({ never_told: val })}
                  onChangeFavoriteThing={(val) => handleUpdate({ favorite_thing: val })}
                  onChangeWishForYear={(val) => handleUpdate({ wish_for_year: val })}
                  onChangeSpecialNote={(val) => handleUpdate({ special_note: val })}
                  onNext={() => setCurrentStepIndex(7)}
                  onBack={() => setCurrentStepIndex(5)}
                />
              )}

              {currentStepIndex === 7 && (
                <StepVoiceNote
                  voiceNoteUrl={surprise.voice_note_url}
                  voiceNoteDuration={surprise.voice_note_duration}
                  partnerName={surprise.partner_name}
                  onChangeVoiceNote={(url, dur) => handleUpdate({ voice_note_url: url, voice_note_duration: dur })}
                  onNext={() => setCurrentStepIndex(8)}
                  onBack={() => setCurrentStepIndex(6)}
                />
              )}

              {currentStepIndex === 8 && (
                <StepAudioMusic
                  songTitle={surprise.song_title}
                  songUrl={surprise.song_url}
                  onChangeAudio={(title, url) => handleUpdate({ song_title: title, song_url: url })}
                  onNext={() => setCurrentStepIndex(9)}
                  onBack={() => setCurrentStepIndex(7)}
                />
              )}

              {currentStepIndex === 9 && (
                <StepGeneration
                  surprise={surprise}
                  onUpdateGeneratedContent={(messages, letter) =>
                    handleUpdate({ generated_messages: messages, personal_letter: letter })
                  }
                  onNext={() => {
                    setCurrentView('preview');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onBack={() => setCurrentStepIndex(8)}
                />
              )}
            </div>
          </div>
        )}

        {/* 3. INTERACTIVE PREVIEW */}
        {currentView === 'preview' && (
          <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12">
            <InteractivePreview
              surprise={surprise}
              onNext={() => {
                setCurrentView('scheduling');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBack={() => {
                setCurrentStepIndex(9);
                setCurrentView('creation');
              }}
            />
          </div>
        )}

        {/* 4. SCHEDULING */}
        {currentView === 'scheduling' && (
          <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12">
            <Scheduling
              unlockAt={surprise.unlock_at}
              partnerName={surprise.partner_name}
              onChangeUnlockAt={(iso) => handleUpdate({ unlock_at: iso })}
              onNext={() => {
                setCurrentView('payment');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBack={() => setCurrentView('preview')}
            />
          </div>
        )}

        {/* 5. PRICING & PAYMENT */}
        {currentView === 'payment' && (
          <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12">
            <PricingPayment
              surprise={surprise}
              onUpdateUnlockAt={(iso) => handleUpdate({ unlock_at: iso })}
              onPaymentSuccess={(token) => {
                setGeneratedShareToken(token);
                handleUpdate({ share_token: token, payment_status: 'paid' });
                setCurrentView('success');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBack={() => setCurrentView('scheduling')}
            />
          </div>
        )}

        {/* 6. SUCCESS & SHARE */}
        {currentView === 'success' && (
          <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12">
            <SuccessShare
              surprise={surprise}
              shareToken={generatedShareToken || surprise.share_token}
              onOpenRecipientView={() => {
                const token = generatedShareToken || surprise.share_token;
                window.history.pushState({}, '', `/s/${token}`);
                loadRecipientSurprise(token);
              }}
              onCreateAnother={() => {
                setSurprise({
                  id: 'surprise-' + Date.now(),
                  partner_name: '',
                  sender_name: '',
                  nickname: 'Love',
                  relationship_start_date: '2023-04-15',
                  how_we_met: '',
                  first_photo: '',
                  first_photo_caption: '',
                  favorite_memory: '',
                  memory_photo: '',
                  additional_photos: [],
                  love_most: '',
                  never_told: '',
                  favorite_thing: '',
                  wish_for_year: '',
                  special_note: '',
                  voice_note_url: '',
                  voice_note_duration: 0,
                  song_title: '',
                  song_url: '',
                  generated_messages: [],
                  personal_letter: '',
                  unlock_at: new Date(Date.now() + 3600000 * 4).toISOString(),
                  created_at: new Date().toISOString(),
                  payment_status: 'pending',
                  share_token: 'wish-' + Math.random().toString(36).substring(2, 9)
                });
                setGeneratedShareToken('');
                setCurrentStepIndex(0);
                setCurrentView('creation');
              }}
            />
          </div>
        )}

        {/* 7. RECIPIENT EXPERIENCE VIEW */}
        {currentView === 'recipient' && (
          <div className="min-h-screen w-full bg-[#FAF8F5]">
            {recipientLoading ? (
              <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 select-none">
                <div className="w-12 h-12 rounded-full bg-white border border-[#E8E2D9] text-[#333333] flex items-center justify-center animate-pulse mb-4 shadow-xs">
                  <span className="font-serif text-lg">✦</span>
                </div>
                <p className="font-serif text-xl text-[#333333] font-light">Opening your surprise...</p>
              </div>
            ) : recipientError ? (
              <RecipientNotFoundView
                isUnpaid={recipientError === 'unpaid'}
                onGoHome={handleGoHome}
              />
            ) : publicData?.is_unlocked && recipientSurprise ? (
              <RecipientMidnightUnlock
                surprise={recipientSurprise}
                onReplay={() => {}}
              />
            ) : publicData ? (
              <RecipientLockedView
                partnerName={publicData.partner_name}
                senderName={publicData.sender_name}
                unlockAt={publicData.unlock_at}
                onSimulateUnlock={() => {
                  const token = activeRecipientToken || generatedShareToken || surprise.share_token;
                  loadRecipientSurprise(token, true);
                }}
              />
            ) : null}
          </div>
        )}
      </main>

      {/* Modals */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onStartCreation={handleStartCreation}
      />

      <AdminOverviewModal
        isOpen={isAdminOverviewOpen}
        onClose={() => setIsAdminOverviewOpen(false)}
        onSelectSurprise={(s) => {
          setIsAdminOverviewOpen(false);
          handleSelectSample(s);
        }}
      />
    </div>
  );
}
