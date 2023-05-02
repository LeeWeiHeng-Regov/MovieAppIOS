import React, { Fragment } from "react";
import { Dimensions, GestureResponderEvent, TouchableOpacity, ViewStyle } from "react-native";
import FastImage from "react-native-fast-image";

import { getImageUrl } from "../config";
import { green } from "../style";
import { Card } from "./Card";

interface IMovieCardProps {
  posterPath?: string | null;
  navigationFunction?: (event: GestureResponderEvent) => void;
}

export const MovieCard = ({ posterPath, navigationFunction }: IMovieCardProps): JSX.Element => {
  const movieCard: ViewStyle = {
    height: ((Dimensions.get("screen").width - 32) * 1.618) / 2,
    width: (Dimensions.get("screen").width - 32) / 2,
    alignSelf: "center",
    backgroundColor: green,
    margin: 8,
  };

  return (
    <Card style={movieCard}>
      <Fragment>
        <TouchableOpacity onPress={navigationFunction}>
          <FastImage
            source={posterPath !== null ? { uri: `${getImageUrl}${posterPath}` } : require("../asset/imageNotFound.svg")}
            style={{
              height: "100%",
              width: "100%",
              borderRadius: 8,
            }}
            resizeMode="stretch"
          />
        </TouchableOpacity>
      </Fragment>
    </Card>
  );
};
