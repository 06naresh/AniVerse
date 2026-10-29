import { Bookmark, Star } from "lucide-react";
import type { Anime } from "../../types/anime";

interface AnimeCardProps {
    anime: Anime;
    isFavorite: boolean;
    onToggleFavorite: (animeId: string) => void;
    onSelect: (anime: Anime) => void;
}

export default function AnimeCard({
    anime,
    isFavorite,
    onToggleFavorite,
    onSelect,
}: AnimeCardProps) {
    return (
        <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-950/10 dark:border-white/10 dark:bg-[#101a35]">
            <div className="relative aspect-3/4 overflow-hidden bg-linear-to-br from-violet-700 via-indigo-800 to-slate-950 ">
                {anime.posterUrl ? (
                    <img src={anime.posterUrl} alt={`Poster for ${anime.title}`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                    <div className="flex h-full flex-col items-center justify-center p-5 text-center">
                        <span className="text-5xl text-violet-200">✦</span>
                        <span className="mt-3 text-sm font-semibold text-white">
                            {anime.title}
                        </span>
                        <span className="mt-1 text-xs text-violet-200/80">
                        AniVerse
                        </span>
                    </div>
                )}


                <button type="button" onClick={() => onToggleFavorite(anime.id)} aria-label={isFavorite ? `Remove ${anime.title} from watchlist` : `Add ${anime.title} to watchlist`} aria-pressed={isFavorite} className={`absolute right-3 top-3 rounded-xl p-2.5 backdrop-blur-md transition ${
                    isFavorite
                        ? "bg-violet-600 text-white"
                        : "bg-slate-950/60 hover:bg-violet-600"
                }`}>
                    <Bookmark size={18} fill={isFavorite ? "currentColor" : "none"} />
                </button>
            </div>

            <div className="p-4">
                <button type="button" onClick={() => onSelect(anime)} className="line-clamp-2 text-left font-semibold text-slate-900 hover:text-violet-600 dark:text-white dark:hover:text-violet-300">
                    {anime.title}
                </button>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    {anime.subtype && (
                        <span className="rounded-full bg-violet-100 px-2.5 py-1 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                            {anime.subtype}
                        </span>
                    )}

                    {anime.episodeCount !== null && (
                        <span>{anime.episodeCount} episodes</span>
                    )}
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm">
                    <Star
                        size={16}
                        fill="currentColor"
                        className="text-amber-400"
                    />
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                        {anime.rating !== null ? anime.rating.toFixed(1) : "Not rated"}
                    </span>
                </div>
            </div>
        </article>
    );
}