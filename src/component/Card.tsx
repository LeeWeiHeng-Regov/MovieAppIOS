import React, { FunctionComponent } from "react";
import { View, ViewStyle } from "react-native";

import { black, br, sw4, sw8 } from "../style";

interface ICardProp {
  style?: ViewStyle;
  children?: JSX.Element;
}

const card: ViewStyle = {
  shadowColor: black,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: sw4,
  shadowOpacity: 0.26,
  elevation: sw8,
  borderRadius: br,
};

export const Card: FunctionComponent<ICardProp> = (props: ICardProp): JSX.Element => {
  return <View style={{ ...card, ...props.style }}>{props.children}</View>;
};
