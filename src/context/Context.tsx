import { createContext, FunctionComponent, useState } from "react";

// the initial state of the context(if don't give an initial state
//then the input type should add undefine and the context provider
//should also check is the input is undefine)
const initialState: IUser = {
  username: "",
  password: "",
};
// const initialState: IUser[] = []; //uncomment this line to

export const Context: React.Context<IContextInput> = createContext<IContextInput>({
  user: initialState,
  selectedMovieID: 0,
  sessionID: "",
  saveUser: () => {},
  changeSelectedMovieID: () => {},
  handleSetSessionID: () => {},
});

const { Provider } = Context;

export const ContextProvider: FunctionComponent<IContextProviderProps> = ({ children }: IContextProviderProps): JSX.Element => {
  const [user, setUser] = useState<IUser>(initialState);
  const [selectedMovieID, setSelectedMovieID] = useState<number>(0);
  const [sessionID, setSessionID] = useState<string>("");

  const changeSelectedMovieID = (newMovieID: number) => {
    setSelectedMovieID(newMovieID);
  };

  const handleSetSessionID = (newSessionID: string) => {
    setSessionID(newSessionID);
  };

  const saveUser = (newUser: IUser) => {
    setUser({ ...user, ...newUser });
  };

  return (
    <Provider
      value={{ user: user, selectedMovieID: selectedMovieID, sessionID: sessionID, changeSelectedMovieID, saveUser, handleSetSessionID }}>
      {children}
    </Provider>
  );
};
