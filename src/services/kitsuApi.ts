import { KitsuResponseSchema, toAnimeView, type Anime } from "../types/anime";

const KITSU_API_URL = import.meta.env.VITE_KITSU_API_URL;

interface FetchAnimeOptions {
    search?: string;
    limit?: number;
    signal?: AbortSignal;
}

async function getJson<T>(
    url:string,
    schema: {
        parse: (data: unknown) => T;
    },
    signal?: AbortSignal,
): Promise<T> {
    const response = await fetch(url, {
        signal,
        headers: {
            Accept: "application/vnd.api+json",
        },
    });

    if(!response.ok) {
        throw new Error(`Request failed with status ${response.status}`,);
    }

    const json: unknown = await response.json();

    return schema.parse(json);
}

export async function fetchAnime({
    search = "",
    limit = 20,
    signal,
}: FetchAnimeOptions = {}): Promise<Anime[]> {
    const params = new URLSearchParams();

    params.set("page[limit]", String(limit));
    params.set("sort", "-userCount");

    if(search.trim()) {
        params.set("filter[text]", search.trim());
    }

    const url = `${KITSU_API_URL}?${params.toString()}`;

    const response = await getJson(url, KitsuResponseSchema, signal,);

    return response.data.map(toAnimeView);
}