import React, { FunctionComponent } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface ICardProp {
  style?: ViewStyle;
  children?: JSX.Element;
}

export const Card: FunctionComponent<ICardProp> = (props: ICardProp): JSX.Element => {
  return <View style={{ ...styles.card, ...props.style }}>{props.children}</View>;
};
const styles = StyleSheet.create({
  card: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    elevation: 8,
    backgroundColor: "white",
    // padding: 5,
    borderRadius: 10,
    margin: 2,
  },
});
