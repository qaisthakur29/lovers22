/**
 * Fast client-side image optimizer and compressor.
 * Creates an instant zero-latency preview and compresses high-resolution photos
 * into lightweight, high-quality images in the background.
 */
export interface OptimizedImageResult {
  previewUrl: string;
  dataUrl: string;
}

export async function optimizeImage(
  file: File,
  maxWidth = 1280,
  maxHeight = 1280,
  quality = 0.82
): Promise<OptimizedImageResult> {
  const previewUrl = URL.createObjectURL(file);

  return new Promise((resolve) => {
    // If browser doesn't support canvas or image decoding, fallback immediately
    if (typeof window === 'undefined' || !window.createImageBitmap && !window.Image) {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          previewUrl,
          dataUrl: (e.target?.result as string) || previewUrl
        });
      };
      reader.onerror = () => resolve({ previewUrl, dataUrl: previewUrl });
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    img.onload = () => {
      try {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { alpha: false });

        if (!ctx) {
          throw new Error('Canvas 2D context unavailable');
        }

        // Smooth resampling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as webp if supported, else jpeg
        let dataUrl = '';
        try {
          dataUrl = canvas.toDataURL('image/webp', quality);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
        } catch {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve({
          previewUrl,
          dataUrl: dataUrl || previewUrl
        });
      } catch (err) {
        // Fallback to standard data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            previewUrl,
            dataUrl: (e.target?.result as string) || previewUrl
          });
        };
        reader.onerror = () => resolve({ previewUrl, dataUrl: previewUrl });
        reader.readAsDataURL(file);
      }
    };

    img.onerror = () => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          previewUrl,
          dataUrl: (e.target?.result as string) || previewUrl
        });
      };
      reader.onerror = () => resolve({ previewUrl, dataUrl: previewUrl });
      reader.readAsDataURL(file);
    };

    img.src = previewUrl;
  });
}
