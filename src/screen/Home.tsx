import React, { Fragment, FunctionComponent, useContext, useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

import { NavigationBar } from "../component";
import { MovieCard } from "../component/MovieCard";
import { APIKey, getPopularMovie, getTopRatedMovie, getTrendingMovieListUrl, getUpcomingMovie, Url } from "../config";
import { Context } from "../context/Context";
import { alignCenter, justifyCenter } from "../style/style";

export const Home: FunctionComponent<HomeProp> = ({ navigation }: HomeProp): JSX.Element => {
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [clicked, setClicked] = useState<boolean>(false);
  const [data, setData] = useState<IMovieList | undefined>(undefined);
  const { changeSelectedMovieID } = useContext<IContextInput>(Context);
  const [selectedFilterType, setSelectedFilterType] = useState<filterType>("Trending");

  type filterType = "Trending" | "Popular" | "Upcoming" | "Top Rated" | "Crayon";
  const movieFilterType: filterType[] = ["Trending", "Popular", "Top Rated", "Upcoming", "Crayon"];

  const handleSetData = (newData: IMovieList): void => {
    setData(newData);
  };

  const handleCancel = (): void => {
    setSearchPhrase("");
  };

  const handleSetSelectedFilterType = (newSelectedFilterType: filterType): void => {
    setSelectedFilterType(newSelectedFilterType);
  };

  const clickedTextBoxStyle: TextStyle = {
    borderColor: "grey",
    borderRadius: 30,
    borderWidth: 4,
    color: "white",
    height: 50,
    marginVertical: 2,
    paddingHorizontal: 20,
    width: "80%",
  };

  const unclickedTextBoxStyle: TextStyle = {
    borderColor: "grey",
    borderRadius: 30,
    borderWidth: 4,
    color: "white",
    height: 50,
    marginVertical: 2,
    paddingHorizontal: 20,
    width: "95%",
  };

  const cancelButton: ViewStyle = {
    ...alignCenter,
    ...justifyCenter,
    backgroundColor: "red",
    borderColor: "red",
    borderRadius: 30,
    borderWidth: 2,
    height: 50,
    marginVertical: 2,
    width: "15%",
  };

  const movieFilterList: ViewStyle = {
    width: "100%",
    marginTop: 4,
    marginVertical: 2,
    borderRadius: 8,
  };

  const movieFilter: ViewStyle = {
    ...alignCenter,
    ...justifyCenter,
    backgroundColor: "green",
    // color: "yellow",
    padding: 4,
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 10,
  };

  const handleFetchTrendingMovieList = async (): Promise<void> => {
    try {
      const jsonResponse: IMovieList = await (await fetch(`${Url}${getTrendingMovieListUrl}?api_key=${APIKey}`)).json();
      handleSetData(jsonResponse);
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect((): void => {
    handleFetchTrendingMovieList();
  }, []);

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "black" }}>
      <StatusBar barStyle={"light-content"} />

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        <TextInput
          onChangeText={(value) => setSearchPhrase(value)}
          onFocus={() => setClicked(true)}
          onBlur={() => setClicked(false)}
          placeholder="Search..."
          placeholderTextColor="white"
          value={searchPhrase}
          style={clicked ? clickedTextBoxStyle : unclickedTextBoxStyle}></TextInput>
        {clicked ? (
          <TouchableOpacity style={cancelButton} onPress={handleCancel}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View>
        <ScrollView style={movieFilterList} horizontal={true} contentContainerStyle={{ height: 32 }}>
          <View style={{ flexDirection: "row", ...alignCenter }}>
            {movieFilterType.map((item, index) => {
              const handlePress = async () => {
                try {
                  if (item === "Crayon") {
                    const response = await (
                      await fetch(
                        `https://api.themoviedb.org/3/search/movie?api_key=724b5b81a31d70bfaef4c50cd34b6d8b&language=en-US&query=crayon%20Shin-chan`,
                      )
                    ).json();
                    handleSetData(response);
                  } else if (item === "Trending") {
                    handleFetchTrendingMovieList();
                  } else if (item === "Popular") {
                    const response: IMovieList = await (await fetch(getPopularMovie)).json();
                    handleSetData(response);
                  } else if (item === "Top Rated") {
                    const response: IMovieList = await (await fetch(getTopRatedMovie)).json();
                    handleSetData(response);
                  } else if (item === "Upcoming") {
                    const response: IMovieList = await (await fetch(getUpcomingMovie)).json();
                    handleSetData(response);
                  }
                  handleSetSelectedFilterType(item);
                } catch (e) {
                  console.log(e);
                }
              };

              return (
                <View key={index} style={movieFilter}>
                  <Text style={{ color: "white" }} onPress={item === selectedFilterType ? undefined : handlePress}>
                    {item}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* <Fragment>
        {data !== undefined ? (
          <FlatList
            data={data.results}
            renderItem={({ item, index }) => {
              const handleNavigation = () => {
                changeSelectedMovieID(item.id);
                navigation.navigate("MovieDetail");
              };
              return item.title.toLowerCase().includes(searchPhrase.toLowerCase()) ? (
                <MovieCard key={index} posterPath={item.poster_path} navigationFunction={handleNavigation} />
              ) : null;
            }}
            keyExtractor={(item) => item.id.toString()}
            style={{ marginBottom: "auto", width: "100%" }}
            numColumns={2}
          />
        ) : (
          <Text>Loading...</Text>
        )}
      </Fragment> */}

      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            height: "100%",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}>
          {data !== undefined ? (
            data.results.map((movie, index) => {
              const handleNavigation = () => {
                changeSelectedMovieID(movie.id);
                navigation.navigate("MovieDetail");
              };
              return movie.title.toLowerCase().includes(searchPhrase.toLowerCase()) ? (
                <MovieCard key={index} posterPath={movie.poster_path} navigationFunction={handleNavigation} />
              ) : null;
            })
          ) : (
            <Text>Loading...</Text>
          )}
        </View>
      </ScrollView>

      <NavigationBar pageName={"Home"} navigationFunction={navigation}></NavigationBar>
    </SafeAreaView>
  );
};
