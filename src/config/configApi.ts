export const Url = "https://api.themoviedb.org/3";
export const APIKey = "724b5b81a31d70bfaef4c50cd34b6d8b";
export const accountID = "18549282";
export const createRequestTokenUrl = "/authentication/token/new";
export const authenticateRequestTokenUrl = "/authentication/token/validate_with_login";
export const createSessionIDUrl = "/authentication/session/new";
export const getAccountDetail = "https://api.themoviedb.org/3/account?api_key=blahblahblah&session_id=xxxxxxxxxxx";
export const getTrendingMovieListUrl = "/trending/movie/day";
export const getMovieDetailUrl = "/movie/";
export const getMovieStateUrl = (movieID: number) => {
  return `/movie/${movieID}/account_states`;
};
export const getMovieReviewUrl = (movieID: number) => {
  return `/movie/${movieID}/reviews`;
};

export const getWatchList = `${Url}/account/${accountID}/watchlist/movies?api_key=${APIKey}&session_id=`;
export const addToWatchList = `${Url}/account/${accountID}/watchlist?api_key=${APIKey}&session_id=`;
export const manipulateRating = (movieID: number) => {
  return `${Url}/movie/${movieID}/rating?api_key=${APIKey}&session_id=`;
};
export const getImageUrl = `https://image.tmdb.org/t/p/original`;
