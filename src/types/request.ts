import type { Anime } from "./anime";

export type RequestState = 
    | {
        status: "loading";
    }
    | {
        status: "error";
        message: string;
    }
    | {
        status: "success";
        anime: Anime[];
    };