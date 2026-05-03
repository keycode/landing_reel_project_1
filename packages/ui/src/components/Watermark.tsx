import { cn } from "../lib/utils";

export interface WatermarkProps {
  className?: string;
}

export function Watermark({ className }: WatermarkProps) {
  return (
    <div className={cn("absolute bottom-6 right-4 z-50 pointer-events-auto", className)}>
      <a 
        href="https://landingreel.com?ref=watermark" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-xl hover:bg-white/30 transition-all duration-300"
      >
        <span className="text-[10px] uppercase tracking-wider opacity-90">⚡ Member of LandingReel</span>
      </a>
    </div>
  );
}
