import React, { useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, Plus, MoveUp, MoveDown, Trash2, Loader2 } from 'lucide-react';
import { PhotoItem } from '../../types';
import { optimizeImage } from '../../utils/imageOptimizer';

interface StepAdditionalPhotosProps {
  photos: PhotoItem[];
  onChangePhotos: (photos: PhotoItem[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepAdditionalPhotos: React.FC<StepAdditionalPhotosProps> = ({
  photos,
  onChangePhotos,
  onNext,
  onBack
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsProcessing(true);
      const fileList: File[] = (Array.from(files) as File[]).slice(0, 10 - photos.length);
      
      // Step 1: create instant local preview placeholders
      const placeholderItems: PhotoItem[] = fileList.map((file, idx) => {
        const previewUrl = URL.createObjectURL(file);
        return {
          id: 'photo-' + Date.now() + '-' + idx + '-' + Math.random().toString(36).substring(2, 5),
          url: previewUrl,
          caption: '',
          name: file.name
        };
      });

      const initialCombined = [...photos, ...placeholderItems];
      onChangePhotos(initialCombined);

      // Step 2: compress in background and update with optimized dataUrls
      try {
        const compressedList = await Promise.all(
          fileList.map((file) => optimizeImage(file, 1280, 1280, 0.82))
        );

        const updated = initialCombined.map((p) => {
          const matchedIdx = placeholderItems.findIndex((ph) => ph.id === p.id);
          if (matchedIdx !== -1 && compressedList[matchedIdx]) {
            return {
              ...p,
              url: compressedList[matchedIdx].dataUrl || p.url
            };
          }
          return p;
        });

        onChangePhotos(updated);
      } catch (err) {
        console.warn('Batch photo compression fallback:', err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleRemove = (id: string) => {
    onChangePhotos(photos.filter(p => p.id !== id));
  };

  const handleCaptionChange = (id: string, caption: string) => {
    onChangePhotos(photos.map(p => p.id === id ? { ...p, caption } : p));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= photos.length) return;
    const reordered = [...photos];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    onChangePhotos(reordered);
  };

  return (
    <div className="w-full max-w-xl mx-auto text-center" id="form-step-additional-photos">
      <h2 className="font-serif text-3xl sm:text-4xl text-[#333333] font-light tracking-tight mb-3">
        Give them a few more memories.
      </h2>
      <p className="text-sm sm:text-base text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
        Add 2 to 10 more pictures they love. We'll present them softly in their midnight surprise.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Grid of photos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 text-left">
        {photos.map((photo, idx) => (
          <div
            key={photo.id}
            className="group relative rounded-2xl overflow-hidden bg-white border border-gray-200 p-2 flex flex-col shadow-sm"
          >
            <div className="relative rounded-xl overflow-hidden aspect-square bg-gray-50">
              <img
                src={photo.url}
                alt="Memory"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => handleRemove(photo.id)}
                  className="p-1 bg-white/90 hover:bg-white rounded-full text-red-500 shadow-sm cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1">
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'up')}
                    className="p-1 bg-white/90 hover:bg-white rounded-full text-gray-700 shadow-sm cursor-pointer"
                    title="Move earlier"
                  >
                    <MoveUp className="w-3 h-3" />
                  </button>
                )}
                {idx < photos.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'down')}
                    className="p-1 bg-white/90 hover:bg-white rounded-full text-gray-700 shadow-sm cursor-pointer"
                    title="Move later"
                  >
                    <MoveDown className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            <input
              type="text"
              value={photo.caption || ''}
              onChange={(e) => handleCaptionChange(photo.id, e.target.value)}
              placeholder="Short note..."
              className="mt-2 w-full px-2 py-1 text-xs bg-transparent border-b border-gray-200 focus:border-black outline-none text-[#333333] placeholder:text-gray-400"
            />
          </div>
        ))}

        {photos.length < 10 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-2xl border-2 border-dashed border-gray-300 bg-white hover:border-black p-4 flex flex-col items-center justify-center text-center aspect-square transition-all group shadow-sm cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-[#FAF8F5] text-gray-700 border border-gray-200 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-[#333333]">
              {isProcessing ? 'Adding...' : 'Add Photos'}
            </span>
            <span className="text-[10px] text-gray-400 mt-0.5">({photos.length}/10)</span>
          </button>
        )}
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
          className="px-7 py-3.5 bg-[#333333] text-white hover:bg-black rounded-full text-sm sm:text-base font-medium transition-all duration-200 flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};


