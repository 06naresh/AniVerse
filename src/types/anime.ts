export interface Anime {
    id: string;
    title: string;
    posterUrl: string | null;
    rating: number | null;
    episodeCount: number | null;
    status: string | null;
    startDate: string | null;
    synopsis: string;
    subtype: string | null;
}

export type AnimeSummary = Pick<Anime, "id" | "title" | "posterUrl" | "rating">;

export type AnimeUpdate = Partial<Anime>;