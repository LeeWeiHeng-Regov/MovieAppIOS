import React, { Fragment, FunctionComponent, useContext, useEffect, useState } from "react";
import { FlatList, SafeAreaView, StatusBar, Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

import { NavigationBar } from "../component";
import { MovieCard } from "../component/MovieCard";
import { APIKey, getTrendingMovieListUrl, Url } from "../config";
import { Context } from "../context/Context";
import { alignCenter, justifyCenter } from "../style/style";

export const Home: FunctionComponent<HomeProp> = ({ navigation }: HomeProp): JSX.Element => {
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [clicked, setClicked] = useState<boolean>(false);
  const [data, setData] = useState<IMovieList | undefined>(undefined);
  const { changeSelectedMovieID } = useContext<IContextInput>(Context);

  const handleSetData = (newData: IMovieList) => {
    setData(newData);
  };

  const handleCancel = (): void => {
    setSearchPhrase("");
  };

  const clickedTextBoxStyle: TextStyle = {
    marginVertical: 2,
    borderWidth: 4,
    borderRadius: 30,
    borderColor: "grey",
    width: "80%",
    height: 50,
    paddingHorizontal: 20,
    color: "white",
  };

  const unclickedTextBoxStyle: TextStyle = {
    marginVertical: 2,
    borderWidth: 4,
    borderRadius: 30,
    borderColor: "grey",
    width: "95%",
    height: 50,
    paddingHorizontal: 20,
    color: "white",
  };

  const cancelButton: ViewStyle = {
    marginVertical: 2,
    borderWidth: 2,
    borderRadius: 30,
    borderColor: "red",
    backgroundColor: "red",
    width: "15%",
    height: 50,
    ...alignCenter,
    ...justifyCenter,
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
      <Fragment>
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
      </Fragment>

      <NavigationBar pageName={"Home"} navigationFunction={navigation}></NavigationBar>
    </SafeAreaView>
  );
};
