import Link from "next/link";
import { Button } from "@landingreel/ui";

// Mock data for initial dashboard view
const mockLandings = [
  { id: "1", title: "Summer Campaign 2026", status: "Active", views: 1240 },
  { id: "2", title: "Feature Showcase: Magic Edit", status: "Draft", views: 0 },
  { id: "3", title: "Legacy Winter Promo", status: "Expired", views: 8900 },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-16 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-neutral-200 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-heading text-neutral-900">
              LandingReel
            </h1>
            <p className="text-lg text-neutral-600 mt-2">
              Manage your high-converting vertical swipable landing pages.
            </p>
          </div>
          <Link href="/editor/new">
            <Button size="lg" className="bg-primary text-white hover:bg-orange-600 transition-colors font-semibold shadow-lg shadow-primary/20">
              + Create New Reel
            </Button>
          </Link>
        </header>

        {/* Dashboard Grid */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-heading">My Reels</h2>
            <span className="text-sm text-neutral-500">{mockLandings.length} Total</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockLandings.map((landing) => (
              <div 
                key={landing.id} 
                className="group relative flex flex-col bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-neutral-200/50"
              >
                {/* Visual Thumbnail Area (Mock) */}
                <div className="h-48 bg-neutral-100 relative overflow-hidden flex items-center justify-center border-b border-neutral-100">
                  <div className="absolute inset-0 bg-linear-to-b from-transparent to-white/90 z-10" />
                  <span className="text-neutral-300 text-6xl font-black group-hover:scale-110 transition-transform duration-500 font-heading">
                    9:16
                  </span>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border ${landing.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' :
                        landing.status === 'Draft' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                          'bg-red-100 text-red-700 border-red-200'
                    }`}>
                      {landing.status}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold truncate group-hover:text-primary text-neutral-900 transition-colors font-heading">
                    {landing.title}
                  </h3>
                  <p className="text-neutral-500 text-sm mt-1 mb-6 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    {landing.views.toLocaleString()} views
                  </p>
                  
                  {/* Actions */}
                  <div className="mt-auto flex gap-3 pt-4 border-t border-neutral-100">
                    <Link href={`/editor/view-${landing.id}`} className="flex-1">
                      <Button variant="outline" className="w-full justify-center bg-transparent border-neutral-300 text-neutral-700 hover:bg-neutral-50 hover:text-black hover:border-neutral-400">
                        Edit Reel
                      </Button>
                    </Link>
                    <Link href={`http://localhost:4321/view-${landing.id}`} target="_blank" className="flex-1">
                      <Button className="w-full justify-center bg-neutral-900 hover:bg-black text-white transition-colors">
                        Preview
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
