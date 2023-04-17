import React, { Fragment } from "react";
import { Dimensions, GestureResponderEvent, Image, TextStyle, TouchableOpacity, ViewStyle } from "react-native";

import { getImageUrl } from "../config";
import { Card } from "./Card";

const movieCard: ViewStyle = {
  height: ((Dimensions.get("screen").width - 10) * 1.618) / 2,
  width: (Dimensions.get("screen").width - 10) / 2,
  alignSelf: "center",
  backgroundColor: "lightgreen",
};
const movieTitle: TextStyle = {
  margin: 5,
  color: "black",
  fontWeight: "bold",
  fontSize: 20,
};
const movieDate: TextStyle = {
  marginBottom: 5,
  color: "grey",
  fontSize: 15,
  marginLeft: 5,
};

interface IMovieCardProps {
  posterPath?: string | null;
  navigationFunction?: (event: GestureResponderEvent) => void;
}

export const MovieCard = ({ posterPath, navigationFunction }: IMovieCardProps): JSX.Element => {
  return (
    <Card style={movieCard}>
      <Fragment>
        <TouchableOpacity onPress={navigationFunction}>
          <Image
            source={posterPath !== null ? { uri: `${getImageUrl}${posterPath}` } : require("../asset/imageNotFound.svg")}
            style={{
              height: "100%",
              width: "100%",
              resizeMode: "stretch",
              borderRadius: 8,
            }}
          />
          {/* <View style={{ height: "20%" }}>
            <Text style={movieTitle}>{title}</Text>
          </View> */}
        </TouchableOpacity>
      </Fragment>
    </Card>
  );
};
