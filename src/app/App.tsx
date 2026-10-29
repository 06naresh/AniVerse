import { useMemo, useState } from "react";
import type { Anime } from "../types/anime"
import type { Page } from "../components/layout/Sidebar";
import Sidebar from "../components/layout/Sidebar";
import NavBar from "../components/layout/Navbar";
import AnimeGrid from "../components/anime/AnimeGrid";


const sampleAnime: Anime[] = [
  {
    id: "anime-1",
    title: "Celestial Whispers",
    posterUrl: null,
    rating: 8.7,
    episodeCount: 12,
    status: "finished",
    startDate: "2025-01-01",
    synopsis: "A mysterious journey through a world of stars.",
    subtype: "TV",
  },
  {
    id: "anime-2",
    title: "The Last Horizon",
    posterUrl: null,
    rating: 8.4,
    episodeCount: 24,
    status: "finished",
    startDate: "2024-04-01",
    synopsis: "A young hero searches for the edge of the world.",
    subtype: "TV",
  },
  {
    id: "anime-3",
    title: "Nebula Riders",
    posterUrl: null,
    rating: 8.9,
    episodeCount: 12,
    status: "current",
    startDate: "2026-01-01",
    synopsis: "A crew explores the far reaches of the galaxy.",
    subtype: "TV",
  },
  {
    id: "anime-4",
    title: "Moonlit Academy",
    posterUrl: null,
    rating: 8.2,
    episodeCount: 13,
    status: "finished",
    startDate: "2025-07-01",
    synopsis: "Students discover secrets hidden in their academy.",
    subtype: "TV",
  },
  {
    id: "anime-5",
    title: "Echoes of Tomorrow",
    posterUrl: null,
    rating: 8.6,
    episodeCount: 24,
    status: "finished",
    startDate: "2024-10-01",
    synopsis: "A story of friendship and the power of memories.",
    subtype: "TV",
  },
];

function App() {
  const [activePage, setActivePage] = useState<Page>("discover");
  const [search, setSearch] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const favoriteAnime = useMemo(
    () => sampleAnime.filter((anime) => favoriteIds.has(anime.id)),
    [favoriteIds],
  );

  const visibleAnime = useMemo(() => {
    const source = activePage === "watchlist" ? favoriteAnime : sampleAnime;

    const normalizedSearch = search.trim().toLowerCase();

    if(!normalizedSearch) {
      return source;
    }

    return source.filter((anime) => anime.title.toLowerCase().includes(normalizedSearch));
  }, [activePage, favoriteAnime, search]);

  function handleToggleFavorite(animeId: string) {
    setFavoriteIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if(nextIds.has(animeId)) {
        nextIds.delete(animeId);
      } else {
        nextIds.add(animeId);
      }

      return nextIds;
    });
  }

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="flex h-dvh w-full flex-col overflow-hidden bg-slate-900 dark:bg-[#080d20] dark:text-white md:flex-row">
        <div className="shrink-0">
          <Sidebar
            activePage={activePage}
            onNavigate={setActivePage}
          />
        </div>

        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <NavBar
            search={search}
            onSearchChange={setSearch}
            isDark={isDark}
            onToggleTheme={() => setIsDark((current) => !current)}
          />

          <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 lg:px-10">
            <section className="mb-8 overflow-hidden rounded-3xl bg-linear-to-br from-indigo-950 via-violet-900 to-fuchsia-900 p-6 text-white sm:p-10">
              <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              Welcome to AniVerse
              </span>

              <h2 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
                Every anime has a universe of its own.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-violet-100 sm:text-base">
                Discover new stories, explore unforgettable worlds,
                and build your personal anime watchlist.
              </p>

              <button type="button" onClick={() => setActivePage("discover")} className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-violet-800 transition hover:bg-violet-100">
                Explore anime
              </button>
            </section>


            <section>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-violet-600 dark:text-violet-300">
                    YOUR NEXT FAVORITE STORY
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    {activePage === "watchlist" ? "My Watchlist" : "Trending anime"}
                  </h2>
                </div>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {visibleAnime.length} anime
                </p>
              </div>

              <AnimeGrid
                animeList={visibleAnime}
                favoriteIds={favoriteIds}
                onToggleFavorite={handleToggleFavorite}
                onSelectAnime={setSelectedAnime}
              />
            </section>

            {selectedAnime && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" onClick={() => setSelectedAnime(null)}>
                <section role="dialog" aria-modal="true" aria-labelledby="anime-dialog-title" className="w-full max-w-lg rounded-2xl border border-white/10 bg-white p-6 shadow-2xl dark:bg-[#101a35]" onClick={(event) => event.stopPropagation()}>
                  <h2 id="anime-dialog-title" className="text-2xl font-bold">
                    {selectedAnime.title}
                  </h2>

                  <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {selectedAnime.synopsis}
                  </p>

                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                    Episodes: {selectedAnime.episodeCount ?? "Unknown"}
                    {" . "}
                    Rating: {selectedAnime.rating ?? "Not rated"}
                  </p>

                  <button type="button" onClick={() => setSelectedAnime(null)} className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500">
                    Close details
                  </button>
                </section>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App
