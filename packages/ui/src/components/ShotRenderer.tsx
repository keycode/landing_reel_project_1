"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "../lib/utils";

export interface FreeFormElement {
  id: string;
  role?: string; // e.g. 'primary-text', 'secondary-text', 'button-cta', etc.
  type: "text" | "button" | "image";
  content: string;
  x: string; // percentage (e.g., '10%')
  y: string; // percentage
  width: string; // percentage or auto
  height?: string;
  fontSize?: string;
  color?: string;
  fontWeight?: string;
  textAlign?: "left" | "center" | "right";
}

export interface ShotData {
  navLabel?: string;
  elements?: FreeFormElement[];
}

export interface ShotRendererProps {
  id: string;
  type: "video" | "image" | "text" | "interactive";
  backgroundUrl?: string;
  shotData?: ShotData;
  isActive?: boolean;
  className?: string;
  editingElementId?: string | null;
}

export function ShotRenderer({ type, backgroundUrl, shotData, isActive = false, className, editingElementId }: ShotRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!isActive || !containerRef.current) return;
    
    // Core animation logic when a slide comes into view using GSAP
    gsap.fromTo(
      containerRef.current.children,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power3.out" }
    );
  }, { dependencies: [isActive], scope: containerRef });

  return (
    <div 
      className={cn("relative w-full h-full flex flex-col items-center justify-center overflow-hidden", className)}
      style={{
        backgroundImage: type === "image" && backgroundUrl ? `url(${backgroundUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {type === "video" && backgroundUrl && (
        <video 
          src={backgroundUrl} 
          loop 
          muted 
          playsInline 
          // Control playback based on active state to optimize performance
          autoPlay={isActive}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}
      
      {/* Dimmed overlay to ensure text readability */}
      {(type === "video" || type === "image") && (
        <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/30 to-black/80 z-10" />
      )}
      
      <div 
        ref={containerRef} 
        className="relative z-20 w-full h-full pointer-events-none"
      >
        {shotData?.elements?.map((el) => {
          if (el.type === "text") {
            const isEditing = editingElementId === el.id;
            return (
              <div
                key={el.id}
                id={el.id}
                className={cn("absolute pointer-events-auto leading-tight", isEditing && "opacity-0")}
                style={{
                  left: el.x,
                  top: el.y,
                  width: el.width,
                  height: el.height,
                  fontSize: el.fontSize || "1.5rem",
                  color: el.color || "#ffffff",
                  fontWeight: el.fontWeight || "bold",
                  textAlign: el.textAlign || "left",
                  visibility: isEditing ? "hidden" : "visible",
                }}
              >
                {el.content}
              </div>
            );
          }
          if (el.type === "button") {
            return (
              <button
                key={el.id}
                id={el.id}
                className="absolute pointer-events-auto bg-white text-black font-semibold rounded-2xl shadow-xl hover:bg-zinc-200 transition-colors flex items-center justify-center p-2"
                style={{
                  left: el.x,
                  top: el.y,
                  width: el.width,
                  height: el.height || "3rem",
                  fontSize: el.fontSize || "1.125rem",
                  color: el.color || "#000000",
                  visibility: editingElementId === el.id ? "hidden" : "visible",
                }}
              >
                {el.content}
              </button>
            );
          }
          return null;
        })}

        {type === "video" && (
           <div className="absolute bottom-8 left-0 right-0 animate-bounce opacity-80 flex justify-center w-full pointer-events-none">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        )}
      </div>
    </div>
  );
}
