import { useIsFocused } from "@react-navigation/native";
import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import { ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FadeInView, Loader, MovieCard, NavigationBar } from "../component";
import { getWatchList } from "../config";
import { Context } from "../context/Context";
import { backgroundBlack, sw3 } from "../style";

export const WatchList: FunctionComponent<WatchListProp> = ({ navigation }: WatchListProp): JSX.Element => {
  const [watchList, setWatchList] = useState<IMovie[] | undefined>(undefined);
  const { changeSelectedMovieID, sessionID } = useContext<IContextInput>(Context);
  const pageFocused = useIsFocused();

  const handleSetWatchList = (newWatchList: IMovie[]) => {
    setWatchList(newWatchList);
  };

  const handleFetchWatchList = async (): Promise<void> => {
    try {
      const jsonResponse: IMovieWatchListResponse = await (await fetch(`${getWatchList}${sessionID}`)).json();
      handleSetWatchList(jsonResponse.results);
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect((): void => {
    pageFocused && handleFetchWatchList();
  }, [pageFocused]);

  return (
    <SafeAreaView edges={["top"]} style={{ height: "100%", backgroundColor: backgroundBlack }}>
      <StatusBar barStyle={"light-content"} />

      <ScrollView>
        <FadeInView style={{ flexDirection: "row", flexWrap: "wrap", width: "100%", paddingHorizontal: sw3 }}>
          {watchList !== undefined ? (
            watchList.map((item, index) => {
              const handleMovieSelected = (): void => {
                changeSelectedMovieID(item.id);
                navigation.navigate("MovieDetail");
              };
              return <MovieCard key={index} posterPath={item.poster_path} navigationFunction={handleMovieSelected} />;
            })
          ) : (
            <Loader />
          )}
        </FadeInView>
      </ScrollView>
      <NavigationBar pageName={"WatchList"} navigationFunction={navigation}></NavigationBar>
    </SafeAreaView>
  );
};
