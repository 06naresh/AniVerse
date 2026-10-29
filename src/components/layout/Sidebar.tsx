import { Bookmark, CircleHelp, Compass, Orbit, Settings } from "lucide-react";

export type Page = "discover" | "watchlist";

interface SidebarProps {
    activePage: Page;
    onNavigate: (page: Page) => void;
}

export default function Sidebar({
    activePage,
    onNavigate,
}: SidebarProps) {
    const navigationItem: {
        id:Page;
        label: string;
        icon: typeof Compass;
    }[] = [
        {
            id: "discover",
            label: "Discover",
            icon: Compass,
        },
        {
            id: "watchlist",
            label: "My Watchlist",
            icon: Bookmark,
        },
    ];

    return (
        <aside className="flex h-full w-full flex-col border-r border-white/10 bg-[#0b1024] text-slate-200 md:w-64 md:shrink-0">
            <div className="flex items-center gap-3 px-5 py-6">
                <div className="rounded-xl bg-violet-500/15 p-2 text-violet-300">
                    <Orbit size={30} />
                </div>


                <div>
                    <h1 className="text-xl font-bold tracking-tight text-white">
                        AniVerse
                    </h1>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                        Your anime universe
                    </p>
                </div>
            </div>


            <nav aria-label="Main navigation" className="flex flex-1 flex-row gap-2 px-3 pb-3 md:flex-col">
                {navigationItem.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;

                    return (
                        <button key={item.id} type="button" onClick={() => onNavigate(item.id)} aria-current={isActive ? "page" : undefined} className={`flex flex-1 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition md:flex-none ${
                            isActive
                                ? "bg-violet-600 text-white shadow-lg shadow-violet-950/30"
                                : "text-slate-400 hover:bg-white/5 hover:text-white" 
                        }`}>
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>


            <div className="hidden space-y-2 px-4 pb-5 md:block">
                <button type="button" className="flex w-full items-center gap-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
                    <Settings size={18} />
                    Settings
                </button>

                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
                    <CircleHelp size={18} />
                    Help & Support
                </button>
            </div>
        </aside>
    );
}