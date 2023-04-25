import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import React, { Fragment, FunctionComponent, useContext, useEffect, useState } from "react";
import { Alert, Dimensions, SafeAreaView, Text, TextInput, TouchableOpacity, View, ViewStyle } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";

import { NavigationBar } from "../component";
import { Context } from "../context/Context";
import { alignCenter, justifyCenter } from "../style/style";

export const Profile: FunctionComponent<ProfileProp> = ({ navigation }: ProfileProp): JSX.Element => {
  const { user } = useContext<IContextInput>(Context);
  const [editing, setEditing] = useState<boolean>(false);
  const [gender, setGender] = useState<string>("");
  const [date, setDate] = useState<string>(moment().format("DD / MM / YYYY"));

  const genderOption = [
    { key: "1", value: "Male" },
    { key: "2", value: "Female" },
  ];

  const handleSetEditing = (): void => {
    setEditing(!editing);
  };

  const handleLogout = (): void => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const handleSetGender = (newGender: string): void => {
    setGender(newGender);
  };

  const submitRatingButton: ViewStyle = {
    borderWidth: 2,
    borderRadius: 8,
    ...justifyCenter,
    ...alignCenter,
    alignSelf: "center",
    backgroundColor: "red",
    width: 256,
    height: 40,
    position: "absolute",
    marginTop: Dimensions.get("screen").height * 0.85,
  };

  const editButton: ViewStyle = {
    borderWidth: 2,
    borderRadius: 8,
    ...justifyCenter,
    ...alignCenter,
    alignSelf: "center",
    backgroundColor: editing ? "blue" : "red",
    width: 256,
    height: 40,
  };

  const textBox: ViewStyle = {
    marginBottom: 16,
    borderWidth: 2,
    borderRadius: 8,
    padding: 4,
    minHeight: 40,
    width: 256,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  };

  const handleSaveChange = async (): Promise<void> => {
    if (gender === "") {
      Alert.alert("Error", "Please select gender type");
      return;
    }

    try {
      await AsyncStorage.multiSet([
        ["gender", gender],
        ["date", date],
      ]).then(() => handleSetEditing());
    } catch (e) {
      console.log(e);
    }
  };

  const getStoredData = async (): Promise<void> => {
    const keys: string[] = ["date", "gender"];
    await AsyncStorage.multiGet(keys).then((data: readonly [string, string | null][]) => {
      const storedGender: string | null = (
        data.find((element: [string, string | null]) => element[0] === "gender") as [string, string | null]
      )[1];
      const storedDate: string | null = (
        data.find((element: [string, string | null]) => element[0] === "date") as [string, string | null]
      )[1];

      if (storedGender !== null) {
        handleSetGender(storedGender);
      }
      if (storedDate !== null) {
        setDate(storedDate);
      }
    });
  };

  useEffect((): void => {
    getStoredData();
  }, []);

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "lightgreen" }}>
      <View style={{ height: "100%", justifyContent: "center", alignItems: "center" }}>
        <View style={{ ...textBox, alignItems: "center" }}>
          <Text>Username: {user.username}</Text>
        </View>
        <View style={{ ...textBox, padding: 0 }}>
          <Text style={{ marginVertical: 4 }}>Gender: </Text>
          {editing ? (
            <View style={{ height: "auto", maxHeight: 120, marginVertical: 0 }}>
              <SelectList
                boxStyles={{
                  alignItems: "center",
                  borderColor: "black",
                  height: 24,
                  justifyContent: "center",
                  marginBottom: 0,
                  marginVertical: 2,
                  paddingBottom: 0,
                  paddingTop: 0,
                  width: 160,
                }}
                inputStyles={{
                  height: 24,
                  marginBottom: 0,
                  paddingVertical: 4,
                  textAlign: "center",
                  width: 128,
                }}
                data={genderOption}
                dropdownItemStyles={{ marginTop: 0 }}
                dropdownStyles={{ borderColor: "black", marginTop: 0, marginBottom: 0, paddingTop: 0 }}
                dropdownTextStyles={{ textAlign: "center" }}
                placeholder={gender}
                save="value"
                search={false}
                setSelected={(val: string) => setGender(val)}
              />
            </View>
          ) : (
            <TextInput>{gender}</TextInput>
          )}
        </View>

        {!editing && date !== "" && (
          <View style={{ ...textBox, alignItems: "center" }}>
            <Text>Date of Birth: {date}</Text>
          </View>
        )}

        {editing && (
          <DateTimePicker
            value={moment(date, "DD / MM / YYYY").toDate()}
            maximumDate={moment().toDate()}
            minimumDate={moment("1923-1-1", "YYYY-MM-DD").toDate()}
            display={"spinner"}
            // disabled={!editing}
            onChange={(_, selectedDate) => {
              if (selectedDate !== undefined) {
                setDate(moment(selectedDate).format("DD / MM / YYYY"));
              }
            }}
          />
        )}

        <TouchableOpacity onPress={!editing ? handleSetEditing : handleSaveChange} style={editButton}>
          <Text style={{ color: "white", textAlign: "center", fontSize: 20 }}>{editing ? "save" : "Edit"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleLogout} style={submitRatingButton}>
        <Text style={{ color: "white", textAlign: "center", fontSize: 20 }}>Logout</Text>
      </TouchableOpacity>

      <NavigationBar pageName={"Profile"} navigationFunction={navigation}></NavigationBar>
    </SafeAreaView>
  );
};
