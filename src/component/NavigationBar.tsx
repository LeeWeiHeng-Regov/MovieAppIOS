import { StackNavigationProp } from "@react-navigation/stack";
import React, { Fragment, FunctionComponent } from "react";
import { ImageStyle, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import IconFA from "react-native-vector-icons/FontAwesome";
import IconII from "react-native-vector-icons/Ionicons";

import { black, green, sh12, sh16, sh32, sh4, sw32 } from "../style";

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
    width: "100%",
    bottom: 0,
    backgroundColor: green,
  };

  const iconBar: ViewStyle = {
    flexDirection: "row",
    width: "100%",
    paddingTop: sh4,
  };

  const navigatorButton: ViewStyle = {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  };

  const navigatorButtonText: TextStyle = {
    color: black,
    fontSize: sh12,
    textAlign: "center",
    lineHeight: sh16,
  };

  const icon: ImageStyle = {
    height: sw32,
    width: sw32,
    resizeMode: "stretch",
  };

  return (
    <View style={navigationBar}>
      <View style={iconBar}>
        <TouchableOpacity
          style={navigatorButton}
          disabled={onHomepage}
          onPress={() => navigationFunction.reset({ index: 0, routes: [{ name: "Home" }] })}>
          <IconII name={onHomepage ? "home" : "home-outline"} size={sw32} />
          <Text style={navigatorButtonText}> Home </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={navigatorButton}
          disabled={onWatchListPage}
          onPress={() => navigationFunction.reset({ index: 0, routes: [{ name: "WatchList" }] })}>
          <IconII name={onWatchListPage ? "bookmark" : "bookmark-outline"} size={sw32} />
          <Text style={navigatorButtonText}> Watch List </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={navigatorButton}
          disabled={onProfilePage}
          onPress={() => navigationFunction.reset({ index: 0, routes: [{ name: "Profile" }] })}>
          <IconFA name={onProfilePage ? "user" : "user-o"} size={sw32} />
          <Text style={navigatorButtonText}> Profile </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: sh32,
          backgroundColor: "transparent",
          width: "100%",
        }}
      />
    </View>
  );
};
