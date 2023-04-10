import React, { Fragment, FunctionComponent, useContext, useEffect, useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View, ViewStyle } from "react-native";

import { NavigationBar } from "../component";
import { APIKey, getTrendingMovieListUrl, Url } from "../config";
import { Context } from "../context/Context";
import { MovieCard } from "./Home/MovieCard";
import { alignCenter, justifyCenter } from "./Home/style";

export const Home: FunctionComponent<HomeProp> = ({ navigation }: HomeProp): JSX.Element => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  const [data, setData] = useState<IMovieList | undefined>(undefined);
  const { changeSelectedMovieID } = useContext<IContextInput>(Context);

  const handleSetData = (newData: IMovieList) => {
    setData(newData);
  };

  const handleCancel = (): void => {
    setSearchPhrase("");
  };

  const clickedTextBoxStyle: ViewStyle = {
    marginVertical: 2,
    borderWidth: 4,
    borderRadius: 30,
    borderColor: "grey",
    width: "80%",
    height: 50,
    paddingHorizontal: 20,
  };

  const unclickedTextBoxStyle: ViewStyle = {
    marginVertical: 2,
    borderWidth: 4,
    borderRadius: 30,
    borderColor: "grey",
    width: "95%",
    height: 50,
    paddingHorizontal: 20,
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
      const result = await fetch(`${Url}${getTrendingMovieListUrl}?api_key=${APIKey}`);
      const jsonResponse = await result.json();
      handleSetData(jsonResponse);
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect((): void => {
    handleFetchTrendingMovieList();
  }, []);

  return (
    <Fragment>
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <TextInput
            onChangeText={(value) => setSearchPhrase(value)}
            onFocus={() => setClicked(true)}
            onBlur={() => setClicked(false)}
            placeholder="Search..."
            placeholderTextColor="#6B6B6B"
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
                  <MovieCard key={index} title={item.title} releaseDate={item.release_date} navigationFunction={handleNavigation} />
                ) : null;
              }}
              keyExtractor={(item) => item.id.toString()}
              style={{ marginBottom: "auto", width: "100%" }}
            />
          ) : (
            <Text>Loading...</Text>
          )}
        </Fragment>

        <NavigationBar pageName={"Home"} navigationFunction={navigation}></NavigationBar>
      </View>
    </Fragment>
  );
};
