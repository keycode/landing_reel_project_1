"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "../lib/utils";
import { ReelContainer, ReelContainerRef } from "./ReelContainer";
import { ShotRenderer, ShotRendererProps } from "./ShotRenderer";
import { Watermark } from "./Watermark";

export interface ReelPlayerProps {
  shots: Omit<ShotRendererProps, "isActive">[];
  isPremium?: boolean;
  activeIndex?: number;
  onSlideChange?: (index: number) => void;
}

export function ReelPlayer({ 
  shots, 
  isPremium = false,
  activeIndex: externalActiveIndex,
  onSlideChange: externalOnSlideChange
}: ReelPlayerProps) {
  const [internalActiveIndex, setInternalActiveIndex] = useState(0);
  const [localShots, setLocalShots] = useState(shots);
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const containerRef = useRef<ReelContainerRef>(null);

  const activeIndex = externalActiveIndex !== undefined ? externalActiveIndex : internalActiveIndex;
  
  const handleSlideChange = (index: number) => {
    setInternalActiveIndex(index);
    if (externalOnSlideChange) externalOnSlideChange(index);
    // Send state back to parent if embedded in iframe
    if (typeof window !== "undefined" && window.parent !== window) {
      window.parent.postMessage({ type: "SLIDE_CHANGED", index }, "*");
    }
  };

  useEffect(() => {
    if (externalActiveIndex !== undefined && externalActiveIndex !== internalActiveIndex) {
      containerRef.current?.scrollTo(externalActiveIndex);
      setInternalActiveIndex(externalActiveIndex);
    }
  }, [externalActiveIndex]);

  // Sync state with parent iframe postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data) return;

      if (data.type === "SET_SLIDE" && typeof data.index === "number") {
        containerRef.current?.scrollTo(data.index);
        setInternalActiveIndex(data.index);
      } else if (data.type === "UPDATE_SHOTS" && Array.isArray(data.shots)) {
        setLocalShots(data.shots);
      } else if (data.type === "SET_EDITING_ELEMENT") {
        setEditingElementId(data.id);
      }
    };

    window.addEventListener("message", handleMessage);

    // Notify parent that the iframe is fully mounted and ready to receive state
    if (typeof window !== "undefined" && window.parent !== window) {
      window.parent.postMessage({ type: "IFRAME_READY" }, "*");
    }

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
      <ReelContainer ref={containerRef} onSlideChange={handleSlideChange} startIndex={activeIndex}>
        {localShots.map((shot, index) => (
          <ShotRenderer
            key={shot.id}
            {...shot}
            isActive={activeIndex === index}
            editingElementId={editingElementId}
          />
        ))}
      </ReelContainer>

      <div className="absolute right-[2px] bottom-[10%] flex flex-col gap-2 z-9999 h-[80%] justify-center items-end transition-all duration-500 font-sans pointer-events-none">
        {localShots.map((shot, index) => {
          const isSelected = activeIndex === index;
          const navLabel = shot.shotData?.navLabel || `Slide ${index + 1}`;
          
          return (
            <button

              key={shot.id || index}
              onClick={() => containerRef.current?.scrollTo(index)}
              className={cn(
                "pointer-events-auto group relative outline-none border-none cursor-pointer rounded-l-full transition-all duration-300 ease-in-out h-10 w-px pl-px ml-2 hover:bg-neutral-300 hover:w-[3px]",
                isSelected ? "w-[3px] bg-neutral-300" : "w-px bg-neutral-600"
              )}
            >
              {/* Anchor text placed to the left of the line */}
              <div
                className={cn(
                  "absolute right-[5px] top-1/2 -translate-y-1/2 whitespace-nowrap px-1 transition-all duration-300 pointer-events-none drop-shadow-md text-sm",
                  isSelected 
                    ? "opacity-100 font-medium text-white translate-x-0" 
                    : "opacity-0 text-white/70 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2"
                )}
              >
                {navLabel}
              </div>
            </button>
          );
        })}
      </div>

      {/* Render the watermark if it is a free tier user */}
      {!isPremium && <Watermark />}
    </div>
  );
}
