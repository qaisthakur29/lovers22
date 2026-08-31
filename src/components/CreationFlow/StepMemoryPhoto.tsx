import React, { useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, Upload, RefreshCw, Trash2 } from 'lucide-react';
import { optimizeImage } from '../../utils/imageOptimizer';

interface StepMemoryPhotoProps {
  memoryPhoto: string;
  favoriteMemory: string;
  onChangeMemoryPhoto: (photo: string) => void;
  onChangeFavoriteMemory: (memory: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepMemoryPhoto: React.FC<StepMemoryPhotoProps> = ({
  memoryPhoto,
  favoriteMemory,
  onChangeMemoryPhoto,
  onChangeFavoriteMemory,
  onNext,
  onBack
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const processFile = async (file: File) => {
    if (!file) return;
    setIsOptimizing(true);
    try {
      const result = await optimizeImage(file, 1400, 1400, 0.85);
      onChangeMemoryPhoto(result.dataUrl || result.previewUrl);
    } catch (err) {
      console.warn('Memory photo process fallback:', err);
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

  const isValid = favoriteMemory.trim().length > 5;

  return (
    <div className="w-full max-w-lg mx-auto text-center" id="form-step-memory-photo">
      <h2 className="font-serif text-3xl sm:text-4xl text-[#333333] font-light tracking-tight mb-3">
        A moment you'll never forget.
      </h2>
      <p className="text-sm sm:text-base text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
        Tell us the memory. Then add the photo that belongs with it.
      </p>

      <div className="space-y-6 text-left mb-8">
        <div>
          <label htmlFor="input-favorite-memory" className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">
            The Memory in your words
          </label>
          <textarea
            id="input-favorite-memory"
            value={favoriteMemory}
            onChange={(e) => onChangeFavoriteMemory(e.target.value)}
            rows={4}
            placeholder="e.g. The night we drove up to the hilltop observatory at 2 AM with a blanket, listening to acoustic guitar in the car while looking down at the quiet city lights..."
            className="w-full px-5 py-3.5 text-base sm:text-lg bg-white border border-gray-200 focus:border-black rounded-2xl outline-none transition-all placeholder:text-gray-300 text-[#333333] resize-none leading-relaxed shadow-sm"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">
            Photo from this memory <span className="text-gray-400 font-normal">(optional but special)</span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {memoryPhoto ? (
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white max-w-xs group">
              <img
                src={memoryPhoto}
                alt="Favorite memory"
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {isOptimizing && (
                <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
                  <span className="px-2 py-0.5 bg-black/75 text-white text-[11px] rounded-full">
                    Optimizing...
                  </span>
                </div>
              )}

              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 bg-white/90 rounded-full text-gray-700 shadow-sm hover:bg-white cursor-pointer"
                  title="Change"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onChangeMemoryPhoto('')}
                  className="p-1.5 bg-white/90 rounded-full text-red-500 shadow-sm hover:bg-white cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-4 rounded-xl border border-dashed border-gray-300 bg-white hover:bg-gray-50 hover:border-black transition-colors flex items-center justify-center gap-2 text-sm text-gray-600 shadow-sm cursor-pointer"
            >
              <Upload className="w-4 h-4 text-gray-400" />
              <span>Attach a photo for this memory</span>
            </button>
          )}
        </div>
      </div>

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


