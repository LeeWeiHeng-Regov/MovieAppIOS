declare interface IMovie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  popularity: number;
}

declare interface ICollection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

declare interface IGenre {
  id: number;
  name: string;
}
declare interface IProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

declare interface IProductionCountry {
  iso_3166_1: string;
  name: string;
}

declare interface ISpokenLanguage {
  iso_639_1: string;
  name: string;
}

declare interface IMovieDetail {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: ICollection | null;
  budget: number;
  genres: IGenre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: IProductionCompany[];
  production_countries: IProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: ISpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

declare interface IMovieList {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

declare interface IMovieRating {
  value: number;
}

declare interface IMovieState {
  id: number;
  favorite: boolean;
  rated: IMovieRating | boolean;
  watchlist: boolean;
}

declare interface IAuthorDetails {
  name: string;
  username: string;
  avatar_path: string | null;
  rating: number | null;
}

declare interface IMovieReview {
  author: string;
  author_details: IAuthorDetails;
  content: string;
  created_at: string;
  id: string;
  updated_at: string;
  url: string;
}

declare interface IMovieReviewListResponse {
  id: number;
  page: number;
  results: IMovieReview[] | [];
  total_pages: number;
  total_results: number;
}

declare interface IMovieWatchListResponse {
  page: number;
  results: IMovie[] | [];
  total_pages: number;
  total_results: number;
}

declare interface IAddWatchListResponse {
  success: boolean;
  status_code: number;
  status_message: string;
}

declare interface IPostRatingResponse {
  success: boolean;
  status_code: number;
  status_message: string;
}
