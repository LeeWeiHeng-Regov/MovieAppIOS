import React, { Fragment, FunctionComponent, useContext } from "react";
import { Text, View } from "react-native";

import { NavigationBar } from "../component";
import { Context } from "../context/Context";

export const Profile: FunctionComponent<ProfileProp> = ({ navigation }: ProfileProp): JSX.Element => {
  const { user } = useContext<IContextInput>(Context);

  return (
    <View style={{ flex: 1 }}>
      <Text>username: {user.username}</Text>
      <NavigationBar pageName={"Profile"} navigationFunction={navigation}></NavigationBar>
    </View>
  );
};
