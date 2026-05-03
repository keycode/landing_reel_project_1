import { cn } from "../lib/utils";

export interface CampaignExpiredProps {
  className?: string;
}

export function CampaignExpired({ className }: CampaignExpiredProps) {
  return (
    <div className={cn("w-full h-dvh flex flex-col items-center justify-center bg-zinc-950 text-white p-6 text-center font-sans", className)}>
      <div className="max-w-md w-full p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl flex flex-col items-center relative overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
            <line x1="16" x2="16" y1="2" y2="6"/>
            <line x1="8" x2="8" y1="2" y2="6"/>
            <line x1="3" x2="21" y1="10" y2="10"/>
            <path d="m9 16 2 2 4-4"/>
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold mb-3 tracking-tight">Campaign Expired</h1>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          This interactive Reel is no longer available. The promotion or trial period has ended.
        </p>
        
        <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent mb-8" />
        
        <h2 className="text-lg font-semibold mb-2">Create immersive digital experiences</h2>
        <p className="text-sm text-zinc-500 mb-6">
          Engage your audience with mobile-first vertical scrollytelling.
        </p>
        
        <a 
          href="https://landingreel.com?ref=expired_campaign"
          className="w-full block py-3.5 px-4 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          Build your Free Reel
        </a>
      </div>
    </div>
  );
}
