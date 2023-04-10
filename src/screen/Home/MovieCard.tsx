import React, { Fragment } from "react";
import { GestureResponderEvent, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";

import { Card } from "../../component";

const movieCard: ViewStyle = {
  width: "95%",
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
  title: string;
  releaseDate: string;
  navigationFunction?: (event: GestureResponderEvent) => void;
}

export const MovieCard = ({ title, releaseDate, navigationFunction }: IMovieCardProps): JSX.Element => {
  return (
    <Card style={movieCard}>
      <Fragment>
        <TouchableOpacity onPress={navigationFunction}>
          <Text style={movieTitle}>{title}</Text>
          <Text style={movieDate}>{releaseDate}</Text>
        </TouchableOpacity>
      </Fragment>
    </Card>
  );
};
