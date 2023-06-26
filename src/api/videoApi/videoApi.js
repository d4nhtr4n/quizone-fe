import { category } from "../constant";

const baseUrl = "https://www.2embed.to/embed/tmdb";

const videoApi = {
    getVideo: (type, id, season, episode) => {
        let url = "";
        if (type === category.movie)
            // https://www.2embed.to/embed/tmdb/movie?id=TMDB ID
            url = `${baseUrl}/${type}?id=${id}`;
        else if (type === category.tv)
            // https://www.2embed.to/embed/tmdb/tv?id=TMDB ID&s=SEASON NUMBER&e=EPISODE NUMBER
            url = `${baseUrl}/${type}?id=${id}&s=${season}&e=${episode}`;

        return url;
    },
};

export default videoApi;
