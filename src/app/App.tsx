import { useEffect, useMemo, useState } from "react";
import type { Anime } from "../types/anime"
import type { Page } from "../components/layout/Sidebar";
import Sidebar from "../components/layout/Sidebar";
import NavBar from "../components/layout/Navbar";
import AnimeGrid from "../components/anime/AnimeGrid";
import type { RequestState } from "../types/request";
import { useTheme } from "../context/ThemeContext";
import { fetchAnime } from "../services/kitsuApi";


function getSavedFavoriteIds(): Set<string> {
  try {
    const saved = localStorage.getItem("aniverse-watchlist");
    const parsed: unknown = saved ? JSON.parse(saved) : [];

    if (
      Array.isArray(parsed) && parsed.every((id): id is string => typeof id === "string")
    ) {
      return new Set(parsed);
    }
  } catch {

  }

  return new Set<string>();
}

function App() {
  const [activePage, setActivePage] = useState<Page>("discover");
  const [search, setSearch] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(
    getSavedFavoriteIds,
  );
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);

  const [request, setRequest] = useState<RequestState>({ status: "loading", });

  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const controller = new AbortController();

    async function loadAnime() {
      setRequest({ status: "loading" });

      try {
        const anime = await fetchAnime({
          search, limit: 20, signal: controller.signal,
        });

        setRequest({
          status: "success",
          anime,
        });
      } catch (error: unknown) {
        if (controller.signal.aborted) {
          return;
        }

        setRequest({
          status: "error",
          message: error instanceof Error ? error.message : "Something went wrong while loading anime."
        });
      }
    }

    void loadAnime();

    return () => {
      controller.abort();
    };
  }, [search]);

  useEffect(() => {
    localStorage.setItem("aniverse-watchlist", JSON.stringify([...favoriteIds]),);
  }, [favoriteIds]);

  const allAnime = request.status === "success" ? request.anime : [];

  const favoriteAnime = useMemo(
    () => allAnime.filter((anime) => favoriteIds.has(anime.id)),
    [allAnime, favoriteIds]
  )

  const visibleAnime = activePage === "watchlist" ? favoriteAnime : allAnime;

  function handleToggleFavorite(animeId: string) {
    setFavoriteIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(animeId)) {
        nextIds.delete(animeId);
      } else {
        nextIds.add(animeId);
      }

      return nextIds;
    });
  }


  function handleRetry() {
    setSearch((currentSearch) => `${currentSearch}`);
  }


  return (
    <div className="h-dvh w-full overflow-hidden bg-slate-50 text-slate-900 transition-colors dark:bg-[#080d20] dark:text-white">
      <div className="flex h-full flex-col md:flex-row">
        <Sidebar
          activePage={activePage}
          onNavigate={setActivePage}
        />

        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <NavBar
            search={search}
            onSearchChange={setSearch}
            isDark={isDark}
            onToggleTheme={toggleTheme}
          />

          <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 lg:px-10">

            {activePage === "discover" && (
              <section className="mb-8 overflow-hidden rounded-3xl bg-linear-to-br from-indigo-950 via-violet-900 to-fuchisa-900 p-6 text-white sm:p-10">
                <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                  Your next adventure
                </span>

                <h2 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
                  Every anime has a universe of its own.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-violet-100 sm:text-base">
                  Discover new stories, explore unforgettable worlds,
                  and build your personal anime watchlist.
                </p>

                <button type="button" onClick={() => { setSearch(""); setActivePage("discover") }} className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-violet-800 transition hover:bg-violet-100">
                  Explore anime
                </button>
              </section>
            )}


            <section>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-violet-600 dark:text-violet-300">
                    {activePage === "watchlist" ? "YOUR SAVED COLLECTION" : "FIND YOUR NEXT FAVORITE"}
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    {activePage === "watchlist" ? "My Watchlist" : search.trim() ? "Search results" : "Trending anime"}
                  </h2>
                </div>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {activePage === "watchlist" ? `${favoriteAnime.length} saved` : `${favoriteAnime.length} anime`}
                </p>
              </div>

              {request.status === "loading" && (
                <div role="status" className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-white/10 dark:bg-white/5">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
                  <p className="mt-4 font-medium">
                    Discovering anime...
                  </p>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Loading data from kitsu.
                  </p>
                </div>
              )}

              {request.status === "error" && (
                <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-400/20 dark:bg-red-500/10">
                  <h3 className="font-semibold text-red-700 dark:text-red-300">
                    Unable to load anime
                  </h3>

                  <p className="mt-2 text-sm text-red-600 dark:text-red-200">
                    {request.message}
                  </p>

                  <button className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500">
                    Try again
                  </button>
                </div>
              )}

              {request.status === "success" &&
                activePage === "watchlist" &&
                visibleAnime.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-white/15">
                    <h3 className="text-lg font-semibold">
                      Your watchlist is empty
                    </h3>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Visit Discover and press the bookmark icon on an anime to save it.
                    </p>

                    <button type="button" onClick={() => setActivePage("discover")} className="mt-5 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500">
                      Discover anime
                    </button>
                  </div>
                )
              }

              {request.status === "success" &&
                activePage === "discover" && (
                  <AnimeGrid
                    animeList={visibleAnime}
                    favoriteIds={favoriteIds}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectAnime={setSelectedAnime}
                  />
                )}

              {request.status === "success" &&
                activePage === "watchlist" &&
                visibleAnime.length > 0 && (
                  <AnimeGrid
                    animeList={visibleAnime}
                    favoriteIds={favoriteIds}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectAnime={setSelectedAnime}
                  />
                )
              }
            </section>

            {selectedAnime && (
              <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm" onClick={() => setSelectedAnime(null)}>
                <section role="dialog" aria-modal="true" aria-labelledby="anime-dialog-title" className="my-auto w-full max-w-lg rounded-2xl border border-slate-200 dark:border-white/10 bg-white p-6 shadow-2xl dark:bg-[#101a35]" onClick={(event) => event.stopPropagation()}>
                  <h2 id="anime-dialog-title" className="text-2xl font-bold">
                    {selectedAnime.title}
                  </h2>

                  {selectedAnime.posterUrl && (
                    <img src={selectedAnime.posterUrl} alt={`Postyer for ${selectedAnime.title}`} className="mt-4 max-h-64 w-auto rounded-xl object-cover" />
                  )}

                  <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {selectedAnime.synopsis || "No synopsis is available for this anime."}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <span>
                      Episodes: {selectedAnime.episodeCount ?? "Unknown"}
                    </span>
                    <span>.</span>
                    <span>
                      Rating:{" "}
                      {selectedAnime.rating !== null
                        ? selectedAnime.rating.toFixed(1)
                        : "Not rated"
                      }
                    </span>
                    {selectedAnime.status && (
                      <>
                        <span>.</span>
                        <span>Status: {selectedAnime.status}</span>
                      </>
                    )}

                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button type="button" onClick={() => handleToggleFavorite(selectedAnime.id)} className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-300">
                      {favoriteIds.has(selectedAnime.id) ? "Remove from watchlist" : "Add to watchlist"}
                    </button>


                    <button type="button" onClick={() => setSelectedAnime(null)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:hover:border-white/10 dark:text-white dark:hover:bg-white/5">
                      Close
                    </button>
                  </div>
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
