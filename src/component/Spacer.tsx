import React, { FunctionComponent } from "react";
import { View, ViewStyle } from "react-native";

interface ISpacerProps {
  height?: number;
  width?: number;
  style?: ViewStyle;
}

export const Spacer: FunctionComponent<ISpacerProps> = ({ height, width, style }: ISpacerProps): JSX.Element => {
  return <View style={{ height: height, width: width, ...style }}></View>;
};
