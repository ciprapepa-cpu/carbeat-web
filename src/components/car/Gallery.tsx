"use client";

import Image from "next/image";
import { useState, useCallback } from "react";

interface GalleryProps {
  photos: string[];
  alt: string;
}

function Lightbox({
  photos,
  alt,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  photos: string[];
  alt: string;
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        aria-label="Zavřít"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-4 z-10 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur-sm">
        {currentIndex + 1} / {photos.length}
      </div>

      {/* Previous */}
      {photos.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Předchozí"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Next */}
      {photos.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Další"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Image */}
      <div
        className="relative h-[80vh] w-[90vw] max-w-[1200px]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photos[currentIndex]}
          alt={`${alt} - foto ${currentIndex + 1}`}
          fill
          className="object-contain"
          sizes="90vw"
          priority
        />
      </div>
    </div>
  );
}

export default function Gallery({ photos, alt }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  }, [photos.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  }, [photos.length]);

  if (photos.length === 0) return null;

  return (
    <>
      {/* Main image */}
      <div
        className="relative aspect-[16/9] cursor-zoom-in overflow-hidden rounded-[20px] bg-bg"
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={photos[activeIndex]}
          alt={`${alt} - foto ${activeIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 720px"
          priority
        />
      </div>

      {/* Thumbnail strip */}
      {photos.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative h-[56px] w-[80px] flex-shrink-0 overflow-hidden rounded-[8px] border-2 transition-all ${
                index === activeIndex
                  ? "border-blue ring-2 ring-blue/30"
                  : "border-border opacity-70 hover:opacity-100"
              }`}
              aria-label={`Zobrazit foto ${index + 1}`}
            >
              <Image
                src={photo}
                alt={`${alt} - miniatura ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          photos={photos}
          alt={alt}
          currentIndex={activeIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </>
  );
}
