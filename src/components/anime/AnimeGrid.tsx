import type { Anime } from "../../types/anime";
import AnimeCard from "./AnimeCard";

interface AnimeGridProps {
    animeList: Anime[];
    favoriteIds: Set<string>;
    onToggleFavorite: (animeId: string) => void;
    onSelectAnime: (anime: Anime) => void;
}

export default function AnimeGrid({
    animeList,
    favoriteIds,
    onToggleFavorite,
    onSelectAnime,
}: AnimeGridProps) {
    if(animeList.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-14 text-center dark:border-white/15">
                <p className="text-lg font-semibold text-slate-800 dark:text-white">
                    No anime found
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Try another search term.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {animeList.map((anime) => (
                <AnimeCard
                    key={anime.id}
                    anime={anime}
                    isFavorite={favoriteIds.has(anime.id)}
                    onToggleFavorite={onToggleFavorite}
                    onSelect={onSelectAnime}
                />
            ))}
        </div>
    )
}