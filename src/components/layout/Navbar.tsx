import { Moon, Search, Sun } from "lucide-react";

interface NavbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    isDark: boolean;
    onToggleTheme: () => void;
}

export default function NavBar({
    search,
    onSearchChange,
    isDark,
    onToggleTheme,
}: NavbarProps ) {
    return (
        <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-5 py-5 dark:border-white/10 dark:bg-[#0b1024] sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Discover Anime
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Find your next favorite story
                </p>
            </div>

            <div className="flex items-center gap-3">
                <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5 lg:w-90 lg:flex-none">
                    <Search size={19} className="shrink-0 text-slate-400" />

                    <input type="search" value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search anime titles..." aria-label="Search anime titles" className="w-full min-w-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white" />
                </label>

                <button type="button" onClick={onToggleTheme} aria-label={isDark ? "Switch to light theme": "Switch to dark theme"} className="rounded-xl border border-slate-200 p-3 text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10">
                    {isDark ? <Sun size={19} /> : <Moon size={19} />}
                </button>
            </div>
        </header>
    );
}    