"use client";

import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { SmartImage } from "@/components/SmartImage";

export function TourGallery({ images, alt, theme }: { images: string[]; alt: string; theme: string }) {
  const imgs = Array.from(new Set(images));
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const next = useCallback(() => setIdx((i) => (i + 1) % imgs.length), [imgs.length]);
  const prev = useCallback(() => setIdx((i) => (i - 1 + imgs.length) % imgs.length), [imgs.length]);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onClosePointer = (e: Event) => {
      const target = e.target;
      if (target instanceof Element && target.closest("[data-gallery-close]")) {
        e.preventDefault();
        close();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("pointerdown", onClosePointer, true);
    document.addEventListener("click", onClosePointer, true);
    document.addEventListener("touchend", onClosePointer, true);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("pointerdown", onClosePointer, true);
      document.removeEventListener("click", onClosePointer, true);
      document.removeEventListener("touchend", onClosePointer, true);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, next, prev]);

  const openAt = (i: number) => {
    setIdx(i);
    setOpen(true);
  };

  return (
    <>
      <div className="grid h-[300px] grid-cols-3 grid-rows-2 gap-2.5 sm:h-[440px]">
        <button
          onClick={() => openAt(0)}
          className="group relative col-span-3 row-span-2 overflow-hidden rounded-2xl sm:col-span-2"
        >
          <SmartImage src={imgs[0]} alt={alt} theme={theme} className="absolute inset-0" imgClassName="transition-transform duration-700 group-hover:scale-105" sizes="(max-width:768px) 100vw, 66vw" priority />
          <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
            <Expand className="h-3.5 w-3.5" /> View gallery
          </span>
        </button>
        {imgs.slice(1, 3).map((src, i) => {
          const realIndex = i + 1;
          const isLast = i === 1;
          const extra = imgs.length - 3;
          return (
            <button
              key={src + i}
              onClick={() => openAt(realIndex)}
              className="group relative hidden overflow-hidden rounded-2xl sm:block"
            >
              <SmartImage src={src} alt={`${alt} photo ${realIndex + 1}`} theme={theme} className="absolute inset-0" imgClassName="transition-transform duration-700 group-hover:scale-105" sizes="33vw" />
              {isLast && extra > 0 && (
                <span className="absolute inset-0 flex items-center justify-center bg-ink/55 text-lg font-bold text-white">
                  +{extra} more
                </span>
              )}
            </button>
          );
        })}
      </div>

      {open && (
        <div className="fixed inset-0 z-[80] flex flex-col bg-ink/95 backdrop-blur" role="dialog" aria-modal="true">
          <button
            type="button"
            data-gallery-close
            aria-label="Close gallery"
            onPointerUp={(event) => {
              event.preventDefault();
              event.stopPropagation();
              close();
            }}
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
              close();
            }}
            onTouchEnd={(event) => {
              event.preventDefault();
              event.stopPropagation();
              close();
            }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              close();
            }}
            className="fixed right-4 top-4 z-[100] flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white shadow-lift ring-1 ring-white/20 backdrop-blur transition hover:bg-white/25"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative z-20 flex items-center justify-between p-4 pr-20 text-white">
            <span className="text-sm font-semibold">{idx + 1} / {imgs.length}</span>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4 pb-4">
            <button onClick={prev} aria-label="Previous" className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:left-8">
              <ChevronLeft className="h-7 w-7" />
            </button>
            <div className="relative h-full w-full max-w-5xl">
              <SmartImage src={imgs[idx]} alt={`${alt} photo ${idx + 1}`} theme={theme} className="absolute inset-0" imgClassName="object-contain" sizes="100vw" />
            </div>
            <button onClick={next} aria-label="Next" className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:right-8">
              <ChevronRight className="h-7 w-7" />
            </button>
          </div>
          <div className="flex justify-center gap-2 overflow-x-auto p-4">
            {imgs.map((src, i) => (
              <button
                key={src + i}
                onClick={() => setIdx(i)}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg ring-2 transition ${i === idx ? "ring-coral-400" : "ring-transparent opacity-60 hover:opacity-100"}`}
              >
                <SmartImage src={src} alt="" theme={theme} className="absolute inset-0" sizes="80px" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
