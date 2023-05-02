import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Fragment, FunctionComponent, useContext, useEffect, useRef, useState } from "react";
import { Alert, SafeAreaView, Text, TextInput, TouchableOpacity, ViewStyle } from "react-native";
import TouchID from "react-native-touch-id";

import { APIKey, authenticateRequestTokenUrl, createRequestTokenUrl, createSessionIDUrl, Url } from "../config";
import { Context } from "../context/Context";
import { blue, green, white } from "../style";
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
    backgroundColor: blue._2,
    borderColor: blue._2,
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
      const createdSessionID: boolean | undefined = await handleCreateSessionID(username, password);

      if (createdSessionID) {
        saveUser({ username: username, password: password });
        AsyncStorage.multiSet([
          ["username", username],
          ["password", password],
        ]);
        navigation.navigate("Home");
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      }
    }
  };

  const handleCreateSessionID = async (username: string, password: string): Promise<boolean | undefined> => {
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
        Alert.alert("Error on approve token: ", getTokenApproved.status_message);
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

  const easyLogin = async (): Promise<void> => {
    let storageUsername: string, storagePassword: string;
    try {
      const allowEasyLogin: boolean = await AsyncStorage.multiGet(["username", "password"]).then(
        (data: readonly [string, string | null][]) => {
          const fetchedUsername: string | null = (
            data.find((element: [string, string | null]) => element[0] === "username") as [string, string | null]
          )[1];
          const fetchedPassword: string | null = (
            data.find((element: [string, string | null]) => element[0] === "password") as [string, string | null]
          )[1];
          if (fetchedUsername !== null && fetchedPassword !== null) {
            storageUsername = fetchedUsername;
            storagePassword = fetchedPassword;
            return true;
          }
          return false;
        },
      );
      if (allowEasyLogin) {
        TouchID.authenticate("Login using FaceID", { passcodeFallback: true })
          .then(async (success: boolean) => {
            const createdSessionID: boolean | undefined = await handleCreateSessionID(storageUsername, storagePassword);

            if (createdSessionID) {
              saveUser({ username: storageUsername, password: storagePassword });
              navigation.reset({
                index: 0,
                routes: [{ name: "Home" }],
              });
            }
          })
          .catch((error: IAuthenticationFailedResponse) => {
            console.log("error", error);
          });
      }
    } catch (e) {
      console.log("error: ", e);
    }
  };

  useEffect((): void => {
    easyLogin();
  }, []);

  return (
    <SafeAreaView
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: green,
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
        <Text style={{ fontSize: 20, color: white }}>Login</Text>
      </TouchableOpacity>

      {/* <Text>{loginBefore ? "login before" : "never login before"}</Text> */}
    </SafeAreaView>
  );
};
