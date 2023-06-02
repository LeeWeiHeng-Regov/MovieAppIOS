declare type TAppStackParamList = {
  Home: undefined;
  Login: undefined;
  MovieDetail: undefined;
  WatchList: undefined;
  Profile: undefined;
  Detail: undefined;
};

declare type LoginProp = import("@react-navigation/stack").StackScreenProps<TAppStackParamList, "Login">;
declare type HomeProp = import("@react-navigation/stack").StackScreenProps<TAppStackParamList, "Home">;
declare type DetailProp = import("@react-navigation/stack").StackScreenProps<TAppStackParamList, "Detail">;
declare type MovieDetailProp = import("@react-navigation/stack").StackScreenProps<TAppStackParamList, "MovieDetail">;
declare type WatchListProp = import("@react-navigation/stack").StackScreenProps<TAppStackParamList, "WatchList">;
declare type ProfileProp = import("@react-navigation/stack").StackScreenProps<TAppStackParamList, "Profile">;
