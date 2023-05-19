import React, { FunctionComponent } from "react";
import { View, ViewProps } from "react-native";

interface ISpacerProps {
  height?: number;
  width?: number;
  style?: ViewProps;
}

export const Spacer: FunctionComponent<ISpacerProps> = ({ height, width, style }: ISpacerProps): JSX.Element => {
  return <View style={{ height: height, width: width, ...style }}></View>;
};
