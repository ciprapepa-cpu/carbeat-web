"use client";

import Image from "next/image";
import { useState, useCallback, useRef, useEffect } from "react";

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
  onSelect,
}: {
  photos: string[];
  alt: string;
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}) {
  const thumbStripRef = useRef<HTMLDivElement>(null);

  // Auto-scroll thumbnail strip to keep active thumbnail visible
  useEffect(() => {
    const strip = thumbStripRef.current;
    if (!strip) return;
    const thumb = strip.children[currentIndex] as HTMLElement | undefined;
    if (!thumb) return;
    const stripRect = strip.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    // If thumbnail is outside the visible area, scroll to center it
    if (thumbRect.left < stripRect.left || thumbRect.right > stripRect.right) {
      thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onNext();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPrev, onNext, onClose]);

  // Debounce wheel to prevent rapid-fire navigation
  const wheelTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleWheelDebounced = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      if (wheelTimeout.current) return;
      if (e.deltaY > 0 || e.deltaX > 0) {
        onNext();
      } else if (e.deltaY < 0 || e.deltaX < 0) {
        onPrev();
      }
      wheelTimeout.current = setTimeout(() => {
        wheelTimeout.current = null;
      }, 150);
    },
    [onNext, onPrev]
  );

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Swipe down to close on mobile
  const touchStartY = useRef<number | null>(null);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (deltaY > 80) onClose();
    touchStartY.current = null;
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col bg-black/95"
      onClick={onClose}
      onWheel={handleWheelDebounced}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3" onClick={(e) => e.stopPropagation()}>
        {/* Counter */}
        <div className="rounded-full bg-white/10 px-3 py-1.5 text-xs sm:text-sm text-white backdrop-blur-sm">
          {currentIndex + 1} / {photos.length}
        </div>

        <div className="flex items-center gap-2">
          {/* Minimize button */}
          <button
            onClick={onClose}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            aria-label="Zmenšit"
            title="Zmenšit"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="4 14 10 14 10 20" />
              <polyline points="20 10 14 10 14 4" />
              <line x1="14" y1="10" x2="21" y2="3" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            aria-label="Zavřít"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main image area */}
      <div className="relative flex flex-1 items-center justify-center min-h-0 px-2 sm:px-4">
        {/* Previous */}
        {photos.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-2 sm:left-4 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
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

        {/* Image */}
        <div
          className="relative w-full h-full max-w-[1400px] mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={photos[currentIndex]}
            alt={`${alt} - foto ${currentIndex + 1}`}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {/* Next */}
        {photos.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-2 sm:right-4 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
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
      </div>

      {/* Thumbnail strip */}
      {photos.length > 1 && (
        <div className="px-2 sm:px-4 py-2 sm:py-3" onClick={(e) => e.stopPropagation()}>
          <div
            ref={thumbStripRef}
            className="flex gap-1.5 sm:gap-2 overflow-x-auto justify-center scrollbar-hide"
            onWheel={(e) => {
              // Horizontal scroll with mouse wheel on thumbnail strip
              e.stopPropagation();
              const strip = thumbStripRef.current;
              if (strip) {
                strip.scrollLeft += e.deltaY;
              }
            }}
          >
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => onSelect(index)}
                className={`relative h-[44px] w-[64px] sm:h-[56px] sm:w-[80px] flex-shrink-0 overflow-hidden rounded-md sm:rounded-lg border-2 transition-all ${
                  index === currentIndex
                    ? "border-white ring-1 ring-white/40 opacity-100"
                    : "border-transparent opacity-50 hover:opacity-80"
                }`}
                aria-label={`Zobrazit foto ${index + 1}`}
              >
                <Image
                  src={photo}
                  alt={`${alt} - miniatura ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                  loading={index < 10 ? "eager" : "lazy"}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Gallery({ photos, alt }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const thumbStripRef = useRef<HTMLDivElement>(null);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  }, [photos.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  }, [photos.length]);

  // Keyboard navigation in main gallery (when lightbox is closed)
  useEffect(() => {
    if (lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); handlePrev(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); handleNext(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, handlePrev, handleNext]);

  // Auto-scroll thumbnail strip in main gallery
  useEffect(() => {
    const strip = thumbStripRef.current;
    if (!strip) return;
    const thumb = strip.children[activeIndex] as HTMLElement | undefined;
    if (!thumb) return;
    const stripRect = strip.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    if (thumbRect.left < stripRect.left || thumbRect.right > stripRect.right) {
      thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeIndex]);

  if (photos.length === 0) return null;

  return (
    <>
      {/* Main image */}
      <div className="group relative aspect-[16/9] overflow-hidden rounded-[20px] bg-bg">
        <Image
          src={photos[activeIndex]}
          alt={`${alt} - foto ${activeIndex + 1}`}
          fill
          className="object-cover cursor-zoom-in"
          sizes="(max-width: 768px) 100vw, 720px"
          priority
          onClick={() => setLightboxOpen(true)}
        />

        {/* Zoom button */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute top-3 right-3 z-[2] flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/60 opacity-0 group-hover:opacity-100"
          aria-label="Zvětšit"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
          </svg>
        </button>

        {/* Counter */}
        <div className="absolute top-3 left-3 z-[2] rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {activeIndex + 1} / {photos.length}
        </div>

        {/* Previous */}
        {photos.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-[2] flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/60 sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Předchozí"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* Next */}
        {photos.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-[2] flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/60 sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Další"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {photos.length > 1 && (
        <div
          ref={thumbStripRef}
          className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
        >
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
                loading={index < 6 ? "eager" : "lazy"}
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
          onSelect={setActiveIndex}
        />
      )}
    </>
  );
}
