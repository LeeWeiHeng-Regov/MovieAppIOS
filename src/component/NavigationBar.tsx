import { StackNavigationProp } from "@react-navigation/stack";
import React, { FunctionComponent } from "react";
import { Image, ImageStyle, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

import { black, yellow } from "../style";

type TPageName = "Home" | "WatchList" | "Profile";

interface INavigationBarProp {
  pageName: TPageName;
  navigationFunction: StackNavigationProp<TAppStackParamList>;
}

export const NavigationBar: FunctionComponent<INavigationBarProp> = ({ pageName, navigationFunction }: INavigationBarProp): JSX.Element => {
  const onHomepage: boolean = pageName === "Home";
  const onWatchListPage: boolean = pageName === "WatchList";
  const onProfilePage: boolean = pageName === "Profile";

  const navigationBar: ViewStyle = {
    flexDirection: "row",
    width: "100%",
    marginTop: "auto",
    paddingTop: 4,
    backgroundColor: yellow,
  };

  const navigatorButton: ViewStyle = {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  };

  const navigatorButtonText: TextStyle = {
    color: black,
    fontSize: 10,
    textAlign: "center",
  };

  const icon: ImageStyle = {
    height: 30,
    width: 30,
    resizeMode: "stretch",
  };

  return (
    <View style={navigationBar}>
      <TouchableOpacity
        style={navigatorButton}
        disabled={onHomepage}
        onPress={() => navigationFunction.reset({ index: 0, routes: [{ name: "Home" }] })}>
        <Image source={onHomepage ? require("../asset/filledHome.png") : require("../asset/nonFilledHome.png")} style={icon} />
        <Text style={navigatorButtonText}> Home </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={navigatorButton}
        disabled={onWatchListPage}
        onPress={() => navigationFunction.reset({ index: 0, routes: [{ name: "WatchList" }] })}>
        <Image source={onWatchListPage ? require("../asset/filledBookmark.png") : require("../asset/nonFilledBookmark.png")} style={icon} />
        <Text style={navigatorButtonText}> Watch List </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={navigatorButton}
        disabled={onProfilePage}
        onPress={() => navigationFunction.reset({ index: 0, routes: [{ name: "Profile" }] })}>
        <Image source={onProfilePage ? require("../asset/filledProfile.png") : require("../asset/nonFilledProfile.png")} style={icon} />
        <Text style={navigatorButtonText}> Profile </Text>
      </TouchableOpacity>
    </View>
  );
};
