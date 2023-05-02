import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import React, { Fragment, FunctionComponent, useContext, useEffect, useState } from "react";
import {
  Alert,
  Image,
  ImageSourcePropType,
  ImageStyle,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { scale } from "react-native-size-matters";

import { NavigationBar } from "../component";
import { Context } from "../context/Context";
import { backgroundBlack, black, blue, red, white, yellow } from "../style";
import { alignCenter, justifyCenter } from "../style/style";

export const Profile: FunctionComponent<ProfileProp> = ({ navigation }: ProfileProp): JSX.Element => {
  const { user } = useContext<IContextInput>(Context);
  const [editing, setEditing] = useState<boolean>(false);
  const [gender, setGender] = useState<string>("");
  const [date, setDate] = useState<string>(moment().format("DD / MM / YYYY"));
  const [settingClicked, setSettingClicked] = useState<boolean>(false);

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

  const editButton: ViewStyle = {
    borderWidth: 2,
    borderRadius: 8,
    ...justifyCenter,
    ...alignCenter,
    alignSelf: "center",
    backgroundColor: editing ? blue._2 : red,
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
    backgroundColor: backgroundBlack,
    borderColor: yellow,
  };

  const iconStyle: ImageStyle = {
    height: scale(24),
    width: scale(24),
    tintColor: black,
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

  interface IDropDownItemProps {
    index?: number;
    image: ImageSourcePropType;
    title: string;
    onPressFunction?: () => void;
  }
  const dropdownMenuData: IDropDownItemProps[] = [
    {
      image: require("./Profile/edit.png"),
      title: "Edit",
      onPressFunction: handleSetEditing,
    },
    {
      image: require("./Profile/logout.png"),
      title: "Logout",
      onPressFunction: handleLogout,
    },
  ];

  const dropdownItem = ({ index, image, title, onPressFunction }: IDropDownItemProps): JSX.Element => {
    return (
      <TouchableOpacity style={{ padding: 8, borderWidth: 1 }} key={index} onPress={onPressFunction}>
        <View style={{ flexDirection: "row", ...alignCenter }}>
          <Image source={image} resizeMode={"stretch"} style={iconStyle} />
          <Text style={{ textAlign: "center", fontSize: scale(16) }}>{` ${title} `}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const dropdownMenuStyle: ViewStyle = {
    borderWidth: 1,
    marginTop: 4,
    backgroundColor: yellow,
  };

  const dropdownMenu = () => {
    return (
      <View style={dropdownMenuStyle}>
        {dropdownMenuData.map((Item, i) => {
          return dropdownItem({ ...Item, index: i });
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: backgroundBlack }}>
      <StatusBar barStyle={"light-content"} />
      {!editing && (
        <View style={{ zIndex: 1, marginLeft: "auto", margin: 8, alignItems: "flex-end" }}>
          <TouchableOpacity onPress={() => setSettingClicked(!settingClicked)}>
            <Image source={require("./Profile/setting.png")} resizeMode={"stretch"} style={{ ...iconStyle, tintColor: yellow }} />
          </TouchableOpacity>

          {settingClicked && dropdownMenu()}
        </View>
      )}

      <View style={{ height: "100%", justifyContent: "center", alignItems: "center", position: "absolute", width: "100%" }}>
        <Image
          source={require("./Profile/user.png")}
          style={{ height: scale(128), width: scale(128), marginBottom: scale(16), tintColor: yellow }}
        />

        <View style={textBox}>
          <Text style={{ color: white, fontWeight: "bold" }}>Username: {user.username}</Text>
        </View>
        <View style={{ ...textBox, padding: 0 }}>
          <Text style={{ color: white, fontWeight: "bold" }}>Gender: </Text>
          {editing ? (
            <View style={{ height: "auto", maxHeight: 120, marginVertical: 0 }}>
              <SelectList
                boxStyles={{
                  alignItems: "center",
                  borderColor: yellow,
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
                  marginLeft: 16,
                  textAlign: "center",
                  width: 128,
                  color: white,
                  fontWeight: "bold",
                }}
                data={genderOption}
                dropdownItemStyles={{ marginTop: 0 }}
                dropdownStyles={{ borderColor: yellow, marginTop: 0, marginBottom: 0, paddingTop: 0 }}
                dropdownTextStyles={{ color: white, fontWeight: "bold", textAlign: "center" }}
                placeholder={gender}
                save="value"
                search={false}
                setSelected={(val: string) => setGender(val)}
              />
            </View>
          ) : (
            <TextInput style={{ color: white, fontWeight: "bold" }}>{gender}</TextInput>
          )}
        </View>

        {!editing && date !== "" && (
          <View style={{ ...textBox, alignItems: "center" }}>
            <Text style={{ color: white, fontWeight: "bold" }}>Date of Birth: {date}</Text>
          </View>
        )}

        {editing && (
          <View style={{ backgroundColor: yellow, width: 256, marginBottom: 16, borderRadius: 8 }}>
            <DateTimePicker
              value={moment(date, "DD / MM / YYYY").toDate()}
              maximumDate={moment().toDate()}
              minimumDate={moment("1923-1-1", "YYYY-MM-DD").toDate()}
              display={"spinner"}
              onChange={(_, selectedDate) => {
                if (selectedDate !== undefined) {
                  setDate(moment(selectedDate).format("DD / MM / YYYY"));
                }
              }}
            />
          </View>
        )}

        {editing && (
          <TouchableOpacity onPress={handleSaveChange} style={editButton}>
            <Text style={{ color: white, textAlign: "center", fontSize: 20 }}>save</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* {!editing && (
        <TouchableOpacity onPress={handleLogout} style={submitRatingButton}>
          <Text style={{ color: white, textAlign: "center", fontSize: 20 }}>Logout</Text>
        </TouchableOpacity>
      )} */}
      <NavigationBar pageName={"Profile"} navigationFunction={navigation}></NavigationBar>
    </SafeAreaView>
  );
};
