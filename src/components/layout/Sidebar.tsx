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
        <aside className="flex w-full flex-col border-b border-slate-200 bg-white text-slate-700 transition-colors dark:border-white/10 dark:bg-[#0b1024] dark:text-slate-200 md:h-full md:w-64 md:shrink-0 md:border-b-0 md:border-r">
            <div className="flex items-center gap-3 px-5 py-6">
                <div className="rounded-xl bg-violet-100 p-2 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                    <Orbit size={30} />
                </div>


                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        AniVerse
                    </h1>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                        Your anime universe
                    </p>
                </div>
            </div>


            <nav aria-label="Main navigation" className="flex flex-1 flex-row gap-2 px-3 pb-3 md:flex-1 md:flex-col">
                {navigationItem.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;

                    return (
                        <button key={item.id} type="button" onClick={() => onNavigate(item.id)} aria-current={isActive ? "page" : undefined} className={`flex flex-1 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition md:flex-none ${
                            isActive
                                ? "bg-violet-600 text-white shadow-lg shadow-violet-950/20"
                                : "text-slate-600 hover:bg-slate-100 hover:text-violet-700 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white" 
                        }`}>
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>


            <div className="hidden space-y-2 px-4 pb-5 md:block">
                <button type="button" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white">
                    <Settings size={18} />
                    Settings
                </button>

                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400  dark:hover:bg-white/5 dark:hover:text-white">
                    <CircleHelp size={18} />
                    Help & Support
                </button>
            </div>
        </aside>
    );
}