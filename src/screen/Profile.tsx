import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import { StatusBar, Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import IconFA from "react-native-vector-icons/FontAwesome";
import IconF from "react-native-vector-icons/Fontisto";
import IconII from "react-native-vector-icons/Ionicons";

import { NavigationBar } from "../component";
import { Context } from "../context/Context";
import {
  alignCenter,
  backgroundBlack,
  blue,
  br,
  bw,
  justifyCenter,
  red,
  sh16,
  sh24,
  sh4,
  sh40,
  sh8,
  sw1,
  sw256,
  sw32,
  sw328,
  sw4,
  sw8,
  white,
} from "../style";

export const Profile: FunctionComponent<ProfileProp> = ({ navigation }: ProfileProp): JSX.Element => {
  const { user } = useContext<IContextInput>(Context);
  const [editing, setEditing] = useState<boolean>(false);
  const [gender, setGender] = useState<string>("");
  const [date, setDate] = useState<string>(moment().format("DD / MM / YYYY"));
  const [settingClicked, setSettingClicked] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number>(1);

  // const genderOption = [
  //   { key: "1", value: "Male" },
  //   { key: "2", value: "Female" },
  // ];
  const genderOption = ["Male", "Female"];

  const handleSetEditing = (): void => {
    setEditing(!editing);
  };

  const handleLogout = (): void => {
    AsyncStorage.clear();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const handleSetGender = (newGender: string): void => {
    setGender(newGender);
  };

  const saveButton: ViewStyle = {
    ...alignCenter,
    ...justifyCenter,
    alignSelf: "center",
    backgroundColor: editing ? blue._2 : red,
    borderRadius: br,
    borderWidth: bw,
    height: sh40,
    width: sw256,
  };

  const textBox: ViewStyle = {
    alignItems: "center",
    backgroundColor: backgroundBlack,
    borderColor: blue._3,
    borderRadius: br,
    borderWidth: bw,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: sh16,
    padding: sw4,
    width: sw328,
  };

  const text: TextStyle = {
    color: white,
    fontSize: sh24,
    fontWeight: "bold",
  };

  const handleSaveChange = async (): Promise<void> => {
    setGender(genderOption[selectedOption]);

    try {
      await AsyncStorage.multiSet([
        ["gender", genderOption[selectedOption]],
        ["date", date],
      ]).then(() => {
        handleSetEditing();
        setSettingClicked(false);
      });
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
    icon: string;
    index?: number;
    title: string;
    onPressFunction?: () => void;
  }
  const dropdownMenuData: IDropDownItemProps[] = [
    {
      icon: "edit",
      title: "Edit",
      onPressFunction: handleSetEditing,
    },
    {
      icon: "sign-out",
      title: "Logout",
      onPressFunction: handleLogout,
    },
  ];

  const dropdownItem = ({ index, icon, title, onPressFunction }: IDropDownItemProps): JSX.Element => {
    return (
      <TouchableOpacity style={{ padding: sw8, borderWidth: 0, marginVertical: sh4 }} key={index} onPress={onPressFunction}>
        <View style={{ flexDirection: "row", ...alignCenter }}>
          <IconFA name={icon} size={24} />
          <Text style={{ textAlign: "center", fontSize: sh24 }}>{` ${title} `}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const dropdownMenuStyle: ViewStyle = {
    backgroundColor: blue._3,
    borderWidth: sw1,
    marginTop: sh8,
    borderRadius: br,
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
    <SafeAreaView edges={["top"]} style={{ height: "100%", backgroundColor: backgroundBlack }}>
      <StatusBar barStyle={"light-content"} />
      <View style={{ zIndex: 1, marginRight: sw8 }}>
        {!editing && (
          <View style={{ alignItems: "flex-end", position: "absolute", right: 0 }}>
            <TouchableOpacity onPress={() => setSettingClicked(!settingClicked)}>
              <IconII name={settingClicked ? "settings" : "settings-outline"} style={{ color: blue._3, fontSize: sw32 }} />
            </TouchableOpacity>
            <View>{settingClicked && dropdownMenu()}</View>
          </View>
        )}
      </View>

      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <IconII name="person-circle-outline" size={160} color={blue._3} />
        <View style={textBox}>
          <Text style={text}>Username: {user.username}</Text>
        </View>
        <View style={textBox}>
          <Text style={text}>Gender: </Text>
          {editing ? (
            <View style={{ flexDirection: "row" }}>
              {genderOption.map((item, index) => {
                return (
                  <TouchableOpacity
                    disabled={index === selectedOption}
                    key={index}
                    style={{ flexDirection: "row", ...alignCenter }}
                    onPress={() => setSelectedOption(index)}>
                    <IconF name={index === selectedOption ? "radio-btn-active" : "radio-btn-passive"} size={sh24} />
                    <Text style={text}>{` ${item} `}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <TextInput style={text}>{gender}</TextInput>
          )}
        </View>

        {!editing && date !== "" && (
          <View style={textBox}>
            <Text style={{ color: white, fontWeight: "bold", fontSize: sh24 }}>Date of Birth: {date}</Text>
          </View>
        )}

        {editing && (
          <DateTimePicker
            display={"spinner"}
            maximumDate={moment().toDate()}
            minimumDate={moment("1923-1-1", "YYYY-MM-DD").toDate()}
            onChange={(_, selectedDate) => {
              if (selectedDate !== undefined) {
                setDate(moment(selectedDate).format("DD / MM / YYYY"));
              }
            }}
            style={{ marginBottom: sh16, borderRadius: br }}
            textColor={white}
            value={moment(date, "DD / MM / YYYY").toDate()}
          />
        )}

        {editing && (
          <TouchableOpacity onPress={handleSaveChange} style={saveButton}>
            <Text style={{ color: white, textAlign: "center", fontSize: sh24 }}>save</Text>
          </TouchableOpacity>
        )}
      </View>
      <NavigationBar pageName={"Profile"} navigationFunction={navigation}></NavigationBar>
    </SafeAreaView>
  );
};
