//type of the input to the context(createContext or useContext)
declare interface IContextInput {
  user: IUser;
  selectedMovieID: number;
  sessionID: string;
  saveUser: (user: IUser) => void;
  changeSelectedMovieID: (movieID: number) => void;
  handleSetSessionID: (sessionID: string) => void;
}

declare interface IContextProviderProps {
  children: JSX.Element;
}

//type of user
declare interface IUser {
  username: string;
  password: string;
}
