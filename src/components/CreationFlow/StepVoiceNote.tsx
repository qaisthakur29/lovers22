import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Mic, Square, Play, Pause, Trash2, Volume2 } from 'lucide-react';

interface StepVoiceNoteProps {
  voiceNoteUrl?: string;
  voiceNoteDuration?: number;
  partnerName: string;
  onChangeVoiceNote: (url?: string, duration?: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepVoiceNote: React.FC<StepVoiceNoteProps> = ({
  voiceNoteUrl,
  voiceNoteDuration = 0,
  partnerName,
  onChangeVoiceNote,
  onNext,
  onBack
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setErrorMsg(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      // Audio context for waveform
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      drawLiveWaveform();

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        // Instant local object URL for zero delay playback
        const localBlobUrl = URL.createObjectURL(audioBlob);
        onChangeVoiceNote(localBlobUrl, recordingSeconds);

        // Convert base64 in background for permanent persistence
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          onChangeVoiceNote(base64data, recordingSeconds);
        };
        reader.readAsDataURL(audioBlob);

        stream.getTracks().forEach(track => track.stop());
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };

      recorder.start(200);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 59) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.warn('Microphone access issue:', err);
      setErrorMsg('Microphone access is unavailable in this environment. You can use our sample romantic voice note or continue without recording.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsRecording(false);
  };

  const drawLiveWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      analyserRef.current?.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * (canvas.height / 2);
        ctx.fillStyle = '#333333';
        ctx.fillRect(x, canvas.height / 2 - barHeight / 2, barWidth - 1, Math.max(3, barHeight));
        x += barWidth;
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current || !voiceNoteUrl) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioPlayerRef.current) {
      setPlaybackTime(audioPlayerRef.current.currentTime);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setPlaybackTime(0);
  };

  const loadSampleVoice = () => {
    onChangeVoiceNote(
      'https://actions.google.com/sounds/v1/ambiences/gentle_acoustic_breeze.ogg',
      24
    );
    setErrorMsg(null);
  };

  const formatSec = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full max-w-lg mx-auto text-center" id="form-step-voice-note">
      <h2 className="font-serif text-3xl sm:text-4xl text-[#333333] font-light tracking-tight mb-3">
        Some things are better heard in your voice.
      </h2>
      <p className="text-sm sm:text-base text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
        Leave a little message they'll hear when their surprise opens. Maximum 60 seconds.
      </p>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs sm:text-sm text-[#333333] text-left flex flex-col gap-2 shadow-sm">
          <span>{errorMsg}</span>
          <button
            type="button"
            onClick={loadSampleVoice}
            className="text-xs font-semibold text-black hover:underline self-start flex items-center gap-1"
          >
            <Volume2 className="w-3.5 h-3.5" /> Attach sample voice note
          </button>
        </div>
      )}

      {/* Voice note recorder UI */}
      <div className="mb-8 p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col items-center">
        {voiceNoteUrl ? (
          /* Recorded Player State */
          <div className="w-full space-y-4">
            <audio
              ref={audioPlayerRef}
              src={voiceNoteUrl}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleAudioEnded}
              className="hidden"
            />
            
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-mono text-gray-500">
                {formatSec(playbackTime)} / {formatSec(voiceNoteDuration || 24)}
              </span>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span>Saved ❤️</span>
              </span>
            </div>

            {/* Static visual waveform simulation */}
            <div className="h-12 w-full flex items-center justify-center gap-1 px-4 bg-gray-50 rounded-xl border border-gray-200">
              {[12, 24, 38, 20, 44, 32, 16, 40, 48, 28, 14, 36, 42, 22, 30, 46, 18, 26, 34, 12].map((h, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    isPlaying ? 'bg-black animate-pulse' : 'bg-gray-300'
                  }`}
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={togglePlayback}
                className="w-12 h-12 rounded-full bg-[#333333] text-white hover:bg-black flex items-center justify-center shadow-sm transition-all"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  onChangeVoiceNote(undefined, 0);
                  setIsPlaying(false);
                }}
                className="p-3 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors"
                title="Record again"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : isRecording ? (
          /* Active Recording State */
          <div className="w-full space-y-4">
            <div className="flex items-center justify-center gap-2 text-red-500 text-sm font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span>Recording... {formatSec(recordingSeconds)} / 1:00</span>
            </div>

            <canvas
              ref={canvasRef}
              width={300}
              height={60}
              className="w-full h-16 bg-gray-50 rounded-xl border border-gray-200"
            />

            <button
              type="button"
              onClick={stopRecording}
              className="px-6 py-3 bg-[#333333] text-white rounded-full text-sm font-medium hover:bg-black transition-all flex items-center gap-2 shadow-sm"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Finish Recording</span>
            </button>
          </div>
        ) : (
          /* Idle State */
          <div className="w-full flex flex-col items-center py-4">
            <button
              type="button"
              onClick={startRecording}
              className="w-16 h-16 rounded-full bg-gray-50 border border-gray-200 text-[#333333] hover:bg-black hover:text-white hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-sm mb-4"
            >
              <Mic className="w-7 h-7" />
            </button>
            <p className="text-sm font-medium text-[#333333]">
              Tap to record your voice note
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Speak naturally, just like a quiet phone call.
            </p>

            <button
              type="button"
              onClick={loadSampleVoice}
              className="mt-4 text-xs text-gray-500 hover:text-black hover:underline flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" /> Use romantic sample audio
            </button>
          </div>
        )}
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
          className="px-7 py-3.5 bg-[#333333] text-white hover:bg-black rounded-full text-sm sm:text-base font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
        >
          <span>{voiceNoteUrl ? 'Continue' : 'Skip & Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

