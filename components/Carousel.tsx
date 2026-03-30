"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselProps = {
  children: React.ReactNode;
  showArrows?: boolean;
  showArrowsDesktopOnly?: boolean;
  slidesToScroll?: number;
  loop?: boolean;
  className?: string;
  slideClassName?: string;
};

export function Carousel({
  children,
  showArrows = true,
  showArrowsDesktopOnly = true,
  slidesToScroll = 1,
  loop = false,
  className = "",
  slideClassName = "",
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop,
    align: "start",
    slidesToScroll,
    dragFree: true,
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const childrenArray = React.Children.toArray(children);

  return (
    <div className={`relative ${className}`}>
      {/* Carousel container */}
      <div className="embla" ref={emblaRef}>
        <div className="embla__container gap-4 md:gap-6">
          {childrenArray.map((child, index) => (
            <div key={index} className={`embla__slide ${slideClassName}`}>
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      {showArrows && (
        <div
          className={`${
            showArrowsDesktopOnly ? "hidden md:flex" : "flex"
          } items-center gap-3 absolute -top-16 right-0 md:right-20`}
        >
          <button
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            className={`flex h-14 w-14 items-center justify-center rounded-full border-2 border-woranz-slate bg-white text-woranz-slate transition-opacity ${
              prevBtnDisabled ? "cursor-not-allowed opacity-40" : "hover:bg-woranz-warm-1"
            }`}
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            className={`flex h-14 w-14 items-center justify-center rounded-full bg-white text-woranz-slate shadow-button transition-opacity ${
              nextBtnDisabled ? "cursor-not-allowed opacity-40" : "hover:bg-woranz-warm-1"
            }`}
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>
      )}
    </div>
  );
}

export function CarouselWithHeader({
  title,
  children,
  className = "",
  fullWidth = false,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    dragFree: true,
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const childrenArray = React.Children.toArray(children);

  return (
    <div className={`flex flex-col gap-6 md:gap-10 ${className}`}>
      {/* Header with title and arrows */}
      <div className={`flex items-center justify-between w-full ${fullWidth ? 'carousel-header-centered' : 'pr-6 md:pr-20'}`}>
        <h2 className="section-title text-woranz-slate">
          {title}
        </h2>
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            className={`flex h-14 w-14 items-center justify-center rounded-full bg-white text-woranz-slate shadow-button transition-all ${
              prevBtnDisabled
                ? "cursor-not-allowed opacity-40"
                : "hover:bg-woranz-warm-1 active:scale-95"
            }`}
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            className={`flex h-14 w-14 items-center justify-center rounded-full bg-white text-woranz-slate shadow-button transition-all ${
              nextBtnDisabled
                ? "cursor-not-allowed opacity-40"
                : "hover:bg-woranz-warm-1 active:scale-95"
            }`}
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="embla" ref={emblaRef}>
        <div className={`embla__container flex gap-4 md:gap-6 ${fullWidth ? 'carousel-slides-centered' : ''}`}>
          {childrenArray.map((child, index) => (
            <div key={index} className="embla__slide flex-shrink-0">
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
