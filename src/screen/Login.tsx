import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { FunctionComponent, useContext, useEffect, useRef, useState } from "react";
import { Alert, Linking, ScrollView, Text, TextInput, TouchableOpacity, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TouchID from "react-native-touch-id";

import { APIKey, authenticateRequestTokenUrl, createRequestTokenUrl, createSessionIDUrl, signUpURL, Url } from "../config";
import { Context } from "../context/Context";
import { backgroundBlack, blue, sh128, sh40, sh8, sw256, sw8, sw80, white } from "../style";
import { alignCenter, br, bw, justifyCenter } from "../style/style";

export const Login: FunctionComponent<LoginProp> = ({ navigation }: LoginProp): JSX.Element => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // const [editing, setEditing] = useState<boolean>(false);

  const { saveUser, handleSetSessionID } = useContext<IContextInput>(Context);

  const button: ViewStyle = {
    borderWidth: bw,
    borderRadius: br,
    width: sw80,
    height: sh40,
    ...alignCenter,
    ...justifyCenter,
    backgroundColor: blue._2,
    borderColor: blue._2,
  };

  const textBoxStyle: ViewStyle = {
    borderWidth: bw,
    borderRadius: br,
    width: sw256,
    height: sh40,
    marginBottom: sh8,
    paddingLeft: sw8,
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
      edges={["top"]}
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: blue._3,
      }}>
      <ScrollView
        // onScroll={!editing ? }
        keyboardShouldPersistTaps={"handled"}
        scrollsToTop={true}
        scrollEnabled={true}
        bounces={false}
        style={{ width: "100%", height: "100%" }}
        contentContainerStyle={{}}
        showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: "center", borderColor: "blue" }}>
          <Text style={{ fontSize: 30, marginTop: 160, fontWeight: "bold" }}>Login</Text>
          <View style={{ height: sh128 }} />
          <TextInput
            onChangeText={(value) => setUsername(value)}
            // onFocus={() => setEditing(true)}
            // onBlur={() => setEditing(false)}
            placeholder="Please enter your username*"
            placeholderTextColor={backgroundBlack}
            style={{ ...textBoxStyle, marginTop: "50%" }}
            value={username}
          />
          <TextInput
            onChangeText={(value) => setPassword(value)}
            // onFocus={() => setEditing(true)}
            // onBlur={() => setEditing(false)}
            placeholder="Please enter your password*"
            placeholderTextColor={backgroundBlack}
            style={textBoxStyle}
            secureTextEntry={true}
            value={password}
          />
          <TouchableOpacity style={button} onPress={handleLogin}>
            <Text style={{ fontSize: 20, color: white }}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={{ ...alignCenter }}>
          <Text>
            Do not have an account yet?{" "}
            <Text
              onPress={async () => {
                const Supported = await Linking.canOpenURL(signUpURL);
                Supported ? await Linking.openURL(signUpURL) : Alert.alert("Error", `cannot open this link: ${signUpURL}`);
              }}
              style={{ textDecorationLine: "underline" }}>
              sign up
            </Text>{" "}
            now!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
