import React, { Fragment, FunctionComponent, useContext } from "react";
import { Dimensions, SafeAreaView, Text, TouchableOpacity, View, ViewStyle } from "react-native";

import { NavigationBar } from "../component";
import { Context } from "../context/Context";
import { alignCenter, justifyCenter } from "../style/style";

export const Profile: FunctionComponent<ProfileProp> = ({ navigation }: ProfileProp): JSX.Element => {
  const { user } = useContext<IContextInput>(Context);
  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const submitRatingButton: ViewStyle = {
    borderWidth: 2,
    borderRadius: 10,
    // flexWrap: "wrap",
    ...justifyCenter,
    ...alignCenter,
    alignSelf: "center",
    backgroundColor: "red",
    marginBottom: 5,
    width: 250,
  };

  return (
    <SafeAreaView style={{ height: "100%" }}>
      <Text>username: {user.username}</Text>
      <View style={{ width: 250, alignSelf: "center", marginTop: Dimensions.get("screen").height * 0.75 }}>
        <TouchableOpacity onPress={handleLogout} style={submitRatingButton}>
          <Text style={{ width: 250, paddingVertical: 3, color: "white", textAlign: "center", fontSize: 20 }}>Logout</Text>
        </TouchableOpacity>
      </View>
      <NavigationBar pageName={"Profile"} navigationFunction={navigation}></NavigationBar>
    </SafeAreaView>
  );
};
