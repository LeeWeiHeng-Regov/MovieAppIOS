import { useIsFocused } from "@react-navigation/native";
import React, { Fragment, FunctionComponent, useContext, useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";

import { NavigationBar } from "../component";
import { MovieCard } from "../component/MovieCard";
import { getWatchList } from "../config";
import { Context } from "../context/Context";
import { backgroundBlack } from "../style";

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
    <SafeAreaView style={{ height: "100%", backgroundColor: backgroundBlack }}>
      <StatusBar barStyle={"light-content"} />

      <ScrollView>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {watchList !== undefined ? (
            watchList.map((item, index) => {
              const handleMovieSelected = (): void => {
                changeSelectedMovieID(item.id);
                navigation.navigate("MovieDetail");
              };
              return <MovieCard key={index} posterPath={item.poster_path} navigationFunction={handleMovieSelected} />;
            })
          ) : (
            <Text>Loading...</Text>
          )}
        </View>
      </ScrollView>
      <NavigationBar pageName={"WatchList"} navigationFunction={navigation}></NavigationBar>
    </SafeAreaView>
  );
};
