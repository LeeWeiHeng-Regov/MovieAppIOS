import { useIsFocused } from "@react-navigation/native";
import React, { Fragment, FunctionComponent, useContext, useEffect, useState } from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NavigationBar } from "../component";
import { MovieCard } from "../component/MovieCard";
import { getWatchList } from "../config";
import { Context } from "../context/Context";
import { backgroundBlack, sw4 } from "../style";

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
        <View style={{ flexDirection: "row", flexWrap: "wrap", width: "100%", marginHorizontal: sw4 }}>
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
