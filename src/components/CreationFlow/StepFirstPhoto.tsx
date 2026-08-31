import React, { useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, Upload, RefreshCw, Trash2, Check } from 'lucide-react';
import { optimizeImage } from '../../utils/imageOptimizer';

interface StepFirstPhotoProps {
  firstPhoto: string;
  firstPhotoCaption: string;
  onChangeFirstPhoto: (photo: string) => void;
  onChangeCaption: (caption: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepFirstPhoto: React.FC<StepFirstPhotoProps> = ({
  firstPhoto,
  firstPhotoCaption,
  onChangeFirstPhoto,
  onChangeCaption,
  onNext,
  onBack
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const processFile = async (file: File) => {
    if (!file) return;
    setIsOptimizing(true);
    try {
      // 1. Instant local preview + background optimized compression
      const result = await optimizeImage(file, 1400, 1400, 0.85);
      onChangeFirstPhoto(result.dataUrl || result.previewUrl);
    } catch (err) {
      console.warn('Image processing fallback:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const isValid = firstPhoto.trim().length > 0;

  return (
    <div className="w-full max-w-lg mx-auto text-center" id="form-step-first-photo">
      <h2 className="font-serif text-3xl sm:text-4xl text-[#333333] font-light tracking-tight mb-3">
        Show me where it all began.
      </h2>
      <p className="text-sm sm:text-base text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
        Your first photo together, your favorite photo, or simply a moment that feels like you.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {firstPhoto ? (
        <div className="mb-8 text-left animate-in fade-in duration-300">
          <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white max-w-sm mx-auto group">
            <img
              src={firstPhoto}
              alt="First memory"
              className="w-full h-64 sm:h-72 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {isOptimizing && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-xs flex items-center justify-center">
                <span className="px-3 py-1 bg-black/75 text-white text-xs rounded-full font-medium shadow-sm">
                  Optimizing photo...
                </span>
              </div>
            )}

            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full text-gray-700 shadow-sm border border-gray-200 transition-colors cursor-pointer"
                title="Change photo"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onChangeFirstPhoto('')}
                className="p-2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full text-red-500 shadow-sm border border-gray-200 transition-colors cursor-pointer"
                title="Remove photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 max-w-sm mx-auto">
            <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1.5">
              Photo Caption <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={firstPhotoCaption}
              onChange={(e) => onChangeCaption(e.target.value)}
              placeholder="e.g. Our very first Polaroid together by the coast."
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-black text-[#333333] shadow-sm"
            />
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="mb-8 p-8 sm:p-12 rounded-2xl border-2 border-dashed border-gray-300 bg-white hover:border-black transition-all cursor-pointer flex flex-col items-center justify-center text-center group shadow-sm"
        >
          <div className="w-14 h-14 rounded-full bg-[#FAF8F5] text-gray-700 border border-gray-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-base font-medium text-[#333333] mb-1">
            Click to upload or drag & drop
          </p>
          <p className="text-xs text-gray-400">
            Instant compression • High visual quality
          </p>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 text-sm text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className="px-7 py-3.5 bg-[#333333] text-white hover:bg-black disabled:opacity-40 disabled:hover:bg-[#333333] rounded-full text-sm sm:text-base font-medium transition-all duration-200 flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};


