"use client";

import React, { useEffect, useCallback, useImperativeHandle, forwardRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "../lib/utils";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

export interface ReelContainerProps {
  children: React.ReactNode;
  className?: string;
  onSlideChange?: (index: number) => void;
  startIndex?: number;
}

export interface ReelContainerRef {
  scrollTo: (index: number) => void;
}

export const ReelContainer = forwardRef<ReelContainerRef, ReelContainerProps>(
  ({ children, className, onSlideChange, startIndex = 0 }, ref) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(
      { 
        axis: "y", 
        dragFree: false, 
        loop: false, 
        align: "start",
        startIndex: startIndex
      },
      [WheelGesturesPlugin()]
    );

    useImperativeHandle(ref, () => ({
      scrollTo: (index: number) => {
        if (emblaApi) emblaApi.scrollTo(index);
      }
    }), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    onSlideChange?.(emblaApi.selectedScrollSnap());
  }, [emblaApi, onSlideChange]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
    }
  }, [children, emblaApi]);

  return (
    <div className={cn("overflow-hidden w-full h-full bg-black text-white relative", className)} ref={emblaRef}>
      <div className="flex flex-col touch-pan-y" style={{ height: "100%" }}>
        {React.Children.map(children, (child) => (
          <div className="flex-[0_0_100%] min-w-0 relative border-none outline-none" style={{ height: "100%", minHeight: "100%" }}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
});
ReelContainer.displayName = "ReelContainer";
