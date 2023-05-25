import { SIZE_MATTERS_BASE_WIDTH } from "@env";
import React, { Fragment } from "react";
import { GestureResponderEvent, TouchableOpacity, ViewStyle } from "react-native";
import FastImage from "react-native-fast-image";
import { scale } from "react-native-size-matters/extend";

import { Card } from ".";
import { getImageUrl } from "../config";
import { alignCenter, black, justifyCenter, sh8, sw4 } from "../style";

interface IMovieCardProps {
  posterPath?: string | null;
  style?: ViewStyle;
  navigationFunction?: (event: GestureResponderEvent) => void;
}

export const MovieCard = ({ posterPath = null, style: inputStyle, navigationFunction }: IMovieCardProps): JSX.Element => {
  const movieCard: ViewStyle = {
    height: (scale(SIZE_MATTERS_BASE_WIDTH - 24) * 1.618) / 2,
    width: scale(SIZE_MATTERS_BASE_WIDTH - 24) / 2,
    backgroundColor: black,
    marginHorizontal: sw4,
    marginBottom: sh8,
  };

  return (
    <Card style={{ ...movieCard, ...inputStyle }}>
      <TouchableOpacity onPress={navigationFunction} style={{ flex: 1, ...justifyCenter, ...alignCenter }}>
        <FastImage
          source={posterPath !== null ? { uri: `${getImageUrl}${posterPath}` } : require("../asset/imageNotFound.png")}
          style={{
            height: posterPath !== null ? "100%" : "30%",
            width: posterPath !== null ? "100%" : "40%",
            borderRadius: 8,
          }}
          resizeMode="stretch"
        />
      </TouchableOpacity>
    </Card>
  );
};
