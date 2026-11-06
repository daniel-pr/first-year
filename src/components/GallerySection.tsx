import React, { useState, useEffect, useCallback } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, Maximize2, Sparkles, Heart } from 'lucide-react';
import { useAnniversary } from '../context/AnniversaryContext';

export const GallerySection: React.FC = () => {
  const { config } = useAnniversary();
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // All 20 photos
  const photos = config.photos;

  const handleOpenLightbox = (index: number) => {
    setActivePhotoIndex(index);
  };

  const handleCloseLightbox = () => {
    setActivePhotoIndex(null);
  };

  const handlePrev = useCallback(() => {
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex - 1 + photos.length) % photos.length);
    }
  }, [activePhotoIndex, photos.length]);

  const handleNext = useCallback(() => {
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex + 1) % photos.length);
    }
  }, [activePhotoIndex, photos.length]);

  // Lock body scroll when Lightbox is active
  useEffect(() => {
    if (activePhotoIndex !== null) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [activePhotoIndex]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') handleCloseLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, handlePrev, handleNext]);

  // Preload adjacent images for instantaneous navigation
  useEffect(() => {
    if (activePhotoIndex !== null && photos.length > 0) {
      const nextIdx = (activePhotoIndex + 1) % photos.length;
      const prevIdx = (activePhotoIndex - 1 + photos.length) % photos.length;
      [nextIdx, prevIdx].forEach(idx => {
        if (photos[idx]?.url) {
          const img = new Image();
          img.src = photos[idx].url;
        }
      });
    }
  }, [activePhotoIndex, photos]);

  // Mobile Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  const handleImageError = (id: string) => {
    setImageErrorMap(prev => ({ ...prev, [id]: true }));
  };

  return (
    <section id="galeria" className="py-20 md:py-28 relative scroll-mt-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#735c00] mb-2">
            <Camera className="w-4 h-4 text-[#d4af37]" />
            <span>Nossos Momentos Especiais</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#2a0006] tracking-tight mb-4">
            Galeria de Memórias
          </h2>
          <p className="text-sm sm:text-base text-[#544343] leading-relaxed">
            Vinte retratos que contam a história do nosso amor. Clique em qualquer foto para ampliar e ver a legenda.
          </p>
        </div>

        {/* Responsive Grid: 2 columns on mobile, 3 columns on computer / desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8 items-start">
          {photos.map((photo, index) => {
            const rot = photo.rotation ?? (index % 2 === 0 ? -1.2 : 1.2);
            const isError = imageErrorMap[photo.id];
            const photoNumberFormatted = String(index + 1).padStart(2, '0');

            return (
              <div
                key={photo.id || index}
                onClick={() => handleOpenLightbox(index)}
                style={{ transform: `rotate(${rot}deg)` }}
                className="polaroid-frame rounded-lg p-2.5 sm:p-3.5 cursor-pointer bg-white border border-[#d9c1c1]/40 group hover:border-[#d4af37]/70 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative select-none"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenLightbox(index);
                  }
                }}
                aria-label={`Foto ${index + 1} de ${photos.length}`}
              >
                {/* Photo Container: Clean image with no text on card */}
                <div className="relative aspect-square w-full overflow-hidden rounded-md bg-[#eae8e4]">
                  {!isError ? (
                    <img
                      src={photo.url}
                      alt={`Foto ${photoNumberFormatted}`}
                      referrerPolicy="no-referrer"
                      onError={() => handleImageError(photo.id)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    /* Elegant, Romantic Placeholder if photo is not yet in public/fotos/ */
                    <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-[#fffdfa] via-[#fbf7f0] to-[#f4ece1] border border-dashed border-[#d4af37]/40 relative overflow-hidden">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#fdf2f4] border border-[#d4af37]/40 flex items-center justify-center text-[#4a0e17] mb-2 shadow-xs group-hover:scale-110 transition-transform">
                        <Camera className="w-5 h-5 text-[#d4af37]" />
                      </div>
                      <span className="font-serif text-sm sm:text-base font-semibold text-[#2a0006]">
                        Foto {photoNumberFormatted}
                      </span>
                      <span className="text-[10px] sm:text-xs text-[#867273] font-mono mt-1 px-1.5 py-0.5 rounded bg-white/70 border border-[#d9c1c1]/50 max-w-full truncate">
                        foto-{photoNumberFormatted}.jpg
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-[#735c00] mt-1 italic hidden sm:block">
                        Adicione em /public/fotos/
                      </span>
                    </div>
                  )}

                  {/* Hover Overlay with Lightbox indicator */}
                  <div className="absolute inset-0 bg-[#4a0e17]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="p-2 sm:p-2.5 rounded-full bg-white/95 text-[#4a0e17] shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>

                  {/* Subtle Inner Highlight */}
                  <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_12px_rgba(0,0,0,0.08)]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Lightbox Modal (Full view with captions and photo navigation) */}
        {activePhotoIndex !== null && photos[activePhotoIndex] && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 select-none animate-in fade-in duration-200"
            onClick={handleCloseLightbox}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseLightbox}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
              aria-label="Fechar galeria"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
              aria-label="Próxima foto"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Active Modal Container */}
            <div
              className="max-w-3xl w-full max-h-[92vh] bg-white rounded-xl p-3 sm:p-5 shadow-2xl relative flex flex-col items-center justify-center border border-[#d4af37]/30"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Photo Display */}
              <div className="relative w-full max-h-[70vh] overflow-hidden rounded-lg bg-[#eae8e4] flex items-center justify-center">
                {!imageErrorMap[photos[activePhotoIndex].id] ? (
                  <img
                    src={photos[activePhotoIndex].url}
                    alt={photos[activePhotoIndex].caption || `Foto ${activePhotoIndex + 1}`}
                    referrerPolicy="no-referrer"
                    onError={() => handleImageError(photos[activePhotoIndex].id)}
                    className="max-h-[68vh] w-auto max-w-full object-contain rounded"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-64 sm:h-80 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#fffdfa] to-[#f4ece1]">
                    <div className="w-16 h-16 rounded-full bg-[#fdf2f4] border border-[#d4af37] flex items-center justify-center text-[#4a0e17] mb-3">
                      <Camera className="w-8 h-8 text-[#d4af37]" />
                    </div>
                    <span className="font-serif text-xl font-semibold text-[#2a0006]">
                      Foto {String(activePhotoIndex + 1).padStart(2, '0')}
                    </span>
                    <p className="text-xs text-[#544343] mt-2 max-w-xs">
                      Arquivo: <code className="text-[#4a0e17] bg-white px-2 py-0.5 rounded border border-[#d9c1c1]">public/fotos/foto-{String(activePhotoIndex + 1).padStart(2, '0')}.jpg</code>
                    </p>
                  </div>
                )}
              </div>

              {/* Caption and Navigation Details */}
              <div className="w-full pt-3 sm:pt-4 px-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[#d9c1c1]/40 mt-3">
                <div className="text-center sm:text-left">
                  <h3 className="font-serif text-base sm:text-lg font-semibold text-[#2a0006]">
                    {photos[activePhotoIndex].caption}
                  </h3>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-[#867273] mt-0.5">
                    <span>{photos[activePhotoIndex].date}</span>
                    {photos[activePhotoIndex].location && (
                      <>
                        <span>•</span>
                        <span>{photos[activePhotoIndex].location}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#735c00] bg-[#fbf7f0] px-3 py-1 rounded-full border border-[#d4af37]/35">
                    Foto {activePhotoIndex + 1} de {photos.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
