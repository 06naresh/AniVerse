import z from "zod";

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

const nullableString = z.string().nullable().optional();

const nullableNumber = z.number().nullable().optional();


export const KitsuAnimeSchema = z.object({
    id: z.string(),

    attributes: z.object({
        canonicalTitle: z.string().nullable().optional(),

        titles: z.object({
            en: nullableString,
            en_jp: nullableString,
            ja_jp: nullableString,
        }).optional(),

        posterImage: z.object({
            tiny: nullableString,
            small: nullableString,
            medium: nullableString,
            large: nullableString,
            original: nullableString,  
        }).nullable().optional(),

        averageRating: z.string().nullable().optional(),
        episodeCount: nullableNumber,
        status: nullableString,
        startDate: nullableString,
        synopsis: nullableString,
        subtype: nullableString,
    }),
});

export const KitsuResponseSchema = z.object({
    data: z.array(KitsuAnimeSchema),
});

export type KitsuAnimeDto = z.infer<typeof KitsuAnimeSchema>;

export type KitsuAnimeResponse = z.infer<typeof KitsuResponseSchema>;

export type AnimeSummary = Pick<Anime, "id" | "title" | "posterUrl" | "rating">;

export type AnimeUpdate = Partial<Anime>;

export function toAnimeView(dto:KitsuAnimeDto): Anime {
    const attributes = dto.attributes;

    const title = 
        attributes.canonicalTitle ??
        attributes.titles?.en ??
        attributes.titles?.en_jp ??
        attributes.titles?.ja_jp ??
        "Untitled Anime";
    
    const rawRating = attributes.averageRating;
    const parsedRating = rawRating == null ? null : Number(rawRating);

    const rating = 
        parsedRating !== null && Number.isFinite(parsedRating)
            ? parsedRating / 10 : null;

    const posterUrl = 
        attributes.posterImage?.large ??
        attributes.posterImage?. original ??
        attributes.posterImage?.medium ??
        attributes.posterImage?.small ??
        null;


    return {
        id: dto.id,
        title,
        posterUrl,
        rating,
        episodeCount: attributes.episodeCount ?? null,
        status: attributes.status ?? null,
        startDate: attributes.startDate ?? null,
        synopsis: attributes.synopsis ?? "",
        subtype: attributes.subtype ?? null
    };
}