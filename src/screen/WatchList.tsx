import React, { Fragment, FunctionComponent, useContext, useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";

import { NavigationBar } from "../component";
import { MovieCard } from "../component/MovieCard";
import { getWatchList } from "../config";
import { Context } from "../context/Context";

export const WatchList: FunctionComponent<WatchListProp> = ({ navigation }: WatchListProp): JSX.Element => {
  const [watchList, setWatchList] = useState<IMovie[] | undefined>(undefined);
  const { changeSelectedMovieID, sessionID } = useContext<IContextInput>(Context);

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
    handleFetchWatchList();
  }, []);

  return (
    <Fragment>
      <ScrollView>
        {watchList !== undefined ? (
          watchList.map((item, index) => {
            const handleMovieSelected = (): void => {
              changeSelectedMovieID(item.id);
              navigation.navigate("MovieDetail");
            };
            return <MovieCard key={index} title={item.title} releaseDate={item.release_date} navigationFunction={handleMovieSelected} />;
          })
        ) : (
          <Text>Loading...</Text>
        )}
      </ScrollView>
      <NavigationBar pageName={"WatchList"} navigationFunction={navigation}></NavigationBar>
    </Fragment>
  );
};
