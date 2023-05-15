import { SIZE_MATTERS_BASE_WIDTH } from "@env";
import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import { Image, Keyboard, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale } from "react-native-size-matters/extend";

import { NavigationBar } from "../component";
import { MovieCard } from "../component/MovieCard";
import { APIKey, getPopularMovie, getTopRatedMovie, getTrendingMovieListUrl, getUpcomingMovie, Url } from "../config";
import { Context } from "../context/Context";
import { backgroundBlack, black, blueWhite, sh16, sh32, sh4, sh48, sw16, sw24, sw32, sw4, sw8, white, yellow } from "../style";
import { alignCenter, br, justifyCenter } from "../style/style";

export const Home: FunctionComponent<HomeProp> = ({ navigation }: HomeProp): JSX.Element => {
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [data, setData] = useState<IMovieList | undefined>(undefined);
  const { changeSelectedMovieID } = useContext<IContextInput>(Context);
  const [selectedFilterType, setSelectedFilterType] = useState<filterType>("Trending");
  const [typing, setTyping] = useState<boolean>(true);
  const [showNavigationBar, setShowNavigationBar] = useState<boolean>(true);

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

  const searchBarStyle: ViewStyle = {
    borderColor: blueWhite,
    borderRadius: sw32,
    borderWidth: sw4,
    height: sh48,
    paddingHorizontal: sw16,
    width: scale(SIZE_MATTERS_BASE_WIDTH - 16),
    marginHorizontal: sw8,
  };

  const movieFilterList: ViewStyle = {
    width: scale(SIZE_MATTERS_BASE_WIDTH - 16),
    marginVertical: sh4,
    marginHorizontal: sw8,
    borderRadius: br,
  };

  const movieFilter: ViewStyle = {
    ...alignCenter,
    ...justifyCenter,
    backgroundColor: yellow,
    padding: sw4,
    borderRadius: br,
    marginRight: sw16,
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

  useEffect(() => {
    const handleShowNavigationBar = () => setShowNavigationBar(true);
    const handleHideNavigationBar = () => setShowNavigationBar(false);

    const KeyboardWillShow = Keyboard.addListener("keyboardWillShow", handleHideNavigationBar);
    const KeyboardWillHide = Keyboard.addListener("keyboardWillHide", handleShowNavigationBar);

    return () => {
      KeyboardWillShow.remove();
      KeyboardWillHide.remove();
    };
  }, [typing]);

  return (
    <SafeAreaView edges={["top"]} style={{ height: "100%", backgroundColor: backgroundBlack }}>
      <StatusBar barStyle={"light-content"} />
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", ...searchBarStyle }}>
        <TextInput
          onChangeText={(value) => {
            setSearchPhrase(value);
          }}
          onFocus={() => setTyping(false)}
          onBlur={() => setTyping(true)}
          placeholder="Search..."
          placeholderTextColor={white}
          value={searchPhrase}
          style={{ fontSize: sh16, width: scale(SIZE_MATTERS_BASE_WIDTH - 88) }}></TextInput>
        {searchPhrase !== "" && (
          <TouchableOpacity style={{ marginLeft: sw8 }} onPress={() => setSearchPhrase("")}>
            <Image style={{ height: sw24, width: sw24 }} resizeMode={"stretch"} source={require("./Home/remove.png")}></Image>
          </TouchableOpacity>
        )}
      </View>

      <View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          style={movieFilterList}
          horizontal={true}
          contentContainerStyle={{ height: sh32 }}>
          <View style={{ flexDirection: "row", ...alignCenter }}>
            {movieFilterType.map((item, index) => {
              const handlePress = async () => {
                try {
                  switch (item) {
                    case "Crayon":
                      let response = await (
                        await fetch(
                          `https://api.themoviedb.org/3/search/movie?api_key=724b5b81a31d70bfaef4c50cd34b6d8b&language=en-US&query=crayon%20Shin-chan`,
                        )
                      ).json();
                      handleSetData(response);
                      break;
                    case "Trending":
                      handleFetchTrendingMovieList();
                      break;
                    case "Popular":
                      response = await (await fetch(getPopularMovie)).json();
                      handleSetData(response);
                      break;
                    case "Top Rated":
                      response = await (await fetch(getTopRatedMovie)).json();
                      handleSetData(response);
                      break;
                    case "Upcoming":
                      response = await (await fetch(getUpcomingMovie)).json();
                      handleSetData(response);
                      break;
                  }
                  handleSetSelectedFilterType(item);

                  // if (item === "Crayon") {
                  //   const response = await (
                  //     await fetch(
                  //       `https://api.themoviedb.org/3/search/movie?api_key=724b5b81a31d70bfaef4c50cd34b6d8b&language=en-US&query=crayon%20Shin-chan`,
                  //     )
                  //   ).json();
                  //   handleSetData(response);
                  // } else if (item === "Trending") {
                  //   handleFetchTrendingMovieList();
                  // } else if (item === "Popular") {
                  //   const response: IMovieList = await (await fetch(getPopularMovie)).json();
                  //   handleSetData(response);
                  // } else if (item === "Top Rated") {
                  //   const response: IMovieList = await (await fetch(getTopRatedMovie)).json();
                  //   handleSetData(response);
                  // } else if (item === "Upcoming") {
                  //   const response: IMovieList = await (await fetch(getUpcomingMovie)).json();
                  //   handleSetData(response);
                  // }
                  // handleSetSelectedFilterType(item);
                } catch (e) {
                  console.log(e);
                }
              };

              return (
                <View key={index} style={movieFilter}>
                  <Text
                    style={{
                      color: black,
                      fontSize: sh16,
                      textDecorationLine: item === selectedFilterType ? "underline" : "none",
                      textDecorationStyle: "solid",
                      fontWeight: item === selectedFilterType ? "bold" : "normal",
                    }}
                    disabled={item === selectedFilterType}
                    onPress={handlePress}>
                    {item}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <ScrollView indicatorStyle="white" style={{ width: "100%" }}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            height: "100%",
            width: "100%",
            paddingHorizontal: sw4,
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
      {showNavigationBar && <NavigationBar pageName={"Home"} navigationFunction={navigation}></NavigationBar>}
    </SafeAreaView>
  );
};
