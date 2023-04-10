import React, { Fragment, FunctionComponent, useContext, useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View, ViewStyle } from "react-native";

import { APIKey, authenticateRequestTokenUrl, createRequestTokenUrl, createSessionIDUrl, Url } from "../config";
import { Context } from "../context/Context";
import { alignCenter, justifyCenter } from "../style/style";

export const Login: FunctionComponent<LoginProp> = ({ navigation }: LoginProp): JSX.Element => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { saveUser, handleSetSessionID } = useContext<IContextInput>(Context);

  const button: ViewStyle = {
    borderWidth: 2,
    borderRadius: 10,
    width: "20%",
    height: 45,
    ...alignCenter,
    ...justifyCenter,
    backgroundColor: "blue",
    borderColor: "blue",
  };

  const textBoxStyle: ViewStyle = {
    marginVertical: "auto",
    borderWidth: 2,
    borderRadius: 10,
    width: "80%",
    height: "5%",
    marginBottom: 5,
    paddingHorizontal: 8,
  };

  const handleLogin = async (): Promise<void> => {
    if (username === "" || password === "") {
      Alert.alert("Error", "Please fill in your user name and password!");
    } else {
      const createdSessionID = await handleCreateSessionID();

      if (createdSessionID) {
        saveUser({ username: username, password: password });
        navigation.navigate("Home");
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      }
    }
  };

  const handleCreateSessionID = async (): Promise<boolean | undefined> => {
    try {
      const createRequestToken: IRequestTokenResponse = await (await fetch(`${Url}${createRequestTokenUrl}?api_key=${APIKey}`)).json();

      if (!createRequestToken.success) {
        Alert.alert("Error", createRequestToken.status_message);
        return false;
      }
      const getTokenApproved: IGetTokenApproved = await (
        await fetch(`${Url}${authenticateRequestTokenUrl}?api_key=${APIKey}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
            request_token: createRequestToken.request_token,
          }),
        })
      ).json();

      if (!getTokenApproved.success) {
        Alert.alert("Error: ", getTokenApproved.status_message);
        return false;
      }

      const createSessionID: ICreateSessionID = await (
        await fetch(`${Url}${createSessionIDUrl}?api_key=${APIKey}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            request_token: getTokenApproved.request_token,
          }),
        })
      ).json();

      if (!createSessionID.success) {
        Alert.alert("Error: ", createSessionID.status_message);
        return false;
      } else {
        handleSetSessionID(createSessionID.session_id);
        return true;
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "lightgreen",
        flex: 1,
      }}>
      <TextInput
        onChangeText={(value) => setUsername(value)}
        placeholder="Please enter your user name*"
        placeholderTextColor="#6B6B6B"
        style={{ ...textBoxStyle, marginTop: "50%" }}
        value={username}></TextInput>
      <TextInput
        onChangeText={(value) => setPassword(value)}
        placeholder="Please enter your password*"
        placeholderTextColor="#6B6B6B"
        style={textBoxStyle}
        secureTextEntry={true}
        value={password}></TextInput>

      <TouchableOpacity style={button} onPress={handleLogin}>
        <Text style={{ fontSize: 20, color: "white" }}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};
