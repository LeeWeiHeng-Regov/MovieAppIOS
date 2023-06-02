import React, { FunctionComponent } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const Detail: FunctionComponent<DetailProp> = ({ navigation }: DetailProp): JSX.Element => {
  const sampleData: INRICData = {
    address: "NO9 \nPARIT SIKOM\nKAYU ARA PASONG\n82010 PONTIAN\nJOHOR",
    city: "PONTIAN",
    country: "Malaysia",
    DOB: "1997-10-24",
    gender: "male",
    IDNumber: "971024-01-6077",
    name: "LEE WEI HENG",
    placeOfBirth: "Johor",
    postcode: "82010",
    state: "JOHOR",
  };

  return (
    <SafeAreaView>
      <Text>Name: {sampleData.name}</Text>
      <Text>IC Number: {sampleData.IDNumber}</Text>
      <Text>Date of Birth: {sampleData.DOB}</Text>
      <Text>Gender: {sampleData.gender}</Text>
      <Text>Postcode: {sampleData.postcode}</Text>
      <Text>City: {sampleData.city}</Text>
      <Text>Place Of Birth: {sampleData.placeOfBirth}</Text>
      <Text>Country: {sampleData.country}</Text>
      <Text>State: {sampleData.state}</Text>
    </SafeAreaView>
  );
};
